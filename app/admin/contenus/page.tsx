import { createAdminClient } from '@/lib/supabase/admin';
import ContenuPanel from './ContenuPanel';

export const dynamic = 'force-dynamic';

export default async function ContenusPage() {
  const supabase = createAdminClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'rnp-2026')
    .single();

  const [visitsRes, workshopsRes, nightsRes] = await Promise.all([
    supabase.from('visits').select('*').eq('event_id', event?.id).order('display_order'),
    supabase.from('workshops').select('*').eq('event_id', event?.id).order('display_order'),
    supabase.from('accommodation_nights').select('*').eq('event_id', event?.id).order('night_date'),
  ]);

  return (
    <ContenuPanel
      event={event}
      visits={visitsRes.data || []}
      workshops={workshopsRes.data || []}
      nights={nightsRes.data || []}
    />
  );
}
