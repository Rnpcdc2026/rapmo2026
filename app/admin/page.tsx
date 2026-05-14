import { createAdminClient } from '@/lib/supabase/admin';
import styles from './dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'rnp-2026')
    .single();

  const { data: overview } = await supabase
    .from('stats_overview')
    .select('*')
    .single();

  const { data: visitsStats } = await supabase
    .from('stats_visits')
    .select('*');

  const { data: nightsStats } = await supabase
    .from('stats_nights')
    .select('*');

  const { data: entityBreakdown } = await supabase
    .from('registrations')
    .select('entity')
    .eq('status', 'confirmed');

  // Agrégation par entité côté serveur
  const byEntity: Record<string, number> = {};
  (entityBreakdown || []).forEach((r) => {
    if (r.entity) byEntity[r.entity] = (byEntity[r.entity] || 0) + 1;
  });
  const entityRanking = Object.entries(byEntity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const totalRegistered = overview?.total_registered || 0;
  const targetMin = 150;
  const targetMax = 200;
  const progressPct = Math.min(100, (totalRegistered / targetMax) * 100);

  const daysRemaining = event
    ? Math.max(
        0,
        Math.ceil(
          (new Date(event.registration_deadline).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Tableau de bord</p>
          <h1 className={styles.title}>
            {event?.title || 'Événement'}
          </h1>
          <p className={styles.subtitle}>
            {event?.location} · {new Date(event?.start_date || '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} — {new Date(event?.end_date || '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className={styles.deadlineBadge}>
          <span className={styles.deadlineLabel}>Clôture</span>
          <span className={styles.deadlineValue}>{daysRemaining} jours</span>
        </div>
      </header>

      {/* ─── KPIs ─── */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Inscrits confirmés</span>
          <span className={styles.kpiValue}>{totalRegistered}</span>
          <span className={styles.kpiHint}>Objectif {targetMin}–{targetMax}</span>
          <div className={styles.progress}>
            <div className={styles.progressBar} style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Invitations envoyées</span>
          <span className={styles.kpiValue}>{overview?.invitations_sent || 0}</span>
          <span className={styles.kpiHint}>
            Sur {overview?.total_invited || 0} contacts en base
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Taux de conversion</span>
          <span className={styles.kpiValue}>
            {overview?.invitations_sent
              ? Math.round((totalRegistered / overview.invitations_sent) * 100)
              : 0}
            %
          </span>
          <span className={styles.kpiHint}>Invitations → inscriptions</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Transport en bus</span>
          <span className={styles.kpiValue}>{overview?.bus_count || 0}</span>
          <span className={styles.kpiHint}>Inscrits ayant coché le bus</span>
        </div>
      </section>

      {/* ─── Visites ─── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Remplissage des visites</h2>
        <div className={styles.visitGrid}>
          {(visitsStats || []).map((v: any) => {
            const pct = v.capacity > 0 ? Math.round((v.registered / v.capacity) * 100) : 0;
            const isFull = v.remaining <= 0;
            const isHot = pct >= 80;
            return (
              <div key={v.id} className={styles.visitRow}>
                <div className={styles.visitInfo}>
                  <span className={styles.visitSlot}>{v.slot_label}</span>
                  <span className={styles.visitTitle}>{v.title}</span>
                </div>
                <div className={styles.visitCount}>
                  <span className={`${styles.visitNum} ${isFull ? styles.full : isHot ? styles.hot : ''}`}>
                    {v.registered}<span className={styles.visitMax}>/{v.capacity}</span>
                  </span>
                  <div className={styles.visitBar}>
                    <div
                      className={`${styles.visitBarFill} ${isFull ? styles.barFull : isHot ? styles.barHot : ''}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Nuitées + Top entités ─── */}
      <section className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuitées réservées</h2>
          <div className={styles.nightsList}>
            {(nightsStats || []).map((n: any) => (
              <div key={n.id} className={styles.nightItem}>
                <div>
                  <div className={styles.nightLabel}>
                    {new Date(n.night_date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </div>
                  <div className={styles.nightDesc}>{n.label}</div>
                </div>
                <div className={styles.nightCount}>{n.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top entités</h2>
          <div className={styles.entityList}>
            {entityRanking.length === 0 && (
              <p className={styles.empty}>Aucune inscription pour le moment.</p>
            )}
            {entityRanking.map(([name, count], i) => {
              const max = entityRanking[0][1];
              const pct = (count / max) * 100;
              return (
                <div key={name} className={styles.entityRow}>
                  <span className={styles.entityRank}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.entityName}>{name}</span>
                  <div className={styles.entityBarWrap}>
                    <div className={styles.entityBar} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.entityCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
