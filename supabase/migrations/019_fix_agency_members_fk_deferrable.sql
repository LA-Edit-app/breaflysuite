-- ============================================================
-- Migration 019: Make agency_members.user_id FK deferrable
--
-- Migration 016 updated handle_new_profile_agency() to INSERT
-- into agency_members inside a BEFORE INSERT trigger on profiles.
-- Migration 017 changed that FK to reference profiles(id), so
-- the immediate FK check fired BEFORE the profile row was
-- committed (it's a BEFORE trigger), causing a FK violation on
-- new user creation. Making the constraint DEFERRABLE INITIALLY
-- DEFERRED moves the check to end-of-transaction, at which
-- point the profile IS in the table. This fix also restores
-- correct new-user signup behaviour post-migration-017.
-- ============================================================

ALTER TABLE public.agency_members
  DROP CONSTRAINT IF EXISTS agency_members_user_id_fkey,
  ADD  CONSTRAINT agency_members_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED;
