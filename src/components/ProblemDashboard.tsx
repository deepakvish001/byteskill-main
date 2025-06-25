
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronRight, Plus, Star, Play, Youtube, FileText, Lock, ExternalLink, BookOpen, Filter, Trophy, Calendar, Target, Bookmark, RotateCcw, Timer, Award, TrendingUp } from "lucide-react";

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
  const [bookmarkedProblems, setBookmarkedProblems] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("all-problems");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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

  const toggleBookmark = (problemId: string) => {
    setBookmarkedProblems(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  const getStatusIcon = (problemId: string, status: string) => {
    if (checkedProblems[problemId] || status === "solved") {
      return (
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
      );
    }
    if (status === "attempted") {
      return (
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      );
    }
    return (
      <div className="w-5 h-5 rounded-full border-2 border-gray-600 hover:border-gray-400 transition-all duration-200 hover:scale-110 cursor-pointer" />
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10";
      case "Medium":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30 shadow-lg shadow-yellow-500/10";
      case "Hard":
        return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10";
      default:
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const handleResourceClick = (type: string, problemTitle: string) => {
    const urls = {
      video: `https://youtube.com/search?q=${encodeURIComponent(problemTitle + " tutorial")}`,
      article: `https://takeuforward.org/search?q=${encodeURIComponent(problemTitle)}`,
      notes: `https://docs.google.com/document/new`,
      practice: `https://leetcode.com/problems/${problemTitle.toLowerCase().replace(/\s+/g, '-')}/`
    };
    window.open(urls[type as keyof typeof urls], '_blank');
  };

  // Enhanced mock data with more realistic structure
  const courseData = {
    title: "Striver's A2Z DSA Course/Sheet",
    description: "This course is made for people who want to learn DSA from A to Z for free in a well-organized and structured manner. The entire course is free and will always remain free.",
    totalProgress: { solved: 12, total: 455 },
    streakDays: 7,
    todayGoal: { completed: 3, target: 5 },
    weeklyGoal: { completed: 15, target: 25 },
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
        estimatedTime: "2-3 weeks",
        lectures: [
          {
            id: "lec1",
            title: "Lec 1: Things to Know in C++/Java/Python or any language",
            progress: { solved: 6, total: 9 },
            estimatedTime: "3-4 hours",
            problems: [
              { id: "p1", title: "User Input / Output", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, timeSpent: 15, rating: 4.5 },
              { id: "p2", title: "Data Types", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, timeSpent: 20, rating: 4.2 },
              { id: "p3", title: "If Else statements", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true, timeSpent: 10, rating: 4.0 },
              { id: "p4", title: "Switch Statement", status: "attempted", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true, timeSpent: 25, rating: 3.8 },
              { id: "p5", title: "What are arrays, strings?", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true, rating: 4.3 },
              { id: "p6", title: "For loops", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true, rating: 4.1 },
              { id: "p7", title: "While loops", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true, rating: 3.9 },
              { id: "p8", title: "Functions (Pass by Reference and Value)", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true, rating: 4.4 },
              { id: "p9", title: "Time Complexity", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: false, hasPractice: true, hasNotes: true, rating: 4.6 }
            ]
          },
          {
            id: "lec2",
            title: "Lec 2: Build-up Logical Thinking",
            progress: { solved: 0, total: 22 },
            estimatedTime: "1 week",
            problems: [
              { id: "p10", title: "Pattern Problems", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, rating: 4.2 }
            ]
          }
        ]
      },
      {
        id: "step2",
        title: "Step 2: Learn Important Sorting Techniques",
        progress: { solved: 2, total: 7 },
        estimatedTime: "1-2 weeks",
        lectures: [
          {
            id: "lec3",
            title: "Lec 1: Sorting-I",
            progress: { solved: 2, total: 7 },
            estimatedTime: "4-5 hours",
            problems: [
              { id: "p11", title: "Selection Sort", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, timeSpent: 30, rating: 4.0 },
              { id: "p12", title: "Bubble Sort", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, timeSpent: 25, rating: 3.8 },
              { id: "p13", title: "Insertion Sort", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, rating: 4.1 },
              { id: "p14", title: "Merge Sort", status: "unsolved", difficulty: "Medium", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, rating: 4.5 },
              { id: "p15", title: "Quick Sort", status: "unsolved", difficulty: "Medium", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, rating: 4.3 },
            ]
          }
        ]
      },
      {
        id: "step3",
        title: "Step 3: Solve Problems on Arrays [Easy → Medium → Hard]",
        progress: { solved: 4, total: 40 },
        estimatedTime: "3-4 weeks",
        lectures: [
          {
            id: "lec4",
            title: "Lec 1: Easy",
            progress: { solved: 4, total: 15 },
            estimatedTime: "1 week",
            problems: [
              { id: "p16", title: "Largest Element in Array", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, timeSpent: 20, rating: 4.2 },
              { id: "p17", title: "Second Largest Element", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, timeSpent: 15, rating: 4.0 },
              { id: "p18", title: "Check if Array is Sorted", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, timeSpent: 10, rating: 3.9 },
              { id: "p19", title: "Remove Duplicates", status: "solved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, timeSpent: 35, rating: 4.4 },
              { id: "p20", title: "Left Rotate Array", status: "unsolved", difficulty: "Easy", hasVideo: true, hasArticle: true, hasPractice: true, hasNotes: true, rating: 4.1 }
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
        {/* Enhanced Course Header */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {courseData.title}
                </h1>
                <Badge className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 text-orange-400 border border-orange-500/30 shadow-lg">
                  Free Course
                </Badge>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-4xl">
                {courseData.description}{" "}
                <button className="text-orange-400 hover:text-orange-300 cursor-pointer hover:underline transition-colors font-medium">
                  Know More
                </button>
              </p>
              
              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <div>
                    <span className="text-gray-400 block text-xs">Current Streak</span>
                    <span className="text-yellow-400 font-bold text-lg">{courseData.streakDays} days</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <Target className="w-5 h-5 text-green-400" />
                  <div>
                    <span className="text-gray-400 block text-xs">Today's Goal</span>
                    <span className="text-green-400 font-bold text-lg">{courseData.todayGoal.completed}/{courseData.todayGoal.target}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-gray-400 block text-xs">Weekly Goal</span>
                    <span className="text-blue-400 font-bold text-lg">{courseData.weeklyGoal.completed}/{courseData.weeklyGoal.target}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <div>
                    <span className="text-gray-400 block text-xs">Accuracy</span>
                    <span className="text-purple-400 font-bold text-lg">87%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <div>
                <span className="text-white font-bold text-xl">4.9</span>
                <span className="text-gray-400 text-sm block">(12.5k reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Important Note */}
          <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-800/50 rounded-xl p-5 mb-6 backdrop-blur-sm">
            <p className="text-orange-200 text-sm leading-relaxed">
              <strong className="text-orange-300">Note:</strong> You can find <strong>LeetCode</strong> links for problems available on the internet. However few problems are not there on <strong>LeetCode</strong> for which you will not find a practice link attached. We cannot use third-party links due to legal constraints. Also the newly added TUF+ practice links are to give you a free trial of TUF+ which a lot of people asked for.
            </p>
          </div>

          {/* Enhanced Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-orange-500/10 via-gray-900 to-black border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 group backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-2">
                  {courseData.totalProgress.solved + Object.values(checkedProblems).filter(Boolean).length} / {courseData.totalProgress.total}
                </div>
                <div className="text-sm text-gray-400 mb-3">Total Progress</div>
                <Progress 
                  value={calculateProgress()} 
                  className="w-full h-3 bg-gray-800/50"
                />
                <div className="text-xl font-bold text-orange-400 mt-3">{Math.round(calculateProgress())}%</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 via-gray-900 to-black border border-green-500/20 hover:border-green-400/40 transition-all duration-300 group backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  {courseData.difficulties.easy.solved} / {courseData.difficulties.easy.total}
                </div>
                <div className="text-sm text-gray-400 mb-3">Easy Problems</div>
                <div className="text-lg text-green-400 font-semibold">
                  {Math.round((courseData.difficulties.easy.solved / courseData.difficulties.easy.total) * 100)}% completed
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 via-gray-900 to-black border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 group backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {courseData.difficulties.medium.solved} / {courseData.difficulties.medium.total}
                </div>
                <div className="text-sm text-gray-400 mb-3">Medium Problems</div>
                <div className="text-lg text-yellow-400 font-semibold">
                  {Math.round((courseData.difficulties.medium.solved / courseData.difficulties.medium.total) * 100)}% completed
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 via-gray-900 to-black border border-red-500/20 hover:border-red-400/40 transition-all duration-300 group backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {courseData.difficulties.hard.solved} / {courseData.difficulties.hard.total}
                </div>
                <div className="text-sm text-gray-400 mb-3">Hard Problems</div>
                <div className="text-lg text-red-400 font-semibold">
                  {Math.round((courseData.difficulties.hard.solved / courseData.difficulties.hard.total) * 100)}% completed
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tabs with Filters */}
          <div className="flex items-center justify-between border-b border-gray-800/50 mb-6">
            <div className="flex space-x-1">
              <button 
                onClick={() => setActiveTab("all-problems")}
                className={`px-8 py-4 text-sm font-medium rounded-t-xl transition-all duration-300 ${
                  activeTab === "all-problems" 
                    ? "text-orange-400 bg-gray-800/50 border-b-2 border-orange-400 shadow-lg" 
                    : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                }`}
              >
                All Problems
              </button>
              <button 
                onClick={() => setActiveTab("revision")}
                className={`px-8 py-4 text-sm font-medium rounded-t-xl transition-all duration-300 ${
                  activeTab === "revision" 
                    ? "text-orange-400 bg-gray-800/50 border-b-2 border-orange-400 shadow-lg" 
                    : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                }`}
              >
                <RotateCcw className="w-4 h-4 mr-2 inline" />
                Revision
              </button>
              <button 
                onClick={() => setActiveTab("bookmarks")}
                className={`px-8 py-4 text-sm font-medium rounded-t-xl transition-all duration-300 ${
                  activeTab === "bookmarks" 
                    ? "text-orange-400 bg-gray-800/50 border-b-2 border-orange-400 shadow-lg" 
                    : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                }`}
              >
                <Bookmark className="w-4 h-4 mr-2 inline" />
                Bookmarks
              </button>
            </div>
            
            {/* Enhanced Filter Controls */}
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select 
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white text-sm rounded-xl px-4 py-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white text-sm rounded-xl px-4 py-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="solved">Solved</option>
                <option value="attempted">Attempted</option>
                <option value="unsolved">Unsolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Course Sections */}
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <Card key={section.id} className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 shadow-2xl backdrop-blur-sm">
              {/* Enhanced Section Header */}
              <div 
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-900/30 transition-all duration-200 rounded-t-2xl group"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-5">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all duration-300">
                    {expandedSections[section.id] ? (
                      <ChevronDown className="w-6 h-6 text-orange-400" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl hover:text-orange-400 transition-colors group-hover:scale-105 transform duration-200">
                      {section.title}
                    </h3>
                    <div className="flex items-center space-x-6 mt-2">
                      <p className="text-gray-400 text-sm">
                        {section.progress.solved} of {section.progress.total} problems completed
                      </p>
                      <Badge variant="outline" className="text-xs text-gray-500 border-gray-600/50 bg-gray-800/30">
                        <Timer className="w-3 h-3 mr-1" />
                        Est. {section.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-2">Progress</div>
                    <Progress 
                      value={(section.progress.solved / section.progress.total) * 100} 
                      className="w-40 h-3 bg-gray-800/50"
                    />
                  </div>
                  <div className="text-right bg-gray-800/30 rounded-xl p-4">
                    <span className="text-white font-bold text-lg block">
                      {section.progress.solved} / {section.progress.total}
                    </span>
                    <div className="text-sm text-orange-400 font-medium">
                      {Math.round((section.progress.solved / section.progress.total) * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Section Content */}
              {expandedSections[section.id] && (
                <div className="border-t border-gray-800/50 animate-accordion-down">
                  {section.lectures.map((lecture) => (
                    <div key={lecture.id} className="p-6 bg-gray-950/40 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                            <BookOpen className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-xl">{lecture.title}</h4>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline" className="text-xs text-gray-500 border-gray-600/50 bg-gray-800/30">
                                <Clock className="w-3 h-3 mr-1" />
                                Est. {lecture.estimatedTime}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {lecture.problems.length} problems
                              </span>
                              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                                <Award className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <Progress 
                            value={(lecture.progress.solved / lecture.progress.total) * 100} 
                            className="w-32 h-3 bg-gray-800/50"
                          />
                          <span className="text-sm text-gray-300 font-medium bg-gray-800/30 rounded-lg px-3 py-1">
                            {lecture.progress.solved} / {lecture.progress.total}
                          </span>
                        </div>
                      </div>

                      {/* Enhanced Problems Table */}
                      <Card className="bg-black/50 border border-gray-800/50 overflow-hidden backdrop-blur-sm">
                        <div className="grid grid-cols-7 gap-4 p-5 border-b border-gray-800/50 bg-gray-900/30">
                          <div className="text-sm font-bold text-gray-300">Status</div>
                          <div className="text-sm font-bold text-gray-300 col-span-2">Problem</div>
                          <div className="text-sm font-bold text-gray-300 text-center">Resources</div>
                          <div className="text-sm font-bold text-gray-300 text-center">Practice</div>
                          <div className="text-sm font-bold text-gray-300 text-center">Difficulty</div>
                          <div className="text-sm font-bold text-gray-300 text-center">Actions</div>
                        </div>

                        {lecture.problems.map((problem) => (
                          <div key={problem.id} className="grid grid-cols-7 gap-4 p-5 border-b border-gray-800/30 hover:bg-gray-900/40 transition-all duration-200 group">
                            <div className="flex items-center space-x-3">
                              <input 
                                type="checkbox" 
                                checked={checkedProblems[problem.id] || problem.status === "solved"}
                                onChange={() => toggleProblem(problem.id)}
                                className="w-4 h-4 text-orange-400 bg-black border-gray-600 rounded focus:ring-orange-400 focus:ring-2 transition-all duration-200" 
                              />
                              {getStatusIcon(problem.id, problem.status)}
                            </div>
                            
                            <div className="col-span-2">
                              <button className="text-white text-sm hover:text-orange-400 transition-colors text-left font-medium group-hover:underline">
                                {problem.title}
                              </button>
                              <div className="flex items-center space-x-3 mt-2">
                                {problem.timeSpent && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">{problem.timeSpent}min</span>
                                  </div>
                                )}
                                {problem.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-xs text-yellow-400">{problem.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-2">
                              {problem.hasVideo && (
                                <button 
                                  onClick={() => handleResourceClick('video', problem.title)}
                                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-all duration-200 group/btn border border-red-500/30 hover:scale-110"
                                  title="Watch Video Tutorial"
                                >
                                  <Youtube className="w-4 h-4 text-red-400 group-hover/btn:text-red-300" />
                                </button>
                              )}
                              {problem.hasArticle && (
                                <button 
                                  onClick={() => handleResourceClick('article', problem.title)}
                                  className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 transition-all duration-200 group/btn border border-blue-500/30 hover:scale-110"
                                  title="Read Article"
                                >
                                  <FileText className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-300" />
                                </button>
                              )}
                              {problem.hasNotes && (
                                <button 
                                  onClick={() => handleResourceClick('notes', problem.title)}
                                  className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/40 transition-all duration-200 group/btn border border-green-500/30 hover:scale-110"
                                  title="Take Notes"
                                >
                                  <Plus className="w-4 h-4 text-green-400 group-hover/btn:text-green-300" />
                                </button>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              {problem.hasPractice ? (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleResourceClick('practice', problem.title)}
                                  className="bg-gradient-to-r from-orange-600/30 to-red-600/30 border border-orange-500/50 text-orange-300 hover:from-orange-600/50 hover:to-red-600/50 hover:text-orange-200 h-8 px-4 text-xs font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Solve
                                </Button>
                              ) : (
                                <div className="flex items-center justify-center w-8 h-8 rounded border border-gray-700 bg-gray-800/30">
                                  <Lock className="w-4 h-4 text-gray-600" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <Badge className={`${getDifficultyColor(problem.difficulty)} font-semibold text-xs px-4 py-1 transition-all duration-200 hover:scale-105`}>
                                {problem.difficulty}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                onClick={() => toggleBookmark(problem.id)}
                                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                  bookmarkedProblems[problem.id] 
                                    ? "bg-yellow-500/20 border border-yellow-500/30" 
                                    : "bg-gray-700/20 border border-gray-600/30 hover:bg-yellow-500/10"
                                }`}
                                title="Bookmark Problem"
                              >
                                <Bookmark className={`w-4 h-4 ${
                                  bookmarkedProblems[problem.id] ? "text-yellow-400 fill-current" : "text-gray-500"
                                }`} />
                              </button>
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

        {/* Enhanced Quick Stats Footer */}
        <Card className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-gray-800/50 p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-200">
                {Object.values(checkedProblems).filter(Boolean).length + courseData.totalProgress.solved}
              </div>
              <div className="text-sm text-gray-400">Problems Solved</div>
              <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-200">
                {filteredSections.length}
              </div>
              <div className="text-sm text-gray-400">Active Topics</div>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-200">
                {Math.round(calculateProgress())}%
              </div>
              <div className="text-sm text-gray-400">Course Progress</div>
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-200">
                {courseData.streakDays}
              </div>
              <div className="text-sm text-gray-400">Day Streak</div>
              <div className="w-12 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProblemDashboard;
