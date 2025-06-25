import { useState, useEffect } from "react";
import { Play, ExternalLink, BookOpen, Video, FileText, Clock, Filter, Search, Star, Bookmark, Check, X } from "lucide-react";
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
}

interface Sheet {
  id: string;
  name: string;
  problems: Problem[];
  description: string;
  totalTime: number;
  completion: number;
}

const mockSheets: Record<string, Sheet> = {
  "striver-sde": {
    id: "striver-sde",
    name: "Striver SDE Sheet",
    description: "180 most important coding interview problems",
    totalTime: 2400,
    completion: 78,
    problems: [
      {
        id: 1,
        title: "Set Matrix Zeroes",
        difficulty: "Medium",
        status: "Solved",
        tags: ["Array", "Matrix"],
        companies: ["Google", "Microsoft", "Amazon"],
        timeSpent: 45,
        rating: 4,
        bookmarked: true,
        article: "https://takeuforward.org/data-structure/set-matrix-zero/",
        video: "https://www.youtube.com/watch?v=M65xBewcqcI",
        notes: "https://takeuforward.org/notes/set-matrix-zero"
      },
      {
        id: 2,
        title: "Pascal's Triangle",
        difficulty: "Easy",
        status: "Attempted",
        tags: ["Array", "Dynamic Programming"],
        companies: ["Apple", "Facebook"],
        timeSpent: 30,
        rating: 3,
        article: "https://takeuforward.org/data-structure/program-to-generate-pascals-triangle/",
        video: "https://www.youtube.com/watch?v=6FLvhQjZqvM",
        notes: "https://takeuforward.org/notes/pascals-triangle"
      },
      {
        id: 3,
        title: "Next Permutation",
        difficulty: "Medium",
        status: "Not Started",
        tags: ["Array", "Two Pointers"],
        companies: ["Google", "Amazon"],
        article: "https://takeuforward.org/data-structure/next_permutation-find-next-lexicographically-greater-permutation/",
        video: "https://www.youtube.com/watch?v=LuLCLgMElus",
        notes: "https://takeuforward.org/notes/next-permutation"
      }
    ]
  }
};

interface ProblemDashboardProps {
  selectedSheet: string;
  searchQuery: string;
}

const ProblemDashboard = ({ selectedSheet, searchQuery }: ProblemDashboardProps) => {
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentTime, setCurrentTime] = useState<string>("");

  const sheet = mockSheets[selectedSheet];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!sheet) return;
    
    let filtered = sheet.problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === "all" || problem.status === statusFilter;
      
      return matchesSearch && matchesDifficulty && matchesStatus;
    });

    if (sortBy === "difficulty") {
      const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
      filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    } else if (sortBy === "status") {
      const statusOrder = { "Solved": 1, "Attempted": 2, "Not Started": 3 };
      filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }

    setFilteredProblems(filtered);
  }, [sheet, searchQuery, difficultyFilter, statusFilter, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-400 bg-green-900/20 border-green-800";
      case "Medium": return "text-yellow-400 bg-yellow-900/20 border-yellow-800";
      case "Hard": return "text-red-400 bg-red-900/20 border-red-800";
      default: return "text-gray-400 bg-gray-900/20 border-gray-800";
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "Solved":
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded border-2 border-green-500 bg-green-500">
            <Check className="w-4 h-4 text-white" />
          </div>
        );
      case "Attempted":
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded border-2 border-yellow-500 bg-yellow-500">
            <X className="w-4 h-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded border-2 border-gray-500 bg-gray-900"></div>
        );
    }
  };

  const handleSolveClick = (problemId: number) => {
    window.open(`https://leetcode.com/problems/${problemId}`, '_blank');
  };

  if (!sheet) {
    return (
      <div className="text-white p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Sheet not found</h2>
        <p className="text-gray-400">The selected sheet could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="text-white space-y-8 animate-fade-in">
      {/* Status Progress Section */}
      <StatusProgressBox />

      {/* Header Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {sheet.name}
            </h1>
            <p className="text-gray-400 text-lg">{sheet.description}</p>
            <div className="flex items-center space-x-4 mt-3">
              <Badge className="bg-blue-900/50 text-blue-400 border-blue-800">
                {filteredProblems.length} Problems
              </Badge>
              <Badge className="bg-green-900/50 text-green-400 border-green-800">
                {sheet.completion}% Complete
              </Badge>
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono">{currentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Filters:</span>
          </div>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Solved">Solved</SelectItem>
              <SelectItem value="Attempted">Attempted</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {filteredProblems.map((problem, index) => (
          <div
            key={problem.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Status Indicator */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIndicator(problem.status)}
                </div>

                {/* Problem Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-gray-400 font-mono text-sm">
                      Lec {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {problem.title}
                    </h3>
                    {problem.bookmarked && (
                      <Bookmark className="w-5 h-5 text-yellow-400 fill-current" />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                    <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                      {problem.status}
                    </Badge>
                    {problem.timeSpent && (
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{problem.timeSpent}min</span>
                      </div>
                    )}
                    {problem.rating && (
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < problem.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} className="bg-blue-900/30 text-blue-400 border-blue-900 hover:bg-blue-900/50 transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company) => (
                      <Badge key={company} className="bg-purple-900/30 text-purple-400 border-purple-900">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 ml-4">
                <Button
                  onClick={() => handleSolveClick(problem.id)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Solve</span>
                </Button>

                <div className="flex space-x-2">
                  {problem.article && (
                    <Button
                      onClick={() => window.open(problem.article, '_blank')}
                      size="sm"
                      className="bg-orange-900/30 hover:bg-orange-900/50 text-orange-400 border-orange-900 p-2"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  )}
                  {problem.video && (
                    <Button
                      onClick={() => window.open(problem.video, '_blank')}
                      size="sm"
                      className="bg-red-900/30 hover:bg-red-900/50 text-red-400 border-red-900 p-2"
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                  )}
                  {problem.notes && (
                    <Button
                      onClick={() => window.open(problem.notes, '_blank')}
                      size="sm"
                      className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border-blue-900 p-2"
                    >
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No problems found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProblemDashboard;
