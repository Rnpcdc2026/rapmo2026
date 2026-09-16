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

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'rapmo-2026')
    .single();

  if (!event) {
    notFound();
  }

  // Clôture réelle des inscriptions : passé la fin du jour de la date limite
  const deadline = event.registration_deadline ? new Date(event.registration_deadline) : null;
  const isClosed = deadline
    ? Date.now() > deadline.getTime() + 24 * 60 * 60 * 1000
    : false;

  if (isClosed) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#fff',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ maxWidth: 540, textAlign: 'center' }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#828485',
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            RAPMO 2026
          </div>
          <h1 style={{ fontSize: 28, color: '#E30613', margin: '0 0 12px' }}>
            Les inscriptions sont closes
          </h1>
          <p style={{ fontSize: 16, color: '#4C4C4B', lineHeight: 1.6, margin: '0 0 24px' }}>
            La période d&apos;inscription aux Rencontres Annuelles Patrimoine et Maîtrise
            d&apos;Ouvrage 2026 est terminée. Pour toute question, contactez rapmo.lyon@gmail.com.
          </p>
          <a
            href="/programme"
            style={{
              display: 'inline-block',
              background: '#E30613',
              color: '#fff',
              textDecoration: 'none',
              padding: '12px 22px',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Voir le programme →
          </a>
        </div>
      </main>
    );
  }

  const [
    visitsRes,
    workshopsRes,
    hotelsRes,
    entitiesRes,
    registrationVisitsRes,
    registrationWorkshopsRes,
  ] = await Promise.all([
    supabase
      .from('visits')
      .select('*')
      .eq('event_id', event.id)
      .eq('is_active', true)
      .order('display_order'),
    supabase
      .from('workshops')
      .select('*')
      .eq('event_id', event.id)
      .eq('is_active', true)
      .order('display_order'),
    supabase
      .from('hotels')
      .select('*')
      .eq('event_id', event.id)
      .eq('is_active', true)
      .order('display_order'),
    supabase.from('entities').select('*').order('name'),
    supabase.from('registration_visits').select('visit_id'),
    supabase.from('registration_workshops').select('workshop_id'),
  ]);

  const visits = visitsRes.data ?? [];
  const visitIdSet = new Set(visits.map((v) => v.id));

  const occupancy = new Map<string, number>();
  for (const rv of registrationVisitsRes.data ?? []) {
    if (visitIdSet.has(rv.visit_id)) {
      occupancy.set(rv.visit_id, (occupancy.get(rv.visit_id) ?? 0) + 1);
    }
  }

  const visitsAvailability: Record<string, number> = {};
  visits.forEach((v) => {
    visitsAvailability[v.id] = Math.max(0, v.capacity - (occupancy.get(v.id) ?? 0));
  });

  const workshops = workshopsRes.data ?? [];
  const workshopIdSet = new Set(workshops.map((w) => w.id));
  const wsOccupancy = new Map<string, number>();
  for (const rw of registrationWorkshopsRes.data ?? []) {
    if (workshopIdSet.has(rw.workshop_id)) {
      wsOccupancy.set(rw.workshop_id, (wsOccupancy.get(rw.workshop_id) ?? 0) + 1);
    }
  }
  const workshopsAvailability: Record<string, number> = {};
  workshops.forEach((w) => {
    workshopsAvailability[w.id] = Math.max(0, w.capacity - (wsOccupancy.get(w.id) ?? 0));
  });

  return (
    <RegistrationForm
      event={event}
      visits={visits}
      workshops={workshops}
      entities={entitiesRes.data ?? []}
      hotels={hotelsRes.data ?? []}
      visitsAvailability={visitsAvailability}
      workshopsAvailability={workshopsAvailability}
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
