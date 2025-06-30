
-- Add missing foreign key constraints (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_modules_course_id'
    ) THEN
        ALTER TABLE course_modules ADD CONSTRAINT fk_course_modules_course_id 
          FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_chapters_module_id'
    ) THEN
        ALTER TABLE course_chapters ADD CONSTRAINT fk_course_chapters_module_id 
          FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_chapters_course_id'
    ) THEN
        ALTER TABLE course_chapters ADD CONSTRAINT fk_course_chapters_course_id 
          FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_content_chapter_id'
    ) THEN
        ALTER TABLE course_content ADD CONSTRAINT fk_course_content_chapter_id 
          FOREIGN KEY (chapter_id) REFERENCES course_chapters(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_content_module_id'
    ) THEN
        ALTER TABLE course_content ADD CONSTRAINT fk_course_content_module_id 
          FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_content_course_id'
    ) THEN
        ALTER TABLE course_content ADD CONSTRAINT fk_course_content_course_id 
          FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_course_lessons_course_id'
    ) THEN
        ALTER TABLE course_lessons ADD CONSTRAINT fk_course_lessons_course_id 
          FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Anyone can view published modules" ON public.course_modules;
DROP POLICY IF EXISTS "Anyone can view published chapters" ON public.course_chapters;
DROP POLICY IF EXISTS "Anyone can view published content" ON public.course_content;
DROP POLICY IF EXISTS "Anyone can view lessons for published courses" ON public.course_lessons;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admins can manage chapters" ON public.course_chapters;
DROP POLICY IF EXISTS "Admins can manage content" ON public.course_content;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.course_lessons;

-- Create RLS policies for public access to published content
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published modules" ON public.course_modules
  FOR SELECT USING (
    is_published = true AND 
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE course_id = course_modules.course_id 
      AND is_published = true
    )
  );

CREATE POLICY "Anyone can view published chapters" ON public.course_chapters
  FOR SELECT USING (
    is_published = true AND 
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE course_id = course_chapters.course_id 
      AND is_published = true
    )
  );

CREATE POLICY "Anyone can view published content" ON public.course_content
  FOR SELECT USING (
    status = 'published' AND 
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE course_id = course_content.course_id 
      AND is_published = true
    )
  );

CREATE POLICY "Anyone can view lessons for published courses" ON public.course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE course_id = course_lessons.course_id 
      AND is_published = true
    )
  );

-- Add admin policies for management
CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can manage modules" ON public.course_modules
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can manage chapters" ON public.course_chapters
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can manage content" ON public.course_content
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

CREATE POLICY "Admins can manage lessons" ON public.course_lessons
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin'::text) OR 
    public.has_role(auth.uid(), 'super_admin'::text)
  );

-- Create triggers to update course statistics
CREATE OR REPLACE FUNCTION update_course_stats_on_module_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE courses SET 
            module_count = (
                SELECT COUNT(*) FROM course_modules WHERE course_id = NEW.course_id
            ),
            updated_at = NOW()
        WHERE course_id = NEW.course_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE courses SET 
            module_count = (
                SELECT COUNT(*) FROM course_modules WHERE course_id = OLD.course_id
            ),
            updated_at = NOW()
        WHERE course_id = OLD.course_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_course_stats_on_chapter_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE courses SET 
            chapter_count = (
                SELECT COUNT(*) FROM course_chapters WHERE course_id = NEW.course_id
            ),
            updated_at = NOW()
        WHERE course_id = NEW.course_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE courses SET 
            chapter_count = (
                SELECT COUNT(*) FROM course_chapters WHERE course_id = OLD.course_id
            ),
            updated_at = NOW()
        WHERE course_id = OLD.course_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_course_stats_on_content_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE courses SET 
            problem_count = (
                SELECT COUNT(*) FROM course_content WHERE course_id = NEW.course_id
            ),
            updated_at = NOW()
        WHERE course_id = NEW.course_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE courses SET 
            problem_count = (
                SELECT COUNT(*) FROM course_content WHERE course_id = OLD.course_id
            ),
            updated_at = NOW()
        WHERE course_id = OLD.course_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist and recreate them
DROP TRIGGER IF EXISTS trigger_update_course_stats_on_module_change ON course_modules;
DROP TRIGGER IF EXISTS trigger_update_course_stats_on_chapter_change ON course_chapters;
DROP TRIGGER IF EXISTS trigger_update_course_stats_on_content_change ON course_content;

CREATE TRIGGER trigger_update_course_stats_on_module_change
    AFTER INSERT OR UPDATE OR DELETE ON course_modules
    FOR EACH ROW EXECUTE FUNCTION update_course_stats_on_module_change();

CREATE TRIGGER trigger_update_course_stats_on_chapter_change
    AFTER INSERT OR UPDATE OR DELETE ON course_chapters
    FOR EACH ROW EXECUTE FUNCTION update_course_stats_on_chapter_change();

CREATE TRIGGER trigger_update_course_stats_on_content_change
    AFTER INSERT OR UPDATE OR DELETE ON course_content
    FOR EACH ROW EXECUTE FUNCTION update_course_stats_on_content_change();
