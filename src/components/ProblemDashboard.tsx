import { useState, useEffect } from "react";
import { Play, ExternalLink, BookOpen, Video, FileText, Clock, Filter, Search, Star, Bookmark, CheckCircle2, Circle, X, ChevronDown, ChevronRight, Plus, Save, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

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
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bookmarkedProblems, setBookmarkedProblems] = useState<number[]>([]);
  const [problemNotes, setProblemNotes] = useState<Record<number, string>>({});
  const [selectedTab, setSelectedTab] = useState<"all" | "revision">("all");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentProblemId, setCurrentProblemId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [problemStatuses, setProblemStatuses] = useState<Record<number, "Solved" | "Attempted" | "Not Started">>({});

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

  const addNote = (problemId: number, note: string) => {
    setProblemNotes(prev => ({
      ...prev,
      [problemId]: note
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-400";
      case "Medium": return "text-yellow-400";  
      case "Hard": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getStatusCheckbox = (problemId: number, status: string, onClick?: () => void) => {
    const currentStatus = problemStatuses[problemId] || status;
    const baseClasses = "w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110";
    
    switch (currentStatus) {
      case "Solved":
        return (
          <div className={`${baseClasses} bg-green-500 border-green-500`} onClick={onClick}>
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        );
      case "Attempted":
        return (
          <div className={`${baseClasses} bg-yellow-500 border-yellow-500`} onClick={onClick}>
            <Circle className="w-2 h-2 text-white fill-white" />
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} border-gray-500 hover:border-gray-400`} onClick={onClick}></div>
        );
    }
  };

  const handleRandomProblem = () => {
    const allProblems = sheet.steps.flatMap(step => 
      step.lectures.flatMap(lecture => lecture.problems)
    );
    if (allProblems.length > 0) {
      const randomProblem = allProblems[Math.floor(Math.random() * allProblems.length)];
      console.log("Random problem selected:", randomProblem.title);
      // Here you could navigate to the problem or show it in a modal
    }
  };

  const filteredProblems = (problems: Problem[]) => {
    return problems.filter(problem => {
      const currentStatus = problemStatuses[problem.id] || problem.status;
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;
      const matchesTab = selectedTab === "all" || (selectedTab === "revision" && bookmarkedProblems.includes(problem.id));
      
      return matchesSearch && matchesDifficulty && matchesStatus && matchesTab;
    });
  };

  // Calculate progress statistics
  const calculateProgress = () => {
    const allProblems = sheet.steps.flatMap(step => 
      step.lectures.flatMap(lecture => lecture.problems)
    );
    
    const totalProblems = 455; // Total DSA problems
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

  const progress = calculateProgress();

  const openNoteDialog = (problemId: number, problemTitle: string) => {
    setCurrentProblemId(problemId);
    setNoteTitle(`Notes for: ${problemTitle}`);
    setNoteContent(problemNotes[problemId] || "");
    setNoteDialogOpen(true);
  };

  const saveNote = () => {
    if (currentProblemId) {
      setProblemNotes(prev => ({
        ...prev,
        [currentProblemId]: noteContent
      }));
      setNoteDialogOpen(false);
      setCurrentProblemId(null);
      setNoteContent("");
      setNoteTitle("");
    }
  };

  return (
    <div className="text-white space-y-6 bg-black min-h-screen">
      {/* Enhanced Header Section with Dark Black Background */}
      <div className="bg-black space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-xl"></div>
          <div className="relative bg-black backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {sheet.name}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Free Course
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    450+ Problems
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {sheet.description}
            </p>
          </div>
        </div>

        {/* Progress Section with Dark Black Background */}
        <div className="bg-black backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
            DSA Progress Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Progress */}
            <div className="bg-black rounded-lg p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Total Progress</span>
                </div>
                <span className="text-xs text-gray-400">{progress.total.percentage}%</span>
              </div>
              <div className="text-lg font-bold text-blue-400 mb-2">
                {progress.total.solved} / {progress.total.total}
              </div>
              <Progress value={progress.total.percentage} className="h-2" />
            </div>

            {/* Easy Progress */}
            <div className="bg-black rounded-lg p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Easy</span>
                </div>
                <span className="text-xs text-gray-400">{progress.easy.percentage}%</span>
              </div>
              <div className="text-lg font-bold text-green-400 mb-2">
                {progress.easy.solved} / {progress.easy.total} completed
              </div>
              <Progress value={progress.easy.percentage} className="h-2" />
            </div>

            {/* Medium Progress */}
            <div className="bg-black rounded-lg p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">Medium</span>
                </div>
                <span className="text-xs text-gray-400">{progress.medium.percentage}%</span>
              </div>
              <div className="text-lg font-bold text-yellow-400 mb-2">
                {progress.medium.solved} / {progress.medium.total} completed
              </div>
              <Progress value={progress.medium.percentage} className="h-2" />
            </div>

            {/* Hard Progress */}
            <div className="bg-black rounded-lg p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-gray-300">Hard</span>
                </div>
                <span className="text-xs text-gray-400">{progress.hard.percentage}%</span>
              </div>
              <div className="text-lg font-bold text-red-400 mb-2">
                {progress.hard.solved} / {progress.hard.total} completed
              </div>
              <Progress value={progress.hard.percentage} className="h-2" />
            </div>
          </div>
        </div>

        {/* Enhanced Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            <Button 
              onClick={() => setSelectedTab("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTab === "all" 
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
              }`}
            >
              All Problems
            </Button>
            <Button 
              onClick={() => setSelectedTab("revision")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTab === "revision" 
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
              }`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Revision ({bookmarkedProblems.length})
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search problems..." 
                className="pl-10 w-64 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 rounded-lg" 
                value={searchQuery}
                readOnly
              />
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white rounded-lg">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Solved">Solved</SelectItem>
                <SelectItem value="Attempted">Attempted</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleRandomProblem}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-purple-600/20"
            >
              <Play className="w-4 h-4 mr-2" />
              Pick Random
            </Button>
          </div>
        </div>
      </div>

      {/* Steps and Lectures */}
      <div className="space-y-2">
        {sheet.steps.map((step) => (
          <div key={step.id} className="bg-black border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-900/50 transition-colors"
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex items-center space-x-3">
                {expandedSteps.includes(step.id) ? 
                  <ChevronDown className="w-5 h-5 text-orange-400" /> : 
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                }
                <span className="font-semibold text-white text-lg">{step.title}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-40 bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-700" style={{ width: '0%' }}></div>
                </div>
                <span className="text-sm text-gray-400 font-medium min-w-20">0 / {step.totalProblems}</span>
              </div>
            </div>

            {expandedSteps.includes(step.id) && (
              <div className="border-t border-gray-800">
                {step.lectures.map((lecture) => (
                  <div key={lecture.id}>
                    <div 
                      className="flex items-center justify-between p-4 pl-12 cursor-pointer hover:bg-gray-900/30 border-b border-gray-800/50 transition-colors"
                      onClick={() => toggleLecture(lecture.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {expandedLectures.includes(lecture.id) ? 
                          <ChevronDown className="w-4 h-4 text-orange-400" /> : 
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        }
                        <span className="text-white font-medium">{lecture.title}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-700" style={{ width: '0%' }}></div>
                        </div>
                        <span className="text-sm text-gray-400 font-medium min-w-16">0 / {lecture.totalProblems}</span>
                      </div>
                    </div>

                    {expandedLectures.includes(lecture.id) && (
                      <div className="bg-black">
                        {/* Updated Table Header */}
                        <div className="grid grid-cols-12 gap-4 p-4 pl-16 border-b border-gray-800 text-xs font-semibold text-gray-300 uppercase tracking-wider bg-gray-900/20">
                          <div className="col-span-1">Status</div>
                          <div className="col-span-3">Problem</div>
                          <div className="col-span-1">Est. Time</div>
                          <div className="col-span-1">Article</div>
                          <div className="col-span-1">Video</div>
                          <div className="col-span-1">Practice</div>
                          <div className="col-span-1">Note</div>
                          <div className="col-span-1">Bookmark</div>
                          <div className="col-span-2">Difficulty</div>
                        </div>

                        {/* Enhanced Problems */}
                        {filteredProblems(lecture.problems).map((problem, index) => (
                          <div key={problem.id} className={`grid grid-cols-12 gap-4 p-4 pl-16 border-b border-gray-800/30 hover:bg-gray-900/40 text-sm transition-all duration-200 ${index % 2 === 0 ? 'bg-gray-950/20' : ''}`}>
                            <div className="col-span-1 flex items-center">
                              {getStatusCheckbox(problem.id, problem.status, () => toggleProblemStatus(problem.id))}
                            </div>
                            <div className="col-span-3 flex items-center">
                              <span className="text-white font-medium hover:text-orange-400 transition-colors cursor-pointer">{problem.title}</span>
                            </div>
                            <div className="col-span-1 flex items-center">
                              <div className="flex items-center space-x-1 text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{problem.estimatedTime || 30}m</span>
                              </div>
                            </div>
                            <div className="col-span-1 flex items-center">
                              {problem.hasArticle ? (
                                <Button
                                  onClick={() => window.open(problem.article, '_blank')}
                                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-110"
                                  size="sm"
                                >
                                  <FileText className="w-3 h-3" />
                                </Button>
                              ) : (
                                <span className="text-gray-600 text-center w-full">-</span>
                              )}
                            </div>
                            <div className="col-span-1 flex items-center">
                              {problem.hasVideo ? (
                                <Button
                                  onClick={() => window.open(problem.video, '_blank')}
                                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-110"
                                  size="sm"
                                >
                                  <Video className="w-3 h-3" />
                                </Button>
                              ) : (
                                <span className="text-gray-600 text-center w-full">-</span>
                              )}
                            </div>
                            <div className="col-span-1 flex items-center">
                              {problem.hasPractice ? (
                                <Button
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105"
                                  size="sm"
                                >
                                  Solve
                                </Button>
                              ) : (
                                <span className="text-gray-600 text-center w-full">-</span>
                              )}
                            </div>
                            <div className="col-span-1 flex items-center">
                              <Button
                                onClick={() => openNoteDialog(problem.id, problem.title)}
                                className={`bg-transparent hover:bg-gray-700 p-2 rounded-lg transition-all duration-200 ${
                                  problemNotes[problem.id] ? 'text-blue-400 hover:text-blue-300' : 'text-gray-400 hover:text-white'
                                }`}
                                size="sm"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="col-span-1 flex items-center">
                              <Button
                                onClick={() => toggleBookmark(problem.id)}
                                className={`bg-transparent hover:bg-gray-700 p-2 rounded-lg transition-all duration-200 ${
                                  bookmarkedProblems.includes(problem.id) 
                                    ? 'text-yellow-400 hover:text-yellow-300' 
                                    : 'text-gray-400 hover:text-white'
                                }`}
                                size="sm"
                              >
                                <Star className={`w-3 h-3 ${bookmarkedProblems.includes(problem.id) ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                            <div className="col-span-2 flex items-center">
                              <Badge className={`${getDifficultyColor(problem.difficulty)} bg-transparent border border-current text-sm px-3 py-1 rounded-full font-semibold`}>
                                {problem.difficulty}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        
                        {filteredProblems(lecture.problems).length === 0 && (
                          <div className="p-8 text-center text-gray-500">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No problems match your current filters</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Advanced Note Taking Dialog with Dark Black Background */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="bg-black border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              {noteTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note-content" className="text-sm font-medium text-gray-300">
                Your Notes
              </Label>
              <Textarea
                id="note-content"
                placeholder="Write your notes, observations, solution approach, time complexity, etc..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 resize-none"
              />
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>💡 Tip: Include approach, complexity, and key insights</span>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setNoteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={saveNote}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemDashboard;
