import { createAdminClient } from '@/lib/supabase/admin';

const TRANSPORT_LABELS: Record<string, string> = {
  train: 'Train',
  plane: 'Avion',
  car: 'Voiture personnelle',
  public_or_walk: 'Transport en commun / à pied',
};

// Une colonne par atelier (dans l'ordre voulu à l'export), clé stable = code
const WORKSHOP_COLUMNS: { code: string; label: string }[] = [
  { code: 'atelier-optimisation-travaux', label: 'Atelier Optimisation travaux' },
  { code: 'atelier-biodiversite', label: 'Atelier Réhabiliter autrement' },
  { code: 'atelier-projet-strategique', label: 'Atelier Orientations stratégiques' },
  { code: 'atelier-piece-toit', label: 'Atelier Autour du spectacle' },
];

export const EXPORT_COLUMNS = [
  'Référence',
  'Nom',
  'Prénom',
  'Email',
  'Téléphone',
  'Entité',
  'Filière',
  'Fonction',
  'Régime',
  'Allergies',
  'Hôtel',
  'Transport',
  'Présence',
  'Visite jeudi',
  'Visite vendredi',
  ...WORKSHOP_COLUMNS.map((w) => w.label),
  'Date inscription',
];

export type ExportRow = string[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeRow(r: any, filiereMap: Record<string, string>): ExportRow {
  const presence: string[] = [];
  if (r.attends_thursday_morning) presence.push('Jeudi matin');
  if (r.attends_thursday_afternoon) presence.push('Jeudi après-midi');
  if (r.attends_thursday_evening) presence.push('Jeudi soir');
  if (r.attends_friday_morning) presence.push('Vendredi matin');
  if (r.attends_friday_afternoon) presence.push('Vendredi après-midi');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visits = (r.registration_visits || []).map((rv: any) => rv.visit).filter(Boolean);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thursdayVisit = visits.find((v: any) => v.slot_label === 'jeudi-aprem')?.title || '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fridayVisit = visits.find((v: any) => v.slot_label === 'vendredi-aprem')?.title || '';
  // Codes des ateliers choisis → une colonne par atelier (X si sélectionné)
  const selectedWorkshopCodes = new Set(
    (r.registration_workshops || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((rw: any) => rw.workshop?.code)
      .filter(Boolean)
  );
  const workshopCells = WORKSHOP_COLUMNS.map((w) =>
    selectedWorkshopCodes.has(w.code) ? 'X' : ''
  );

  const created = r.created_at ? new Date(r.created_at).toLocaleString('fr-FR') : '';

  return [
    r.reference || '',
    r.last_name || '',
    r.first_name || '',
    r.email || '',
    r.phone || '',
    r.entity || '',
    filiereMap[(r.email || '').toLowerCase()] || '',
    r.role || '',
    r.diet || '',
    r.allergies || '',
    r.hotel?.title || '',
    TRANSPORT_LABELS[r.transport_mode] || r.transport_mode || '',
    presence.join(', '),
    thursdayVisit,
    fridayVisit,
    ...workshopCells,
    created,
  ];
}

export async function fetchRegistrationRows(): Promise<{ rows: ExportRow[]; count: number }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('registrations')
    .select(
      `reference, first_name, last_name, email, phone, entity, role, diet, allergies,
       transport_mode, status, created_at,
       attends_thursday_morning, attends_thursday_afternoon, attends_thursday_evening,
       attends_friday_morning, attends_friday_afternoon,
       hotel:hotels(title),
       registration_visits ( visit:visits(title, slot_label) ),
       registration_workshops ( workshop:workshops(code, title) )`
    )
    .order('created_at', { ascending: false });

  if (error || !data) return { rows: [], count: 0 };

  // Filière non stockée sur l'inscription → on la récupère depuis les invitations (par email)
  const { data: invites } = await supabase
    .from('invitations')
    .select('email, filiere');
  const filiereMap: Record<string, string> = {};
  for (const inv of invites ?? []) {
    if (inv.email) filiereMap[inv.email.toLowerCase()] = inv.filiere ?? '';
  }

  const rows = data.map((r) => shapeRow(r, filiereMap));
  return { rows, count: rows.length };
}
