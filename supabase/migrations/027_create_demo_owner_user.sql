-- ============================================================
-- Migration 027: Create demo owner user (demo@email.com)
-- In the original project this user was created manually and
-- linked via migration 015. In new projects we create them here.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DO $$
DECLARE
  demo_user_id   UUID;
  demo_agency_id UUID;
  auto_agency_id UUID;
BEGIN
  -- Locate the Demo Agency
  SELECT id INTO demo_agency_id
  FROM   public.agencies
  WHERE  name = 'Demo Agency'
  LIMIT  1;

  IF demo_agency_id IS NULL THEN
    RAISE EXCEPTION 'Demo Agency not found – run earlier migrations first';
  END IF;

  -- Skip if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo@email.com') THEN
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@email.com';

    -- Ensure profile and ownership are correct
    UPDATE public.profiles
    SET    agency_id  = demo_agency_id,
           first_name = 'Demo',
           last_name  = 'User'
    WHERE  id = demo_user_id;

    UPDATE public.agencies
    SET    owner_id = demo_user_id
    WHERE  id = demo_agency_id;

    INSERT INTO public.agency_members (agency_id, user_id, role)
    VALUES (demo_agency_id, demo_user_id, 'owner')
    ON CONFLICT (agency_id, user_id) DO UPDATE SET role = 'owner';

    RETURN;
  END IF;

  demo_user_id := gen_random_uuid();

  -- Create auth user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    demo_user_id,
    'authenticated', 'authenticated',
    'demo@email.com',
    extensions.crypt('demo123', extensions.gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Demo User"}',
    NOW(), NOW(),
    '', '', '', ''
  );

  -- Create email identity for password login
  INSERT INTO auth.identities (
    id, provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'demo@email.com',
    demo_user_id,
    jsonb_build_object('sub', demo_user_id::text, 'email', 'demo@email.com'),
    'email',
    NOW(), NOW(), NOW()
  );

  -- Get the auto-created agency the trigger made for this user
  SELECT agency_id INTO auto_agency_id
  FROM   public.profiles
  WHERE  id = demo_user_id;

  -- Point profile at Demo Agency
  UPDATE public.profiles
  SET    agency_id  = demo_agency_id,
         first_name = 'Demo',
         last_name  = 'User'
  WHERE  id = demo_user_id;

  -- Delete the auto-created placeholder agency (if different)
  IF auto_agency_id IS NOT NULL AND auto_agency_id <> demo_agency_id THEN
    DELETE FROM public.agencies WHERE id = auto_agency_id;
  END IF;

  -- Set demo user as Demo Agency owner
  UPDATE public.agencies
  SET    owner_id = demo_user_id
  WHERE  id = demo_agency_id;

  -- Add to agency_members as owner
  INSERT INTO public.agency_members (agency_id, user_id, role)
  VALUES (demo_agency_id, demo_user_id, 'owner')
  ON CONFLICT (agency_id, user_id) DO UPDATE SET role = 'owner';

END;
$$;
