-- Fix the infinite recursion issue in profiles RLS policies
-- Drop the problematic manager policy that causes recursion
DROP POLICY IF EXISTS "Managers can view all candidate profiles" ON public.profiles;

-- Recreate a simplified manager policy that doesn't cause recursion
-- Use a direct check against auth.jwt() instead of querying profiles table
CREATE POLICY "Managers can view all candidate profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow if user is viewing their own profile OR if they are a manager
  auth.uid() = user_id 
  OR 
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'manager'
);