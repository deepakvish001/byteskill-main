
-- Grant super_admin role to the specified user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users 
WHERE email = 'vishwakarmadeepak310@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Also grant admin role as a fallback
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'vishwakarmadeepak310@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
