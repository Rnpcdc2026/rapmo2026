-- ════════════════════════════════════════════════════════════════════
-- Plateforme d'inscription RAPMO 2026 — Schéma de base de données
-- À exécuter dans Supabase > SQL Editor
-- ════════════════════════════════════════════════════════════════════

-- ─── 1. Événement (table de config, 1 ligne) ────────────────────────
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  start_date date not null,
  end_date date not null,
  location text,
  registration_deadline timestamptz not null,
  contact_email text,
  is_open boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── 2. Visites ─────────────────────────────────────────────────────
create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  code text not null,           -- ex: 'confluence', 'vieux-lyon'
  title text not null,
  description text,
  slot_label text,              -- ex: '07 oct · 17h30'
  slot_date date,
  capacity integer not null default 30,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  unique(event_id, code)
);

-- ─── 3. Ateliers (Option 4 du CDC) ──────────────────────────────────
create table if not exists workshops (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  code text not null,
  title text not null,
  description text,
  speaker text,
  slot_label text,
  capacity integer default 50,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  unique(event_id, code)
);

-- ─── 4. Nuitées disponibles ─────────────────────────────────────────
create table if not exists accommodation_nights (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  night_date date not null,
  label text,
  description text,
  is_active boolean default true,
  unique(event_id, night_date)
);

-- ─── 5. Entités CDC Habitat ─────────────────────────────────────────
create table if not exists entities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_order integer default 0,
  is_active boolean default true
);

-- ─── 6. Inscrits ────────────────────────────────────────────────────
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  reference text unique not null,   -- ex: RAPMO-2026-A4F2
  
  -- Identité
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  entity text,
  role text,
  diet text,
  
  -- Choix
  visit_id uuid references visits(id) on delete set null,
  bus_transport boolean default false,
  
  -- Méta
  status text default 'confirmed', -- 'confirmed' | 'cancelled' | 'waitlist'
  confirmation_email_sent_at timestamptz,
  reminder_email_sent_at timestamptz,
  notes text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_registrations_event on registrations(event_id);
create index if not exists idx_registrations_email on registrations(email);

-- ─── 7. Association inscrit ↔ nuitées (N-N) ─────────────────────────
create table if not exists registration_nights (
  registration_id uuid references registrations(id) on delete cascade,
  night_id uuid references accommodation_nights(id) on delete cascade,
  primary key (registration_id, night_id)
);

-- ─── 8. Association inscrit ↔ ateliers (N-N) ────────────────────────
create table if not exists registration_workshops (
  registration_id uuid references registrations(id) on delete cascade,
  workshop_id uuid references workshops(id) on delete cascade,
  primary key (registration_id, workshop_id)
);

-- ─── 9. Invitations (pour le mass-mailing) ──────────────────────────
create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  entity text,
  invite_token text unique not null default replace(gen_random_uuid()::text, '-', ''),
  sent_at timestamptz,
  opened_at timestamptz,
  registered boolean default false,
  reminder_count integer default 0,
  last_reminder_at timestamptz,
  created_at timestamptz default now(),
  unique(event_id, email)
);
create index if not exists idx_invitations_token on invitations(invite_token);

-- ─── 10. Log d'envois email ─────────────────────────────────────────
create table if not exists email_log (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  registration_id uuid references registrations(id) on delete set null,
  invitation_id uuid references invitations(id) on delete set null,
  email_type text not null,  -- 'invitation' | 'reminder' | 'confirmation' | 'custom'
  to_email text not null,
  subject text,
  resend_id text,
  status text,               -- 'sent' | 'failed'
  error_message text,
  sent_at timestamptz default now()
);

-- ════════════════════════════════════════════════════════════════════
-- VUE STATISTIQUES (utilisée par le dashboard admin)
-- ════════════════════════════════════════════════════════════════════
create or replace view stats_overview as
select
  e.id as event_id,
  e.title,
  (select count(*) from registrations r where r.event_id = e.id and r.status = 'confirmed') as total_registered,
  (select count(*) from invitations i where i.event_id = e.id) as total_invited,
  (select count(*) from invitations i where i.event_id = e.id and i.sent_at is not null) as invitations_sent,
  (select count(*) from registrations r where r.event_id = e.id and r.bus_transport = true) as bus_count
from events e;

create or replace view stats_visits as
select
  v.id,
  v.title,
  v.slot_label,
  v.capacity,
  (select count(*) from registrations r where r.visit_id = v.id and r.status = 'confirmed') as registered,
  v.capacity - (select count(*) from registrations r where r.visit_id = v.id and r.status = 'confirmed') as remaining
from visits v
where v.is_active = true
order by v.display_order, v.slot_label;

create or replace view stats_nights as
select
  an.id,
  an.night_date,
  an.label,
  (select count(*) from registration_nights rn
    join registrations r on r.id = rn.registration_id
    where rn.night_id = an.id and r.status = 'confirmed') as count
from accommodation_nights an
where an.is_active = true
order by an.night_date;

