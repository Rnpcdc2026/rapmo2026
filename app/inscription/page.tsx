import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import RegistrationForm from './RegistrationForm';

export const revalidate = 0;

type SearchParams = {
  email?: string;
  firstName?: string;
  lastName?: string;
  entity?: string;
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createClient();

  // Charger l'événement actif
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'rnp-2026')
    .single();

  if (!event) {
    notFound();
  }

  // Charger les visites, nuitées, ateliers, entités
  const [visitsRes, nightsRes, workshopsRes, entitiesRes, registrationsRes] =
    await Promise.all([
      supabase.from('visits').select('*').eq('event_id', event.id).order('slot_label'),
      supabase
        .from('accommodation_nights')
        .select('*')
        .eq('event_id', event.id)
        .order('night_date'),
      supabase.from('workshops').select('*').eq('event_id', event.id).order('title'),
      supabase.from('entities').select('*').order('name'),
      supabase
        .from('registrations')
        .select('visit_id')
        .eq('event_id', event.id)
        .not('visit_id', 'is', null),
    ]);

  // Calculer la disponibilité par visite
  const visitsAvailability: Record<string, number> = {};
  const visits = visitsRes.data || [];
  visits.forEach((v) => {
    const taken = (registrationsRes.data || []).filter(
      (r) => r.visit_id === v.id
    ).length;
    visitsAvailability[v.id] = Math.max(0, v.capacity - taken);
  });

  return (
    <RegistrationForm
      event={event}
      visits={visits}
      nights={nightsRes.data || []}
      workshops={workshopsRes.data || []}
      entities={entitiesRes.data || []}
      visitsAvailability={visitsAvailability}
      prefill={
        searchParams.email || searchParams.firstName
          ? {
              email: searchParams.email,
              firstName: searchParams.firstName,
              lastName: searchParams.lastName,
              entity: searchParams.entity,
            }
          : null
      }
    />
  );
}
