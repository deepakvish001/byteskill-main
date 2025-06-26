
-- Add missing tagline column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS tagline TEXT;

-- Update the courses table to include all required fields for proper course management
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS module_count INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS chapter_count INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS problem_count INTEGER DEFAULT 0;

-- Create function to automatically update course statistics
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update module count
    UPDATE courses SET module_count = (
        SELECT COUNT(*) FROM course_modules WHERE course_id = NEW.course_id
    ) WHERE course_id = NEW.course_id;
    
    -- Update chapter count
    UPDATE courses SET chapter_count = (
        SELECT COUNT(*) FROM course_chapters WHERE course_id = NEW.course_id
    ) WHERE course_id = NEW.course_id;
    
    -- Update problem count (from course_content)
    UPDATE courses SET problem_count = (
        SELECT COUNT(*) FROM course_content WHERE course_id = NEW.course_id
    ) WHERE course_id = NEW.course_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update course statistics
DROP TRIGGER IF EXISTS update_course_stats_modules ON course_modules;
CREATE TRIGGER update_course_stats_modules
    AFTER INSERT OR UPDATE OR DELETE ON course_modules
    FOR EACH ROW EXECUTE FUNCTION update_course_stats();

DROP TRIGGER IF EXISTS update_course_stats_chapters ON course_chapters;
CREATE TRIGGER update_course_stats_chapters
    AFTER INSERT OR UPDATE OR DELETE ON course_chapters
    FOR EACH ROW EXECUTE FUNCTION update_course_stats();

DROP TRIGGER IF EXISTS update_course_stats_content ON course_content;
CREATE TRIGGER update_course_stats_content
    AFTER INSERT OR UPDATE OR DELETE ON course_content
    FOR EACH ROW EXECUTE FUNCTION update_course_stats();
