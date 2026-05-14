// Types des entités de la base de données

export type Event = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  registration_deadline: string;
  contact_email: string | null;
  is_open: boolean;
};

export type Visit = {
  id: string;
  event_id: string;
  code: string;
  title: string;
  description: string | null;
  slot_label: string | null;
  slot_date: string | null;
  capacity: number;
  is_active: boolean;
  display_order: number;
};

export type Workshop = {
  id: string;
  event_id: string;
  code: string;
  title: string;
  description: string | null;
  speaker: string | null;
  slot_label: string | null;
  capacity: number;
  is_active: boolean;
  display_order: number;
};

export type AccommodationNight = {
  id: string;
  event_id: string;
  night_date: string;
  label: string | null;
  description: string | null;
  is_active: boolean;
};

export type Entity = {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
};

export type Registration = {
  id: string;
  event_id: string;
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  entity: string | null;
  role: string | null;
  diet: string | null;
  visit_id: string | null;
  bus_transport: boolean;
  status: 'confirmed' | 'cancelled' | 'waitlist';
  confirmation_email_sent_at: string | null;
  reminder_email_sent_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RegistrationWithRelations = Registration & {
  visit: Visit | null;
  nights: AccommodationNight[];
  workshops: Workshop[];
};

export type Invitation = {
  id: string;
  event_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  entity: string | null;
  invite_token: string;
  sent_at: string | null;
  opened_at: string | null;
  registered: boolean;
  reminder_count: number;
  last_reminder_at: string | null;
};

export type StatsOverview = {
  event_id: string;
  title: string;
  total_registered: number;
  total_invited: number;
  invitations_sent: number;
  bus_count: number;
};

export type StatsVisit = {
  id: string;
  title: string;
  slot_label: string | null;
  capacity: number;
  registered: number;
  remaining: number;
};

export type StatsNight = {
  id: string;
  night_date: string;
  label: string | null;
  count: number;
};
