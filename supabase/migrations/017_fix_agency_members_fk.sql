-- ============================================================
-- Migration 017: Fix agency_members FK + backfill missing rows
-- ============================================================
-- The original migration referenced auth.users(id) for user_id.
-- PostgREST needs a direct FK to public.profiles(id) to allow
-- the embedded `.select('*, profiles(...)')` join syntax.
-- Also backfills any profiles that were linked to an agency but
-- were never inserted into agency_members (e.g. the demo user).
-- ============================================================

-- 1. Change FK target from auth.users to public.profiles
ALTER TABLE public.agency_members
  DROP CONSTRAINT agency_members_user_id_fkey,
  ADD  CONSTRAINT agency_members_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. Backfill: any profile with an agency_id that has no agency_members row
INSERT INTO public.agency_members (agency_id, user_id, role)
SELECT
  p.agency_id,
  p.id,
  CASE WHEN a.owner_id = p.id THEN 'owner' ELSE 'member' END
FROM  public.profiles  p
JOIN  public.agencies  a ON a.id = p.agency_id
WHERE p.agency_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM   public.agency_members am
    WHERE  am.agency_id = p.agency_id
    AND    am.user_id   = p.id
  )
ON CONFLICT (agency_id, user_id) DO NOTHING;
