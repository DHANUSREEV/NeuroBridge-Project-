-- Fix the security issue by creating a proper security definer function
-- Drop the insecure policy
DROP POLICY IF EXISTS "Managers can view all candidate profiles" ON public.profiles;

-- Create a security definer function to get the current user's role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create the correct policy using the security definer function
CREATE POLICY "Managers can view all candidate profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow if user is viewing their own profile OR if they are a manager
  auth.uid() = user_id 
  OR 
  public.get_current_user_role() = 'manager'
);