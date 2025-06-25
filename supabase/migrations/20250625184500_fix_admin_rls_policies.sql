
-- Fix RLS policies for admin operations

-- Drop existing policies that are causing issues
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage all modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admins can manage all chapters" ON public.course_chapters;
DROP POLICY IF EXISTS "Admins can manage all content" ON public.course_content;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.course_lessons;

-- Create more specific policies for admin operations

-- Courses table policies
CREATE POLICY "Admins can insert courses" ON public.courses
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can update courses" ON public.courses
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can delete courses" ON public.courses
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- Course modules table policies
CREATE POLICY "Admins can insert modules" ON public.course_modules
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can update modules" ON public.course_modules
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can delete modules" ON public.course_modules
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- Course chapters table policies
CREATE POLICY "Admins can insert chapters" ON public.course_chapters
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can update chapters" ON public.course_chapters
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can delete chapters" ON public.course_chapters
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- Course content table policies
CREATE POLICY "Admins can insert content" ON public.course_content
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can update content" ON public.course_content
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can delete content" ON public.course_content
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- Course lessons table policies
CREATE POLICY "Admins can insert lessons" ON public.course_lessons
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can update lessons" ON public.course_lessons
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can delete lessons" ON public.course_lessons
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
