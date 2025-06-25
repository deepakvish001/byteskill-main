
import { ChevronDown, ChevronRight, FileText, Users, BookOpen, Cpu, Network, Settings, Trophy, Target, TrendingUp, Star, Code, GitBranch } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  selectedSheet: string;
  onSheetChange: (sheet: string) => void;
}

const Sidebar = ({ selectedSheet, onSheetChange }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["dsa-sheet"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: TrendingUp,
      items: [],
      badge: "New"
    },
    {
      id: "course",
      label: "Courses",
      icon: BookOpen,
      items: [
        { id: "beginner-course", label: "Complete Beginner Course" },
        { id: "advanced-dsa", label: "Advanced DSA Mastery" },
        { id: "system-design-course", label: "System Design Fundamentals" }
      ]
    },
    {
      id: "dsa-sheet",
      label: "DSA Sheets",
      icon: FileText,
      items: [
        { id: "striver-a2z", label: "Striver A2Z Sheet", progress: 45 },
        { id: "striver-sde", label: "Striver SDE Sheet", progress: 78 },
        { id: "striver-79", label: "Striver 79 Sheet", progress: 23 },
        { id: "blind-75", label: "Blind 75 Sheet", progress: 67 },
        { id: "neetcode-150", label: "NeetCode 150", progress: 34 },
        { id: "top-interview", label: "Top Interview Questions", progress: 89 }
      ]
    },
    {
      id: "practice",
      label: "Practice Arena",
      icon: Target,
      items: [
        { id: "daily-challenge", label: "Daily Challenge", badge: "Hot" },
        { id: "weekly-contest", label: "Weekly Contest" },
        { id: "mock-interviews", label: "Mock Interviews" },
        { id: "peer-battles", label: "Peer Code Battles", badge: "New" }
      ]
    },
    {
      id: "dsa-playlist",
      label: "Topic Wise",
      icon: Code,
      items: [
        { id: "array-series", label: "Arrays & Hashing" },
        { id: "binary-search", label: "Binary Search" },
        { id: "string-series", label: "String Algorithms" },
        { id: "linkedlist", label: "Linked Lists" },
        { id: "recursion", label: "Recursion & Backtracking" },
        { id: "stack-queue", label: "Stack & Queue" },
        { id: "tree-series", label: "Trees & Graphs" },
        { id: "dynamic-programming", label: "Dynamic Programming" },
        { id: "greedy", label: "Greedy Algorithms" }
      ]
    },
    {
      id: "interview",
      label: "Interview Prep",
      icon: Users,
      items: [
        { id: "behavioral", label: "Behavioral Questions" },
        { id: "company-specific", label: "Company Specific" },
        { id: "salary-negotiation", label: "Salary Negotiation" }
      ]
    },
    {
      id: "core-subjects",
      label: "Core CS",
      icon: Cpu,
      items: [
        { id: "dbms", label: "Database Management" },
        { id: "operating-system", label: "Operating Systems" },
        { id: "computer-networks", label: "Computer Networks" },
        { id: "oops", label: "Object Oriented Programming" }
      ]
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Trophy,
      items: [],
      badge: "12"
    }
  ];

  return (
    <div className="w-72 bg-gray-950/90 backdrop-blur-lg border-r border-gray-800/50 text-white h-screen overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">BS</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Byteskill
              </span>
              <div className="text-xs text-blue-400">Learning Dashboard</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-300">Learning Streak</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">47 Days</div>
            <div className="text-xs text-gray-400">Keep it up! 🔥</div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => item.items.length > 0 ? toggleSection(item.id) : onSheetChange(item.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-gray-800/50 transition-all duration-200 group",
                  selectedSheet === item.id && "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    selectedSheet === item.id ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400"
                  )} />
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    selectedSheet === item.id ? "text-white" : "text-gray-300 group-hover:text-white"
                  )}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge className={cn(
                      "text-xs px-2 py-0.5",
                      item.badge === "New" && "bg-green-500/20 text-green-400 border-green-500/30",
                      item.badge === "Hot" && "bg-red-500/20 text-red-400 border-red-500/30",
                      typeof item.badge === "string" && !["New", "Hot"].includes(item.badge) && "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    )}>
                      {item.badge}
                    </Badge>
                  )}
                </div>
                {item.items.length > 0 && (
                  expandedSections.includes(item.id) ? 
                    <ChevronDown className="w-4 h-4 text-blue-400" /> : 
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                )}
              </button>
              
              {expandedSections.includes(item.id) && item.items.length > 0 && (
                <div className="ml-6 mt-2 space-y-1 border-l border-gray-700/50 pl-4">
                  {item.items.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onSheetChange(subItem.id)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg text-sm transition-all duration-200 group flex items-center justify-between",
                        selectedSheet === subItem.id 
                          ? "text-blue-400 bg-blue-500/10 font-medium" 
                          : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{subItem.label}</span>
                        {subItem.badge && (
                          <Badge className={cn(
                            "text-xs px-1.5 py-0.5",
                            subItem.badge === "New" && "bg-green-500/20 text-green-400",
                            subItem.badge === "Hot" && "bg-red-500/20 text-red-400"
                          )}>
                            {subItem.badge}
                          </Badge>
                        )}
                      </div>
                      {subItem.progress && (
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-700 rounded-full h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full transition-all" 
                              style={{ width: `${subItem.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{subItem.progress}%</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
