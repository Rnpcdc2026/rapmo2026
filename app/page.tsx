import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import styles from './page.module.css';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'rnp-2026')
    .single();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandMark} />
          <span>Rencontre Nationale Patrimoine</span>
        </div>
        <div className={styles.headerMeta}>
          Édition <strong>2026</strong> · Lyon
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.decor} />
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.eyebrow}>Inscription ouverte</div>
            <h1 className={styles.title}>
              Deux jours pour
              <br />
              <em>bâtir ensemble</em>
              <br />
              le patrimoine.
            </h1>
            <p className={styles.lede}>
              Retrouvez 150 à 200 collaborateurs CDC Habitat à Lyon pour partager la
              stratégie Groupe, échanger sur nos métiers et créer du lien autour
              d'ateliers, visites et tables rondes.
            </p>
            <Link href="/inscription" className={styles.ctaPrimary}>
              S'inscrire au séminaire
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8h12M9 3l5 5-5 5" />
              </svg>
            </Link>
          </div>
          <div className={styles.heroMeta}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Dates</span>
              <span className={styles.metaValue}>08 — 09 octobre 2026</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Lieu</span>
              <span className={styles.metaValue}>
                {event?.location || 'Métropole lyonnaise'}
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Public</span>
              <span className={styles.metaValue}>Collaborateurs &amp; filiales</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Clôture</span>
              <span className={styles.metaValue}>25 septembre 2026</span>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>CDC Habitat — GIE Expertise &amp; Support · DPG-SMO-2026-01</span>
        <span>
          Une question ?{' '}
          <a href={`mailto:${event?.contact_email || 'sophie.mondet@cdc-habitat.fr'}`}>
            {event?.contact_email || 'sophie.mondet@cdc-habitat.fr'}
          </a>
        </span>
      </footer>
    </main>
  );
}
