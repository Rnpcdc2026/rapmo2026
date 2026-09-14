import Image from 'next/image';
import styles from './programme.module.css';

const patrimoineVisits = [
  {
    img: '/visits/visite-confluence-spl.jpg',
    title: 'Entre Rhône et Saône, le quartier de Confluence — avec la SPL Lyon Confluence',
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
    title: "Visites d'opérations autour de la thématique des matériaux biosourcés à Confluence",
    desc: 'À la découverte de deux opérations : opération en pierre de taille (SACVL) et structure bois (Albizzia).',
    credit: '',
  },
];

const culturalVisits = [
  { img: '/visits/visite-musee-confluences.jpg', title: 'Visite du Musée des Confluences' },
  { img: '/visits/visite-saint-jean-unesco.jpg', title: 'Visite du quartier Saint-Jean' },
  { img: '/visits/visite-festival-airt-famille.jpg', title: 'Festival Airt de Famille' },
];

const conferences: { title: string; desc: string; lieu: string; video?: string }[] = [
  {
    title: 'Atelier d’expression et de mise en situation - Autour du spectacle « Sous le même toit »',
    desc: "Atelier d'expression et de mise en situation. Après la représentation du matin, place à la créativité.",
    lieu: 'Le Sucre',
    video: '/teaser-spectacle.mp4',
  },
  {
    title: 'Comprendre les orientations stratégiques du Groupe et leurs déclinaisons dans nos métiers',
    desc: "Le projet stratégique du Groupe entre dans une nouvelle phase de maturation. Cet atelier vise à présenter les principales orientations qui concernent le patrimoine et la maîtrise d'ouvrage, à partager les réflexions déjà engagées au sein de nos filières et à identifier les sujets qui devront être accompagnés dans les années à venir.",
    lieu: 'Le Sucre',
  },
  {
    title: 'Optimisation de la programmation de travaux',
    desc: 'Un an après le lancement de la démarche : cap sur les résultats, les usages du PANORAMA et les idées qui feront évoluer nos pratiques de programmation de travaux.',
    lieu: 'Kolaab',
  },
  {
    title: 'Réhabiliter autrement : quand la nature devient un levier de performance',
    desc: 'Testez différents scénarios de végétalisation et visualisez leurs bénéfices pour vos projets de réhabilitation.',
    lieu: 'Kolaab',
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
              <span className={styles.time}>11h10</span>
              <div><p className={styles.rowTitle}>Pause</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>11h30</span>
              <div>
                <p className={styles.rowTitle}>Conférence — Emma Haziza, suivie de vos questions</p>
                <p className={styles.rowSub}>
                  Hydrologue systémicienne, docteure de l&apos;École supérieure des Mines de Paris.
                </p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>12h40</span>
              <div><p className={styles.rowTitle}>Cocktail déjeunatoire au Sucre</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>14h00</span>
              <div>
                <p className={styles.rowTitle}>Visites de patrimoine — au choix</p>
                <p className={styles.rowSub}>Voir le détail des quatre visites plus bas.</p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>17h00</span>
              <div><p className={styles.rowTitle}>Retour dans les hôtels</p></div>
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
              <div><p className={styles.rowTitle}>Spectacle « Sous le même toit » par la Compagnie Etosha</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>9h40</span>
              <div><p className={styles.rowTitle}>Intervention de Clément Lecuivre</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>9h50</span>
              <div>
                <p className={styles.rowTitle}>Conférences interactives — au choix</p>
                <p className={styles.rowSub}>Voir le détail des quatre conférences plus bas.</p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>12h20</span>
              <div><p className={styles.rowTitle}>Pause</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>12h40</span>
              <div><p className={styles.rowTitle}>Clôture par Thierry Laget</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>13h00</span>
              <div><p className={styles.rowTitle}>Cocktail déjeunatoire au Sucre</p></div>
            </div>
            <div className={styles.row}>
              <span className={styles.time}>14h15</span>
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
              <span className={styles.time}>16h30</span>
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
                {c.video && (
                  <video className={styles.cardVideo} controls preload="metadata" playsInline>
                    <source src={c.video} type="video/mp4" />
                    Votre navigateur ne peut pas lire cette vidéo.
                  </video>
                )}
                <div className={styles.cardBody}>
                  {c.video && <div className={styles.videoTag}>▶ Teaser du spectacle</div>}
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <p className={styles.cardDesc}>{c.desc}</p>
                  <p className={styles.cardLieu}>📍 Lieu : {c.lieu}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <hr className={styles.separator} />

        {/* Plan d'orientation — conférences interactives */}
        <section className={styles.day}>
          <h2 className={styles.blockTitle}>S&apos;orienter — Le Sucre &amp; Kolaab</h2>
          <p className={styles.intro}>
            Les conférences interactives se tiennent sur deux sites voisins du quai Rambaud,
            à une minute à pied l&apos;un de l&apos;autre.
          </p>
          <div className={styles.mapWrap}>
            <svg viewBox="0 0 600 780" role="img" aria-label="Plan d'accès à pied entre Le Sucre et Kolaab, quai Rambaud">
              {/* Terre */}
              <rect x="0" y="0" width="600" height="780" fill="#F3EEE3" />
              {/* Saône */}
              <polygon points="0,0 300,0 285,780 0,780" fill="#A9D9F0" />
              <text x="70" y="470" fill="#6FA9C8" fontSize="30" fontStyle="italic" fontWeight="600" transform="rotate(-84 70 470)">Saône</text>
              {/* Emprises bâties */}
              <rect x="325" y="70" width="150" height="250" rx="10" fill="#EADFC6" />
              <rect x="325" y="360" width="150" height="360" rx="10" fill="#EADFC6" />
              {/* Quai Rambaud */}
              <rect x="500" y="0" width="26" height="780" fill="#FFFFFF" />
              {/* Itinéraire à pied */}
              <path d="M405,748 H513 V150" fill="none" stroke="#1A5FD0" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M405,748 H513 V150" fill="none" stroke="#2E7DF6" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="405" cy="748" r="12" fill="#2E7DF6" stroke="#fff" strokeWidth="4" />
              <circle cx="513" cy="150" r="12" fill="#2E7DF6" stroke="#fff" strokeWidth="4" />
              {/* La Sucrière */}
              <circle cx="400" cy="430" r="9" fill="#C1277A" />
              <text x="400" y="455" fill="#8E1D5B" fontSize="15" fontWeight="700" textAnchor="middle">La Sucrière</text>
              {/* Épingle Kolaab */}
              <path d="M400,168 C388,146 378,140 378,122 A22,22 0 1,1 422,122 C422,140 412,146 400,168 Z" fill="#C1277A" />
              <circle cx="400" cy="120" r="9" fill="#fff" />
              <text x="400" y="196" fill="#3A3A3A" fontSize="21" fontWeight="700" textAnchor="middle">Kolaab</text>
              <text x="400" y="216" fill="#828485" fontSize="13" textAnchor="middle">Ateliers 3 &amp; 4</text>
              {/* Épingle Le Sucre */}
              <path d="M400,600 C388,578 378,572 378,554 A22,22 0 1,1 422,554 C422,572 412,578 400,600 Z" fill="#C1277A" />
              <circle cx="400" cy="552" r="9" fill="#fff" />
              <text x="400" y="628" fill="#3A3A3A" fontSize="21" fontWeight="700" textAnchor="middle">Le Sucre</text>
              <text x="400" y="648" fill="#828485" fontSize="13" textAnchor="middle">Ateliers 1 &amp; 2</text>
            </svg>
          </div>
          <p className={styles.cardDesc} style={{ textAlign: 'center', marginTop: '10px' }}>
            <strong>Le Sucre</strong> — 50 quai Rambaud &nbsp;·&nbsp; <strong>Kolaab</strong> — 45 quai Rambaud, Lyon 2e
          </p>
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
