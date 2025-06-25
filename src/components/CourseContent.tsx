
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProblemTable from "./ProblemTable";
import { toast } from "sonner";

interface CourseContentProps {
  selectedSheet: string;
  searchQuery: string;
  isEnrolled: boolean;
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

const CourseContent = ({ selectedSheet, searchQuery, isEnrolled }: CourseContentProps) => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<Step[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [expandedLectures, setExpandedLectures] = useState<string[]>([]);
  const [problemStatuses, setProblemStatuses] = useState<Record<number, "Solved" | "Attempted" | "Not Started">>({});
  const [bookmarkedProblems, setBookmarkedProblems] = useState<number[]>([]);
  const [problemNotes, setProblemNotes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateCourseData();
  }, [selectedSheet]);

  const generateCourseData = () => {
    // Generate mock data structure for the course
    const mockSteps: Step[] = [
      {
        id: "step-1",
        title: "Introduction to Data Structures",
        expanded: false,
        totalProblems: 5,
        completedProblems: 0,
        lectures: [
          {
            id: "lecture-1-1",
            title: "Arrays and Strings",
            expanded: false,
            totalProblems: 5,
            completedProblems: 0,
            problems: [
              {
                id: 1,
                title: "Two Sum",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Array", "Hash Table"],
                companies: ["Google", "Amazon"],
                hasArticle: true,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 15
              },
              {
                id: 2,
                title: "Valid Anagram",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Hash Table", "String"],
                companies: ["Facebook", "Microsoft"],
                hasArticle: true,
                hasVideo: false,
                hasPractice: true,
                estimatedTime: 20
              },
              {
                id: 3,
                title: "Group Anagrams",
                difficulty: "Medium",
                status: "Not Started",
                tags: ["Array", "Hash Table", "String"],
                companies: ["Amazon", "Uber"],
                hasArticle: true,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 30
              },
              {
                id: 4,
                title: "Top K Frequent Elements",
                difficulty: "Medium",
                status: "Not Started",
                tags: ["Array", "Hash Table", "Divide and Conquer"],
                companies: ["Amazon", "Facebook"],
                hasArticle: false,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 25
              },
              {
                id: 5,
                title: "Product of Array Except Self",
                difficulty: "Medium",
                status: "Not Started",
                tags: ["Array"],
                companies: ["Amazon", "Facebook", "Microsoft"],
                hasArticle: true,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 30
              }
            ]
          }
        ]
      },
      {
        id: "step-2",
        title: "Advanced Data Structures",
        expanded: false,
        totalProblems: 4,
        completedProblems: 0,
        lectures: [
          {
            id: "lecture-2-1",
            title: "Trees and Graphs",
            expanded: false,
            totalProblems: 4,
            completedProblems: 0,
            problems: [
              {
                id: 6,
                title: "Binary Tree Inorder Traversal",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Hash Table", "Stack", "Tree"],
                companies: ["Microsoft", "Facebook"],
                hasArticle: true,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 20
              },
              {
                id: 7,
                title: "Validate Binary Search Tree",
                difficulty: "Medium",
                status: "Not Started",
                tags: ["Tree", "Depth-First Search"],
                companies: ["Amazon", "Facebook"],
                hasArticle: true,
                hasVideo: false,
                hasPractice: true,
                estimatedTime: 25
              },
              {
                id: 8,
                title: "Number of Islands",
                difficulty: "Medium",
                status: "Not Started",
                tags: ["Array", "Depth-First Search", "Breadth-First Search"],
                companies: ["Amazon", "Google", "Facebook"],
                hasArticle: true,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 35
              },
              {
                id: 9,
                title: "Course Schedule",
                difficulty: "Medium",
                status: "Not Started",
                tags: ["Depth-First Search", "Breadth-First Search", "Graph"],
                companies: ["Facebook", "Zenefits"],
                hasArticle: false,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 40
              }
            ]
          }
        ]
      }
    ];

    setSteps(mockSteps);
    setLoading(false);
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
    if (!user || !isEnrolled) {
      toast.error("Please enroll in the course to track your progress");
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

    setProblemStatuses(prev => ({
      ...prev,
      [problemId]: newStatus
    }));

    // Update in database
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          problem_id: problemId.toString(),
          status: newStatus.toLowerCase().replace(' ', '_'),
          solved_at: newStatus === "Solved" ? new Date().toISOString() : null
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating problem status:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleToggleBookmark = (problemId: number) => {
    if (!user || !isEnrolled) {
      toast.error("Please enroll in the course to bookmark problems");
      return;
    }

    setBookmarkedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleOpenNoteDialog = (problemId: number, problemTitle: string) => {
    if (!user || !isEnrolled) {
      toast.error("Please enroll in the course to add notes");
      return;
    }
    // This would open a note dialog - for now just show a toast
    toast.info(`Note dialog for ${problemTitle} (ID: ${problemId})`);
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
        (problemStatuses[problem.id] || problem.status) === "Solved"
      ).length, 0
    );
    return totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0;
  };

  const calculateLectureProgress = (lecture: Lecture) => {
    const solvedProblems = lecture.problems.filter(problem => 
      (problemStatuses[problem.id] || problem.status) === "Solved"
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
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Course Content Locked</h3>
        <p className="text-gray-400 mb-4">
          Enroll in this course to access all problems and track your progress.
        </p>
      </div>
    );
  }

  return (
    <ProblemTable
      steps={steps}
      expandedSteps={expandedSteps}
      expandedLectures={expandedLectures}
      problemStatuses={problemStatuses}
      bookmarkedProblems={bookmarkedProblems}
      problemNotes={problemNotes}
      onToggleStep={handleToggleStep}
      onToggleLecture={handleToggleLecture}
      onToggleProblemStatus={handleToggleProblemStatus}
      onToggleBookmark={handleToggleBookmark}
      onOpenNoteDialog={handleOpenNoteDialog}
      applyAdvancedFilters={applyAdvancedFilters}
      calculateStepProgress={calculateStepProgress}
      calculateLectureProgress={calculateLectureProgress}
    />
  );
};

export default CourseContent;
