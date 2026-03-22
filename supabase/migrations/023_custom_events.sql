-- Create custom events table for ad hoc calendar events
CREATE TABLE IF NOT EXISTS public.custom_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME, -- Optional time of day
  color TEXT DEFAULT '#3b82f6', -- Hex color for the event
  all_day BOOLEAN DEFAULT true,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.custom_events ENABLE ROW LEVEL SECURITY;

-- Users can only see custom events from their own agency
CREATE POLICY "Users can view agency custom events" ON public.custom_events
  FOR SELECT 
  TO authenticated 
  USING (
    agency_id IN (
      SELECT am.agency_id 
      FROM public.agency_members am 
      WHERE am.user_id = auth.uid()
    )
  );

-- Users can create custom events in their agency
CREATE POLICY "Users can create agency custom events" ON public.custom_events
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    agency_id IN (
      SELECT am.agency_id 
      FROM public.agency_members am 
      WHERE am.user_id = auth.uid()
    )
  );

-- Users can update custom events in their agency
CREATE POLICY "Users can update agency custom events" ON public.custom_events
  FOR UPDATE 
  TO authenticated 
  USING (
    agency_id IN (
      SELECT am.agency_id 
      FROM public.agency_members am 
      WHERE am.user_id = auth.uid()
    )
  );

-- Users can delete custom events in their agency
CREATE POLICY "Users can delete agency custom events" ON public.custom_events
  FOR DELETE 
  TO authenticated 
  USING (
    agency_id IN (
      SELECT am.agency_id 
      FROM public.agency_members am 
      WHERE am.user_id = auth.uid()
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_events_agency_id ON public.custom_events(agency_id);
CREATE INDEX IF NOT EXISTS idx_custom_events_event_date ON public.custom_events(event_date);
CREATE INDEX IF NOT EXISTS idx_custom_events_created_by ON public.custom_events(created_by);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_events_updated_at 
  BEFORE UPDATE ON public.custom_events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();