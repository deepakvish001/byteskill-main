
-- Create system_settings table for configuration management
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')),
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage system settings
CREATE POLICY "Admins can manage system settings" ON public.system_settings
FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Insert some default settings
INSERT INTO public.system_settings (key, value, type, description, category) VALUES
('site_name', 'ByteSkill', 'string', 'The name of the application', 'general'),
('maintenance_mode', 'false', 'boolean', 'Enable/disable maintenance mode', 'general'),
('max_file_size', '10485760', 'number', 'Maximum file upload size in bytes', 'general'),
('email_notifications', 'true', 'boolean', 'Enable email notifications', 'notifications'),
('api_rate_limit', '100', 'number', 'API rate limit per minute', 'api');
