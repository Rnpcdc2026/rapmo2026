import { createAdminClient } from '@/lib/supabase/admin';

const TRANSPORT_LABELS: Record<string, string> = {
  train: 'Train',
  plane: 'Avion',
  car: 'Voiture personnelle',
  public_or_walk: 'Transport en commun / à pied',
};

export const EXPORT_COLUMNS = [
  'Référence',
  'Nom',
  'Prénom',
  'Email',
  'Téléphone',
  'Entité',
  'Fonction',
  'Régime',
  'Allergies',
  'Hôtel',
  'Transport',
  'Présence',
  'Visite jeudi',
  'Visite vendredi',
  'Ateliers',
  'Date inscription',
];

export type ExportRow = string[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeRow(r: any): ExportRow {
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
  const workshops = (r.registration_workshops || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((rw: any) => rw.workshop?.title)
    .filter(Boolean)
    .join(' | ');

  const created = r.created_at ? new Date(r.created_at).toLocaleString('fr-FR') : '';

  return [
    r.reference || '',
    r.last_name || '',
    r.first_name || '',
    r.email || '',
    r.phone || '',
    r.entity || '',
    r.role || '',
    r.diet || '',
    r.allergies || '',
    r.hotel?.title || '',
    TRANSPORT_LABELS[r.transport_mode] || r.transport_mode || '',
    presence.join(', '),
    thursdayVisit,
    fridayVisit,
    workshops,
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
       registration_workshops ( workshop:workshops(title) )`
    )
    .order('created_at', { ascending: false });

  if (error || !data) return { rows: [], count: 0 };
  const rows = data.map(shapeRow);
  return { rows, count: rows.length };
}
