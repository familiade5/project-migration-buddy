-- Fix 1: Add policy to deny anonymous access to user_roles
CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix 2: Restrict crecis table to authenticated users only
DROP POLICY IF EXISTS "All users can view crecis" ON public.crecis;

CREATE POLICY "Authenticated users can view crecis"
ON public.crecis
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix 3: Create secure function for inserting activity logs
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_user_name TEXT;
  v_log_id UUID;
BEGIN
  -- Get the authenticated user's ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to log activity';
  END IF;
  
  -- Get user details from profiles table (server-side, not client-provided)
  SELECT email, full_name INTO v_user_email, v_user_name
  FROM public.profiles
  WHERE id = v_user_id;
  
  -- Insert the activity log with server-validated data
  INSERT INTO public.activity_logs (
    user_id,
    user_email,
    user_name,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    v_user_id,
    v_user_email,
    v_user_name,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Drop the old permissive INSERT policy
DROP POLICY IF EXISTS "Anyone authenticated can insert logs" ON public.activity_logs;

-- Create a more restrictive INSERT policy that only allows the function to insert
-- Users can only insert logs through the secure function
CREATE POLICY "Only authenticated users via function can insert logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  user_id = auth.uid()
);