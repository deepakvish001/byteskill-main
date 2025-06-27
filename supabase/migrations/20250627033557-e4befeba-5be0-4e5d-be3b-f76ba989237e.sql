
-- First, let's enhance the profiles table with additional fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS leetcode_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title text;

-- Create education table
CREATE TABLE IF NOT EXISTS public.user_education (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text,
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create work experience table
CREATE TABLE IF NOT EXISTS public.user_experience (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text,
  location text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.user_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  technologies text[],
  github_url text,
  live_url text,
  start_date date,
  end_date date,
  is_ongoing boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date_achieved date,
  organization text,
  certificate_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user activity logs for real-time tracking
CREATE TABLE IF NOT EXISTS public.user_activity (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  points_earned integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create RLS policies for new tables
ALTER TABLE public.user_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Education policies
CREATE POLICY "Users can view their own education" ON public.user_education
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own education" ON public.user_education
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own education" ON public.user_education
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own education" ON public.user_education
  FOR DELETE USING (user_id = auth.uid());

-- Experience policies
CREATE POLICY "Users can view their own experience" ON public.user_experience
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own experience" ON public.user_experience
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own experience" ON public.user_experience
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own experience" ON public.user_experience
  FOR DELETE USING (user_id = auth.uid());

-- Projects policies
CREATE POLICY "Users can view their own projects" ON public.user_projects
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own projects" ON public.user_projects
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own projects" ON public.user_projects
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own projects" ON public.user_projects
  FOR DELETE USING (user_id = auth.uid());

-- Achievements policies
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own achievements" ON public.user_achievements
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own achievements" ON public.user_achievements
  FOR DELETE USING (user_id = auth.uid());

-- Activity policies
CREATE POLICY "Users can view their own activity" ON public.user_activity
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own activity" ON public.user_activity
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to update user XP and streaks based on activity
CREATE OR REPLACE FUNCTION public.update_user_xp_and_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update XP points
  UPDATE public.profiles 
  SET 
    xp_points = xp_points + NEW.points_earned,
    updated_at = now()
  WHERE id = NEW.user_id;

  -- Update streak if it's a daily activity
  IF NEW.activity_type IN ('problem_solved', 'lesson_completed', 'course_progress') THEN
    -- Check if user was active yesterday to maintain streak
    UPDATE public.profiles 
    SET 
      current_streak = CASE 
        WHEN EXISTS (
          SELECT 1 FROM public.user_activity 
          WHERE user_id = NEW.user_id 
          AND activity_type IN ('problem_solved', 'lesson_completed', 'course_progress')
          AND created_at::date = (CURRENT_DATE - INTERVAL '1 day')
        ) OR current_streak = 0 THEN current_streak + 1
        ELSE 1
      END,
      max_streak = GREATEST(max_streak, current_streak + 1),
      updated_at = now()
    WHERE id = NEW.user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.user_activity 
      WHERE user_id = NEW.user_id 
      AND activity_type IN ('problem_solved', 'lesson_completed', 'course_progress')
      AND created_at::date = CURRENT_DATE
      AND id != NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for XP and stats updates
DROP TRIGGER IF EXISTS update_user_stats_trigger ON public.user_activity;
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT ON public.user_activity
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_xp_and_stats();

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile pictures
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view all profile pictures" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can update their own profile pictures" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