-- ════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════════
alter table events enable row level security;
alter table visits enable row level security;
alter table workshops enable row level security;
alter table accommodation_nights enable row level security;
alter table entities enable row level security;
alter table registrations enable row level security;
alter table registration_nights enable row level security;
alter table registration_workshops enable row level security;
alter table invitations enable row level security;
alter table email_log enable row level security;

-- Lecture publique des contenus (visites, ateliers, nuitées, entités, événement)
create policy "public read events" on events for select using (true);
create policy "public read visits" on visits for select using (is_active = true);
create policy "public read workshops" on workshops for select using (is_active = true);
create policy "public read nights" on accommodation_nights for select using (is_active = true);
create policy "public read entities" on entities for select using (is_active = true);

-- L'écriture passe par les routes API (service_role) — pas de policy publique
-- Les admins authentifiés ont tous les droits via service_role côté serveur

-- ════════════════════════════════════════════════════════════════════
-- DONNÉES INITIALES (seed)
-- ════════════════════════════════════════════════════════════════════
insert into events (slug, title, subtitle, start_date, end_date, location, registration_deadline, contact_email)
values (
  'rapmo-2026',
  'Rencontres Annuelles Patrimoine et Maîtrise d''Ouvrage 2026',
  'Deux jours pour bâtir ensemble le patrimoine',
  '2026-10-08',
  '2026-10-09',
  'Métropole lyonnaise',
  '2026-09-15 17:00:00+02',
  'sophie.mondet@cdc-habitat.fr'
)
on conflict (slug) do nothing;

-- Récupération de l'event_id pour les inserts liés
do $$
declare
  ev_id uuid;
begin
  select id into ev_id from events where slug = 'rapmo-2026';
  
  -- Visites
  insert into visits (event_id, code, title, description, slot_label, slot_date, capacity, display_order) values
    (ev_id, 'confluence', 'Confluence & nouvelle ville', 'Quartier emblématique de la mutation urbaine lyonnaise, regards croisés avec les opérations CDC Habitat.', '07 oct · 17h30', '2026-10-07', 25, 1),
    (ev_id, 'vieux-lyon', 'Vieux Lyon & traboules', 'Patrimoine Renaissance, traboules cachées, lecture du tissu urbain historique avec un guide-conférencier.', '07 oct · 17h30', '2026-10-07', 30, 2),
    (ev_id, 'croix-rousse', 'Croix-Rousse & canuts', 'L''âme ouvrière de Lyon, les pentes et les enjeux de logement social contemporains sur la colline.', '09 oct · 09h00', '2026-10-09', 25, 3),
    (ev_id, 'part-dieu', 'Part-Dieu en mutation', 'Le cœur tertiaire de Lyon et ses programmes mixtes, visite d''une opération récente du groupe.', '09 oct · 09h00', '2026-10-09', 30, 4)
  on conflict (event_id, code) do nothing;
  
  -- Nuitées
  insert into accommodation_nights (event_id, night_date, label, description) values
    (ev_id, '2026-10-07', 'Nuit du mercredi 07 octobre', 'Arrivée la veille du séminaire · check-in dès 15h'),
    (ev_id, '2026-10-08', 'Nuit du jeudi 08 octobre', 'Soir du séminaire · dîner en commun inclus')
  on conflict (event_id, night_date) do nothing;
  
  -- Ateliers (exemples — à compléter par l'admin)
  insert into workshops (event_id, code, title, description, slot_label, capacity, display_order) values
    (ev_id, 'strategie', 'Stratégie patrimoniale 2030', 'Atelier collaboratif autour des grands axes de la stratégie Groupe.', '08 oct · 14h00', 40, 1),
    (ev_id, 'transition', 'Transition énergétique du parc', 'Retours d''expérience et perspectives sur la rénovation thermique.', '08 oct · 14h00', 40, 2),
    (ev_id, 'innovation', 'Innovation & nouveaux usages', 'Nouvelles formes d''habitat, services aux résidents, digital.', '08 oct · 14h00', 40, 3)
  on conflict (event_id, code) do nothing;
end $$;

-- Entités CDC
insert into entities (name, display_order) values
  ('CDC Habitat — Siège', 1),
  ('DI Île-de-France', 2),
  ('DI Auvergne-Rhône-Alpes', 3),
  ('DI Nouvelle-Aquitaine', 4),
  ('DI Méditerranée', 5),
  ('DI Grand Ouest', 6),
  ('DI Grand Est', 7),
  ('Adoma', 8),
  ('Sainte-Barbe', 9),
  ('CDC Habitat Social', 10)
on conflict (name) do nothing;

-- ════════════════════════════════════════════════════════════════════
-- FONCTION : générer une référence d'inscription unique
-- ════════════════════════════════════════════════════════════════════
create or replace function generate_registration_reference() returns text as $$
declare
  ref text;
  exists_count integer;
begin
  loop
    ref := 'RAPMO-2026-' || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 4));
    select count(*) into exists_count from registrations where reference = ref;
    exit when exists_count = 0;
  end loop;
  return ref;
end;
$$ language plpgsql;
