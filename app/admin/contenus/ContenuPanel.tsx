'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './contenus.module.css';

type Visit = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  slot_label: string | null;
  slot_date: string | null;
  capacity: number;
  is_active: boolean;
  display_order: number;
};

type Workshop = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  speaker: string | null;
  slot_label: string | null;
  capacity: number;
  is_active: boolean;
  display_order: number;
};

type Night = {
  id: string;
  night_date: string;
  label: string | null;
  description: string | null;
  is_active: boolean;
};

type EventRow = {
  id: string;
  title: string;
  subtitle: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  registration_deadline: string;
  contact_email: string | null;
  is_open: boolean;
};

type Props = {
  event: EventRow | null;
  visits: Visit[];
  workshops: Workshop[];
  nights: Night[];
};

export default function ContenuPanel({ event, visits: visitsInit, workshops: workshopsInit, nights: nightsInit }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<'event' | 'visits' | 'workshops' | 'nights'>('event');
  const [visits, setVisits] = useState(visitsInit);
  const [workshops, setWorkshops] = useState(workshopsInit);
  const [nights, setNights] = useState(nightsInit);
  const [eventForm, setEventForm] = useState(event);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ─── API helpers ──────────────────────────────────────
  const apiCall = async (method: string, payload?: any, query?: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const url = `/api/admin/content${query ? '?' + query : ''}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Erreur' });
        return null;
      }
      return data;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return null;
    } finally {
      setBusy(false);
    }
  };

  // ─── EVENT ─────────────────────────────────────────────
  const saveEvent = async () => {
    if (!eventForm) return;
    const data = await apiCall('PATCH', {
      table: 'events',
      id: eventForm.id,
      data: {
        title: eventForm.title,
        subtitle: eventForm.subtitle,
        start_date: eventForm.start_date,
        end_date: eventForm.end_date,
        location: eventForm.location,
        registration_deadline: eventForm.registration_deadline,
        contact_email: eventForm.contact_email,
        is_open: eventForm.is_open,
      },
    });
    if (data?.success) {
      setMessage({ type: 'success', text: 'Événement mis à jour.' });
      router.refresh();
    }
  };

  // ─── VISITS ────────────────────────────────────────────
  const addVisit = () => {
    setVisits((prev) => [
      ...prev,
      {
        id: 'new-' + Date.now(),
        code: 'visite-' + (prev.length + 1),
        title: 'Nouvelle visite',
        description: '',
        slot_label: '',
        slot_date: null,
        capacity: 25,
        is_active: true,
        display_order: prev.length + 1,
      } as Visit,
    ]);
  };

  const saveVisit = async (v: Visit) => {
    const isNew = v.id.startsWith('new-');
    if (isNew) {
      const data = await apiCall('POST', {
        table: 'visits',
        eventId: event?.id,
        data: {
          code: v.code,
          title: v.title,
          description: v.description,
          slot_label: v.slot_label,
          slot_date: v.slot_date,
          capacity: v.capacity,
          is_active: v.is_active,
          display_order: v.display_order,
        },
      });
      if (data?.success) {
        setVisits((prev) => prev.map((x) => (x.id === v.id ? data.row : x)));
        setMessage({ type: 'success', text: 'Visite créée.' });
      }
    } else {
      const data = await apiCall('PATCH', {
        table: 'visits',
        id: v.id,
        data: {
          code: v.code,
          title: v.title,
          description: v.description,
          slot_label: v.slot_label,
          slot_date: v.slot_date,
          capacity: v.capacity,
          is_active: v.is_active,
          display_order: v.display_order,
        },
      });
      if (data?.success) setMessage({ type: 'success', text: 'Visite mise à jour.' });
    }
  };

  const deleteVisit = async (v: Visit) => {
    if (!confirm(`Supprimer la visite "${v.title}" ? Cette action est irréversible.`)) return;
    if (v.id.startsWith('new-')) {
      setVisits((prev) => prev.filter((x) => x.id !== v.id));
      return;
    }
    const data = await apiCall('DELETE', undefined, `table=visits&id=${v.id}`);
    if (data?.success) {
      setVisits((prev) => prev.filter((x) => x.id !== v.id));
      setMessage({ type: 'success', text: 'Visite supprimée.' });
    }
  };

  // ─── WORKSHOPS (similaire) ────────────────────────────
  const addWorkshop = () => {
    setWorkshops((prev) => [
      ...prev,
      {
        id: 'new-' + Date.now(),
        code: 'atelier-' + (prev.length + 1),
        title: 'Nouvel atelier',
        description: '',
        speaker: '',
        slot_label: '',
        capacity: 40,
        is_active: true,
        display_order: prev.length + 1,
      } as Workshop,
    ]);
  };

  const saveWorkshop = async (w: Workshop) => {
    const isNew = w.id.startsWith('new-');
    const payload = {
      code: w.code, title: w.title, description: w.description, speaker: w.speaker,
      slot_label: w.slot_label, capacity: w.capacity, is_active: w.is_active, display_order: w.display_order,
    };
    if (isNew) {
      const data = await apiCall('POST', { table: 'workshops', eventId: event?.id, data: payload });
      if (data?.success) {
        setWorkshops((prev) => prev.map((x) => (x.id === w.id ? data.row : x)));
        setMessage({ type: 'success', text: 'Atelier créé.' });
      }
    } else {
      const data = await apiCall('PATCH', { table: 'workshops', id: w.id, data: payload });
      if (data?.success) setMessage({ type: 'success', text: 'Atelier mis à jour.' });
    }
  };

  const deleteWorkshop = async (w: Workshop) => {
    if (!confirm(`Supprimer l'atelier "${w.title}" ?`)) return;
    if (w.id.startsWith('new-')) {
      setWorkshops((prev) => prev.filter((x) => x.id !== w.id));
      return;
    }
    const data = await apiCall('DELETE', undefined, `table=workshops&id=${w.id}`);
    if (data?.success) {
      setWorkshops((prev) => prev.filter((x) => x.id !== w.id));
      setMessage({ type: 'success', text: 'Atelier supprimé.' });
    }
  };

  // ─── NIGHTS ───────────────────────────────────────────
  const addNight = () => {
    setNights((prev) => [
      ...prev,
      {
        id: 'new-' + Date.now(),
        night_date: event?.start_date || '2026-10-07',
        label: '',
        description: '',
        is_active: true,
      } as Night,
    ]);
  };

  const saveNight = async (n: Night) => {
    const isNew = n.id.startsWith('new-');
    const payload = {
      night_date: n.night_date, label: n.label, description: n.description, is_active: n.is_active,
    };
    if (isNew) {
      const data = await apiCall('POST', { table: 'accommodation_nights', eventId: event?.id, data: payload });
      if (data?.success) {
        setNights((prev) => prev.map((x) => (x.id === n.id ? data.row : x)));
        setMessage({ type: 'success', text: 'Nuitée créée.' });
      }
    } else {
      const data = await apiCall('PATCH', { table: 'accommodation_nights', id: n.id, data: payload });
      if (data?.success) setMessage({ type: 'success', text: 'Nuitée mise à jour.' });
    }
  };

  const deleteNight = async (n: Night) => {
    if (!confirm(`Supprimer la nuitée du ${n.night_date} ?`)) return;
    if (n.id.startsWith('new-')) {
      setNights((prev) => prev.filter((x) => x.id !== n.id));
      return;
    }
    const data = await apiCall('DELETE', undefined, `table=accommodation_nights&id=${n.id}`);
    if (data?.success) {
      setNights((prev) => prev.filter((x) => x.id !== n.id));
      setMessage({ type: 'success', text: 'Nuitée supprimée.' });
    }
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Configuration</p>
          <h1 className={styles.title}>Contenus <em>de l'événement.</em></h1>
        </div>
      </header>

      <div className={styles.tabs}>
        <button className={tab === 'event' ? styles.tabActive : ''} onClick={() => setTab('event')}>
          Événement
        </button>
        <button className={tab === 'visits' ? styles.tabActive : ''} onClick={() => setTab('visits')}>
          Visites ({visits.length})
        </button>
        <button className={tab === 'workshops' ? styles.tabActive : ''} onClick={() => setTab('workshops')}>
          Ateliers ({workshops.length})
        </button>
        <button className={tab === 'nights' ? styles.tabActive : ''} onClick={() => setTab('nights')}>
          Nuitées ({nights.length})
        </button>
      </div>

      {message && (
        <div className={message.type === 'success' ? styles.alertSuccess : styles.alertError}>
          {message.text}
        </div>
      )}

      {/* ════════ ONGLET EVENT ════════ */}
      {tab === 'event' && eventForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Paramètres de l'événement</h2>
            <label className={styles.toggleLine}>
              <input
                type="checkbox"
                checked={eventForm.is_open}
                onChange={(e) => setEventForm({ ...eventForm, is_open: e.target.checked })}
              />
              <span>Inscriptions ouvertes</span>
            </label>
          </div>

          <div className={styles.formGrid}>
            <Field label="Titre" full>
              <input
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              />
            </Field>
            <Field label="Sous-titre" full>
              <input
                value={eventForm.subtitle || ''}
                onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
              />
            </Field>
            <Field label="Date de début">
              <input
                type="date"
                value={eventForm.start_date}
                onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
              />
            </Field>
            <Field label="Date de fin">
              <input
                type="date"
                value={eventForm.end_date}
                onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
              />
            </Field>
            <Field label="Lieu" full>
              <input
                value={eventForm.location || ''}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
              />
            </Field>
            <Field label="Date limite d'inscription">
              <input
                type="datetime-local"
                value={eventForm.registration_deadline?.slice(0, 16) || ''}
                onChange={(e) => setEventForm({ ...eventForm, registration_deadline: e.target.value + ':00+02' })}
              />
            </Field>
            <Field label="Email de contact">
              <input
                type="email"
                value={eventForm.contact_email || ''}
                onChange={(e) => setEventForm({ ...eventForm, contact_email: e.target.value })}
              />
            </Field>
          </div>

          <div className={styles.cardFooter}>
            <button onClick={saveEvent} disabled={busy} className={styles.btnPrimary}>
              {busy ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* ════════ ONGLET VISITES ════════ */}
      {tab === 'visits' && (
        <>
          <div className={styles.addBar}>
            <button onClick={addVisit} className={styles.btnGhost}>
              + Ajouter une visite
            </button>
          </div>
          {visits.map((v, idx) => (
            <div key={v.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{v.title || 'Sans titre'}</h2>
                <div className={styles.cardHeaderActions}>
                  <label className={styles.toggleLine}>
                    <input
                      type="checkbox"
                      checked={v.is_active}
                      onChange={(e) => {
                        const updated = { ...v, is_active: e.target.checked };
                        setVisits((prev) => prev.map((x) => (x.id === v.id ? updated : x)));
                      }}
                    />
                    <span>Visible</span>
                  </label>
                </div>
              </div>
              <div className={styles.formGrid}>
                <Field label="Titre">
                  <input
                    value={v.title}
                    onChange={(e) => setVisits((prev) => prev.map((x) => x.id === v.id ? { ...x, title: e.target.value } : x))}
                  />
                </Field>
                <Field label="Code interne">
                  <input
                    value={v.code}
                    onChange={(e) => setVisits((prev) => prev.map((x) => x.id === v.id ? { ...x, code: e.target.value } : x))}
                  />
                </Field>
                <Field label="Libellé du créneau (ex: '07 oct · 17h30')">
                  <input
                    value={v.slot_label || ''}
                    onChange={(e) => setVisits((prev) => prev.map((x) => x.id === v.id ? { ...x, slot_label: e.target.value } : x))}
                  />
                </Field>
                <Field label="Date de la visite">
                  <input
                    type="date"
                    value={v.slot_date || ''}
                    onChange={(e) => setVisits((prev) => prev.map((x) => x.id === v.id ? { ...x, slot_date: e.target.value } : x))}
                  />
                </Field>
                <Field label="Capacité (places max)">
                  <input
                    type="number"
                    value={v.capacity}
                    onChange={(e) => setVisits((prev) => prev.map((x) => x.id === v.id ? { ...x, capacity: parseInt(e.target.value) || 0 } : x))}
                  />
                </Field>
                <Field label="Ordre d'affichage">
                  <input
                    type="number"
                    value={v.display_order}
                    onChange={(e) => setVisits((prev) => prev.map((x) => x.id === v.id ? { ...x, display_order: parseInt(e.target.value) || 0 } : x))}
                  />
                </Field>
                <Field label="Description" full>
                  <textarea
                    rows={3}
                    value={v.description || ''}
                    onChange={(e) => setVisits((prev) => prev.map((x) => x.id === v.id ? { ...x, description: e.target.value } : x))}
                  />
                </Field>
              </div>
              <div className={styles.cardFooter}>
                <button onClick={() => deleteVisit(v)} disabled={busy} className={styles.btnDanger}>
                  Supprimer
                </button>
                <button onClick={() => saveVisit(v)} disabled={busy} className={styles.btnPrimary}>
                  {v.id.startsWith('new-') ? 'Créer' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ════════ ONGLET ATELIERS ════════ */}
      {tab === 'workshops' && (
        <>
          <div className={styles.addBar}>
            <button onClick={addWorkshop} className={styles.btnGhost}>+ Ajouter un atelier</button>
          </div>
          {workshops.map((w) => (
            <div key={w.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{w.title || 'Sans titre'}</h2>
                <label className={styles.toggleLine}>
                  <input
                    type="checkbox"
                    checked={w.is_active}
                    onChange={(e) => setWorkshops((prev) => prev.map((x) => x.id === w.id ? { ...x, is_active: e.target.checked } : x))}
                  />
                  <span>Visible</span>
                </label>
              </div>
              <div className={styles.formGrid}>
                <Field label="Titre">
                  <input value={w.title} onChange={(e) => setWorkshops((p) => p.map((x) => x.id === w.id ? { ...x, title: e.target.value } : x))} />
                </Field>
                <Field label="Code interne">
                  <input value={w.code} onChange={(e) => setWorkshops((p) => p.map((x) => x.id === w.id ? { ...x, code: e.target.value } : x))} />
                </Field>
                <Field label="Intervenant">
                  <input value={w.speaker || ''} onChange={(e) => setWorkshops((p) => p.map((x) => x.id === w.id ? { ...x, speaker: e.target.value } : x))} />
                </Field>
                <Field label="Créneau">
                  <input value={w.slot_label || ''} onChange={(e) => setWorkshops((p) => p.map((x) => x.id === w.id ? { ...x, slot_label: e.target.value } : x))} />
                </Field>
                <Field label="Capacité">
                  <input type="number" value={w.capacity} onChange={(e) => setWorkshops((p) => p.map((x) => x.id === w.id ? { ...x, capacity: parseInt(e.target.value) || 0 } : x))} />
                </Field>
                <Field label="Ordre d'affichage">
                  <input type="number" value={w.display_order} onChange={(e) => setWorkshops((p) => p.map((x) => x.id === w.id ? { ...x, display_order: parseInt(e.target.value) || 0 } : x))} />
                </Field>
                <Field label="Description" full>
                  <textarea rows={3} value={w.description || ''} onChange={(e) => setWorkshops((p) => p.map((x) => x.id === w.id ? { ...x, description: e.target.value } : x))} />
                </Field>
              </div>
              <div className={styles.cardFooter}>
                <button onClick={() => deleteWorkshop(w)} disabled={busy} className={styles.btnDanger}>Supprimer</button>
                <button onClick={() => saveWorkshop(w)} disabled={busy} className={styles.btnPrimary}>
                  {w.id.startsWith('new-') ? 'Créer' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ════════ ONGLET NUITÉES ════════ */}
      {tab === 'nights' && (
        <>
          <div className={styles.addBar}>
            <button onClick={addNight} className={styles.btnGhost}>+ Ajouter une nuitée</button>
          </div>
          {nights.map((n) => (
            <div key={n.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Nuitée du {new Date(n.night_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
                <label className={styles.toggleLine}>
                  <input
                    type="checkbox"
                    checked={n.is_active}
                    onChange={(e) => setNights((p) => p.map((x) => x.id === n.id ? { ...x, is_active: e.target.checked } : x))}
                  />
                  <span>Disponible</span>
                </label>
              </div>
              <div className={styles.formGrid}>
                <Field label="Date de la nuit">
                  <input type="date" value={n.night_date} onChange={(e) => setNights((p) => p.map((x) => x.id === n.id ? { ...x, night_date: e.target.value } : x))} />
                </Field>
                <Field label="Libellé">
                  <input value={n.label || ''} placeholder="Nuit du mardi 07 octobre" onChange={(e) => setNights((p) => p.map((x) => x.id === n.id ? { ...x, label: e.target.value } : x))} />
                </Field>
                <Field label="Description" full>
                  <textarea rows={2} value={n.description || ''} onChange={(e) => setNights((p) => p.map((x) => x.id === n.id ? { ...x, description: e.target.value } : x))} />
                </Field>
              </div>
              <div className={styles.cardFooter}>
                <button onClick={() => deleteNight(n)} disabled={busy} className={styles.btnDanger}>Supprimer</button>
                <button onClick={() => saveNight(n)} disabled={busy} className={styles.btnPrimary}>
                  {n.id.startsWith('new-') ? 'Créer' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`${styles.field} ${full ? styles.fieldFull : ''}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
