
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, Clock, TrendingUp, BookOpen, Code, Trophy, Target, Filter, SortAsc, Search, Play, Star, Lock, CheckCircle } from "lucide-react";

interface ProblemDashboardProps {
  selectedSheet: string;
  searchQuery: string;
}

const ProblemDashboard = ({ selectedSheet, searchQuery }: ProblemDashboardProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data for problems
  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      status: "solved",
      tags: ["Array", "Hash Table"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      acceptance: "49.2%",
      likes: 15420,
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "Medium",
      status: "attempted",
      tags: ["Linked List", "Math", "Recursion"],
      timeComplexity: "O(max(m,n))",
      spaceComplexity: "O(max(m,n))",
      acceptance: "38.4%",
      likes: 9234,
      description: "You are given two non-empty linked lists representing two non-negative integers."
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      status: "unsolved",
      tags: ["Hash Table", "String", "Sliding Window"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(min(m,n))",
      acceptance: "33.8%",
      likes: 12876,
      description: "Given a string s, find the length of the longest substring without repeating characters."
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      status: "unsolved",
      tags: ["Array", "Binary Search", "Divide and Conquer"],
      timeComplexity: "O(log(min(m,n)))",
      spaceComplexity: "O(1)",
      acceptance: "35.2%",
      likes: 8945,
      description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays."
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      status: "solved",
      tags: ["String", "Dynamic Programming"],
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      acceptance: "32.1%",
      likes: 11234,
      description: "Given a string s, return the longest palindromic substring in s."
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "attempted":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-900 text-green-400 border-green-800";
      case "Medium":
        return "bg-yellow-900 text-yellow-400 border-yellow-800";
      case "Hard":
        return "bg-red-900 text-red-400 border-red-800";
      default:
        return "bg-gray-900 text-gray-400 border-gray-800";
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === "all" || problem.status === selectedStatus;
    
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const stats = {
    total: problems.length,
    solved: problems.filter(p => p.status === "solved").length,
    attempted: problems.filter(p => p.status === "attempted").length,
    unsolved: problems.filter(p => p.status === "unsolved").length
  };

  const progressPercentage = (stats.solved / stats.total) * 100;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black border-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-900 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Problems</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-900 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Solved</p>
                <p className="text-2xl font-bold text-green-400">{stats.solved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-900 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Attempted</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.attempted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-900 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Progress</p>
                <p className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="bg-black border-gray-900">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
              <span className="text-sm text-gray-400">{stats.solved}/{stats.total} problems</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-gray-900" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-black border-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-1 text-white text-sm focus:ring-2 focus:ring-gray-700"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-1 text-white text-sm focus:ring-2 focus:ring-gray-700"
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="attempted">Attempted</option>
              <option value="unsolved">Unsolved</option>
            </select>

            <Button variant="outline" size="sm" className="bg-gray-900 border-gray-800 text-white hover:bg-gray-800">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <Card className="bg-black border-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-gray-950 border border-gray-900 rounded-lg p-4 hover:bg-gray-900 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      {getStatusIcon(problem.status)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {problem.title}
                          </h3>
                          <Badge className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {problem.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs bg-gray-900 text-gray-300 border-gray-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Time: {problem.timeComplexity}</span>
                          <span>Space: {problem.spaceComplexity}</span>
                          <span>Acceptance: {problem.acceptance}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{problem.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="bg-gray-900 border-gray-800 text-white hover:bg-gray-800">
                        <Play className="w-4 h-4 mr-2" />
                        Solve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemDashboard;
