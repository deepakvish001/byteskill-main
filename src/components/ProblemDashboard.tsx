
import { useState, useEffect } from "react";
import { Play, ExternalLink, BookOpen, Video, FileText, Clock, Filter, Search, Star, Bookmark, CheckCircle2, Circle, X, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusProgressBox from "./StatusProgressBox";

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
    name: "Striver A2Z DSA Course",
    description: "This course is made for people who want to learn DSA from A to Z for free in a well-organized and structured manner.",
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
                hasPractice: false,
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
                hasPractice: false,
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
                hasPractice: false,
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
  const [currentTime, setCurrentTime] = useState<string>("");

  const sheet = mockSheets[selectedSheet] || mockSheets["striver-a2z"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-500";
      case "Medium": return "text-yellow-500";
      case "Hard": return "text-red-500";
      default: return "text-gray-400";
    }
  };

  const getStatusCheckbox = (status: string) => {
    switch (status) {
      case "Solved":
        return <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-500 flex items-center justify-center">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>;
      case "Attempted":
        return <div className="w-4 h-4 bg-yellow-500 rounded border-2 border-yellow-500 flex items-center justify-center">
          <Circle className="w-2 h-2 text-white fill-white" />
        </div>;
      default:
        return <div className="w-4 h-4 border-2 border-gray-500 rounded"></div>;
    }
  };

  return (
    <div className="text-white space-y-6 bg-black min-h-screen">
      {/* Status Progress Section */}
      <StatusProgressBox />

      {/* Header Section */}
      <div className="bg-black space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {sheet.name}
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            {sheet.description} <span className="text-orange-500 cursor-pointer hover:underline">Know More</span>
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">
              <strong>Note:</strong> You can find <strong>LeetCode</strong> links for problems available on the internet. However few problems are not there on <strong>LeetCode</strong> for which you will not find a practice link attached. We cannot use third-party links due to legal constraints. Also the newly added TUF+ practice links are to give you a free trial of TUF+ which a lot of people asked for. If you don't wish to upgrade, you can still use the TUF platform, nothing has changed.
            </p>
            <p className="text-red-800 text-sm mt-2">
              Remember, you started using our website because of our content and not because of some third party links :)
            </p>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400">Total Progress</div>
            <div className="text-lg font-bold">0 / 455</div>
            <div className="text-sm text-gray-500">0%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Easy</div>
            <div className="text-lg font-bold">0 / 131 <span className="text-sm text-gray-500">completed</span></div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Medium</div>
            <div className="text-lg font-bold">0 / 187 <span className="text-sm text-gray-500">completed</span></div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Hard</div>
            <div className="text-lg font-bold">0 / 136 <span className="text-sm text-gray-500">completed</span></div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
            All Problems
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded">
            Revision
          </Button>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-3 py-2 rounded">
              <Search className="w-4 h-4" />
            </Button>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">Difficulty</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-3 py-2 rounded">
              Pick Random
            </Button>
          </div>
        </div>
      </div>

      {/* Steps and Lectures */}
      <div className="space-y-2">
        {sheet.steps.map((step) => (
          <div key={step.id} className="bg-black border border-gray-800 rounded">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-900"
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex items-center space-x-3">
                {expandedSteps.includes(step.id) ? 
                  <ChevronDown className="w-4 h-4 text-white" /> : 
                  <ChevronRight className="w-4 h-4 text-white" />
                }
                <span className="font-medium text-white">{step.title}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <span className="text-sm text-gray-400">0 / {step.totalProblems}</span>
              </div>
            </div>

            {expandedSteps.includes(step.id) && (
              <div className="border-t border-gray-800">
                {step.lectures.map((lecture) => (
                  <div key={lecture.id}>
                    <div 
                      className="flex items-center justify-between p-4 pl-12 cursor-pointer hover:bg-gray-900 border-b border-gray-800"
                      onClick={() => toggleLecture(lecture.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {expandedLectures.includes(lecture.id) ? 
                          <ChevronDown className="w-4 h-4 text-white" /> : 
                          <ChevronRight className="w-4 h-4 text-white" />
                        }
                        <span className="text-white">{lecture.title}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <span className="text-sm text-gray-400">0 / {lecture.totalProblems}</span>
                      </div>
                    </div>

                    {expandedLectures.includes(lecture.id) && (
                      <div className="bg-black">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 p-4 pl-16 border-b border-gray-800 text-xs font-medium text-gray-400 uppercase">
                          <div className="col-span-1">Status</div>
                          <div className="col-span-3">Problem</div>
                          <div className="col-span-1">TUF+</div>
                          <div className="col-span-1">Resource (Art)</div>
                          <div className="col-span-1">Resource (Yt)</div>
                          <div className="col-span-1">Practice</div>
                          <div className="col-span-1">Note</div>
                          <div className="col-span-1">Revision</div>
                          <div className="col-span-2">Difficulty</div>
                        </div>

                        {/* Problems */}
                        {lecture.problems.map((problem) => (
                          <div key={problem.id} className="grid grid-cols-12 gap-4 p-4 pl-16 border-b border-gray-800 hover:bg-gray-900 text-sm">
                            <div className="col-span-1 flex items-center">
                              {getStatusCheckbox(problem.status)}
                            </div>
                            <div className="col-span-3 flex items-center">
                              <span className="text-white">{problem.title}</span>
                            </div>
                            <div className="col-span-1 flex items-center">
                              <Button 
                                onClick={() => window.open('https://takeuforward.org/tuf-plus', '_blank')}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 text-xs rounded"
                              >
                                Solve
                              </Button>
                            </div>
                            <div className="col-span-1 flex items-center">
                              {problem.hasArticle ? (
                                <Button
                                  onClick={() => window.open(problem.article, '_blank')}
                                  className="bg-orange-500 hover:bg-orange-600 text-white p-1 rounded"
                                  size="sm"
                                >
                                  <FileText className="w-3 h-3" />
                                </Button>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </div>
                            <div className="col-span-1 flex items-center">
                              {problem.hasVideo ? (
                                <Button
                                  onClick={() => window.open(problem.video, '_blank')}
                                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                  size="sm"
                                >
                                  <Video className="w-3 h-3" />
                                </Button>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </div>
                            <div className="col-span-1 flex items-center">
                              {problem.hasPractice ? (
                                <Button
                                  className="bg-gray-500 hover:bg-gray-600 text-white p-1 rounded"
                                  size="sm"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </div>
                            <div className="col-span-1 flex items-center">
                              <Button
                                className="bg-transparent hover:bg-gray-700 text-gray-400 p-1 rounded"
                                size="sm"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="col-span-1 flex items-center">
                              <Button
                                className="bg-transparent hover:bg-gray-700 text-gray-400 p-1 rounded"
                                size="sm"
                              >
                                <Star className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="col-span-2 flex items-center">
                              <Badge className={`${getDifficultyColor(problem.difficulty)} bg-transparent border-0 text-sm`}>
                                {problem.difficulty}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemDashboard;
