-- ============================================================
-- Migration 018: Task assignment + role-aware RLS
-- Adds assigned_to column. Admins/owners see all tasks;
-- members only see tasks assigned to them or created by them.
-- ============================================================

-- 1. Add assigned_to (FK to profiles so PostgREST can join)
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);

-- 2. Drop the old catch-all policy
DROP POLICY IF EXISTS "Agency isolation on tasks" ON public.tasks;

-- 3. SELECT: admins/owners see all tasks; members see only theirs
CREATE POLICY "Tasks select" ON public.tasks
  FOR SELECT USING (
    agency_id = public.current_agency_id()
    AND (
      public.is_agency_admin()
      OR assigned_to = auth.uid()
      OR created_by  = auth.uid()
    )
  );

-- 4. INSERT: any agency member can create tasks
CREATE POLICY "Tasks insert" ON public.tasks
  FOR INSERT WITH CHECK (agency_id = public.current_agency_id());

-- 5. UPDATE: admins always; members only their visible tasks
CREATE POLICY "Tasks update" ON public.tasks
  FOR UPDATE
  USING (
    agency_id = public.current_agency_id()
    AND (
      public.is_agency_admin()
      OR assigned_to = auth.uid()
      OR created_by  = auth.uid()
    )
  )
  WITH CHECK (agency_id = public.current_agency_id());

-- 6. DELETE: admins always; members only their visible tasks
CREATE POLICY "Tasks delete" ON public.tasks
  FOR DELETE USING (
    agency_id = public.current_agency_id()
    AND (
      public.is_agency_admin()
      OR assigned_to = auth.uid()
      OR created_by  = auth.uid()
    )
  );
