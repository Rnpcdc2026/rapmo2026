import Image from 'next/image';
import styles from './programme.module.css';

const patrimoineVisits = [
  {
    img: '/visits/visite-confluence-spl.jpg',
    title: 'Entre Rhône et Saône, le quartier de Confluence',
    desc: "D'ancienne friche industrielle à quartier futuriste et audacieux, le quartier de la Confluence dévoile un nouveau visage de la ville.",
    credit: '',
  },
  {
    img: '/visits/visite-saint-priest.jpg',
    title: "À Saint-Priest, la nouvelle vie de la rue de l'Industrie",
    desc: 'Vaste projet mêlant réhabilitation, construction neuve et aménagement, pensé sous deux axes majeurs : réemploi de matériaux et végétalisation.',
    credit: '© Architecte AA Group',
  },
  {
    img: '/visits/visite-gratte-ciel-nord.jpg',
    title: 'Gratte-ciel Nord – SERL – Villeurbanne',
    desc: "Un projet d'aménagement à la fois prolongement et hommage au centre historique de Villeurbanne, les Gratte-Ciel.",
    credit: '© COGEDIM',
  },
  {
    img: '/visits/visite-pierre-taille-mariniers.jpg',
    title: "Visites d'opérations autour de la thématique des matériaux biosourcés",
    desc: 'À la découverte de deux opérations : opération en pierre de taille (SACVL) et structure bois (Albizzia).',
    credit: '',
  },
];

const culturalVisits = [
  { img: '/visits/visite-musee-confluences.jpg', title: 'Visite du Musée des Confluences' },
  { img: '/visits/visite-saint-jean-unesco.jpg', title: 'Visite du quartier Saint-Jean' },
  { img: '/visits/visite-festival-airt-famille.jpg', title: 'Festival Airt de Famille' },
];

const conferences = [
  {
    title: 'Autour du spectacle « Sous le même toit » : prolongez l’expérience !',
    desc: "Atelier d'expression et de mise en situation. Après la représentation du matin, place à la créativité.",
  },
  {
    title: 'Optimisation de la programmation de travaux',
    desc: 'Un an après le lancement de la démarche : cap sur les résultats, les usages du PANORAMA et les idées qui feront évoluer nos pratiques de programmation de travaux.',
  },
  {
    title: 'Réhabiliter autrement : quand la nature devient un levier de performance',
    desc: 'Testez différents scénarios de végétalisation et visualisez leurs bénéfices pour vos projets de réhabilitation.',
  },
  {
    title: 'Comprendre les orientations stratégiques du Groupe et leurs déclinaisons dans nos métiers',
    desc: "Le projet stratégique du Groupe entre dans une nouvelle phase de maturation. Cet atelier vise à présenter les principales orientations qui concernent le patrimoine et la maîtrise d'ouvrage, à partager les réflexions déjà engagées au sein de nos filières et à identifier les sujets qui devront être accompagnés dans les années à venir.",
  },
];

