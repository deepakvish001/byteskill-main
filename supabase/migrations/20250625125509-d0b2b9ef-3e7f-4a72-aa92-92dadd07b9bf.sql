
-- Drop existing problematic RLS policies on user_roles table
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

-- Create new non-recursive RLS policies for user_roles
-- Allow users to view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users with admin or super_admin role to view all roles
-- Using the security definer function to avoid recursion
CREATE POLICY "Admin users can view all roles" ON public.user_roles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- Allow users with admin or super_admin role to insert/update/delete roles
CREATE POLICY "Admin users can manage all roles" ON public.user_roles
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );
