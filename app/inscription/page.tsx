import { createClient } from '@/lib/supabase/server';
import RegistrationForm from './RegistrationForm';
import type { Event, Visit, AccommodationNight, Workshop, Entity } from '@/lib/types';

export const revalidate = 30;

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const supabase = createClient();

  // Si un token d'invitation est fourni, pré-remplir avec les infos de l'invitation
  let prefill: {
    email?: string;
    firstName?: string;
    lastName?: string;
    entity?: string;
  } | null = null;
  if (searchParams.token) {
    const { data: invitation } = await supabase
      .from('invitations')
      .select('email, first_name, last_name, entity')
      .eq('invite_token', searchParams.token)
      .maybeSingle();
    if (invitation) {
      prefill = {
        email: invitation.email,
        firstName: invitation.first_name || undefined,
        lastName: invitation.last_name || undefined,
        entity: invitation.entity || undefined,
      };
      // Marquer comme ouverte
      await supabase
        .from('invitations')
        .update({ opened_at: new Date().toISOString() })
        .eq('invite_token', searchParams.token)
        .is('opened_at', null);
    }
  }

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'rnp-2026')
    .single();

  if (!event) {
    return (
      <main style={{ padding: 80, textAlign: 'center' }}>
        <h1>Événement introuvable</h1>
      </main>
    );
  }

  if (!event.is_open) {
    return (
      <main style={{ padding: 80, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h1 className="font-serif" style={{ fontSize: 48, marginBottom: 16 }}>
          Inscriptions <em>fermées.</em>
        </h1>
        <p style={{ color: 'rgba(26,22,18,0.6)' }}>
          Les inscriptions à la Rencontre Nationale Patrimoine 2026 sont actuellement
          fermées. Pour toute question, contactez {event.contact_email}.
        </p>
      </main>
    );
  }

  // Charger les contenus en parallèle
  const [visitsRes, nightsRes, workshopsRes, entitiesRes] = await Promise.all([
    supabase
      .from('visits')
      .select('*')
      .eq('event_id', event.id)
      .eq('is_active', true)
      .order('display_order'),
    supabase
      .from('accommodation_nights')
      .select('*')
      .eq('event_id', event.id)
      .eq('is_active', true)
      .order('night_date'),
    supabase
      .from('workshops')
      .select('*')
      .eq('event_id', event.id)
      .eq('is_active', true)
      .order('display_order'),
    supabase
      .from('entities')
      .select('*')
      .eq('is_active', true)
      .order('display_order'),
  ]);

  // Vérifier les places restantes par visite (fait via vue stats_visits)
  const { data: visitsStats } = await supabase.from('stats_visits').select('*');
  const visitsAvailability = new Map(
    (visitsStats || []).map((v: any) => [v.id, v.remaining as number])
  );

  return (
    <RegistrationForm
      event={event as Event}
      visits={(visitsRes.data || []) as Visit[]}
      nights={(nightsRes.data || []) as AccommodationNight[]}
      workshops={(workshopsRes.data || []) as Workshop[]}
      entities={(entitiesRes.data || []) as Entity[]}
      visitsAvailability={Object.fromEntries(visitsAvailability)}
      prefill={prefill}
    />
  );
}
