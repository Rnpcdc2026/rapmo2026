'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './emails.module.css';

type Invitation = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  entity: string | null;
  sent_at: string | null;
  opened_at: string | null;
  registered: boolean;
  reminder_count: number;
  last_reminder_at: string | null;
  created_at: string;
};

type EmailLog = {
  id: string;
  email_type: string;
  to_email: string;
  subject: string | null;
  status: string;
  sent_at: string;
  error_message: string | null;
};

type Props = {
  eventId: string;
  initialInvitations: Invitation[];
  initialLog: EmailLog[];
};

export default function EmailsPanel({ eventId, initialInvitations, initialLog }: Props) {
  const router = useRouter();
  const [invitations, setInvitations] = useState(initialInvitations);
  const [log, setLog] = useState(initialLog);
  const [tab, setTab] = useState<'invitations' | 'import' | 'log'>('invitations');
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent' | 'registered' | 'not-registered'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

  const filtered = useMemo(() => {
    return invitations.filter((inv) => {
      const matchSearch =
        !search ||
        `${inv.first_name || ''} ${inv.last_name || ''} ${inv.email} ${inv.entity || ''}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchFilter =
        filter === 'all' ||
        (filter === 'pending' && !inv.sent_at) ||
        (filter === 'sent' && inv.sent_at) ||
        (filter === 'registered' && inv.registered) ||
        (filter === 'not-registered' && inv.sent_at && !inv.registered);
      return matchSearch && matchFilter;
    });
  }, [invitations, search, filter]);

  // ─── Stats rapides ─────────────────────────────────────
  const stats = useMemo(() => ({
    total: invitations.length,
    sent: invitations.filter((i) => i.sent_at).length,
    registered: invitations.filter((i) => i.registered).length,
    pending: invitations.filter((i) => !i.sent_at).length,
    notRegistered: invitations.filter((i) => i.sent_at && !i.registered).length,
  }), [invitations]);

  // ─── CSV Parser ─────────────────────────────────────────
  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];
    const headerLine = lines[0];
    const sep = headerLine.includes(';') ? ';' : ',';
    const headers = headerLine.split(sep).map((h) => h.trim().toLowerCase());
    const emailIdx = headers.findIndex((h) => h.includes('email') || h.includes('mail'));
    const firstIdx = headers.findIndex((h) => h.includes('prénom') || h.includes('prenom') || h === 'first_name' || h === 'firstname');
    const lastIdx = headers.findIndex((h) => h.includes('nom') && !h.includes('prénom') && !h.includes('prenom') || h === 'last_name' || h === 'lastname');
    const entityIdx = headers.findIndex((h) => h.includes('entité') || h.includes('entite') || h.includes('société') || h.includes('societe') || h === 'entity' || h === 'company');

    if (emailIdx === -1) return [];

    return lines.slice(1).map((line) => {
      const cells = line.split(sep).map((c) => c.trim().replace(/^["']|["']$/g, ''));
      return {
        email: cells[emailIdx] || '',
        first_name: firstIdx >= 0 ? cells[firstIdx] || '' : '',
        last_name: lastIdx >= 0 ? cells[lastIdx] || '' : '',
        entity: entityIdx >= 0 ? cells[entityIdx] || '' : '',
      };
    }).filter((r) => r.email);
  };

  const onCsvSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCsv(text);
      setCsvPreview(parsed);
    };
    reader.readAsText(file);
  };

  const importContacts = async () => {
    if (csvPreview.length === 0) return;
    setImporting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/invitations/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, contacts: csvPreview }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Erreur import' });
      } else {
        setMessage({
          type: 'success',
          text: `${data.imported} nouveau(x) contact(s) importé(s) sur ${data.total} ligne(s) valides.`,
        });
        setCsvPreview([]);
        if (fileRef.current) fileRef.current.value = '';
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setImporting(false);
    }
  };

  // ─── Envoi invitations / relances ───────────────────────
  const sendBatch = async (mode: 'invite' | 'remind') => {
    if (selected.size === 0) {
      setMessage({ type: 'error', text: 'Sélectionnez au moins une invitation.' });
      return;
    }
    if (!confirm(`Confirmer l'envoi de ${selected.size} ${mode === 'invite' ? 'invitation(s)' : 'relance(s)'} ?`)) return;

    setBusy(true);
    setMessage(null);
    try {
      const endpoint = mode === 'invite' ? '/api/admin/invitations/send' : '/api/admin/invitations/remind';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationIds: Array.from(selected), eventId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Erreur envoi' });
      } else {
        setMessage({
          type: 'success',
          text: `${data.sent} email(s) envoyé(s)${data.failed > 0 ? `, ${data.failed} échec(s)` : ''}.`,
        });
        setSelected(new Set());
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((i) => i.id)));
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Communications</p>
          <h1 className={styles.title}>Invitations <em>&amp; relances.</em></h1>
        </div>
      </header>

      <div className={styles.statsRow}>
        <Stat label="Contacts en base" value={stats.total} />
        <Stat label="En attente d'envoi" value={stats.pending} tone={stats.pending > 0 ? 'warn' : undefined} />
        <Stat label="Invitations envoyées" value={stats.sent} />
        <Stat label="Inscrits" value={stats.registered} tone="success" />
        <Stat label="Sans réponse" value={stats.notRegistered} tone={stats.notRegistered > 0 ? 'warn' : undefined} />
      </div>

      <div className={styles.tabs}>
        <button className={tab === 'invitations' ? styles.tabActive : ''} onClick={() => setTab('invitations')}>
          Carnet d'invitations
        </button>
        <button className={tab === 'import' ? styles.tabActive : ''} onClick={() => setTab('import')}>
          Importer un fichier
        </button>
        <button className={tab === 'log' ? styles.tabActive : ''} onClick={() => setTab('log')}>
          Historique d'envois
        </button>
      </div>

      {message && (
        <div className={message.type === 'success' ? styles.alertSuccess : styles.alertError}>
          {message.text}
        </div>
      )}

      {/* ════════ ONGLET INVITATIONS ════════ */}
      {tab === 'invitations' && (
        <>
          <div className={styles.toolbar}>
            <input
              type="search"
              placeholder="Rechercher un contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="all">Tous les contacts</option>
              <option value="pending">À inviter</option>
              <option value="sent">Invités</option>
              <option value="registered">Inscrits</option>
              <option value="not-registered">Sans réponse</option>
            </select>
            <div className={styles.toolbarActions}>
              <button
                onClick={() => sendBatch('invite')}
                disabled={busy || selected.size === 0}
                className={styles.btnPrimary}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 8l12-6-5 14-2-6-5-2z" />
                </svg>
                Envoyer invitation ({selected.size})
              </button>
              <button
                onClick={() => sendBatch('remind')}
                disabled={busy || selected.size === 0}
                className={styles.btnGhost}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 2" />
                </svg>
                Relancer ({selected.size})
              </button>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkCol}>
                    <input
                      type="checkbox"
                      checked={selected.size > 0 && selected.size === filtered.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Email</th>
                  <th>Nom</th>
                  <th>Entité</th>
                  <th>Statut</th>
                  <th>Dernier envoi</th>
                  <th>Relances</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className={styles.emptyRow}>Aucun contact ne correspond.</td></tr>
                )}
                {filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    className={selected.has(inv.id) ? styles.rowSelected : ''}
                    onClick={() => toggle(inv.id)}
                  >
                    <td className={styles.checkCol} onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(inv.id)} onChange={() => toggle(inv.id)} />
                    </td>
                    <td className={styles.emailCell}>{inv.email}</td>
                    <td>{[inv.first_name, inv.last_name].filter(Boolean).join(' ') || '—'}</td>
                    <td className={styles.cellMuted}>{inv.entity || '—'}</td>
                    <td>
                      {inv.registered ? (
                        <span className={styles.tagSuccess}>● Inscrit</span>
                      ) : inv.sent_at ? (
                        <span className={styles.tagSent}>● Invité</span>
                      ) : (
                        <span className={styles.tagPending}>● À envoyer</span>
                      )}
                    </td>
                    <td className={styles.cellMuted}>
                      {inv.last_reminder_at
                        ? new Date(inv.last_reminder_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : inv.sent_at
                        ? new Date(inv.sent_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className={styles.cellMuted}>{inv.reminder_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ════════ ONGLET IMPORT ════════ */}
      {tab === 'import' && (
        <div className={styles.importPanel}>
          <div className={styles.importIntro}>
            <h2>Importer une liste de contacts</h2>
            <p>
              Fichier CSV avec une ligne d'en-tête. Colonnes reconnues :{' '}
              <code>email</code> (obligatoire), <code>prénom</code>, <code>nom</code>, <code>entité</code>.
              Séparateur virgule ou point-virgule. Encodage UTF-8.
            </p>
          </div>

          <div className={styles.dropzone}>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={onCsvSelected}
              id="csv-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="csv-input" className={styles.dropzoneLabel}>
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 4v18M10 10l6-6 6 6M4 26h24" />
              </svg>
              <span>Choisir un fichier CSV...</span>
            </label>
          </div>

          {csvPreview.length > 0 && (
            <>
              <div className={styles.previewHeader}>
                <strong>{csvPreview.length}</strong> ligne(s) détectée(s) — aperçu des 10 premières :
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>Email</th><th>Prénom</th><th>Nom</th><th>Entité</th></tr>
                  </thead>
                  <tbody>
                    {csvPreview.slice(0, 10).map((c, i) => (
                      <tr key={i}>
                        <td className={styles.emailCell}>{c.email}</td>
                        <td>{c.first_name || '—'}</td>
                        <td>{c.last_name || '—'}</td>
                        <td className={styles.cellMuted}>{c.entity || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={importContacts} disabled={importing} className={styles.btnPrimary} style={{ marginTop: 24 }}>
                {importing ? 'Import en cours...' : `Importer les ${csvPreview.length} contact(s)`}
              </button>
            </>
          )}
        </div>
      )}

      {/* ════════ ONGLET HISTORIQUE ════════ */}
      {tab === 'log' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Date</th><th>Type</th><th>Destinataire</th><th>Sujet</th><th>Statut</th></tr>
            </thead>
            <tbody>
              {log.length === 0 && (
                <tr><td colSpan={5} className={styles.emptyRow}>Aucun envoi enregistré.</td></tr>
              )}
              {log.map((l) => (
                <tr key={l.id}>
                  <td className={styles.cellMuted}>{new Date(l.sent_at).toLocaleString('fr-FR')}</td>
                  <td><span className={styles.typeTag}>{l.email_type}</span></td>
                  <td className={styles.emailCell}>{l.to_email}</td>
                  <td className={styles.cellMuted}>{l.subject || '—'}</td>
                  <td>
                    {l.status === 'sent' ? (
                      <span className={styles.tagSuccess}>● Envoyé</span>
                    ) : (
                      <span className={styles.tagFailed} title={l.error_message || ''}>● Échec</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'success' | 'warn' }) {
  return (
    <div className={styles.statBox}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${tone === 'success' ? styles.statSuccess : tone === 'warn' ? styles.statWarn : ''}`}>
        {value}
      </span>
    </div>
  );
}
