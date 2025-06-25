
import { useState } from "react";
import { Search, ChevronDown, ChevronRight, ExternalLink, Youtube, FileText, Plus, ArrowLeft, Shuffle } from "lucide-react";
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
}

interface ProblemDashboardProps {
  selectedSheet: string;
}

const ProblemDashboard = ({ selectedSheet }: ProblemDashboardProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["day-1"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [problemStatuses, setProblemStatuses] = useState<Record<string, "solved" | "unsolved" | "attempted">>({
    "pascal-triangle": "solved",
    "next-permutation": "solved",
    "kadane-algorithm": "solved",
    "sort-array": "solved",
    "stock-buy-sell": "solved"
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
    const allProblems = problems.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (difficultyFilter === "all" || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase())
    );
    if (allProblems.length > 0) {
      const randomProblem = allProblems[Math.floor(Math.random() * allProblems.length)];
      alert(`Random Problem: ${randomProblem.name} (${randomProblem.difficulty})`);
    }
  };

  const problems: Problem[] = [
    {
      id: "set-matrix-zeros",
      name: "Set Matrix Zeros",
      status: problemStatuses["set-matrix-zeros"] || "unsolved",
      difficulty: "Medium",
      hasYoutube: false,
      hasArticle: false,
      hasSolution: false
    },
    {
      id: "pascal-triangle",
      name: "Pascal's Triangle",
      status: problemStatuses["pascal-triangle"] || "unsolved",
      difficulty: "Medium",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    },
    {
      id: "next-permutation",
      name: "Next Permutation",
      status: problemStatuses["next-permutation"] || "unsolved",
      difficulty: "Medium",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    },
    {
      id: "kadane-algorithm",
      name: "Kadane's Algorithm",
      status: problemStatuses["kadane-algorithm"] || "unsolved",
      difficulty: "Easy",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    },
    {
      id: "sort-array",
      name: "Sort an array of 0's, 1's and 2's",
      status: problemStatuses["sort-array"] || "unsolved",
      difficulty: "Medium",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    },
    {
      id: "stock-buy-sell",
      name: "Stock Buy and Sell",
      status: problemStatuses["stock-buy-sell"] || "unsolved",
      difficulty: "Easy",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    }
  ];

  const filteredProblems = problems.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (difficultyFilter === "all" || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase())
  );

  const solvedCount = problems.filter(p => p.status === "solved").length;
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
      default: return "DSA Problem Sheet";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {getSheetTitle()}
        </h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          SDE Sheet contains very handily crafted and picked top coding interview questions from different topics of Data Structures & Algorithms. 
          These questions are one of the most asked coding interview questions in coding interviews of companies like{" "}
          <span className="font-semibold text-blue-400">Google, Amazon, Microsoft, Facebook, Swiggy, Flipkart</span>, etc, and cover almost all of the concepts related to Data Structure & Algorithms.{" "}
          <span className="text-blue-400 cursor-pointer hover:underline">Know More</span>
        </p>
        <div className="mt-4 p-3 bg-blue-900/20 border-l-4 border-blue-500 text-sm">
          <span className="font-semibold text-blue-400">Note:</span> You can find{" "}
          <span className="font-semibold text-white">LeetCode</span> links for problems available on the internet. However few problems are{" "}
          <span className="font-semibold text-white">not there on LeetCode</span> for which you will not find a practice link attached. We cannot use third-party links due to legal constraints. 
          Also the newly added TUF+ practice links are to give you a free trial of TUF+ which a lot of people asked for.
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 mb-6">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Total Progress</h2>
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#374151" strokeWidth="8" fill="none" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke="#3b82f6" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray="176" 
                    strokeDashoffset={176 - (176 * progressPercentage / 100)} 
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-white">{solvedCount} / {totalCount}</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-semibold text-white mb-2">Easy</h3>
            <div className="text-2xl font-bold mb-1 text-green-400">{easySolved} / {easyCount}</div>
            <div className="text-sm text-gray-400">completed</div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-white mb-2">Medium</h3>
            <div className="text-2xl font-bold mb-1 text-yellow-400">{mediumSolved} / {mediumCount}</div>
            <div className="text-sm text-gray-400">completed</div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-white mb-2">Hard</h3>
            <div className="text-2xl font-bold mb-1 text-red-400">{hardSolved} / {hardCount}</div>
            <div className="text-sm text-gray-400">completed</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-blue-400 border-blue-500 bg-blue-500/10">
                All Problems
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Revision
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search problems..." 
                  className="pl-10 w-64 bg-gray-800 border-gray-600 text-white placeholder-gray-400" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-md text-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-400 border-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={getRandomProblem}
              >
                <Shuffle className="w-4 h-4 mr-1" />
                Pick Random
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <button
                onClick={() => toggleSection("day-1")}
                className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {expandedSections.includes("day-1") ? (
                    <ChevronDown className="w-4 h-4 text-blue-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="font-semibold text-white">Day 1: Arrays</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">{solvedCount} / {filteredProblems.length}</span>
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </button>

              {expandedSections.includes("day-1") && (
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-gray-700">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-3">Problem</div>
                    <div className="col-span-1">Resource (Play)</div>
                    <div className="col-span-1">Resource (Free)</div>
                    <div className="col-span-1">Practice</div>
                    <div className="col-span-1">Note</div>
                    <div className="col-span-1">Revision</div>
                    <div className="col-span-3">Difficulty</div>
                  </div>

                  {filteredProblems.map((problem) => (
                    <div key={problem.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-800 border-b border-gray-800 transition-colors">
                      <div className="col-span-1 flex items-center">
                        <button
                          onClick={() => toggleProblemStatus(problem.id)}
                          className={cn(
                            "w-4 h-4 rounded-full border-2 transition-colors",
                            problem.status === "solved" ? "bg-green-500 border-green-500" : 
                            problem.status === "attempted" ? "bg-yellow-500 border-yellow-500" : 
                            "border-gray-500 hover:border-blue-400"
                          )}
                        />
                      </div>
                      <div className="col-span-3 flex items-center">
                        <span className={cn(
                          "text-sm cursor-pointer hover:text-blue-400 transition-colors",
                          problem.status === "solved" ? "text-blue-400" : "text-white"
                        )}>
                          {problem.name}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center">
                        {problem.hasYoutube ? (
                          <button className="text-red-500 hover:text-red-400 transition-colors">
                            <Youtube className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center">
                        {problem.hasArticle ? (
                          <button className="text-blue-400 hover:text-blue-300 transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center">
                        {problem.hasSolution ? (
                          <button className="text-green-400 hover:text-green-300 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center">
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <button className="w-4 h-4 bg-gray-700 rounded-full hover:bg-blue-500 transition-colors" />
                      </div>
                      <div className="col-span-3 flex items-center">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "border-2",
                            problem.difficulty === "Easy" && "bg-green-900/20 text-green-400 border-green-500",
                            problem.difficulty === "Medium" && "bg-yellow-900/20 text-yellow-400 border-yellow-500",
                            problem.difficulty === "Hard" && "bg-red-900/20 text-red-400 border-red-500"
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

            {["Day 2: Arrays Part–II", "Day 3: Arrays Part–III", "Day 4: Arrays Part–IV"].map((day, index) => (
              <div key={day}>
                <button
                  onClick={() => toggleSection(`day-${index + 2}`)}
                  className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-white">{day}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">0 / 6</span>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
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
