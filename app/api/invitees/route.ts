import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createAdminClient();

  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('slug', 'rapmo-2026')
    .single();

  if (!event) {
    return NextResponse.json({ error: 'Événement introuvable.' }, { status: 404 });
  }

  const { data: invitees, error } = await supabase
    .from('invitations')
    .select('id, first_name, last_name, email, entity, filiere')
    .eq('event_id', event.id)
    .eq('registered', false)
    .order('last_name');

  if (error) {
    console.error('[API/invitees]', error.message);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }

  return NextResponse.json(invitees ?? [], {
    headers: { 'Cache-Control': 'no-store' },
  });
}
