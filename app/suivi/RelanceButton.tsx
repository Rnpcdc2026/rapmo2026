'use client';

import { useState } from 'react';
import styles from './suivi.module.css';

export default function RelanceButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleClick() {
    if (
      !window.confirm(
        'Envoyer le mail de rappel à TOUS les invités pas encore inscrits ? Cette action envoie de vrais emails.'
      )
    ) {
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/suivi/remind', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setResult(data.error || 'Erreur lors de l’envoi.');
      } else {
        setResult(`${data.sent} rappel(s) envoyé(s)${data.failed ? `, ${data.failed} échec(s)` : ''} (sur ${data.total} non-inscrits).`);
      }
    } catch {
      setResult('Erreur réseau. Réessaie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className={styles.relanceWrap}>
      <button className={styles.relanceBtn} onClick={handleClick} disabled={loading}>
        {loading ? 'Envoi en cours…' : 'Relancer les non-inscrits'}
      </button>
      {result && <span className={styles.relanceResult}>{result}</span>}
    </span>
  );
}
