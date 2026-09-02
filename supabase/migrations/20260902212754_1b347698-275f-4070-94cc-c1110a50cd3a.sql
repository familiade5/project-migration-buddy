ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid;

UPDATE public.profiles SET approval_status = 'approved', approved_at = COALESCE(approved_at, now())
WHERE approval_status = 'pending';

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_approval_status_check CHECK (approval_status IN ('pending','approved','rejected'));

CREATE OR REPLACE FUNCTION public.is_approved_user(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND approval_status = 'approved')
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _is_portal boolean := COALESCE((NEW.raw_user_meta_data->>'portal_client')::boolean, false);
  _by_admin boolean := COALESCE((NEW.raw_user_meta_data->>'created_by_admin')::boolean, false);
  _status text;
BEGIN
  IF _is_portal OR _by_admin THEN
    _status := 'approved';
  ELSE
    _status := 'pending';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, temp_password, approval_status, approved_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'temp_password')::boolean, false),
    _status,
    CASE WHEN _status = 'approved' THEN now() ELSE NULL END
  );

  IF _is_portal = false AND _status = 'approved' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;

  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));