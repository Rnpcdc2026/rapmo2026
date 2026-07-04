import Image from 'next/image';
import styles from './programme.module.css';

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

        {/* Jeudi 8 octobre */}
        <section className={styles.day}>
          <h2 className={styles.dayTitle}>Jeudi 8 octobre 2026</h2>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>8h15</h3>
            <p className={styles.slotName}>Accueil café au Sucre</p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>9h00</h3>
            <p className={styles.slotName}>
              Les filières Patrimoine et Maîtrise d&apos;Ouvrage au rendez-vous du nouveau
              Projet Stratégique du Groupe
            </p>
            <ul className={styles.list}>
              <li>Démarche Qualité Maintenance et satisfaction client</li>
              <li>Plan Stratégique Climat</li>
            </ul>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>11h00</h3>
            <p className={styles.slotName}>Pause</p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>11h30</h3>
            <p className={styles.slotName}>
              Conférence &mdash; Emma Haziza
            </p>
            <p className={styles.slotSpeaker}>
              Hydrologue systémicienne, docteure de l&apos;École supérieure des Mines de Paris.
            </p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>12h40</h3>
            <p className={styles.slotName}>Cocktail déjeunatoire</p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>14h00</h3>
            <p className={styles.slotName}>Visites de patrimoine &mdash; au choix</p>
            <ul className={styles.list}>
              <li>Entre Rhône et Saône, le quartier de Confluence</li>
              <li>À Saint-Priest, la nouvelle vie de la rue de l&apos;Industrie</li>
              <li>Gratte-ciel Nord &ndash; SERL &ndash; Villeurbanne</li>
              <li>Visites d&apos;opérations autour de la thématique des matériaux biosourcés</li>
            </ul>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>19h30</h3>
            <p className={styles.slotName}>Apéritif et dîner au Selcius</p>
          </div>
        </section>

        <hr className={styles.separator} />

        {/* Vendredi 9 octobre */}
        <section className={styles.day}>
          <h2 className={styles.dayTitle}>Vendredi 9 octobre 2026</h2>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>8h15</h3>
            <p className={styles.slotName}>Accueil café au Sucre</p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>8h45</h3>
            <p className={styles.slotName}>Intervention de Thierry Laget</p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>9h00</h3>
            <p className={styles.slotName}>
              Spectacle « Sous le même toit » par la Compagnie Etosha
            </p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>9h50</h3>
            <p className={styles.slotName}>Conférences interactives &mdash; au choix</p>
            <ul className={styles.list}>
              <li>Autour du spectacle « Sous le même toit »</li>
              <li>Optimisation de la programmation de travaux</li>
              <li>Réhabiliter autrement : quand la nature devient un levier de performance</li>
              <li>Réflexion autour du projet stratégique</li>
            </ul>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>11h30</h3>
            <p className={styles.slotName}>Pause</p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>11h50</h3>
            <p className={styles.slotName}>Intervention de Clément Lecuivre</p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>13h00</h3>
            <p className={styles.slotName}>Cocktail déjeunatoire</p>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>14h30</h3>
            <p className={styles.slotName}>Visites de sites culturels et lyonnais &mdash; au choix</p>
            <ul className={styles.list}>
              <li>Visite du Musée des Confluences</li>
              <li>Visite du quartier Saint-Jean</li>
              <li>Festival Airt de Famille</li>
            </ul>
          </div>

          <div className={styles.slot}>
            <h3 className={styles.slotTime}>17h00</h3>
            <p className={styles.slotName}>Fin des rencontres</p>
          </div>
        </section>

        <hr className={styles.separator} />

        {/* Les visites de patrimoine — détail */}
        <section className={styles.day}>
          <h2 className={styles.blockTitle}>Les visites de patrimoine</h2>

          <div className={styles.slot}>
            <p className={styles.slotName}>Entre Rhône et Saône, le quartier de Confluence</p>
            <p className={styles.text}>
              D&apos;ancienne friche industrielle à quartier futuriste et audacieux, le quartier
              de la Confluence dévoile un nouveau visage de la ville.
            </p>
          </div>

          <div className={styles.slot}>
            <p className={styles.slotName}>À Saint-Priest, la nouvelle vie de la rue de l&apos;Industrie</p>
            <p className={styles.text}>
              Vaste projet mêlant réhabilitation, construction neuve et aménagement, pensé sous
              deux axes majeurs : réemploi de matériaux et végétalisation.
            </p>
          </div>

          <div className={styles.slot}>
            <p className={styles.slotName}>Gratte-ciel Nord &ndash; SERL &ndash; Villeurbanne</p>
            <p className={styles.text}>
              Un projet d&apos;aménagement à la fois prolongement et hommage au centre historique
              de Villeurbanne, les Gratte-Ciel.
            </p>
          </div>

          <div className={styles.slot}>
            <p className={styles.slotName}>
              Visites d&apos;opérations autour de la thématique des matériaux biosourcés
            </p>
            <p className={styles.text}>
              À la découverte de deux opérations : opération en pierre de taille (SACVL) et
              structure bois (Albizzia).
            </p>
          </div>
        </section>

        <hr className={styles.separator} />

        {/* Les conférences interactives — détail */}
        <section className={styles.day}>
          <h2 className={styles.blockTitle}>Les conférences interactives</h2>

          <div className={styles.slot}>
            <p className={styles.slotName}>
              Autour du spectacle « Sous le même toit » : prolongez l&apos;expérience !
            </p>
            <p className={styles.text}>
              Atelier d&apos;expression et de mise en situation. Après la représentation du matin,
              place à la créativité.
            </p>
          </div>

          <div className={styles.slot}>
            <p className={styles.slotName}>Optimisation de la programmation de travaux</p>
            <p className={styles.text}>
              Un an après le lancement de la démarche : cap sur les résultats, les usages du
              PANORAMA et les idées qui feront évoluer nos pratiques de programmation de travaux.
            </p>
          </div>

          <div className={styles.slot}>
            <p className={styles.slotName}>
              Réhabiliter autrement : quand la nature devient un levier de performance
            </p>
            <p className={styles.text}>
              Testez différents scénarios de végétalisation et visualisez leurs bénéfices pour vos
              projets de réhabilitation.
            </p>
          </div>

          <div className={styles.slot}>
            <p className={styles.slotName}>Réflexion autour du projet stratégique</p>
            <p className={styles.text}>
              Les grandes orientations étant validées, la phase d&apos;écriture est lancée.
              Plusieurs axes concernent notre filière patrimoine et maîtrise d&apos;ouvrage.
              Exprimons-nous !
            </p>
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
