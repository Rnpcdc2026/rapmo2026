import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendReminderEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Compte d'email de test à ne pas relancer
const TEST_EMAIL = 'comm.esprit@orange.fr';

export async function POST() {
  if (cookies().get('suivi_ok')?.value !== 'ok') {
    return Response.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('slug', 'rapmo-2026')
    .single();

  if (!event) {
    return Response.json({ error: 'Événement introuvable.' }, { status: 500 });
  }

  const { data: invites, error } = await supabase
    .from('invitations')
    .select('id')
    .eq('event_id', event.id)
    .eq('registered', false)
    .neq('email', TEST_EMAIL);

  if (error) {
    return Response.json({ error: 'Erreur lecture invitations.' }, { status: 500 });
  }

  const ids = (invites ?? []).map((i) => i.id as string);

  let sent = 0;
  let failed = 0;
  for (const id of ids) {
    const r = await sendReminderEmail({ invitationId: id, eventId: event.id });
    if (r.success) sent++;
    else failed++;
    await new Promise((res) => setTimeout(res, 80));
  }

  return Response.json({ total: ids.length, sent, failed });
}
