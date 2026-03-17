-- ============================================================
-- Migration 020: Create demo member user
-- Creates demo.member@email.com / demo123 and adds them to
-- the Demo Agency as a regular member.
-- Requires migration 019 (deferrable FK) to be applied first.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DO $$
DECLARE
  demo_member_id  UUID;
  demo_agency_id  UUID;
BEGIN
  -- Locate the Demo Agency
  SELECT id INTO demo_agency_id
  FROM   public.agencies
  WHERE  name = 'Demo Agency'
  LIMIT  1;

  IF demo_agency_id IS NULL THEN
    RAISE EXCEPTION 'Demo Agency not found – run earlier migrations first';
  END IF;

  -- Only create if not already present
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo.member@email.com') THEN
    -- Already exists: just ensure profile + membership are correct
    SELECT id INTO demo_member_id
    FROM   auth.users
    WHERE  email = 'demo.member@email.com';

    UPDATE public.profiles
    SET    agency_id  = demo_agency_id,
           first_name = 'Demo',
           last_name  = 'Member'
    WHERE  id = demo_member_id;

    INSERT INTO public.agency_members (agency_id, user_id, role)
    VALUES (demo_agency_id, demo_member_id, 'member')
    ON CONFLICT (agency_id, user_id) DO NOTHING;

    RETURN;
  END IF;

  demo_member_id := gen_random_uuid();

  -- Create auth user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    demo_member_id,
    'authenticated', 'authenticated',
    'demo.member@email.com',
    extensions.crypt('demo123', extensions.gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Demo Member"}',
    NOW(), NOW(),
    '', '', '', ''
  );
  -- ^ on_auth_user_created fires here: inserts profile (agency_id=NULL)
  --   profiles_agency_trigger fires: creates an auto-agency, then inserts
  --   agency_members (deferred FK, so no immediate violation).

  -- Create email identity for password login
  INSERT INTO auth.identities (
    id, provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'demo.member@email.com',
    demo_member_id,
    jsonb_build_object('sub', demo_member_id::text, 'email', 'demo.member@email.com'),
    'email',
    NOW(), NOW(), NOW()
  );

  -- Point the profile at Demo Agency (instead of the auto-created one)
  UPDATE public.profiles
  SET    agency_id  = demo_agency_id,
         first_name = 'Demo',
         last_name  = 'Member'
  WHERE  id = demo_member_id;

  -- Remove the now-obsolete auto-created agency
  -- (ON DELETE SET NULL on profiles.agency_id keeps the profile intact)
  DELETE FROM public.agencies
  WHERE  owner_id = demo_member_id
    AND  id       != demo_agency_id;

  -- Register as member of Demo Agency
  INSERT INTO public.agency_members (agency_id, user_id, role)
  VALUES (demo_agency_id, demo_member_id, 'member')
  ON CONFLICT (agency_id, user_id) DO NOTHING;

END $$;
