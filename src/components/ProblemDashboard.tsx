import { useState, useEffect } from "react";
import { Code, Bookmark, Minimize2, Maximize2, Trophy, Medal, Target, Crown, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressSection from "@/components/ProgressSection";
import StatsOverview from "@/components/StatsOverview";
import AdvancedFilter from "@/components/AdvancedFilter";
import ProblemTable from "@/components/ProblemTable";
import NoteDialog from "@/components/NoteDialog";
import CoursePageToolbar from "@/components/CoursePageToolbar";

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

interface Sheet {
  id: string;
  name: string;
  description: string;
  totalTime: number;
  completion: number;
  steps: Step[];
}

const mockSheets: Record<string, Sheet> = {
  "striver-a2z": {
    id: "striver-a2z",
    name: "Byteskill A2Z DSA Course",
    description: "This course is made for people who want to learn DSA from A to Z for free in a well-organized and structured manner. Master algorithms and data structures with our comprehensive curriculum.",
    totalTime: 2400,
    completion: 0,
    steps: [
      {
        id: "step1",
        title: "Step 1: Learn the basics",
        expanded: true,
        totalProblems: 31,
        completedProblems: 0,
        lectures: [
          {
            id: "lec1",
            title: "Lec 1: Things to Know in C++/Java/Python or any language",
            expanded: true,
            totalProblems: 9,
            completedProblems: 0,
            problems: [
              {
                id: 1,
                title: "User Input / Output",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Basics"],
                companies: [],
                hasArticle: true,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 15,
                article: "https://takeuforward.org/c/c-basic-input-output/",
                video: "https://www.youtube.com/watch?v=EAR7De6Goz4"
              },
              {
                id: 2,
                title: "Data Types",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Basics"],
                companies: [],
                hasArticle: true,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 20,
                article: "https://takeuforward.org/c/data-types-in-c/",
                video: "https://www.youtube.com/watch?v=EAR7De6Goz4"
              },
              {
                id: 3,
                title: "If Else statements",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Basics"],
                companies: [],
                hasArticle: true,
                hasVideo: true,
                hasPractice: true,
                estimatedTime: 25,
                article: "https://takeuforward.org/if-else/if-else-statements-in-c/",
                video: "https://www.youtube.com/watch?v=EAR7De6Goz4"
              },
              {
                id: 4,
                title: "Switch Statement",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Basics"],
                companies: [],
                hasArticle: true,
                hasVideo: true,
                hasPractice: false,
                article: "https://takeuforward.org/switch/switch-statement-in-c/",
                video: "https://www.youtube.com/watch?v=EAR7De6Goz4"
              },
              {
                id: 5,
                title: "What are arrays, strings?",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Array", "String"],
                companies: [],
                hasArticle: true,
                hasVideo: true,
                hasPractice: false,
                article: "https://takeuforward.org/arrays/introduction-to-arrays/",
                video: "https://www.youtube.com/watch?v=EAR7De6Goz4"
              },
              {
                id: 6,
                title: "For loops",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Loops"],
                companies: [],
                hasArticle: true,
                hasVideo: true,
                hasPractice: false,
                article: "https://takeuforward.org/loops/for-loop-in-c/",
                video: "https://www.youtube.com/watch?v=EAR7De6Goz4"
              },
              {
                id: 7,
                title: "While loops",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Loops"],
                companies: [],
                hasArticle: true,
                hasVideo: true,
                hasPractice: false,
                article: "https://takeuforward.org/loops/while-loop-in-c/",
                video: "https://www.youtube.com/watch?v=EAR7De6Goz4"
              },
              {
                id: 8,
                title: "Functions (Pass by Reference and Value)",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Functions"],
                companies: [],
                hasArticle: true,
                hasVideo: true,
                hasPractice: false,
                article: "https://takeuforward.org/functions/functions-in-c/",
                video: "https://www.youtube.com/watch?v=EAR7De6Goz4"
              },
              {
                id: 9,
                title: "Time Complexity (Learn Basics, and then analyse in next Steps)",
                difficulty: "Easy",
                status: "Not Started",
                tags: ["Time Complexity"],
                companies: [],
                hasArticle: true,
                hasVideo: true,
                hasPractice: false,
                article: "https://takeuforward.org/time-complexity/time-complexity-analysis/",
                video: "https://www.youtube.com/watch?v=EAR7De6Goz4"
              }
            ]
          },
          {
            id: "lec2",
            title: "Lec 2: Build-up Logical Thinking",
            expanded: false,
            totalProblems: 1,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec3",
            title: "Lec 3: Learn STL/Java-Collections or similar thing in your language",
            expanded: false,
            totalProblems: 1,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec4",
            title: "Lec 4: Know Basic Maths",
            expanded: false,
            totalProblems: 7,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec5",
            title: "Lec 5: Learn Basic Recursion",
            expanded: false,
            totalProblems: 9,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec6",
            title: "Lec 6: Learn Basic Hashing",
            expanded: false,
            totalProblems: 3,
            completedProblems: 0,
            problems: []
          }
        ]
      },
      {
        id: "step2",
        title: "Step 2: Learn Important Sorting Techniques",
        expanded: false,
        totalProblems: 7,
        completedProblems: 0,
        lectures: [
          {
            id: "lec7",
            title: "Lec 1: Sorting-I",
            expanded: false,
            totalProblems: 7,
            completedProblems: 0,
            problems: []
          }
        ]
      },
      {
        id: "step3",
        title: "Step 3: Solve Problems on Arrays [Easy -> Medium -> Hard]",
        expanded: false,
        totalProblems: 40,
        completedProblems: 0,
        lectures: [
          {
            id: "lec8",
            title: "Lec 1: Easy",
            expanded: false,
            totalProblems: 13,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec9",
            title: "Lec 2: Medium",
            expanded: false,
            totalProblems: 15,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec10",
            title: "Lec 3: Hard",
            expanded: false,
            totalProblems: 12,
            completedProblems: 0,
            problems: []
          }
        ]
      },
      {
        id: "step4",
        title: "Step 4: Binary Search [1D, 2D Arrays, Search Space]",
        expanded: false,
        totalProblems: 32,
        completedProblems: 0,
        lectures: [
          {
            id: "lec11",
            title: "Lec 1: Learning Binary Search on 1D Arrays",
            expanded: false,
            totalProblems: 8,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec12",
            title: "Lec 2: BS on Answers",
            expanded: false,
            totalProblems: 11,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec13",
            title: "Lec 3: BS on 2D Arrays",
            expanded: false,
            totalProblems: 4,
            completedProblems: 0,
            problems: []
          }
        ]
      },
      {
        id: "step5",
        title: "Step 5: Strings [Basic and Medium]",
        expanded: false,
        totalProblems: 15,
        completedProblems: 0,
        lectures: [
          {
            id: "lec14",
            title: "Lec 1: Basic and Easy String Problems",
            expanded: false,
            totalProblems: 8,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec15",
            title: "Lec 2: Medium String Problems",
            expanded: false,
            totalProblems: 7,
            completedProblems: 0,
            problems: []
          }
        ]
      },
      {
        id: "step6",
        title: "Step 6: Learn LinkedList [Single/Double LL, Medium, Hard Problems]",
        expanded: false,
        totalProblems: 31,
        completedProblems: 0,
        lectures: [
          {
            id: "lec16",
            title: "Lec 1: Learn 1D LinkedList",
            expanded: false,
            totalProblems: 9,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec17",
            title: "Lec 2: Learn Doubly LinkedList",
            expanded: false,
            totalProblems: 4,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec18",
            title: "Lec 3: Medium Problems of LL",
            expanded: false,
            totalProblems: 12,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec19",
            title: "Lec 4: Medium Problems of DLL",
            expanded: false,
            totalProblems: 2,
            completedProblems: 0,
            problems: []
          },
          {
            id: "lec20",
            title: "Lec 5: Hard Problems of LL",
            expanded: false,
            totalProblems: 4,
            completedProblems: 0,
            problems: []
          }
        ]
      }
    ]
  }
};

interface ProblemDashboardProps {
  selectedSheet: string;
  searchQuery: string;
}

const ProblemDashboard = ({ selectedSheet, searchQuery }: ProblemDashboardProps) => {
  const [expandedSteps, setExpandedSteps] = useState<string[]>(["step1"]);
  const [expandedLectures, setExpandedLectures] = useState<string[]>(["lec1"]);
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

  const sheet = mockSheets[selectedSheet] || mockSheets["striver-a2z"];

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

  const toggleBookmark = (problemId: number) => {
    setBookmarkedProblems(prev => 
      prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const toggleProblemStatus = (problemId: number) => {
    setProblemStatuses(prev => {
      const currentStatus = prev[problemId] || "Not Started";
      let nextStatus: "Solved" | "Attempted" | "Not Started";
      
      switch (currentStatus) {
        case "Not Started":
          nextStatus = "Attempted";
          break;
        case "Attempted":
          nextStatus = "Solved";
          break;
        case "Solved":
          nextStatus = "Not Started";
          break;
        default:
          nextStatus = "Not Started";
      }
      
      return {
        ...prev,
        [problemId]: nextStatus
      };
    });
  };

  const collapseAllSteps = () => {
    if (allStepsCollapsed) {
      setExpandedSteps(sheet.steps.map(step => step.id));
    } else {
      setExpandedSteps([]);
    }
    setAllStepsCollapsed(!allStepsCollapsed);
  };

  const collapseAllLectures = () => {
    if (allLecturesCollapsed) {
      const allLectureIds = sheet.steps.flatMap(step => step.lectures.map(lecture => lecture.id));
      setExpandedLectures(allLectureIds);
    } else {
      setExpandedLectures([]);
    }
    setAllLecturesCollapsed(!allLecturesCollapsed);
  };

  const filteredStepsAndLectures = () => {
    if (selectedTab !== "revision") {
      return sheet.steps;
    }

    // Filter to show only steps and lectures that contain bookmarked problems
    return sheet.steps.map(step => ({
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

  // Calculate progress statistics with dynamic updates
  const calculateProgress = () => {
    const allProblems = sheet.steps.flatMap(step => 
      step.lectures.flatMap(lecture => lecture.problems)
    );
    
    const totalProblems = 455;
    const easyTotal = 131;
    const mediumTotal = 187;
    const hardTotal = 136;
    
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
      total: { solved: totalSolved, total: totalProblems, percentage: Math.round((totalSolved / totalProblems) * 100) },
      easy: { solved: easySolved, total: easyTotal, percentage: Math.round((easySolved / easyTotal) * 100) },
      medium: { solved: mediumSolved, total: mediumTotal, percentage: Math.round((mediumSolved / mediumTotal) * 100) },
      hard: { solved: hardSolved, total: hardTotal, percentage: Math.round((hardSolved / hardTotal) * 100) }
    };
  };

  // Calculate step and lecture progress
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

  // Calculate points and awards
  const calculatePointsAndAwards = () => {
    const allProblems = sheet.steps.flatMap(step => 
      step.lectures.flatMap(lecture => lecture.problems)
    );
    
    let totalPoints = 0;
    let totalArticlesRead = 0;
    let totalVideosWatched = 0;
    
    allProblems.forEach(problem => {
      const status = problemStatuses[problem.id] || problem.status;
      if (status === "Solved") {
        // Points based on difficulty
        switch (problem.difficulty) {
          case "Easy": totalPoints += 10; break;
          case "Medium": totalPoints += 25; break;
          case "Hard": totalPoints += 50; break;
        }
      }
      // Simulate articles read and videos watched (in real app, track these separately)
      if (problem.hasArticle && Math.random() > 0.7) totalArticlesRead++;
      if (problem.hasVideo && Math.random() > 0.8) totalVideosWatched++;
    });

    const awards = [];
    if (progress.total.solved >= 50) awards.push({ name: "Problem Solver", icon: Trophy, color: "text-yellow-400" });
    if (progress.easy.solved >= 20) awards.push({ name: "Easy Master", icon: Medal, color: "text-green-400" });
    if (progress.medium.solved >= 15) awards.push({ name: "Medium Challenger", icon: Target, color: "text-yellow-400" });
    if (progress.hard.solved >= 5) awards.push({ name: "Hard Warrior", icon: Crown, color: "text-red-400" });
    if (totalArticlesRead >= 30) awards.push({ name: "Knowledge Seeker", icon: Brain, color: "text-blue-400" });
    if (totalVideosWatched >= 20) awards.push({ name: "Video Learner", icon: Zap, color: "text-purple-400" });

    return { totalPoints, totalArticlesRead, totalVideosWatched, awards };
  };

  const progress = calculateProgress();
  const { totalPoints, totalArticlesRead, totalVideosWatched, awards } = calculatePointsAndAwards();

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

  return (
    <div className="text-white space-y-4 sm:space-y-6 bg-black min-h-screen px-2 sm:px-4 lg:px-0">
      {/* Enhanced Header Section with Dark Black Background */}
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
                  {sheet.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-semibold text-xs">
                    Free Course
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-semibold text-xs">
                    450+ Problems
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-semibold text-xs">
                    Complete DSA
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed text-center sm:text-left">
              {sheet.description}
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

        {/* Course Page Toolbar - Always show default options */}
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

        {/* Enhanced Filter Tabs */}
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
