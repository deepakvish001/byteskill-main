
-- Create courses table with enhanced fields
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  category TEXT NOT NULL,
  topics TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  estimated_hours INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create modules table
CREATE TABLE public.course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  module_order INTEGER NOT NULL DEFAULT 1,
  estimated_hours INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE public.course_chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  chapter_order INTEGER NOT NULL DEFAULT 1,
  estimated_time_minutes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lectures/problems table (unified content table)
CREATE TABLE public.course_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES course_chapters(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('lecture', 'problem', 'article')),
  title TEXT NOT NULL,
  description TEXT,
  content_order INTEGER NOT NULL DEFAULT 1,
  
  -- Content details
  article_content TEXT,
  video_url TEXT,
  practice_link TEXT,
  estimated_time_minutes INTEGER DEFAULT 0,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  topics TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Status and flags
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_bookmarkable BOOLEAN DEFAULT true,
  is_practice_available BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress tracking tables
CREATE TABLE public.user_course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE public.user_module_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, module_id)
);

CREATE TABLE public.user_content_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES course_content(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES course_chapters(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  
  -- Progress tracking
  is_completed BOOLEAN DEFAULT false,
  is_bookmarked BOOLEAN DEFAULT false,
  time_spent_minutes INTEGER DEFAULT 0,
  notes TEXT,
  
  completed_at TIMESTAMP WITH TIME ZONE,
  bookmarked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, content_id)
);

-- Create indexes for better performance
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_chapters_module_id ON course_chapters(module_id);
CREATE INDEX idx_course_content_chapter_id ON course_content(chapter_id);
CREATE INDEX idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX idx_user_module_progress_user_id ON user_module_progress(user_id);
CREATE INDEX idx_user_content_progress_user_id ON user_content_progress(user_id);

-- Enable RLS on all tables
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course structure (public read for published content)
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published modules" ON public.course_modules
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published chapters" ON public.course_chapters
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published content" ON public.course_content
  FOR SELECT USING (status = 'published');

-- RLS Policies for user progress (users can only see their own progress)
CREATE POLICY "Users can view their own course progress" ON public.user_course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own course progress" ON public.user_course_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own module progress" ON public.user_module_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own module progress" ON public.user_module_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own content progress" ON public.user_content_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own content progress" ON public.user_content_progress
  FOR ALL USING (auth.uid() = user_id);

-- Function to update course progress automatically
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update module progress
  UPDATE user_module_progress 
  SET progress_percentage = (
    SELECT COALESCE(
      (COUNT(CASE WHEN ucp.is_completed THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0))::INTEGER, 
      0
    )
    FROM course_content cc
    LEFT JOIN user_content_progress ucp ON cc.id = ucp.content_id AND ucp.user_id = NEW.user_id
    WHERE cc.module_id = NEW.module_id
  ),
  completed_at = CASE 
    WHEN progress_percentage = 100 THEN NOW() 
    ELSE NULL 
  END
  WHERE user_id = NEW.user_id AND module_id = NEW.module_id;

  -- Update course progress
  UPDATE user_course_progress 
  SET progress_percentage = (
    SELECT COALESCE(
      (COUNT(CASE WHEN ucp.is_completed THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0))::INTEGER, 
      0
    )
    FROM course_content cc
    LEFT JOIN user_content_progress ucp ON cc.id = ucp.content_id AND ucp.user_id = NEW.user_id
    WHERE cc.course_id = NEW.course_id
  ),
  completed_at = CASE 
    WHEN progress_percentage = 100 THEN NOW() 
    ELSE NULL 
  END,
  last_accessed_at = NOW()
  WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update progress
CREATE TRIGGER trigger_update_course_progress
  AFTER INSERT OR UPDATE OF is_completed ON user_content_progress
  FOR EACH ROW EXECUTE FUNCTION update_course_progress();
