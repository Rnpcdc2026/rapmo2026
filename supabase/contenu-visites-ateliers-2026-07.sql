-- Contenu définitif visites & conférences interactives — docx "CDC formulaire_VFinale" (juillet 2026)
-- Les codes restent inchangés (pour préserver les jauges déjà posées)

-- ═══ Conférences interactives (ateliers vendredi matin) ═══
update workshops set
  title = 'Autour du spectacle « Sous le même toit » : prolongez l''expérience !',
  description = 'Atelier d''expression et de mise en situation. Après la représentation du matin, place à la créativité.'
where code = 'atelier-piece-toit';

update workshops set
  title = 'Optimisation de la programmation de travaux',
  description = 'Un an après le lancement de la démarche : cap sur les résultats, les usages du PANORAMA et les idées qui feront évoluer nos pratiques de programmation de travaux.'
where code = 'atelier-optimisation-travaux';

update workshops set
  title = 'Réhabiliter autrement : quand la nature devient un levier de performance',
  description = 'Testez différents scénarios de végétalisation et visualisez leurs bénéfices pour vos projets de réhabilitation.'
where code = 'atelier-biodiversite';

update workshops set
  title = 'Réflexion autour du projet stratégique',
  description = 'Les grandes orientations étant validées, la phase d''écriture est lancée. Plusieurs axes concernent notre filière patrimoine et maîtrise d''ouvrage. Exprimons-nous !'
where code = 'atelier-projet-strategique';

-- ═══ Visites de patrimoine (jeudi après-midi) ═══
update visits set
  title = 'Entre Rhône et Saône, le quartier de Confluence',
  description = 'D''ancienne friche industrielle à quartier futuriste et audacieux, le quartier de la Confluence dévoile un nouveau visage de la ville.'
where code = 'visite-confluence-spl';

update visits set
  title = 'À Saint-Priest, la nouvelle vie de la rue de l''Industrie',
  description = 'Vaste projet mêlant réhabilitation, construction neuve et aménagement, pensé sous deux axes majeurs : réemploi de matériaux et végétalisation.'
where code = 'visite-saint-priest';

update visits set
  title = 'Gratte-ciel Nord – SERL – Villeurbanne',
  description = 'Un projet d''aménagement à la fois prolongement et hommage au centre historique de Villeurbanne, les Gratte-Ciel.'
where code = 'visite-gratte-ciel-nord';

update visits set
  title = 'Visites d''opérations autour de la thématique des matériaux biosourcés',
  description = 'À la découverte de deux opérations : opération en pierre de taille (SACVL) et structure bois (Albizzia).'
where code = 'visite-pierre-taille-mariniers';

-- ═══ Visites culturelles (vendredi après-midi) — titres alignés sur le programme ═══
update visits set title = 'Visite du Musée des Confluences'  where code = 'visite-musee-confluences';
update visits set title = 'Visite du quartier Saint-Jean'    where code = 'visite-saint-jean-unesco';
update visits set title = 'Festival Airt de Famille'         where code = 'visite-festival-airt-famille';

-- Vérification
select 'visit'    as type, code, title from visits
union all
select 'workshop' as type, code, title from workshops
order by type, code;
