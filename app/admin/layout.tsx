import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import styles from './admin.module.css';

async function signOut() {
  'use server';
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si on est sur /admin/login on saute le layout (rendu dans la page elle-même)
  // Le middleware redirige déjà si non connecté

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand}>
          <div className={styles.brandMark} />
          <div>
            <div className={styles.brandTitle}>Patrimoine</div>
            <div className={styles.brandSub}>Admin · 2026</div>
          </div>
        </Link>

        <nav className={styles.nav}>
          <div className={styles.navSection}>Tableau de bord</div>
          <Link href="/admin" className={styles.navLink}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="5" height="5" /><rect x="9" y="2" width="5" height="5" />
              <rect x="2" y="9" width="5" height="5" /><rect x="9" y="9" width="5" height="5" />
            </svg>
            Vue d'ensemble
          </Link>

          <div className={styles.navSection}>Inscrits</div>
          <Link href="/admin/inscrits" className={styles.navLink}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="5" r="3" /><path d="M2 14c0-3 3-5 6-5s6 2 6 5" />
            </svg>
            Liste des inscrits
          </Link>

          <div className={styles.navSection}>Communications</div>
          <Link href="/admin/emails" className={styles.navLink}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="12" height="10" /><path d="M2 4l6 5 6-5" />
            </svg>
            Invitations &amp; relances
          </Link>

          <div className={styles.navSection}>Configuration</div>
          <Link href="/admin/contenus" className={styles.navLink}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="2" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M3.5 12.5l1.5-1.5M11 5l1.5-1.5" />
            </svg>
            Visites, ateliers, dates
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userBox}>
            <div className={styles.userInitials}>
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className={styles.userMeta}>
              <div className={styles.userEmail}>{user?.email}</div>
              <form action={signOut}>
                <button type="submit" className={styles.signOut}>Se déconnecter</button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
