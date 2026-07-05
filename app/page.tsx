import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import styles from './page.module.css';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'rapmo-2026')
    .single();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Image
            src="/cdc-habitat-logo.jpg"
            alt="CDC Habitat"
            width={200}
            height={68}
            priority
            className={styles.logo}
          />
        </div>
        <div className={styles.headerMeta}>
          Rencontres Annuelles Patrimoine et Maîtrise d'Ouvrage <strong>2026</strong>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.eyebrow}>Inscription ouverte</div>
            <h1 className={styles.title}>
              Rencontres Annuelles Patrimoine &amp;{' '}
              <span className={styles.titleAccent}>Maîtrise d&apos;ouvrage 2026</span>
            </h1>
            <p className={styles.subtitle}>
              Satisfaction client et transition climatique : relever collectivement ces défis
            </p>
            <p className={styles.lede}>
              Les Rencontres Annuelles Patrimoine et Maîtrise d&apos;Ouvrage se tiendront à Lyon
              Confluence, les jeudi 8 et vendredi 9 octobre 2026. Deux jours pour se retrouver et
              partager autour de la Démarche Qualité Maintenance et du Plan Stratégique Climat. Deux
              jours rythmés par des échanges, des conférences interactives et des visites inspirantes
              de patrimoine et de sites culturels lyonnais. Au cœur de ces rencontres, une ambition :
              améliorer durablement la qualité des logements et le cadre de vie des résidences.
            </p>
            <Link href="/inscription" className={styles.ctaPrimary}>
              S'inscrire aux rencontres
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 8h12M9 3l5 5-5 5" />
              </svg>
            </Link>
            {event?.registration_deadline && (
              <p className={styles.ctaDeadline}>
                Clôture des inscriptions le{' '}
                {new Date(event.registration_deadline).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home-confluence.jpg"
              alt="Le quartier de la Confluence à Lyon, entre Rhône et Saône"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.metaStrip}>
        <div className={styles.metaStripInner}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Dates</span>
            <span className={styles.metaValue}>08 — 09 octobre 2026</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Lieu</span>
            <span className={styles.metaValue}>
              {event?.location || 'Métropole lyonnaise'}
            </span>
          </div>
          <Link href="/programme" className={`${styles.ctaSecondary} ${styles.metaCta}`}>
            Voir le programme
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 8h12M9 3l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>CDC Habitat — GIE Expertise &amp; Support · Référence DPG-SMO-2026-01</span>
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
