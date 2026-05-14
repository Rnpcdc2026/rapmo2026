'use client';

import { useState, useMemo } from 'react';
import styles from './inscrits.module.css';

type Registration = {
  id: string;
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  entity: string | null;
  role: string | null;
  diet: string | null;
  bus_transport: boolean;
  status: string;
  created_at: string;
  visit: { id: string; title: string; slot_label: string } | null;
  registration_nights: { night: { id: string; night_date: string; label: string } }[];
};

type Props = {
  initialRegistrations: Registration[];
  visits: { id: string; title: string; slot_label: string }[];
  entities: string[];
};

export default function InscritsTable({
  initialRegistrations,
  visits,
  entities,
}: Props) {
  const [registrations] = useState(initialRegistrations);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [visitFilter, setVisitFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const matchSearch =
        !search ||
        `${r.first_name} ${r.last_name} ${r.email} ${r.reference}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchEntity = !entityFilter || r.entity === entityFilter;
      const matchVisit =
        !visitFilter ||
        (visitFilter === 'none' ? !r.visit : r.visit?.id === visitFilter);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchEntity && matchVisit && matchStatus;
    });
  }, [registrations, search, entityFilter, visitFilter, statusFilter]);

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === filtered.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filtered.map((r) => r.id)));
    }
  };

  const exportCSV = () => {
    const rowsToExport =
      selectedRows.size > 0
        ? filtered.filter((r) => selectedRows.has(r.id))
        : filtered;

    const headers = [
      'Référence',
      'Prénom',
      'Nom',
      'Email',
      'Téléphone',
      'Entité',
      'Fonction',
      'Régime',
      'Visite',
      'Nuitées',
      'Bus',
      'Statut',
      'Inscription',
    ];

    const escape = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = rowsToExport.map((r) => [
      r.reference,
      r.first_name,
      r.last_name,
      r.email,
      r.phone || '',
      r.entity || '',
      r.role || '',
      r.diet || '',
      r.visit?.title || '',
      r.registration_nights
        .map((rn) =>
          new Date(rn.night.night_date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
          })
        )
        .join(' & '),
      r.bus_transport ? 'Oui' : 'Non',
      r.status,
      new Date(r.created_at).toLocaleString('fr-FR'),
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inscrits-rnp2026-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Inscrits</p>
          <h1 className={styles.title}>
            {filtered.length} <span className={styles.titleSub}>participant{filtered.length > 1 ? 's' : ''}</span>
          </h1>
          {selectedRows.size > 0 && (
            <p className={styles.subtitle}>
              {selectedRows.size} sélectionné{selectedRows.size > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className={styles.actions}>
          <button onClick={exportCSV} className={styles.btnPrimary}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 1v9M4 7l4 4 4-4M2 14h12" />
            </svg>
            Exporter CSV
            {selectedRows.size > 0 && ` (${selectedRows.size})`}
          </button>
        </div>
      </header>

      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Rechercher un inscrit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}>
          <option value="">Toutes les entités</option>
          {entities.map((ent) => (
            <option key={ent} value={ent}>{ent}</option>
          ))}
        </select>
        <select value={visitFilter} onChange={(e) => setVisitFilter(e.target.value)}>
          <option value="">Toutes les visites</option>
          <option value="none">Sans visite</option>
          {visits.map((v) => (
            <option key={v.id} value={v.id}>{v.slot_label} — {v.title}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tous statuts</option>
          <option value="confirmed">Confirmés</option>
          <option value="cancelled">Annulés</option>
          <option value="waitlist">Liste d'attente</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkCol}>
                <input
                  type="checkbox"
                  checked={selectedRows.size > 0 && selectedRows.size === filtered.length}
                  ref={(el) => {
                    if (el) el.indeterminate = selectedRows.size > 0 && selectedRows.size < filtered.length;
                  }}
                  onChange={toggleAll}
                />
              </th>
              <th>Référence</th>
              <th>Participant</th>
              <th>Entité</th>
              <th>Visite</th>
              <th>Nuitées</th>
              <th>Bus</th>
              <th>Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.emptyRow}>
                  Aucun inscrit ne correspond aux filtres.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr
                key={r.id}
                className={selectedRows.has(r.id) ? styles.rowSelected : ''}
                onClick={() => toggleRow(r.id)}
              >
                <td className={styles.checkCol} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(r.id)}
                    onChange={() => toggleRow(r.id)}
                  />
                </td>
                <td className={styles.refCol}>{r.reference}</td>
                <td>
                  <div className={styles.nameCol}>
                    {r.first_name} {r.last_name}
                  </div>
                  <div className={styles.emailCol}>{r.email}</div>
                </td>
                <td className={styles.cellMuted}>{r.entity || '—'}</td>
                <td>
                  {r.visit ? (
                    <span className={styles.visitTag}>
                      <span className={styles.visitTagDot} />
                      {r.visit.title}
                    </span>
                  ) : (
                    <span className={styles.cellMuted}>—</span>
                  )}
                </td>
                <td>
                  {r.registration_nights.length === 0 ? (
                    <span className={styles.cellMuted}>—</span>
                  ) : (
                    r.registration_nights
                      .map((rn) =>
                        new Date(rn.night.night_date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                        })
                      )
                      .join(' & ')
                  )}
                </td>
                <td>
                  {r.bus_transport ? (
                    <span className={styles.yesTag}>Oui</span>
                  ) : (
                    <span className={styles.cellMuted}>—</span>
                  )}
                </td>
                <td className={styles.cellMuted}>
                  {new Date(r.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