export default function ProgrammePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.brand}>
          <Image
            src="/cdc-habitat-logo.jpg"
            alt="CDC Habitat"
            width={200}
            height={68}
            priority
            className={styles.logo}
          />
        </a>
        <div className={styles.headerTitle}>
          Rencontres Annuelles Patrimoine et Maîtrise d&apos;Ouvrage <strong>2026</strong>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <a href="/inscription" className={styles.backLink}>← Retour au formulaire</a>
        </div>

        <h1 className={styles.pageTitle}>Programme</h1>
        <p className={styles.intro}>
          Deux journées d&apos;échanges, de conférences interactives et de visites inspirantes
          au cœur de Lyon Confluence.
        </p>

        <a href="/programme-rapmo-2026.pdf" download className={styles.btnDownload}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v8M4 7l4 4 4-4M2 13h12" />
          </svg>
          Télécharger le programme (PDF)
        </a>

        {/* Jeudi 8 octobre */}
        <section className={styles.day}>
          <h2 className={styles.dayTitle}>Jeudi 8 octobre 2026</h2>
          <div className={styles.timeline}>
            <div className={styles.row}>
              <span className={styles.time}>8h15</span>
              <div><p className={styles.rowTitle}>Accueil café au Sucre</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>9h00</span>
              <div>
                <p className={styles.rowTitle}>
                  Les filières Patrimoine et Maîtrise d&apos;Ouvrage au rendez-vous du nouveau
                  Projet Stratégique du Groupe
                </p>
                <ul className={styles.rowList}>
                  <li>Démarche Qualité Maintenance et satisfaction client</li>
                  <li>Plan Stratégique Climat</li>
                </ul>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>11h00</span>
              <div><p className={styles.rowTitle}>Pause</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>11h30</span>
              <div>
                <p className={styles.rowTitle}>Conférence — Emma Haziza</p>
                <p className={styles.rowSub}>
                  Hydrologue systémicienne, docteure de l&apos;École supérieure des Mines de Paris.
                </p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>12h40</span>
              <div><p className={styles.rowTitle}>Cocktail déjeunatoire</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>14h00</span>
              <div>
                <p className={styles.rowTitle}>Visites de patrimoine — au choix</p>
                <p className={styles.rowSub}>Voir le détail des quatre visites plus bas.</p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>19h30</span>
              <div><p className={styles.rowTitle}>Apéritif et dîner au Selcius</p></div>
            </div>
          </div>
        </section>

        <hr className={styles.separator} />

        {/* Vendredi 9 octobre */}
        <section className={styles.day}>
          <h2 className={styles.dayTitle}>Vendredi 9 octobre 2026</h2>
          <div className={styles.timeline}>
            <div className={styles.row}>
              <span className={styles.time}>8h15</span>
              <div><p className={styles.rowTitle}>Accueil café au Sucre</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>8h45</span>
              <div><p className={styles.rowTitle}>Intervention de Thierry Laget</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>9h00</span>
              <div><p className={styles.rowTitle}>Spectacle « Sous le même toit » par la Compagnie Etosha</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>9h50</span>
              <div>
                <p className={styles.rowTitle}>Conférences interactives — au choix</p>
                <p className={styles.rowSub}>Voir le détail des quatre conférences plus bas.</p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>11h30</span>
              <div><p className={styles.rowTitle}>Pause</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>11h50</span>
              <div><p className={styles.rowTitle}>Intervention de Clément Lecuivre</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>13h00</span>
              <div><p className={styles.rowTitle}>Cocktail déjeunatoire</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>14h30</span>
              <div>
                <p className={styles.rowTitle}>Visites de sites culturels et lyonnais — au choix</p>
                <ul className={styles.rowList}>
                  <li>Visite du Musée des Confluences</li>
                  <li>Visite du quartier Saint-Jean</li>
                  <li>Festival Airt de Famille</li>
                </ul>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>17h00</span>
              <div><p className={styles.rowTitle}>Fin des rencontres</p></div>
            </div>
          </div>
        </section>

        <hr className={styles.separator} />

        {/* Les visites de patrimoine — cartes */}
        <section className={styles.day}>
          <h2 className={styles.blockTitle}>Les visites de patrimoine</h2>
          <div className={styles.cardGrid}>
            {patrimoineVisits.map((v) => (
              <article key={v.title} className={styles.card}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.img} alt={v.title} className={styles.cardImg} />
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{v.title}</h3>
                  <p className={styles.cardDesc}>{v.desc}</p>
                  {v.credit && <p className={styles.cardCredit}>{v.credit}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <hr className={styles.separator} />

        {/* Les conférences interactives — cartes */}
        <section className={styles.day}>
          <h2 className={styles.blockTitle}>Les conférences interactives</h2>
          <div className={styles.cardGrid}>
            {conferences.map((c) => (
              <article key={c.title} className={styles.card}>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <p className={styles.cardDesc}>{c.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <hr className={styles.separator} />

        {/* Les visites culturelles — cartes */}
        <section className={styles.day}>
          <h2 className={styles.blockTitle}>Les visites culturelles</h2>
          <div className={styles.cardGrid}>
            {culturalVisits.map((v) => (
              <article key={v.title} className={styles.card}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.img} alt={v.title} className={styles.cardImg} />
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{v.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className={styles.note}>
          Programme prévisionnel, susceptible d&apos;évoluer. Toute mise à jour vous sera
          communiquée par email.
        </p>

        <div className={styles.actions}>
          <a href="/inscription" className={styles.btnSecondary}>
            ← Retour au formulaire
          </a>
        </div>
      </div>
    </main>
  );
}
