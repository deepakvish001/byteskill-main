import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Code, Bookmark, Trophy, Medal, Target, Crown, Brain, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressSection from "@/components/ProgressSection";
import StatsOverview from "@/components/StatsOverview";
import ProblemTable from "@/components/ProblemTable";
import NoteDialog from "@/components/NoteDialog";
import CoursePageToolbar from "@/components/CoursePageToolbar";
import { toast } from "sonner";

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

interface ProblemDashboardProps {
  selectedSheet: string;
  searchQuery: string;
  userId?: string;
}

const ProblemDashboard = ({ selectedSheet, searchQuery, userId }: ProblemDashboardProps) => {
  const { user } = useAuth();
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [expandedLectures, setExpandedLectures] = useState<string[]>([]);
  const [bookmarkedProblems, setBookmarkedProblems] = useState<number[]>([]);
  const [problemNotes, setProblemNotes] = useState<Record<number, string>>({});
  const [selectedTab, setSelectedTab] = useState<"all" | "revision">("all");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentProblemId, setCurrentProblemId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [problemStatuses, setProblemStatuses] = useState<Record<number, "Solved" | "Attempted" | "Not Started">>({});
  const [allStepsCollapsed, setAllStepsCollapsed] = useState(false);
  const [allLecturesCollapsed, setAllLecturesCollapsed] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    difficulty: "all",
    status: "all",
    hasArticle: false,
    hasVideo: false,
    hasPractice: false,
    searchQuery: ""
  });

  // Fetch course data with real-time updates
  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ['course-content', selectedSheet],
    queryFn: async () => {
      // Fetch course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('course_id', selectedSheet)
        .single();

      if (courseError) throw courseError;

      // Fetch modules
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', selectedSheet)
        .eq('is_published', true)
        .order('module_order');

      if (modulesError) throw modulesError;

      // If no modules, return empty structure
      if (!modules || modules.length === 0) {
        return { course, steps: [] };
      }

      // Fetch chapters
      const moduleIds = modules.map(m => m.id);
      const { data: chapters, error: chaptersError } = await supabase
        .from('course_chapters')
        .select('*')
        .in('module_id', moduleIds)
        .eq('is_published', true)
        .order('chapter_order');

      if (chaptersError) throw chaptersError;

      // Fetch content
      const chapterIds = chapters?.map(c => c.id) || [];
      const { data: content, error: contentError } = await supabase
        .from('course_content')
        .select('*')
        .in('chapter_id', chapterIds)
        .eq('status', 'published')
        .order('content_order');

      if (contentError) throw contentError;

      // Transform to Step structure
      const steps: Step[] = modules.map(module => {
        const moduleChapters = chapters?.filter(c => c.module_id === module.id) || [];
        
        const lectures: Lecture[] = moduleChapters.map(chapter => {
          const chapterContent = content?.filter(c => c.chapter_id === chapter.id) || [];
          
          const problems: Problem[] = chapterContent.map(item => ({
            id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16),
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
            notes: undefined
          }));

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

      return { course, steps };
    },
    enabled: !!selectedSheet,
  });

  // Fetch user progress
  const { data: userProgress } = useQuery({
    queryKey: ['user-progress', selectedSheet, userId || user?.id],
    queryFn: async () => {
      const targetUserId = userId || user?.id;
      if (!targetUserId) return null;

      const { data, error } = await supabase
        .from('user_content_progress')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('course_id', selectedSheet);

      if (error) throw error;
      return data || [];
    },
    enabled: !!(userId || user?.id) && !!selectedSheet,
  });

  // Update problem statuses and bookmarks when user progress loads
  useEffect(() => {
    if (userProgress) {
      const statuses: Record<number, "Solved" | "Attempted" | "Not Started"> = {};
      const bookmarks: number[] = [];
      const notes: Record<number, string> = {};

      userProgress.forEach(p => {
        const problemId = parseInt(p.content_id.replace(/-/g, '').substring(0, 8), 16);
        
        if (p.is_completed) {
          statuses[problemId] = "Solved";
        } else if (p.time_spent_minutes > 0) {
          statuses[problemId] = "Attempted";
        } else {
          statuses[problemId] = "Not Started";
        }

        if (p.is_bookmarked) {
          bookmarks.push(problemId);
        }

        if (p.notes) {
          notes[problemId] = p.notes;
        }
      });

      setProblemStatuses(statuses);
      setBookmarkedProblems(bookmarks);
      setProblemNotes(notes);
    }
  }, [userProgress]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const toggleLecture = (lectureId: string) => {
    setExpandedLectures(prev => 
      prev.includes(lectureId) 
        ? prev.filter(id => id !== lectureId)
        : [...prev, lectureId]
    );
  };

  const toggleBookmark = async (problemId: number) => {
    if (!user) {
      toast.error("Please log in to bookmark problems");
      return;
    }

    const isBookmarked = bookmarkedProblems.includes(problemId);
    
    try {
      // Update in database
      const contentId = findContentIdByProblemId(problemId);
      if (!contentId) return;

      const { error } = await supabase
        .from('user_content_progress')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          course_id: selectedSheet,
          module_id: findModuleIdByProblemId(problemId),
          chapter_id: findChapterIdByProblemId(problemId),
          is_bookmarked: !isBookmarked,
          bookmarked_at: !isBookmarked ? new Date().toISOString() : null
        });

      if (error) throw error;

      setBookmarkedProblems(prev => 
        isBookmarked 
          ? prev.filter(id => id !== problemId)
          : [...prev, problemId]
      );
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const toggleProblemStatus = async (problemId: number) => {
    if (!user) {
      toast.error("Please log in to track progress");
      return;
    }

    const currentStatus = problemStatuses[problemId] || "Not Started";
    let newStatus: "Solved" | "Attempted" | "Not Started";
    
    switch (currentStatus) {
      case "Not Started":
        newStatus = "Attempted";
        break;
      case "Attempted":
        newStatus = "Solved";
        break;
      case "Solved":
        newStatus = "Not Started";
        break;
      default:
        newStatus = "Not Started";
    }

    try {
      const contentId = findContentIdByProblemId(problemId);
      if (!contentId) return;

      const { error } = await supabase
        .from('user_content_progress')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          course_id: selectedSheet,
          module_id: findModuleIdByProblemId(problemId),
          chapter_id: findChapterIdByProblemId(problemId),
          is_completed: newStatus === "Solved",
          time_spent_minutes: newStatus !== "Not Started" ? 1 : 0,
          completed_at: newStatus === "Solved" ? new Date().toISOString() : null
        });

      if (error) throw error;

      setProblemStatuses(prev => ({
        ...prev,
        [problemId]: newStatus
      }));
    } catch (error) {
      console.error('Error updating problem status:', error);
      toast.error('Failed to update progress');
    }
  };

  // Helper functions
  const findContentIdByProblemId = (problemId: number): string => {
    if (!courseData?.steps) return '';
    for (const step of courseData.steps) {
      for (const lecture of step.lectures) {
        const problem = lecture.problems.find(p => p.id === problemId);
        if (problem) {
          return lecture.id;
        }
      }
    }
    return '';
  };

  const findModuleIdByProblemId = (problemId: number): string => {
    if (!courseData?.steps) return '';
    for (const step of courseData.steps) {
      for (const lecture of step.lectures) {
        if (lecture.problems.find(p => p.id === problemId)) {
          return step.id;
        }
      }
    }
    return '';
  };

  const findChapterIdByProblemId = (problemId: number): string => {
    if (!courseData?.steps) return '';
    for (const step of courseData.steps) {
      for (const lecture of step.lectures) {
        if (lecture.problems.find(p => p.id === problemId)) {
          return lecture.id;
        }
      }
    }
    return '';
  };

  const collapseAllSteps = () => {
    if (allStepsCollapsed) {
      setExpandedSteps(courseData?.steps.map(step => step.id) || []);
    } else {
      setExpandedSteps([]);
    }
    setAllStepsCollapsed(!allStepsCollapsed);
  };

  const collapseAllLectures = () => {
    if (allLecturesCollapsed) {
      const allLectureIds = courseData?.steps.flatMap(step => step.lectures.map(lecture => lecture.id)) || [];
      setExpandedLectures(allLectureIds);
    } else {
      setExpandedLectures([]);
    }
    setAllLecturesCollapsed(!allLecturesCollapsed);
  };

  const filteredStepsAndLectures = () => {
    if (!courseData?.steps) return [];
    
    if (selectedTab !== "revision") {
      return courseData.steps;
    }

    return courseData.steps.map(step => ({
      ...step,
      lectures: step.lectures.map(lecture => ({
        ...lecture,
        problems: lecture.problems.filter(problem => bookmarkedProblems.includes(problem.id))
      })).filter(lecture => lecture.problems.length > 0)
    })).filter(step => step.lectures.length > 0);
  };

  const applyAdvancedFilters = (problems: Problem[]) => {
    return problems.filter(problem => {
      const currentStatus = problemStatuses[problem.id] || problem.status;
      const matchesSearch = problem.title.toLowerCase().includes(advancedFilters.searchQuery.toLowerCase());
      const matchesDifficulty = advancedFilters.difficulty === "all" || problem.difficulty === advancedFilters.difficulty;
      const matchesStatus = advancedFilters.status === "all" || currentStatus === advancedFilters.status;
      const matchesArticle = !advancedFilters.hasArticle || problem.hasArticle;
      const matchesVideo = !advancedFilters.hasVideo || problem.hasVideo;
      const matchesPractice = !advancedFilters.hasPractice || problem.hasPractice;
      
      return matchesSearch && matchesDifficulty && matchesStatus && matchesArticle && matchesVideo && matchesPractice;
    });
  };

  const calculateProgress = () => {
    if (!courseData?.steps) {
      return {
        total: { solved: 0, total: 0, percentage: 0 },
        easy: { solved: 0, total: 0, percentage: 0 },
        medium: { solved: 0, total: 0, percentage: 0 },
        hard: { solved: 0, total: 0, percentage: 0 }
      };
    }

    const allProblems = courseData.steps.flatMap(step => 
      step.lectures.flatMap(lecture => lecture.problems)
    );
    
    const easyProblems = allProblems.filter(p => p.difficulty === "Easy");
    const mediumProblems = allProblems.filter(p => p.difficulty === "Medium");
    const hardProblems = allProblems.filter(p => p.difficulty === "Hard");
    
    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    
    allProblems.forEach(problem => {
      const status = problemStatuses[problem.id] || problem.status;
      if (status === "Solved") {
        totalSolved++;
        switch (problem.difficulty) {
          case "Easy":
            easySolved++;
            break;
          case "Medium":
            mediumSolved++;
            break;
          case "Hard":
            hardSolved++;
            break;
        }
      }
    });
    
    return {
      total: { solved: totalSolved, total: allProblems.length, percentage: Math.round((totalSolved / (allProblems.length || 1)) * 100) },
      easy: { solved: easySolved, total: easyProblems.length, percentage: Math.round((easySolved / (easyProblems.length || 1)) * 100) },
      medium: { solved: mediumSolved, total: mediumProblems.length, percentage: Math.round((mediumSolved / (mediumProblems.length || 1)) * 100) },
      hard: { solved: hardSolved, total: hardProblems.length, percentage: Math.round((hardSolved / (hardProblems.length || 1)) * 100) }
    };
  };

  const calculateStepProgress = (step: Step) => {
    const stepProblems = step.lectures.flatMap(lecture => lecture.problems);
    const solvedProblems = stepProblems.filter(problem => 
      (problemStatuses[problem.id] || problem.status) === "Solved"
    );
    return stepProblems.length > 0 ? Math.round((solvedProblems.length / stepProblems.length) * 100) : 0;
  };

  const calculateLectureProgress = (lecture: Lecture) => {
    const solvedProblems = lecture.problems.filter(problem => 
      (problemStatuses[problem.id] || problem.status) === "Solved"
    );
    return lecture.problems.length > 0 ? Math.round((solvedProblems.length / lecture.problems.length) * 100) : 0;
  };

  const progress = calculateProgress();
  const { totalPoints, totalArticlesRead, totalVideosWatched, awards } = {
    totalPoints: progress.total.solved * 15,
    totalArticlesRead: Math.floor(progress.total.solved * 0.7),
    totalVideosWatched: Math.floor(progress.total.solved * 0.5),
    awards: []
  };

  const openNoteDialog = (problemId: number, problemTitle: string) => {
    setCurrentProblemId(problemId);
    setNoteTitle(`Notes for: ${problemTitle}`);
    setNoteContent(problemNotes[problemId] || "");
    setNoteDialogOpen(true);
  };

  const saveNote = (content: string) => {
    if (currentProblemId) {
      setProblemNotes(prev => ({
        ...prev,
        [currentProblemId]: content
      }));
      setCurrentProblemId(null);
      setNoteContent("");
      setNoteTitle("");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Course</h3>
          <p className="text-gray-400">There was an error loading the course content. Please try again later.</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!courseData?.course) {
    return (
      <div className="text-center py-12">
        <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">Course Not Found</h3>
        <p className="text-gray-500">The requested course could not be found or is not available.</p>
      </div>
    );
  }

  // No content state
  if (!courseData.steps || courseData.steps.length === 0) {
    return (
      <div className="text-white space-y-4 sm:space-y-6 bg-black min-h-screen px-2 sm:px-4 lg:px-0">
        {/* Course Header */}
        <div className="bg-black space-y-4 sm:space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-xl"></div>
            <div className="relative bg-black backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    {courseData.course.title}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-semibold text-xs">
                      {courseData.course.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed text-center sm:text-left">
                {courseData.course.description}
              </p>
            </div>
          </div>
        </div>

        {/* No Content Message */}
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Content Available</h3>
          <p className="text-gray-500">
            This course doesn't have any modules or problems yet. Content will appear here once the course is properly structured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white space-y-4 sm:space-y-6 bg-black min-h-screen px-2 sm:px-4 lg:px-0">
      {/* Enhanced Header Section */}
      <div className="bg-black space-y-4 sm:space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-xl"></div>
          <div className="relative bg-black backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Code className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  {courseData.course.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-semibold text-xs">
                    {courseData.course.is_premium ? 'Premium' : 'Free'} Course
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-semibold text-xs">
                    {progress.total.total} Problems
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-semibold text-xs">
                    {courseData.course.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed text-center sm:text-left">
              {courseData.course.description}
            </p>
          </div>
        </div>

        <StatsOverview 
          totalPoints={totalPoints}
          totalArticlesRead={totalArticlesRead}
          totalVideosWatched={totalVideosWatched}
          awards={awards}
        />

        <ProgressSection progress={progress} />

        <CoursePageToolbar
          onRevisionModeToggle={() => setSelectedTab(selectedTab === "revision" ? "all" : "revision")}
          onCollapseAllSteps={collapseAllSteps}
          onExpandAllSteps={() => collapseAllSteps()}
          onCollapseAllLectures={collapseAllLectures}
          onExpandAllLectures={() => collapseAllLectures()}
          allStepsCollapsed={allStepsCollapsed}
          allLecturesCollapsed={allLecturesCollapsed}
          filters={advancedFilters}
          onFiltersChange={setAdvancedFilters}
        />

        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            onClick={() => setSelectedTab("all")}
            className={`px-3 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
              selectedTab === "all" 
                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
            }`}
          >
            All Problems
          </Button>
          <Button 
            onClick={() => setSelectedTab("revision")}
            className={`px-3 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
              selectedTab === "revision" 
                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
            }`}
          >
            <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Revision ({bookmarkedProblems.length})
          </Button>
        </div>
      </div>

      <ProblemTable 
        steps={filteredStepsAndLectures()}
        expandedSteps={expandedSteps}
        expandedLectures={expandedLectures}
        problemStatuses={problemStatuses}
        bookmarkedProblems={bookmarkedProblems}
        problemNotes={problemNotes}
        onToggleStep={toggleStep}
        onToggleLecture={toggleLecture}
        onToggleProblemStatus={toggleProblemStatus}
        onToggleBookmark={toggleBookmark}
        onOpenNoteDialog={openNoteDialog}
        applyAdvancedFilters={applyAdvancedFilters}
        calculateStepProgress={calculateStepProgress}
        calculateLectureProgress={calculateLectureProgress}
      />

      <NoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        noteTitle={noteTitle}
        noteContent={noteContent}
        onSave={saveNote}
      />
    </div>
  );
};

export default ProblemDashboard;
