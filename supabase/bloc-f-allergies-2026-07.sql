-- Bloc F — colonne allergies + fonction register_participant mise à jour
-- p_allergies est ajouté EN DERNIER avec DEFAULT NULL : l'ancien code (18 args) et
-- le nouveau code (19 args nommés) fonctionnent tous les deux → pas de fenêtre cassée.

-- 1. Nouvelle colonne
alter table registrations add column if not exists allergies text;

-- 2. Supprimer l'ancienne fonction (18 args) pour éviter toute ambiguïté, puis recréer
drop function if exists register_participant(
  uuid, text, text, text, text, text, text, text, uuid, text,
  boolean, boolean, boolean, boolean, boolean, uuid, uuid, uuid[]
);

CREATE OR REPLACE FUNCTION public.register_participant(
  p_event_id uuid, p_email text, p_first_name text, p_last_name text, p_phone text,
  p_entity text, p_role text, p_diet text, p_hotel_id uuid, p_transport_mode text,
  p_attends_thu_morning boolean, p_attends_thu_afternoon boolean, p_attends_thu_evening boolean,
  p_attends_fri_morning boolean, p_attends_fri_afternoon boolean,
  p_thursday_visit_id uuid, p_friday_visit_id uuid, p_workshop_ids uuid[],
  p_allergies text DEFAULT NULL
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_invitation_id   uuid;
  v_already_reg     boolean;
  v_registration_id uuid;
  v_reference       text;
  v_next_num        bigint;
  v_visit_capacity  integer;
  v_visit_taken     integer;
  v_workshop_id     uuid;
BEGIN
  -- 1. Vérifier que l'email est dans la liste d'invités
  SELECT id, COALESCE(registered, false)
    INTO v_invitation_id, v_already_reg
  FROM invitations
  WHERE lower(email) = lower(p_email)
    AND event_id = p_event_id
  LIMIT 1;
  IF v_invitation_id IS NULL THEN
    RAISE EXCEPTION 'Email non trouvé dans la liste des invités: %', p_email
      USING ERRCODE = 'P0003';
  END IF;
  IF v_already_reg THEN
    RAISE EXCEPTION 'Inscription déjà existante pour: %', p_email
      USING ERRCODE = 'P0002';
  END IF;
  -- 2. Lock + check quota jeudi
  IF p_thursday_visit_id IS NOT NULL THEN
    SELECT capacity INTO v_visit_capacity
    FROM visits WHERE id = p_thursday_visit_id FOR UPDATE;
    IF v_visit_capacity IS NOT NULL AND v_visit_capacity < 999 THEN
      SELECT COUNT(*) INTO v_visit_taken
      FROM registration_visits WHERE visit_id = p_thursday_visit_id;
      IF v_visit_taken >= v_visit_capacity THEN
        RAISE EXCEPTION 'Visite jeudi complète: %', p_thursday_visit_id
          USING ERRCODE = 'P0001';
      END IF;
    END IF;
  END IF;
  -- 2bis. Lock + check quota vendredi
  IF p_friday_visit_id IS NOT NULL THEN
    SELECT capacity INTO v_visit_capacity
    FROM visits WHERE id = p_friday_visit_id FOR UPDATE;
    IF v_visit_capacity IS NOT NULL AND v_visit_capacity < 999 THEN
      SELECT COUNT(*) INTO v_visit_taken
      FROM registration_visits WHERE visit_id = p_friday_visit_id;
      IF v_visit_taken >= v_visit_capacity THEN
        RAISE EXCEPTION 'Visite vendredi complète: %', p_friday_visit_id
          USING ERRCODE = 'P0001';
      END IF;
    END IF;
  END IF;
  -- 3. Générer la référence via la séquence
  v_next_num := nextval('registration_ref_seq');
  v_reference := 'RAPMO-2026-' || LPAD(v_next_num::text, 4, '0');
  -- 4. Insertion registration
  INSERT INTO registrations (
    event_id, reference, first_name, last_name, email, phone, entity, role,
    diet, allergies, hotel_id, transport_mode,
    attends_thursday_morning, attends_thursday_afternoon, attends_thursday_evening,
    attends_friday_morning, attends_friday_afternoon, status
  ) VALUES (
    p_event_id, v_reference, p_first_name, p_last_name, lower(p_email), p_phone, p_entity, p_role,
    NULLIF(p_diet, ''), NULLIF(p_allergies, ''), p_hotel_id, p_transport_mode,
    p_attends_thu_morning, p_attends_thu_afternoon, p_attends_thu_evening,
    p_attends_fri_morning, p_attends_fri_afternoon, 'confirmed'
  ) RETURNING id INTO v_registration_id;
  -- 5. Insertions registration_visits
  IF p_thursday_visit_id IS NOT NULL THEN
    INSERT INTO registration_visits (registration_id, visit_id)
    VALUES (v_registration_id, p_thursday_visit_id);
  END IF;
  IF p_friday_visit_id IS NOT NULL THEN
    INSERT INTO registration_visits (registration_id, visit_id)
    VALUES (v_registration_id, p_friday_visit_id);
  END IF;
  -- 6. Insertions registration_workshops
  IF p_workshop_ids IS NOT NULL AND array_length(p_workshop_ids, 1) > 0 THEN
    FOREACH v_workshop_id IN ARRAY p_workshop_ids LOOP
      INSERT INTO registration_workshops (registration_id, workshop_id)
      VALUES (v_registration_id, v_workshop_id);
    END LOOP;
  END IF;
  -- 7. Marquer l'invitation
  UPDATE invitations SET registered = true WHERE id = v_invitation_id;
  RETURN v_registration_id;
END;
$function$;
