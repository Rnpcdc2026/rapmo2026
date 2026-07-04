-- Jauges (capacités) RAPMO 2026 — consignes Nadia (juillet 2026)
-- Rappel : capacity = 999 => pas de jauge (affiché sans "places restantes")

-- ── Visites de patrimoine (jeudi après-midi) ──
update visits set capacity = 50  where code = 'visite-saint-priest';          -- limité à un bus
update visits set capacity = 55  where code = 'visite-confluence-spl';
update visits set capacity = 55  where code = 'visite-gratte-ciel-nord';
update visits set capacity = 55  where code = 'visite-pierre-taille-mariniers'; -- matériaux biosourcés

-- ── Visites culturelles (vendredi après-midi) ──
update visits set capacity = 50  where code = 'visite-saint-jean-unesco';
update visits set capacity = 55  where code = 'visite-festival-airt-famille';
update visits set capacity = 999 where code = 'visite-musee-confluences';      -- sans jauge

-- ── Conférences interactives (ateliers vendredi matin) ──
update workshops set capacity = 50 where code = 'atelier-piece-toit';         -- « Sous le même toit »
update workshops set capacity = 55 where code = 'atelier-biodiversite';
update workshops set capacity = 55 where code = 'atelier-optimisation-travaux';
update workshops set capacity = 55 where code = 'atelier-projet-strategique';

-- Vérification
select 'visit'    as type, code, title, capacity from visits
union all
select 'workshop' as type, code, title, capacity from workshops
order by type, code;
