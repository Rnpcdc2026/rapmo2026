import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchRegistrationRows, EXPORT_COLUMNS } from '@/lib/registrations-export';
import styles from './suivi.module.css';

export const dynamic = 'force-dynamic';

function getPassword() {
  return process.env.SUIVI_PASSWORD || process.env.ACCESS_PASSWORD || '';
}

async function login(formData: FormData) {
  'use server';
  const pwd = String(formData.get('password') || '');
  const expected = getPassword();
  if (expected && pwd === expected) {
    cookies().set('suivi_ok', 'ok', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    redirect('/suivi');
  }
  redirect('/suivi?error=1');
}

export default async function SuiviPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const authorized = cookies().get('suivi_ok')?.value === 'ok';

  if (!authorized) {
    return (
      <main className={styles.gate}>
        <form action={login} className={styles.gateCard}>
          <h1 className={styles.gateTitle}>Suivi des inscriptions</h1>
          <p className={styles.gateText}>Accès réservé. Merci de saisir le mot de passe.</p>
          {searchParams?.error && (
            <p className={styles.gateError}>Mot de passe incorrect.</p>
          )}
          <input
            className={styles.gateInput}
            type="password"
            name="password"
            placeholder="Mot de passe"
            autoFocus
            required
          />
          <button type="submit" className={styles.gateBtn}>Accéder</button>
        </form>
      </main>
    );
  }

  const { rows, count } = await fetchRegistrationRows();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Image
          src="/cdc-habitat-logo.jpg"
          alt="CDC Habitat"
          width={160}
          height={54}
          className={styles.logo}
        />
        <div className={styles.headerTitle}>
          Suivi des inscriptions — RAPMO 2026
        </div>
      </header>

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Inscriptions</h1>
        <p className={styles.subtitle}>Liste des participants enregistrés sur la plateforme.</p>

        <div className={styles.actionsBar}>
          <span className={styles.count}>
            {count} inscription{count > 1 ? 's' : ''}
          </span>
          <a href="/api/suivi/export" className={styles.exportBtn}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v8M4 7l4 4 4-4M2 13h12" />
            </svg>
            Exporter en Excel
          </a>
        </div>

        {count === 0 ? (
          <div className={styles.tableWrap}>
            <div className={styles.empty}>Aucune inscription pour le moment.</div>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {EXPORT_COLUMNS.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className={j === 0 ? styles.ref : undefined}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
