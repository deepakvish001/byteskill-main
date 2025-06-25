
import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, ExternalLink, Youtube, FileText, Plus, Shuffle, Filter, SortAsc, Clock, Zap, Trophy, BookOpen, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Problem {
  id: string;
  name: string;
  status: "solved" | "unsolved" | "attempted";
  difficulty: "Easy" | "Medium" | "Hard";
  hasYoutube: boolean;
  hasArticle: boolean;
  hasSolution: boolean;
  estimatedTime: number;
  topics: string[];
  companies: string[];
  frequency: number;
}

interface ProblemDashboardProps {
  selectedSheet: string;
  searchQuery: string;
}

const ProblemDashboard = ({ selectedSheet, searchQuery }: ProblemDashboardProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["day-1"]);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [problemStatuses, setProblemStatuses] = useState<Record<string, "solved" | "unsolved" | "attempted">>({
    "pascal-triangle": "solved",
    "next-permutation": "solved",
    "kadane-algorithm": "solved",
    "sort-array": "solved",
    "stock-buy-sell": "solved",
    "two-sum": "attempted",
    "valid-parentheses": "solved"
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleProblemStatus = (problemId: string) => {
    setProblemStatuses(prev => {
      const currentStatus = prev[problemId] || "unsolved";
      const nextStatus = currentStatus === "unsolved" ? "attempted" : 
                        currentStatus === "attempted" ? "solved" : "unsolved";
      return { ...prev, [problemId]: nextStatus };
    });
  };

  const getRandomProblem = () => {
    const allProblems = filteredProblems;
    if (allProblems.length > 0) {
      const randomProblem = allProblems[Math.floor(Math.random() * allProblems.length)];
      alert(`🎯 Random Problem Selected!\n\n${randomProblem.name}\nDifficulty: ${randomProblem.difficulty}\nEstimated Time: ${randomProblem.estimatedTime} min`);
    }
  };

  const problems: Problem[] = [
    {
      id: "two-sum",
      name: "Two Sum",
      status: problemStatuses["two-sum"] || "unsolved",
      difficulty: "Easy",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true,
      estimatedTime: 15,
      topics: ["Array", "Hash Table"],
      companies: ["Google", "Amazon", "Microsoft"],
      frequency: 95
    },
    {
      id: "valid-parentheses",
      name: "Valid Parentheses",
      status: problemStatuses["valid-parentheses"] || "unsolved",
      difficulty: "Easy",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true,
      estimatedTime: 20,
      topics: ["Stack", "String"],
      companies: ["Facebook", "Apple"],
      frequency: 88
    },
    {
      id: "set-matrix-zeros",
      name: "Set Matrix Zeros",
      status: problemStatuses["set-matrix-zeros"] || "unsolved",
      difficulty: "Medium",
      hasYoutube: false,
      hasArticle: false,
      hasSolution: false,
      estimatedTime: 30,
      topics: ["Array", "Matrix"],
      companies: ["Microsoft", "Apple"],
      frequency: 75
    },
    {
      id: "pascal-triangle",
      name: "Pascal's Triangle",
      status: problemStatuses["pascal-triangle"] || "unsolved",
      difficulty: "Easy",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true,
      estimatedTime: 25,
      topics: ["Array", "Dynamic Programming"],
      companies: ["Google", "Amazon"],
      frequency: 82
    },
    {
      id: "next-permutation",
      name: "Next Permutation",
      status: problemStatuses["next-permutation"] || "unsolved",
      difficulty: "Medium",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true,
      estimatedTime: 35,
      topics: ["Array", "Two Pointers"],
      companies: ["Amazon", "Microsoft"],
      frequency: 70
    },
    {
      id: "kadane-algorithm",
      name: "Maximum Subarray (Kadane's Algorithm)",
      status: problemStatuses["kadane-algorithm"] || "unsolved",
      difficulty: "Medium",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true,
      estimatedTime: 25,
      topics: ["Array", "Dynamic Programming"],
      companies: ["Google", "Facebook", "Netflix"],
      frequency: 92
    },
    {
      id: "sort-array",
      name: "Sort Colors (Dutch Flag)",
      status: problemStatuses["sort-array"] || "unsolved",
      difficulty: "Medium",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true,
      estimatedTime: 20,
      topics: ["Array", "Two Pointers", "Sorting"],
      companies: ["Apple", "Microsoft"],
      frequency: 78
    },
    {
      id: "stock-buy-sell",
      name: "Best Time to Buy and Sell Stock",
      status: problemStatuses["stock-buy-sell"] || "unsolved",
      difficulty: "Easy",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true,
      estimatedTime: 20,
      topics: ["Array", "Dynamic Programming"],
      companies: ["Amazon", "Bloomberg"],
      frequency: 89
    }
  ];

  const searchTerm = searchQuery || localSearchTerm;

  const filteredProblems = useMemo(() => {
    let filtered = problems.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           p.companies.some(company => company.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = difficultyFilter === "all" || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      
      return matchesSearch && matchesDifficulty && matchesStatus;
    });

    // Apply sorting
    switch (sortBy) {
      case "difficulty":
        const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
      case "frequency":
        filtered.sort((a, b) => b.frequency - a.frequency);
        break;
      case "time":
        filtered.sort((a, b) => a.estimatedTime - b.estimatedTime);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [problems, searchTerm, difficultyFilter, statusFilter, sortBy, problemStatuses]);

  const solvedCount = problems.filter(p => p.status === "solved").length;
  const attemptedCount = problems.filter(p => p.status === "attempted").length;
  const totalCount = problems.length;
  const progressPercentage = Math.round((solvedCount / totalCount) * 100);

  const easyCount = problems.filter(p => p.difficulty === "Easy").length;
  const mediumCount = problems.filter(p => p.difficulty === "Medium").length;
  const hardCount = problems.filter(p => p.difficulty === "Hard").length;

  const easySolved = problems.filter(p => p.difficulty === "Easy" && p.status === "solved").length;
  const mediumSolved = problems.filter(p => p.difficulty === "Medium" && p.status === "solved").length;
  const hardSolved = problems.filter(p => p.difficulty === "Hard" && p.status === "solved").length;

  const getSheetTitle = () => {
    switch (selectedSheet) {
      case "striver-sde": return "Striver's SDE Sheet — Top Coding Interview Problems";
      case "striver-a2z": return "Striver's A2Z DSA Course/Sheet";
      case "blind-75": return "Blind 75 LeetCode Questions";
      case "neetcode-150": return "NeetCode 150 Essential Problems";
      default: return "DSA Problem Sheet";
    }
  };

  const getSheetDescription = () => {
    switch (selectedSheet) {
      case "striver-sde": 
        return "Carefully curated collection of top coding interview questions from leading tech companies. Master these problems to excel in your next technical interview.";
      case "striver-a2z": 
        return "Complete A-Z DSA learning path covering all fundamental concepts with practice problems arranged in optimal learning sequence.";
      case "blind-75": 
        return "The most essential 75 LeetCode problems that cover all important patterns and concepts needed for technical interviews.";
      default: 
        return "Comprehensive collection of data structures and algorithms problems to enhance your coding skills.";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              {getSheetTitle()}
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed max-w-4xl">
              {getSheetDescription()}
            </p>
          </div>
          <div className="flex items-center space-x-3 ml-6">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{totalCount}</div>
            <div className="text-sm text-gray-400">Total Problems</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{solvedCount}</div>
            <div className="text-sm text-gray-400">Solved</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{attemptedCount}</div>
            <div className="text-sm text-gray-400">Attempted</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{progressPercentage}%</div>
            <div className="text-sm text-gray-400">Progress</div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Progress Analytics
            </h2>
            <div className="relative">
              <div className="w-20 h-20 relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#374151" strokeWidth="6" fill="none" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    stroke="url(#gradient)" 
                    strokeWidth="6" 
                    fill="none" 
                    strokeDasharray="201" 
                    strokeDashoffset={201 - (201 * progressPercentage / 100)} 
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-white">Easy</h3>
            <div className="text-3xl font-bold text-green-400">{easySolved} / {easyCount}</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${easyCount > 0 ? (easySolved / easyCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-white">Medium</h3>
            <div className="text-3xl font-bold text-yellow-400">{mediumSolved} / {mediumCount}</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${mediumCount > 0 ? (mediumSolved / mediumCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-white">Hard</h3>
            <div className="text-3xl font-bold text-red-400">{hardSolved} / {hardCount}</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${hardCount > 0 ? (hardSolved / hardCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems Section */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
        {/* Controls */}
        <div className="p-6 border-b border-gray-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-400 border-blue-500 bg-blue-500/10 hover:bg-blue-500 hover:text-white"
              >
                All Problems
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Favorites
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Revision
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-300 border-gray-600 hover:bg-gray-800"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-400 border-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={getRandomProblem}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Random
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search by problem name, topic, or company..." 
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500" 
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
              />
            </div>
            
            {showFilters && (
              <>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-md text-sm min-w-[120px]"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-md text-sm min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="solved">Solved</option>
                  <option value="attempted">Attempted</option>
                  <option value="unsolved">Unsolved</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-md text-sm min-w-[120px]"
                >
                  <option value="default">Default Order</option>
                  <option value="name">Name</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="frequency">Frequency</option>
                  <option value="time">Time</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Problems List */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <button
                onClick={() => toggleSection("day-1")}
                className="flex items-center justify-between w-full p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/30"
              >
                <div className="flex items-center space-x-4">
                  {expandedSections.includes("day-1") ? (
                    <ChevronDown className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-blue-400" />
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <span className="font-semibold text-white text-lg">Arrays & Hashing Fundamentals</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Progress</div>
                    <div className="text-white font-semibold">{solvedCount} / {filteredProblems.length}</div>
                  </div>
                  <div className="w-32 bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700" 
                      style={{ width: `${filteredProblems.length > 0 ? (solvedCount / filteredProblems.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </button>

              {expandedSections.includes("day-1") && (
                <div className="mt-4 space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-400 border-b border-gray-700/50">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-4">Problem & Topics</div>
                    <div className="col-span-1">Resources</div>
                    <div className="col-span-1">Time</div>
                    <div className="col-span-2">Companies</div>
                    <div className="col-span-1">Frequency</div>
                    <div className="col-span-2">Difficulty</div>
                  </div>

                  {/* Problems */}
                  {filteredProblems.map((problem, index) => (
                    <div key={problem.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-800/30 border border-gray-800/50 rounded-lg transition-all duration-200 group">
                      <div className="col-span-1 flex items-center">
                        <button
                          onClick={() => toggleProblemStatus(problem.id)}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                            problem.status === "solved" ? "bg-green-500 border-green-500" : 
                            problem.status === "attempted" ? "bg-yellow-500 border-yellow-500" : 
                            "border-gray-500 hover:border-blue-400 group-hover:scale-110"
                          )}
                        >
                          {problem.status === "solved" && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </button>
                      </div>
                      
                      <div className="col-span-4 flex flex-col space-y-1">
                        <span className={cn(
                          "text-sm font-medium cursor-pointer hover:text-blue-400 transition-colors",
                          problem.status === "solved" ? "text-blue-400" : "text-white"
                        )}>
                          {index + 1}. {problem.name}
                        </span>
                        <div className="flex items-center space-x-1">
                          {problem.topics.slice(0, 2).map((topic) => (
                            <Badge key={topic} className="text-xs bg-gray-700/50 text-gray-300 border-gray-600">
                              {topic}
                            </Badge>
                          ))}
                          {problem.topics.length > 2 && (
                            <span className="text-xs text-gray-500">+{problem.topics.length - 2}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex items-center space-x-2">
                        {problem.hasYoutube && (
                          <button className="text-red-500 hover:text-red-400 transition-colors p-1">
                            <Youtube className="w-4 h-4" />
                          </button>
                        )}
                        {problem.hasArticle && (
                          <button className="text-blue-400 hover:text-blue-300 transition-colors p-1">
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        {problem.hasSolution && (
                          <button className="text-green-400 hover:text-green-300 transition-colors p-1">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="col-span-1 flex items-center">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-sm">{problem.estimatedTime}m</span>
                        </div>
                      </div>
                      
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center space-x-1">
                          {problem.companies.slice(0, 2).map((company) => (
                            <Badge key={company} className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                              {company}
                            </Badge>
                          ))}
                          {problem.companies.length > 2 && (
                            <span className="text-xs text-gray-500">+{problem.companies.length - 2}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex items-center">
                        <div className="flex items-center space-x-1">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            problem.frequency >= 90 ? "bg-red-500" :
                            problem.frequency >= 75 ? "bg-yellow-500" : "bg-green-500"
                          )}></div>
                          <span className="text-sm text-gray-300">{problem.frequency}%</span>
                        </div>
                      </div>
                      
                      <div className="col-span-2 flex items-center">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "border-2 font-medium",
                            problem.difficulty === "Easy" && "bg-green-900/20 text-green-400 border-green-500/50",
                            problem.difficulty === "Medium" && "bg-yellow-900/20 text-yellow-400 border-yellow-500/50",
                            problem.difficulty === "Hard" && "bg-red-900/20 text-red-400 border-red-500/50"
                          )}
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional sections */}
            {["Dynamic Programming Mastery", "Graph Algorithms Deep Dive", "Advanced Data Structures"].map((section, index) => (
              <div key={section}>
                <button
                  onClick={() => toggleSection(`section-${index + 2}`)}
                  className="flex items-center justify-between w-full p-4 bg-gray-800/30 rounded-xl hover:bg-gray-700/30 transition-all duration-200 border border-gray-700/20"
                >
                  <div className="flex items-center space-x-4">
                    <ChevronRight className="w-5 h-5 text-blue-400" />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 2}</span>
                      </div>
                      <span className="font-semibold text-white">{section}</span>
                      <Badge className="bg-gray-700 text-gray-300 text-xs">Coming Soon</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-sm text-gray-500">0 / 8</span>
                    <div className="w-32 bg-gray-700 rounded-full h-3">
                      <div className="bg-gray-600 h-3 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDashboard;
