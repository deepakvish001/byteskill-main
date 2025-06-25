
-- Create table for course content and metadata
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'dsa-sheet', 'course', 'interview-prep', 'core-cs'
  difficulty TEXT DEFAULT 'beginner',
  total_lessons INTEGER DEFAULT 0,
  estimated_hours INTEGER DEFAULT 0,
  prerequisites TEXT[],
  tags TEXT[],
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user course enrollments
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id TEXT REFERENCES public.courses(course_id) NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create table for lessons within courses
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(course_id) NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user lesson progress
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id UUID REFERENCES public.course_lessons(id) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read access)
CREATE POLICY "Anyone can view courses" 
  ON public.courses 
  FOR SELECT 
  USING (true);

-- RLS Policies for course_enrollments (users can only see their own enrollments)
CREATE POLICY "Users can view their own enrollments" 
  ON public.course_enrollments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments" 
  ON public.course_enrollments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" 
  ON public.course_enrollments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for course_lessons (public read access)
CREATE POLICY "Anyone can view course lessons" 
  ON public.course_lessons 
  FOR SELECT 
  USING (true);

-- RLS Policies for lesson_progress (users can only see their own progress)
CREATE POLICY "Users can view their own lesson progress" 
  ON public.lesson_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson progress" 
  ON public.lesson_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" 
  ON public.lesson_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert sample course data
INSERT INTO public.courses (course_id, title, description, category, difficulty, total_lessons, estimated_hours, tags, is_premium) VALUES
-- DSA Sheets
('striver-a2z', 'Striver A2Z DSA Sheet', 'Complete DSA preparation from basics to advanced topics', 'dsa-sheet', 'beginner', 191, 120, ARRAY['dsa', 'algorithms', 'data-structures'], false),
('striver-sde', 'Striver SDE Sheet', 'Most important 180+ problems for SDE interviews', 'dsa-sheet', 'intermediate', 180, 90, ARRAY['interview', 'sde', 'coding'], false),
('blind-75', 'Blind 75 Sheet', 'Essential 75 problems for tech interviews', 'dsa-sheet', 'intermediate', 75, 45, ARRAY['interview', 'leetcode'], false),
('neetcode-150', 'NeetCode 150', 'Curated list of 150 LeetCode problems', 'dsa-sheet', 'intermediate', 150, 75, ARRAY['leetcode', 'interview'], false),

-- Courses
('dsa-fundamentals', 'DSA Fundamentals', 'Master the fundamentals of Data Structures and Algorithms', 'course', 'beginner', 24, 40, ARRAY['basics', 'fundamentals'], false),
('system-design', 'System Design Mastery', 'Learn to design scalable distributed systems', 'course', 'advanced', 16, 60, ARRAY['system-design', 'scalability'], true),
('algorithms-advanced', 'Advanced Algorithms', 'Deep dive into complex algorithmic concepts', 'course', 'advanced', 20, 50, ARRAY['algorithms', 'advanced'], true),
('competitive-programming', 'Competitive Programming', 'Master competitive programming techniques', 'course', 'intermediate', 18, 45, ARRAY['cp', 'contests'], false),

-- Interview Prep
('behavioral', 'Behavioral Interview Prep', 'Master behavioral interviews with STAR method', 'interview-prep', 'beginner', 12, 15, ARRAY['behavioral', 'soft-skills'], false),
('company-specific', 'Company Specific Preparation', 'Targeted preparation for top tech companies', 'interview-prep', 'intermediate', 25, 35, ARRAY['companies', 'interview'], false),
('salary-negotiation', 'Salary Negotiation Mastery', 'Learn to negotiate your worth effectively', 'interview-prep', 'intermediate', 8, 12, ARRAY['negotiation', 'career'], true),

-- Core CS
('dbms', 'Database Management Systems', 'Complete DBMS concepts for interviews', 'core-cs', 'intermediate', 15, 30, ARRAY['database', 'sql'], false),
('operating-system', 'Operating Systems', 'OS concepts every developer should know', 'core-cs', 'intermediate', 18, 35, ARRAY['os', 'systems'], false),
('computer-networks', 'Computer Networks', 'Networking fundamentals and protocols', 'core-cs', 'intermediate', 14, 25, ARRAY['networking', 'protocols'], false),
('oops', 'Object Oriented Programming', 'Master OOP principles and design patterns', 'core-cs', 'beginner', 12, 20, ARRAY['oop', 'design-patterns'], false);

-- Insert sample lessons for a few courses
INSERT INTO public.course_lessons (course_id, lesson_number, title, content, duration_minutes) VALUES
-- DSA Fundamentals lessons
('dsa-fundamentals', 1, 'Introduction to Arrays', 'Learn the basics of arrays and their operations', 45),
('dsa-fundamentals', 2, 'Array Manipulation Techniques', 'Advanced array operations and algorithms', 60),
('dsa-fundamentals', 3, 'Introduction to Linked Lists', 'Understanding linked list data structure', 50),
('dsa-fundamentals', 4, 'Linked List Operations', 'Insertion, deletion, and traversal in linked lists', 55),

-- System Design lessons
('system-design', 1, 'System Design Fundamentals', 'Introduction to distributed systems', 90),
('system-design', 2, 'Scalability Principles', 'Horizontal vs Vertical scaling', 75),
('system-design', 3, 'Load Balancing', 'Different load balancing strategies', 80),

-- Behavioral Interview lessons
('behavioral', 1, 'STAR Method Introduction', 'Learn the STAR framework for behavioral questions', 30),
('behavioral', 2, 'Common Behavioral Questions', 'Practice with frequently asked questions', 45),
('behavioral', 3, 'Leadership and Teamwork', 'Showcase your leadership skills', 35);
