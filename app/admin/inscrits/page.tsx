import { createAdminClient } from '@/lib/supabase/admin';
import InscritsTable from './InscritsTable';

export const dynamic = 'force-dynamic';

export default async function InscritsPage() {
  const supabase = createAdminClient();

  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      visit:visits(id, title, slot_label),
      registration_nights(night:accommodation_nights(id, night_date, label))
    `)
    .order('created_at', { ascending: false });

  const { data: visits } = await supabase
    .from('visits')
    .select('id, title, slot_label')
    .eq('is_active', true)
    .order('display_order');

  const { data: entities } = await supabase
    .from('entities')
    .select('name')
    .eq('is_active', true)
    .order('display_order');

  return (
    <InscritsTable
      initialRegistrations={(registrations || []) as any[]}
      visits={(visits || []) as any[]}
      entities={(entities || []).map((e) => e.name)}
    />
  );
}
