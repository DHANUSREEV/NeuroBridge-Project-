-- Add policy to allow managers to view candidate profiles
CREATE POLICY "Managers can view all candidate profiles" 
ON public.profiles 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1
  FROM profiles manager_profile
  WHERE manager_profile.user_id = auth.uid() 
  AND manager_profile.role = 'manager'::user_role
));