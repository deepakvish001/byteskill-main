
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProblemTable from "./ProblemTable";
import NoteDialog from "./NoteDialog";
import { toast } from "sonner";
import { useProgressHandler } from "@/hooks/useProgressHandler";

interface CourseContentProps {
  selectedSheet: string;
  searchQuery: string;
  isEnrolled: boolean;
  allStepsCollapsed?: boolean;
  allLecturesCollapsed?: boolean;
  revisionMode?: boolean;
}

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Solved" | "Attempted" | "Not Started";
  tags: string[];
  companies: string[];
  timeSpent?: number;
  rating?: number;
  bookmarked?: boolean;
  article?: string;
  video?: string;
  notes?: string;
  hasArticle?: boolean;
  hasVideo?: boolean;
  hasPractice?: boolean;
  estimatedTime?: number;
  practice_link?: string;
  description?: string;
  content_id?: string;
}

interface Lecture {
  id: string;
  title: string;
  problems: Problem[];
  expanded: boolean;
  totalProblems: number;
  completedProblems: number;
}

interface Step {
  id: string;
  title: string;
  lectures: Lecture[];
  expanded: boolean;
  totalProblems: number;
  completedProblems: number;
}

const CourseContent = ({ 
  selectedSheet, 
  searchQuery, 
  isEnrolled, 
  allStepsCollapsed = false,
  allLecturesCollapsed = false,
  revisionMode = false
}: CourseContentProps) => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<Step[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [expandedLectures, setExpandedLectures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<{ id: number; title: string } | null>(null);
  const [contentIdMap, setContentIdMap] = useState<Record<number, string>>({});

  const {
    progressState,
    fetchUserProgress,
    toggleProblemStatus,
    toggleBookmark,
    saveNote
  } = useProgressHandler(selectedSheet);

  // Handle collapse/expand controls from parent
  useEffect(() => {
    if (allStepsCollapsed) {
      setExpandedSteps([]);
    } else {
      setExpandedSteps(steps.map(step => step.id));
    }
  }, [allStepsCollapsed, steps]);

  useEffect(() => {
    if (allLecturesCollapsed) {
      setExpandedLectures([]);
    } else {
      const allLectureIds = steps.flatMap(step => step.lectures.map(lecture => lecture.id));
      setExpandedLectures(allLectureIds);
    }
  }, [allLecturesCollapsed, steps]);

  useEffect(() => {
    if (selectedSheet && isEnrolled) {
      fetchCourseData();
    } else {
      setSteps([]);
      setLoading(false);
    }
  }, [selectedSheet, isEnrolled, user]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch modules for this course
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', selectedSheet)
        .eq('is_published', true)
        .order('module_order');

      if (modulesError) throw modulesError;

      if (!modules || modules.length === 0) {
        setSteps([]);
        setLoading(false);
        return;
      }

      // Fetch chapters for all modules
      const moduleIds = modules.map(m => m.id);
      const { data: chapters, error: chaptersError } = await supabase
        .from('course_chapters')
        .select('*')
        .in('module_id', moduleIds)
        .eq('is_published', true)
        .order('chapter_order');

      if (chaptersError) throw chaptersError;

      // Fetch content for all chapters
      const chapterIds = chapters?.map(c => c.id) || [];
      const { data: content, error: contentError } = await supabase
        .from('course_content')
        .select('*')
        .in('chapter_id', chapterIds)
        .eq('status', 'published')
        .order('content_order');

      if (contentError) throw contentError;

      // Create content ID mapping
      const idMap: Record<number, string> = {};
      
      // Transform data to match the expected structure
      const transformedSteps: Step[] = modules.map(module => {
        const moduleChapters = chapters?.filter(c => c.module_id === module.id) || [];
        
        const lectures: Lecture[] = moduleChapters.map(chapter => {
          const chapterContent = content?.filter(c => c.chapter_id === chapter.id) || [];
          
          const problems: Problem[] = chapterContent.map(item => {
            const problemId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16);
            idMap[problemId] = item.id;
            
            return {
              id: problemId,
              title: item.title,
              difficulty: (item.difficulty as "Easy" | "Medium" | "Hard") || "Easy",
              status: "Not Started" as const,
              tags: item.tags || [],
              companies: [],
              hasArticle: !!item.article_content,
              hasVideo: !!item.video_url,
              hasPractice: !!item.practice_link,
              estimatedTime: item.estimated_time_minutes || 30,
              article: item.article_content || undefined,
              video: item.video_url || undefined,
              practice_link: item.practice_link || undefined,
              description: item.description || undefined,
              content_id: item.id
            };
          });

          return {
            id: chapter.id,
            title: chapter.title,
            problems,
            expanded: false,
            totalProblems: problems.length,
            completedProblems: 0
          };
        });

        return {
          id: module.id,
          title: module.title,
          lectures,
          expanded: false,
          totalProblems: lectures.reduce((sum, l) => sum + l.totalProblems, 0),
          completedProblems: 0
        };
      });

      setSteps(transformedSteps);
      setContentIdMap(idMap);
      
      // Fetch user progress after setting up the content
      if (user) {
        await fetchUserProgress(idMap);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course content');
      setSteps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = (stepId: string) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const handleToggleLecture = (lectureId: string) => {
    setExpandedLectures(prev => 
      prev.includes(lectureId) 
        ? prev.filter(id => id !== lectureId)
        : [...prev, lectureId]
    );
  };

  const handleToggleProblemStatus = async (problemId: number) => {
    const contentId = contentIdMap[problemId];
    if (!contentId) {
      console.error('Content ID not found for problem:', problemId);
      toast.error('Failed to update progress - content not found');
      return;
    }

    const moduleId = findModuleIdByProblemId(problemId);
    const chapterId = findChapterIdByProblemId(problemId);
    
    await toggleProblemStatus(problemId, contentId, moduleId, chapterId);
  };

  const handleToggleBookmark = async (problemId: number) => {
    const contentId = contentIdMap[problemId];
    if (!contentId) {
      console.error('Content ID not found for problem:', problemId);
      toast.error('Failed to update bookmark - content not found');
      return;
    }

    const moduleId = findModuleIdByProblemId(problemId);
    const chapterId = findChapterIdByProblemId(problemId);
    
    await toggleBookmark(problemId, contentId, moduleId, chapterId);
  };

  const handleOpenNoteDialog = (problemId: number, problemTitle: string) => {
    if (!user) {
      toast.error("Please sign in to add notes");
      return;
    }
    setCurrentProblem({ id: problemId, title: problemTitle });
    setNoteDialogOpen(true);
  };

  const handleSaveNote = async (noteContent: string) => {
    if (!user || !currentProblem) return;

    const contentId = contentIdMap[currentProblem.id];
    if (!contentId) {
      console.error('Content ID not found for problem:', currentProblem.id);
      toast.error('Failed to save note - content not found');
      return;
    }

    const moduleId = findModuleIdByProblemId(currentProblem.id);
    const chapterId = findChapterIdByProblemId(currentProblem.id);
    
    await saveNote(currentProblem.id, contentId, moduleId, chapterId, noteContent);
  };

  // Helper functions to find IDs
  const findModuleIdByProblemId = (problemId: number): string => {
    for (const step of steps) {
      for (const lecture of step.lectures) {
        if (lecture.problems.find(p => p.id === problemId)) {
          return step.id;
        }
      }
    }
    return '';
  };

  const findChapterIdByProblemId = (problemId: number): string => {
    for (const step of steps) {
      for (const lecture of step.lectures) {
        if (lecture.problems.find(p => p.id === problemId)) {
          return lecture.id;
        }
      }
    }
    return '';
  };

  const applyAdvancedFilters = (problems: Problem[]) => {
    return problems.filter(problem => 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const calculateStepProgress = (step: Step) => {
    const totalProblems = step.lectures.reduce((sum, lecture) => sum + lecture.problems.length, 0);
    const solvedProblems = step.lectures.reduce((sum, lecture) => 
      sum + lecture.problems.filter(problem => 
        (progressState.problemStatuses[problem.id] || problem.status) === "Solved"
      ).length, 0
    );
    return totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0;
  };

  const calculateLectureProgress = (lecture: Lecture) => {
    const solvedProblems = lecture.problems.filter(problem => 
      (progressState.problemStatuses[problem.id] || problem.status) === "Solved"
    ).length;
    return lecture.problems.length > 0 ? (solvedProblems / lecture.problems.length) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Course Content Locked</h3>
        <p className="text-gray-400 mb-4">
          Enroll in this course to access all problems and track your progress.
        </p>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">No Content Available</h3>
        <p className="text-gray-400 mb-4">
          This course doesn't have any modules or chapters yet. Content will appear here once available.
        </p>
      </div>
    );
  }

  // Filter problems for revision mode
  const filteredSteps = revisionMode 
    ? steps.map(step => ({
        ...step,
        lectures: step.lectures.map(lecture => ({
          ...lecture,
          problems: lecture.problems.filter(problem => 
            (progressState.problemStatuses[problem.id] || problem.status) === "Solved" ||
            progressState.bookmarkedProblems.includes(problem.id)
          )
        })).filter(lecture => lecture.problems.length > 0)
      })).filter(step => step.lectures.length > 0)
    : steps;

  return (
    <>
      <ProblemTable
        steps={filteredSteps}
        expandedSteps={expandedSteps}
        expandedLectures={expandedLectures}
        problemStatuses={progressState.problemStatuses}
        bookmarkedProblems={progressState.bookmarkedProblems}
        problemNotes={progressState.problemNotes}
        onToggleStep={handleToggleStep}
        onToggleLecture={handleToggleLecture}
        onToggleProblemStatus={handleToggleProblemStatus}
        onToggleBookmark={handleToggleBookmark}
        onOpenNoteDialog={handleOpenNoteDialog}
        applyAdvancedFilters={applyAdvancedFilters}
        calculateStepProgress={calculateStepProgress}
        calculateLectureProgress={calculateLectureProgress}
      />
      
      {currentProblem && (
        <NoteDialog
          open={noteDialogOpen}
          onOpenChange={setNoteDialogOpen}
          noteTitle={`Notes for: ${currentProblem.title}`}
          noteContent={progressState.problemNotes[currentProblem.id] || ""}
          onSave={handleSaveNote}
        />
      )}
    </>
  );
};

export default CourseContent;
