
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronRight, Plus, Star, Play, Youtube, FileText, Lock } from "lucide-react";

interface ProblemDashboardProps {
  selectedSheet: string;
  searchQuery: string;
}

const ProblemDashboard = ({ selectedSheet, searchQuery }: ProblemDashboardProps) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    "step1": true,
    "step2": false,
    "step3": false,
    "step4": false,
    "step5": false,
    "step6": false
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "attempted":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-900/20 text-green-400 border-green-800/50";
      case "Medium":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-800/50";
      case "Hard":
        return "bg-red-900/20 text-red-400 border-red-800/50";
      default:
        return "bg-gray-900/20 text-gray-400 border-gray-800/50";
    }
  };

  // Mock data structured like the reference image
  const courseData = {
    title: "Striver's A2Z DSA Course",
    description: "This course is made for people who want to learn DSA from A to Z for free in a well-organized and structured manner.",
    totalProgress: { solved: 0, total: 455 },
    difficulties: {
      easy: { solved: 0, total: 131 },
      medium: { solved: 0, total: 187 },
      hard: { solved: 0, total: 136 }
    },
    sections: [
      {
        id: "step1",
        title: "Step 1: Learn the basics",
        progress: { solved: 0, total: 31 },
        lectures: [
          {
            id: "lec1",
            title: "Lec 1: Things to Know in C++/Java/Python or any language",
            progress: { solved: 0, total: 9 },
            problems: [
              { id: 1, title: "User Input / Output", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: false, hasNotes: true },
              { id: 2, title: "Data Types", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: false, hasNotes: true },
              { id: 3, title: "If Else statements", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: 4, title: "Switch Statement", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: 5, title: "What are arrays, strings?", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: 6, title: "For loops", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: 7, title: "While loops", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: 8, title: "Functions (Pass by Reference and Value)", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: 9, title: "Time Complexity (Learn Basics, and then analyse in next Steps)", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true }
            ]
          }
        ]
      },
      {
        id: "step2",
        title: "Step 2: Build-up Logical Thinking",
        progress: { solved: 0, total: 1 },
        lectures: []
      },
      {
        id: "step3",
        title: "Step 3: Learn STL/Java-Collections or similar thing in your language",
        progress: { solved: 0, total: 1 },
        lectures: []
      },
      {
        id: "step4",
        title: "Step 4: Know Basic Maths",
        progress: { solved: 0, total: 7 },
        lectures: []
      },
      {
        id: "step5",
        title: "Step 5: Learn Basic Recursion",
        progress: { solved: 0, total: 9 },
        lectures: []
      },
      {
        id: "step6",
        title: "Step 6: Learn Basic Hashing",
        progress: { solved: 0, total: 3 },
        lectures: []
      }
    ]
  };

  const progressPercentage = (courseData.totalProgress.solved / courseData.totalProgress.total) * 100;

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Course Header */}
        <div className="bg-black border border-gray-900 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-2">{courseData.title}</h1>
          <p className="text-gray-400 text-sm mb-4">
            {courseData.description}{" "}
            <span className="text-orange-400 cursor-pointer hover:underline">Know More</span>
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
            <p className="text-orange-800 text-sm">
              <strong>Note:</strong> You can find <strong>LeetCode</strong> links for problems available on the internet. However few problems are not there on <strong>LeetCode</strong> for which you will not find a practice link attached. We cannot use third-party links due to legal constraints. Also the newly added TUF+ practice links are to give you a free trial of TUF+ which a lot of people asked for. If you don't wish to upgrade, you can still use the TUF platform, nothing has changed.
            </p>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Remember, you started using our website because of our content and not because of some third party links :)
          </p>

          {/* Progress Overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-black border border-gray-900 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {courseData.totalProgress.solved} / {courseData.totalProgress.total}
                </div>
                <div className="text-sm text-gray-400">Total Progress</div>
                <div className="text-lg font-semibold text-gray-500 mt-2">0%</div>
              </div>
            </div>
            
            <div className="bg-black border border-gray-900 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {courseData.difficulties.easy.solved} / {courseData.difficulties.easy.total}
                </div>
                <div className="text-sm text-gray-400">Easy</div>
                <div className="text-sm text-gray-500 mt-1">completed</div>
              </div>
            </div>

            <div className="bg-black border border-gray-900 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {courseData.difficulties.medium.solved} / {courseData.difficulties.medium.total}
                </div>
                <div className="text-sm text-gray-400">Medium</div>
                <div className="text-sm text-gray-500 mt-1">completed</div>
              </div>
            </div>

            <div className="bg-black border border-gray-900 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {courseData.difficulties.hard.solved} / {courseData.difficulties.hard.total}
                </div>
                <div className="text-sm text-gray-400">Hard</div>
                <div className="text-sm text-gray-500 mt-1">completed</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b border-gray-900">
            <button className="pb-2 text-orange-400 border-b-2 border-orange-400 font-medium">
              All Problems
            </button>
            <button className="pb-2 text-gray-400 hover:text-white transition-colors">
              Revision
            </button>
          </div>
        </div>

        {/* Course Sections */}
        <div className="space-y-4">
          {courseData.sections.map((section) => (
            <div key={section.id} className="bg-black border border-gray-900 rounded-lg">
              {/* Section Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-950 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-3">
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <h3 className="text-white font-medium">{section.title}</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <Progress 
                    value={(section.progress.solved / section.progress.total) * 100} 
                    className="w-32 h-2 bg-gray-800"
                  />
                  <span className="text-sm text-gray-400">
                    {section.progress.solved} / {section.progress.total}
                  </span>
                </div>
              </div>

              {/* Section Content */}
              {expandedSections[section.id] && section.lectures.length > 0 && (
                <div className="border-t border-gray-900">
                  {section.lectures.map((lecture) => (
                    <div key={lecture.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-medium">{lecture.title}</h4>
                        <div className="flex items-center space-x-4">
                          <Progress 
                            value={(lecture.progress.solved / lecture.progress.total) * 100} 
                            className="w-24 h-2 bg-gray-800"
                          />
                          <span className="text-sm text-gray-400">
                            {lecture.progress.solved} / {lecture.progress.total}
                          </span>
                        </div>
                      </div>

                      {/* Problems Table */}
                      <div className="bg-black border border-gray-900 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-7 gap-4 p-3 border-b border-gray-900 bg-gray-950 text-sm font-medium text-gray-400">
                          <div>Status</div>
                          <div>Problem</div>
                          <div>Resource (vids)</div>
                          <div>Resource + (free)</div>
                          <div>Practice</div>
                          <div>Note</div>
                          <div>Difficulty</div>
                        </div>

                        {lecture.problems.map((problem) => (
                          <div key={problem.id} className="grid grid-cols-7 gap-4 p-3 border-b border-gray-900 hover:bg-gray-950 transition-colors items-center">
                            <div className="flex items-center">
                              <input type="checkbox" className="mr-2 accent-orange-400" />
                              {getStatusIcon(problem.status)}
                            </div>
                            
                            <div className="text-white text-sm">{problem.title}</div>
                            
                            <div className="flex items-center justify-center">
                              {problem.hasVideo ? (
                                <Youtube className="w-5 h-5 text-orange-400 cursor-pointer hover:text-orange-300" />
                              ) : (
                                <span className="text-gray-600">-</span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              {problem.hasArticle ? (
                                <FileText className="w-5 h-5 text-red-400 cursor-pointer hover:text-red-300" />
                              ) : (
                                <span className="text-gray-600">-</span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              {problem.hasPractice ? (
                                <Button size="sm" variant="outline" className="bg-red-900/20 border-red-800/50 text-red-400 hover:bg-red-900/30 h-6 px-2 text-xs">
                                  TUF+
                                </Button>
                              ) : (
                                <span className="text-gray-600">-</span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              {problem.hasNotes ? (
                                <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                              ) : (
                                <span className="text-gray-600">-</span>
                              )}
                            </div>
                            
                            <div>
                              <Badge className={getDifficultyColor(problem.difficulty)}>
                                {problem.difficulty}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemDashboard;
