import { cookies } from 'next/headers';
import { fetchRegistrationRows, EXPORT_COLUMNS } from '@/lib/registrations-export';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function toCsvValue(v: string): string {
  return '"' + String(v ?? '').replace(/"/g, '""') + '"';
}

export async function GET() {
  if (cookies().get('suivi_ok')?.value !== 'ok') {
    return new Response('Non autorisé.', { status: 401 });
  }

  const { rows } = await fetchRegistrationRows();

  const sep = ';'; // séparateur attendu par Excel en config FR
  const lines = [EXPORT_COLUMNS, ...rows].map((row) =>
    row.map(toCsvValue).join(sep)
  );
  // BOM UTF-8 pour que les accents s'affichent correctement dans Excel
  const csv = '﻿' + lines.join('\r\n');

  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inscriptions-rapmo-2026-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
