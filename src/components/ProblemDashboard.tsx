
import { useState } from "react";
import { Search, ChevronDown, ChevronRight, ExternalLink, Youtube, FileText, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ProblemDashboard = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["day-1"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const problems = [
    {
      id: "set-matrix-zeros",
      name: "Set Matrix Zeros",
      status: "unsolved",
      difficulty: "Medium",
      hasYoutube: false,
      hasArticle: false,
      hasSolution: false
    },
    {
      id: "pascal-triangle",
      name: "Pascal's Triangle",
      status: "solved",
      difficulty: "Medium",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    },
    {
      id: "next-permutation",
      name: "Next Permutation",
      status: "solved",
      difficulty: "Medium",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    },
    {
      id: "kadane-algorithm",
      name: "Kadane's Algorithm",
      status: "solved",
      difficulty: "Easy",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    },
    {
      id: "sort-array",
      name: "Sort an array of 0's, 1's and 2's",
      status: "solved",
      difficulty: "Medium",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    },
    {
      id: "stock-buy-sell",
      name: "Stock Buy and Sell",
      status: "solved",
      difficulty: "Easy",
      hasYoutube: true,
      hasArticle: true,
      hasSolution: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Striver's SDE Sheet — Top Coding Interview Problems
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          SDE Sheet contains very handily crafted and picked top coding interview questions from different topics of Data Structures & Algorithms. 
          These questions are one of the most asked coding interview questions in coding interviews of companies like{" "}
          <span className="font-semibold">Google, Amazon, Microsoft, Facebook, Swiggy, Flipkart</span>, etc, and cover almost all of the concepts related to Data Structure & Algorithms.{" "}
          <span className="text-orange-500 cursor-pointer hover:underline">Know More</span>
        </p>
        <div className="mt-4 p-3 bg-orange-50 border-l-4 border-orange-500 text-sm">
          <span className="font-semibold text-orange-600">Note:</span> You can find{" "}
          <span className="font-semibold">LeetCode</span> links for problems available on the internet. However few problems are{" "}
          <span className="font-semibold">not there on LeetCode</span> for which you will not find a practice link attached. We cannot use third-party links due to legal constraints. 
          Also the newly added TUF+ practice links are to give you a free trial of TUF+ which a lot of people asked for.
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Total Progress</h2>
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                  <circle cx="32" cy="32" r="28" stroke="#f97316" strokeWidth="8" fill="none" strokeDasharray="176" strokeDashoffset="176" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">0%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold">0 / 191</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Easy</h3>
            <div className="text-2xl font-bold mb-1">0 / 0</div>
            <div className="text-sm text-gray-500">completed</div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Medium</h3>
            <div className="text-2xl font-bold mb-1">0 / 0</div>
            <div className="text-sm text-gray-500">completed</div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Hard</h3>
            <div className="text-2xl font-bold mb-1">0 / 0</div>
            <div className="text-sm text-gray-500">completed</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-orange-500 border-orange-500">
                All Problems
              </Button>
              <Button variant="ghost" size="sm">
                Revision
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search problems..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                Difficulty <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm">
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
                className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {expandedSections.includes("day-1") ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-semibold">Day 1: Arrays</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">0 / 6</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </button>

              {expandedSections.includes("day-1") && (
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-200">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-3">Problem</div>
                    <div className="col-span-1">Resource (Play)</div>
                    <div className="col-span-1">Resource (Free)</div>
                    <div className="col-span-1">Practice</div>
                    <div className="col-span-1">Note</div>
                    <div className="col-span-1">Revision</div>
                    <div className="col-span-3">Difficulty</div>
                  </div>

                  {problems.map((problem) => (
                    <div key={problem.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <div className="col-span-1 flex items-center">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2",
                          problem.status === "solved" ? "bg-green-500 border-green-500" : "border-gray-300"
                        )} />
                      </div>
                      <div className="col-span-3 flex items-center">
                        <span className={cn(
                          "text-sm",
                          problem.status === "solved" ? "text-orange-500" : "text-gray-900"
                        )}>
                          {problem.name}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center">
                        {problem.hasYoutube ? (
                          <Youtube className="w-4 h-4 text-red-500" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center">
                        {problem.hasArticle ? (
                          <FileText className="w-4 h-4 text-gray-600" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center">
                        {problem.hasSolution ? (
                          <ArrowLeft className="w-4 h-4 text-gray-600" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center">
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="col-span-1 flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded-full" />
                      </div>
                      <div className="col-span-3 flex items-center">
                        <Badge 
                          variant={problem.difficulty === "Easy" ? "secondary" : problem.difficulty === "Medium" ? "default" : "destructive"}
                          className={cn(
                            problem.difficulty === "Easy" && "bg-green-100 text-green-800",
                            problem.difficulty === "Medium" && "bg-yellow-100 text-yellow-800"
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

            {/* Additional days */}
            {["Day 2: Arrays Part–II", "Day 3: Arrays Part–III", "Day 4: Arrays Part–IV"].map((day, index) => (
              <div key={day}>
                <button
                  onClick={() => toggleSection(`day-${index + 2}`)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ChevronRight className="w-4 h-4" />
                    <span className="font-semibold">{day}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">0 / 6</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
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
