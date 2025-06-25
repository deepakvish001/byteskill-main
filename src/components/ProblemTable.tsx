
import { Clock, FileText, Video, Star, Edit3, CheckCircle2, Circle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface ProblemTableProps {
  steps: Step[];
  expandedSteps: string[];
  expandedLectures: string[];
  problemStatuses: Record<number, "Solved" | "Attempted" | "Not Started">;
  bookmarkedProblems: number[];
  problemNotes: Record<number, string>;
  onToggleStep: (stepId: string) => void;
  onToggleLecture: (lectureId: string) => void;
  onToggleProblemStatus: (problemId: number) => void;
  onToggleBookmark: (problemId: number) => void;
  onOpenNoteDialog: (problemId: number, problemTitle: string) => void;
  applyAdvancedFilters: (problems: Problem[]) => Problem[];
  calculateStepProgress: (step: Step) => number;
  calculateLectureProgress: (lecture: Lecture) => number;
}

const ProblemTable = ({ 
  steps, 
  expandedSteps, 
  expandedLectures, 
  problemStatuses, 
  bookmarkedProblems, 
  problemNotes,
  onToggleStep,
  onToggleLecture,
  onToggleProblemStatus,
  onToggleBookmark,
  onOpenNoteDialog,
  applyAdvancedFilters,
  calculateStepProgress,
  calculateLectureProgress
}: ProblemTableProps) => {
  
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

  return (
    <div className="space-y-2">
      {steps.map((step) => {
        const stepProgress = calculateStepProgress(step);
        const stepSolved = step.lectures.flatMap(lecture => lecture.problems).filter(problem => 
          (problemStatuses[problem.id] || problem.status) === "Solved"
        ).length;
        
        return (
          <div key={step.id} className="bg-black border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors">
            <div 
              className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-gray-900/50 transition-colors"
              onClick={() => onToggleStep(step.id)}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                {expandedSteps.includes(step.id) ? 
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" /> : 
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                }
                <span className="font-semibold text-white text-sm sm:text-base lg:text-lg truncate">{step.title}</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                <div className="w-20 sm:w-32 lg:w-40 bg-gray-800 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-700" 
                    style={{ width: `${stepProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-400 font-medium min-w-12 sm:min-w-20 text-right">{stepSolved} / {step.totalProblems}</span>
              </div>
            </div>

            {expandedSteps.includes(step.id) && (
              <div className="border-t border-gray-800">
                {step.lectures.map((lecture) => {
                  const lectureProgress = calculateLectureProgress(lecture);
                  const lectureSolved = lecture.problems.filter(problem => 
                    (problemStatuses[problem.id] || problem.status) === "Solved"
                  ).length;
                  
                  return (
                    <div key={lecture.id}>
                      <div 
                        className="flex items-center justify-between p-3 sm:p-4 pl-8 sm:pl-12 cursor-pointer hover:bg-gray-900/30 border-b border-gray-800/50 transition-colors"
                        onClick={() => onToggleLecture(lecture.id)}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          {expandedLectures.includes(lecture.id) ? 
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" /> : 
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          }
                          <span className="text-white font-medium text-xs sm:text-sm lg:text-base truncate">{lecture.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                          <div className="w-16 sm:w-24 lg:w-32 bg-gray-800 rounded-full h-2 sm:h-2.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 sm:h-2.5 rounded-full transition-all duration-700" 
                              style={{ width: `${lectureProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-400 font-medium min-w-10 sm:min-w-16 text-right">{lectureSolved} / {lecture.totalProblems}</span>
                        </div>
                      </div>

                      {expandedLectures.includes(lecture.id) && (
                        <div className="bg-black">
                          {/* Mobile-First Table Design */}
                          <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 pl-16 border-b border-gray-800 text-xs font-semibold text-gray-300 uppercase tracking-wider bg-gray-900/20">
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

                          {/* Mobile Card Layout */}
                          <div className="lg:hidden">
                            {applyAdvancedFilters(lecture.problems).map((problem, index) => (
                              <div key={problem.id} className={`p-4 border-b border-gray-800/30 ${index % 2 === 0 ? 'bg-gray-950/20' : ''}`}>
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    {getStatusCheckbox(problem.id, problem.status, () => onToggleProblemStatus(problem.id))}
                                    <div>
                                      <h4 className="text-white font-medium text-sm hover:text-orange-400 transition-colors cursor-pointer">{problem.title}</h4>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Badge className={`${getDifficultyColor(problem.difficulty)} bg-transparent border border-current text-xs px-2 py-0.5 rounded-full font-semibold`}>
                                          {problem.difficulty}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => onToggleBookmark(problem.id)}
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
                                
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center space-x-1 text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-xs">{problem.estimatedTime || 30}m</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    {problem.hasArticle && (
                                      <Button
                                        onClick={() => window.open(problem.article, '_blank')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-110"
                                        size="sm"
                                      >
                                        <FileText className="w-3 h-3" />
                                      </Button>
                                    )}
                                    {problem.hasVideo && (
                                      <Button
                                        onClick={() => window.open(problem.video, '_blank')}
                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-110"
                                        size="sm"
                                      >
                                        <Video className="w-3 h-3" />
                                      </Button>
                                    )}
                                    {problem.hasPractice && (
                                      <Button
                                        onClick={() => window.open(`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}/`, '_blank')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105"
                                        size="sm"
                                      >
                                        Solve
                                      </Button>
                                    )}
                                    <Button
                                      onClick={() => onOpenNoteDialog(problem.id, problem.title)}
                                      className={`bg-transparent hover:bg-gray-700 p-2 rounded-lg transition-all duration-200 ${
                                        problemNotes[problem.id] ? 'text-blue-400 hover:text-blue-300' : 'text-gray-400 hover:text-white'
                                      }`}
                                      size="sm"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Desktop Table Layout */}
                          <div className="hidden lg:block">
                            {applyAdvancedFilters(lecture.problems).map((problem, index) => (
                              <div key={problem.id} className={`grid grid-cols-12 gap-4 p-4 pl-16 border-b border-gray-800/30 hover:bg-gray-900/40 text-sm transition-all duration-200 ${index % 2 === 0 ? 'bg-gray-950/20' : ''}`}>
                                <div className="col-span-1 flex items-center">
                                  {getStatusCheckbox(problem.id, problem.status, () => onToggleProblemStatus(problem.id))}
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
                                      onClick={() => window.open(`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}/`, '_blank')}
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
                                    onClick={() => onOpenNoteDialog(problem.id, problem.title)}
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
                                    onClick={() => onToggleBookmark(problem.id)}
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
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProblemTable;
