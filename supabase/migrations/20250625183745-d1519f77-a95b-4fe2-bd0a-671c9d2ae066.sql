
-- Phase 1: Critical Database Security Fixes

-- 1. Add comprehensive RLS policies for courses table
CREATE POLICY "Public can view published courses" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all courses" ON public.courses
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- 2. Add RLS policies for course_modules table
CREATE POLICY "Public can view published modules" ON public.course_modules
  FOR SELECT USING (
    is_published = true AND 
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE course_id = course_modules.course_id 
      AND is_published = true
    )
  );

CREATE POLICY "Admins can manage all modules" ON public.course_modules
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- 3. Add RLS policies for course_chapters table
CREATE POLICY "Public can view published chapters" ON public.course_chapters
  FOR SELECT USING (
    is_published = true AND 
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE course_id = course_chapters.course_id 
      AND is_published = true
    )
  );

CREATE POLICY "Admins can manage all chapters" ON public.course_chapters
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- 4. Add RLS policies for course_content table
CREATE POLICY "Public can view published content" ON public.course_content
  FOR SELECT USING (
    status = 'published' AND 
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE course_id = course_content.course_id 
      AND is_published = true
    )
  );

CREATE POLICY "Admins can manage all content" ON public.course_content
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- 5. Add RLS policies for course_lessons table
CREATE POLICY "Public can view lessons for published courses" ON public.course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE course_id = course_lessons.course_id 
      AND is_published = true
    )
  );

CREATE POLICY "Admins can manage all lessons" ON public.course_lessons
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- 6. Create admin audit logging function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type_param TEXT,
  target_type_param TEXT DEFAULT NULL,
  target_id_param TEXT DEFAULT NULL,
  payload_param JSONB DEFAULT '{}'::jsonb
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only log if user has admin role
  IF public.has_role(auth.uid(), 'admin'::text) OR public.has_role(auth.uid(), 'super_admin'::text) THEN
    INSERT INTO public.audit_logs (
      action_type,
      actor_id,
      target_type,
      target_id,
      payload
    ) VALUES (
      action_type_param,
      auth.uid(),
      target_type_param,
      target_id_param,
      payload_param
    );
  END IF;
END;
$$;

-- 7. Create server-side admin validation function
CREATE OR REPLACE FUNCTION public.validate_admin_operation(
  operation_type TEXT,
  resource_type TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has admin role
  IF NOT (public.has_role(auth.uid(), 'admin'::text) OR public.has_role(auth.uid(), 'super_admin'::text)) THEN
    RAISE EXCEPTION 'Insufficient permissions for % operation on %', operation_type, resource_type;
  END IF;
  
  -- Log the operation attempt
  PERFORM public.log_admin_action(
    operation_type,
    resource_type,
    auth.uid()::text,
    jsonb_build_object('timestamp', now(), 'user_id', auth.uid())
  );
  
  RETURN true;
END;
$$;

-- 8. Enhanced rate limiting for login attempts
CREATE OR REPLACE FUNCTION public.check_login_rate_limit(
  email_param TEXT,
  ip_param TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recent_attempts INTEGER;
  last_attempt_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Clean up old attempts first
  DELETE FROM public.login_attempts 
  WHERE attempted_at < NOW() - INTERVAL '1 hour';
  
  -- Count recent failed attempts for this email
  SELECT COUNT(*), MAX(attempted_at)
  INTO recent_attempts, last_attempt_time
  FROM public.login_attempts 
  WHERE email = email_param 
    AND success = false 
    AND attempted_at > NOW() - INTERVAL '15 minutes';
  
  -- Progressive rate limiting
  IF recent_attempts >= 5 THEN
    -- Check if enough time has passed since last attempt
    IF last_attempt_time > NOW() - INTERVAL '15 minutes' THEN
      RAISE EXCEPTION 'Too many failed login attempts. Please try again in 15 minutes.';
    END IF;
  ELSIF recent_attempts >= 3 THEN
    -- Shorter delay for fewer attempts
    IF last_attempt_time > NOW() - INTERVAL '5 minutes' THEN
      RAISE EXCEPTION 'Too many failed login attempts. Please try again in 5 minutes.';
    END IF;
  END IF;
  
  RETURN true;
END;
$$;

-- 9. Add input validation constraints
ALTER TABLE public.courses 
ADD CONSTRAINT valid_course_title_length CHECK (char_length(title) BETWEEN 1 AND 200),
ADD CONSTRAINT valid_course_description_length CHECK (char_length(description) <= 2000);

ALTER TABLE public.course_modules 
ADD CONSTRAINT valid_module_title_length CHECK (char_length(title) BETWEEN 1 AND 200),
ADD CONSTRAINT valid_module_description_length CHECK (char_length(description) <= 1000);

ALTER TABLE public.course_chapters 
ADD CONSTRAINT valid_chapter_title_length CHECK (char_length(title) BETWEEN 1 AND 200),
ADD CONSTRAINT valid_chapter_description_length CHECK (char_length(description) <= 1000);

ALTER TABLE public.course_content 
ADD CONSTRAINT valid_content_title_length CHECK (char_length(title) BETWEEN 1 AND 200),
ADD CONSTRAINT valid_content_description_length CHECK (char_length(description) <= 1000);

-- 10. Add URL validation for video and practice links
ALTER TABLE public.course_content 
ADD CONSTRAINT valid_video_url CHECK (
  video_url IS NULL OR 
  video_url ~* '^https?://[^\s/$.?#].[^\s]*$'
),
ADD CONSTRAINT valid_practice_link CHECK (
  practice_link IS NULL OR 
  practice_link ~* '^https?://[^\s/$.?#].[^\s]*$'
);

ALTER TABLE public.course_lessons 
ADD CONSTRAINT valid_lesson_video_url CHECK (
  video_url IS NULL OR 
  video_url ~* '^https?://[^\s/$.?#].[^\s]*$'
);
