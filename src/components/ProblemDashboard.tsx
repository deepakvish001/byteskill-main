
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronRight, Plus, Star, Play, Youtube, FileText, Lock, ExternalLink, BookOpen } from "lucide-react";

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

  const [checkedProblems, setCheckedProblems] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("all-problems");

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleProblem = (problemId: string) => {
    setCheckedProblems(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  const getStatusIcon = (problemId: string) => {
    if (checkedProblems[problemId]) {
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    }
    return <Circle className="w-4 h-4 text-gray-600" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-900/30 text-green-400 border-green-700/50";
      case "Medium":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-700/50";
      case "Hard":
        return "bg-red-900/30 text-red-400 border-red-700/50";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-700/50";
    }
  };

  // Enhanced mock data with more realistic structure
  const courseData = {
    title: "Striver's A2Z DSA Course/Sheet",
    description: "This course is made for people who want to learn DSA from A to Z for free in a well-organized and structured manner. The entire course is free and will always remain free.",
    totalProgress: { solved: 12, total: 455 },
    difficulties: {
      easy: { solved: 8, total: 131 },
      medium: { solved: 3, total: 187 },
      hard: { solved: 1, total: 136 }
    },
    sections: [
      {
        id: "step1",
        title: "Step 1: Learn the basics",
        progress: { solved: 6, total: 31 },
        lectures: [
          {
            id: "lec1",
            title: "Lec 1: Things to Know in C++/Java/Python or any language",
            progress: { solved: 6, total: 9 },
            problems: [
              { id: "p1", title: "User Input / Output", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: false, hasNotes: true },
              { id: "p2", title: "Data Types", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: false, hasNotes: true },
              { id: "p3", title: "If Else statements", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: "p4", title: "Switch Statement", status: "attempted", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: "p5", title: "What are arrays, strings?", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: "p6", title: "For loops", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: "p7", title: "While loops", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: "p8", title: "Functions (Pass by Reference and Value)", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true },
              { id: "p9", title: "Time Complexity", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true }
            ]
          },
          {
            id: "lec2",
            title: "Lec 2: Build-up Logical Thinking",
            progress: { solved: 0, total: 22 },
            problems: [
              { id: "p10", title: "Patterns", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true }
            ]
          }
        ]
      },
      {
        id: "step2",
        title: "Step 2: Learn Important Sorting Techniques",
        progress: { solved: 2, total: 7 },
        lectures: [
          {
            id: "lec3",
            title: "Lec 1: Sorting-I",
            progress: { solved: 2, total: 7 },
            problems: [
              { id: "p11", title: "Selection Sort", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true },
              { id: "p12", title: "Bubble Sort", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true },
              { id: "p13", title: "Insertion Sort", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true },
              { id: "p14", title: "Merge Sort", status: "unsolved", difficulty: "Medium", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true },
              { id: "p15", title: "Quick Sort", status: "unsolved", difficulty: "Medium", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true },
            ]
          }
        ]
      },
      {
        id: "step3",
        title: "Step 3: Solve Problems on Arrays [Easy → Medium → Hard]",
        progress: { solved: 4, total: 40 },
        lectures: [
          {
            id: "lec4",
            title: "Lec 1: Easy",
            progress: { solved: 4, total: 15 },
            problems: [
              { id: "p16", title: "Largest Element in Array", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true },
              { id: "p17", title: "Second Largest Element", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true },
              { id: "p18", title: "Check if Array is Sorted", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true },
              { id: "p19", title: "Remove Duplicates", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true },
              { id: "p20", title: "Left Rotate Array", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true }
            ]
          }
        ]
      }
    ]
  };

  const calculateProgress = () => {
    const totalSolved = Object.values(checkedProblems).filter(Boolean).length + courseData.totalProgress.solved;
    return (totalSolved / courseData.totalProgress.total) * 100;
  };

  const filteredSections = courseData.sections.filter(section => 
    searchQuery === "" || 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.lectures.some(lecture => 
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.problems.some(problem => 
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  );

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Course Header */}
        <div className="bg-black border border-gray-800/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-3">{courseData.title}</h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {courseData.description}{" "}
                <button className="text-orange-400 hover:text-orange-300 cursor-pointer hover:underline transition-colors">
                  Know More
                </button>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-white font-semibold">4.9</span>
              <span className="text-gray-400 text-sm">(12.5k)</span>
            </div>
          </div>
          
          {/* Important Note */}
          <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-800/50 rounded-lg p-4 mb-6">
            <p className="text-orange-200 text-sm leading-relaxed">
              <strong className="text-orange-300">Note:</strong> You can find <strong>LeetCode</strong> links for problems available on the internet. However few problems are not there on <strong>LeetCode</strong> for which you will not find a practice link attached. We cannot use third-party links due to legal constraints. Also the newly added TUF+ practice links are to give you a free trial of TUF+ which a lot of people asked for.
            </p>
          </div>

          <p className="text-gray-400 text-sm mb-6 italic">
            Remember, you started using our website because of our content and not because of some third party links :)
          </p>

          {/* Enhanced Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800/50 hover:border-gray-700 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {courseData.totalProgress.solved + Object.values(checkedProblems).filter(Boolean).length} / {courseData.totalProgress.total}
                </div>
                <div className="text-sm text-gray-400 mb-2">Total Progress</div>
                <Progress 
                  value={calculateProgress()} 
                  className="w-full h-2 bg-gray-800"
                />
                <div className="text-lg font-semibold text-orange-400 mt-2">{Math.round(calculateProgress())}%</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-900/20 to-black border-green-800/50 hover:border-green-700 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {courseData.difficulties.easy.solved} / {courseData.difficulties.easy.total}
                </div>
                <div className="text-sm text-gray-400 mb-2">Easy</div>
                <div className="text-sm text-green-500 font-medium">completed</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-800/50 hover:border-yellow-700 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {courseData.difficulties.medium.solved} / {courseData.difficulties.medium.total}
                </div>
                <div className="text-sm text-gray-400 mb-2">Medium</div>
                <div className="text-sm text-yellow-500 font-medium">completed</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-800/50 hover:border-red-700 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {courseData.difficulties.hard.solved} / {courseData.difficulties.hard.total}
                </div>
                <div className="text-sm text-gray-400 mb-2">Hard</div>
                <div className="text-sm text-red-500 font-medium">completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex space-x-1 border-b border-gray-800/50">
            <button 
              onClick={() => setActiveTab("all-problems")}
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                activeTab === "all-problems" 
                  ? "text-orange-400 bg-gray-900/50 border-b-2 border-orange-400" 
                  : "text-gray-400 hover:text-white hover:bg-gray-900/30"
              }`}
            >
              All Problems
            </button>
            <button 
              onClick={() => setActiveTab("revision")}
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                activeTab === "revision" 
                  ? "text-orange-400 bg-gray-900/50 border-b-2 border-orange-400" 
                  : "text-gray-400 hover:text-white hover:bg-gray-900/30"
              }`}
            >
              Revision
            </button>
            <button 
              onClick={() => setActiveTab("bookmarks")}
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                activeTab === "bookmarks" 
                  ? "text-orange-400 bg-gray-900/50 border-b-2 border-orange-400" 
                  : "text-gray-400 hover:text-white hover:bg-gray-900/30"
              }`}
            >
              Bookmarks
            </button>
          </div>
        </div>

        {/* Enhanced Course Sections */}
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <Card key={section.id} className="bg-black border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 shadow-lg">
              {/* Section Header */}
              <div 
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-950/50 transition-all duration-200 rounded-t-xl"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-gray-900">
                    {expandedSections[section.id] ? (
                      <ChevronDown className="w-5 h-5 text-orange-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{section.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {section.progress.solved} of {section.progress.total} problems completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Progress</div>
                    <Progress 
                      value={(section.progress.solved / section.progress.total) * 100} 
                      className="w-32 h-2 bg-gray-800"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">
                      {section.progress.solved} / {section.progress.total}
                    </span>
                    <div className="text-sm text-gray-400">
                      {Math.round((section.progress.solved / section.progress.total) * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Content */}
              {expandedSections[section.id] && (
                <div className="border-t border-gray-800/50">
                  {section.lectures.map((lecture) => (
                    <div key={lecture.id} className="p-5 bg-gray-950/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-5 h-5 text-orange-400" />
                          <h4 className="text-white font-medium text-lg">{lecture.title}</h4>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Progress 
                            value={(lecture.progress.solved / lecture.progress.total) * 100} 
                            className="w-24 h-2 bg-gray-800"
                          />
                          <span className="text-sm text-gray-400 font-medium">
                            {lecture.progress.solved} / {lecture.progress.total}
                          </span>
                        </div>
                      </div>

                      {/* Enhanced Problems Table */}
                      <Card className="bg-black border border-gray-800/50 overflow-hidden">
                        <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-800/50 bg-gray-950/50">
                          <div className="text-sm font-semibold text-gray-300">Status</div>
                          <div className="text-sm font-semibold text-gray-300 col-span-2">Problem</div>
                          <div className="text-sm font-semibold text-gray-300 text-center">Resources</div>
                          <div className="text-sm font-semibold text-gray-300 text-center">Practice</div>
                          <div className="text-sm font-semibold text-gray-300 text-center">Difficulty</div>
                        </div>

                        {lecture.problems.map((problem) => (
                          <div key={problem.id} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-800/30 hover:bg-gray-950/40 transition-all duration-200 group">
                            <div className="flex items-center space-x-3">
                              <input 
                                type="checkbox" 
                                checked={checkedProblems[problem.id] || false}
                                onChange={() => toggleProblem(problem.id)}
                                className="w-4 h-4 text-orange-400 bg-black border-gray-600 rounded focus:ring-orange-400 focus:ring-2" 
                              />
                              {getStatusIcon(problem.id)}
                            </div>
                            
                            <div className="col-span-2">
                              <button className="text-white text-sm hover:text-orange-400 transition-colors text-left font-medium group-hover:underline">
                                {problem.title}
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-3">
                              {problem.hasVideo && (
                                <button className="p-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 transition-colors group">
                                  <Youtube className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                                </button>
                              )}
                              {problem.hasArticle && (
                                <button className="p-2 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 transition-colors group">
                                  <FileText className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                                </button>
                              )}
                              {problem.hasNotes && (
                                <button className="p-2 rounded-lg bg-green-900/20 hover:bg-green-900/40 transition-colors group">
                                  <Plus className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                                </button>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              {problem.hasPractice ? (
                                <Button 
                                  size="sm" 
                                  className="bg-orange-900/30 border border-orange-700/50 text-orange-400 hover:bg-orange-900/50 hover:text-orange-300 h-8 px-3 text-xs font-medium transition-all duration-200"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Solve
                                </Button>
                              ) : (
                                <Lock className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <Badge className={`${getDifficultyColor(problem.difficulty)} font-medium text-xs px-3 py-1`}>
                                {problem.difficulty}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Stats Footer */}
        <Card className="bg-gradient-to-r from-gray-900 to-black border-gray-800/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {Object.values(checkedProblems).filter(Boolean).length + courseData.totalProgress.solved}
              </div>
              <div className="text-sm text-gray-400">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {filteredSections.length}
              </div>
              <div className="text-sm text-gray-400">Active Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {Math.round(calculateProgress())}%
              </div>
              <div className="text-sm text-gray-400">Course Progress</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProblemDashboard;
