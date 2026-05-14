import { createAdminClient } from '@/lib/supabase/admin';
import EmailsPanel from './EmailsPanel';

export const dynamic = 'force-dynamic';

export default async function EmailsPage() {
  const supabase = createAdminClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'rnp-2026')
    .single();

  const { data: invitations } = await supabase
    .from('invitations')
    .select('*')
    .eq('event_id', event?.id)
    .order('created_at', { ascending: false });

  const { data: emailLog } = await supabase
    .from('email_log')
    .select('*')
    .eq('event_id', event?.id)
    .order('sent_at', { ascending: false })
    .limit(50);

  return (
    <EmailsPanel
      eventId={event?.id || ''}
      initialInvitations={(invitations || []) as any[]}
      initialLog={(emailLog || []) as any[]}
    />
  );
}
