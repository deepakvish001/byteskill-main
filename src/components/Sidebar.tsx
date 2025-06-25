
import { ChevronDown, ChevronRight, FileText, Users, BookOpen, Cpu, Network, Settings, Trophy, Target, TrendingUp, Star, Code, GitBranch, ChevronLeft, Menu, Flame, Award, Calendar, Brain } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  selectedSheet: string;
  onSheetChange: (sheet: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ selectedSheet, onSheetChange, collapsed, onToggleCollapse }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["dsa-sheet"]);

  const toggleSection = (section: string) => {
    if (collapsed) return;
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
        { id: "beginner-course", label: "Complete Beginner Course", progress: 12 },
        { id: "advanced-dsa", label: "Advanced DSA Mastery", progress: 67 },
        { id: "system-design-course", label: "System Design Fundamentals", progress: 34 },
        { id: "interview-prep", label: "Interview Preparation", progress: 89 }
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
        { id: "weekly-contest", label: "Weekly Contest", badge: "Live" },
        { id: "mock-interviews", label: "Mock Interviews" },
        { id: "peer-battles", label: "Peer Code Battles", badge: "New" },
        { id: "speed-coding", label: "Speed Coding", badge: "Beta" }
      ]
    },
    {
      id: "dsa-playlist",
      label: "Topic Wise",
      icon: Code,
      items: [
        { id: "array-series", label: "Arrays & Hashing", progress: 78 },
        { id: "binary-search", label: "Binary Search", progress: 45 },
        { id: "string-series", label: "String Algorithms", progress: 67 },
        { id: "linkedlist", label: "Linked Lists", progress: 89 },
        { id: "recursion", label: "Recursion & Backtracking", progress: 34 },
        { id: "stack-queue", label: "Stack & Queue", progress: 56 },
        { id: "tree-series", label: "Trees & Graphs", progress: 23 },
        { id: "dynamic-programming", label: "Dynamic Programming", progress: 12 },
        { id: "greedy", label: "Greedy Algorithms", progress: 78 }
      ]
    },
    {
      id: "interview",
      label: "Interview Prep",
      icon: Users,
      items: [
        { id: "behavioral", label: "Behavioral Questions" },
        { id: "company-specific", label: "Company Specific" },
        { id: "salary-negotiation", label: "Salary Negotiation" },
        { id: "resume-review", label: "Resume Review", badge: "Pro" }
      ]
    },
    {
      id: "core-subjects",
      label: "Core CS",
      icon: Cpu,
      items: [
        { id: "dbms", label: "Database Management", progress: 45 },
        { id: "operating-system", label: "Operating Systems", progress: 23 },
        { id: "computer-networks", label: "Computer Networks", progress: 67 },
        { id: "oops", label: "Object Oriented Programming", progress: 89 }
      ]
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Trophy,
      items: [],
      badge: "15"
    },
    {
      id: "ai-mentor",
      label: "AI Mentor",
      icon: Brain,
      items: [],
      badge: "Beta"
    }
  ];

  return (
    <div className={cn(
      "h-screen bg-black/95 backdrop-blur-xl border-r border-blue-500/20 text-white transition-all duration-300 shadow-2xl shadow-blue-900/10",
      collapsed ? "w-16" : "w-72"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-lg">BS</span>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-white bg-clip-text text-transparent">
                    Byteskill
                  </span>
                  <div className="text-xs text-blue-400 flex items-center space-x-1">
                    <Flame className="w-3 h-3" />
                    <span>Learning Hub</span>
                  </div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="text-blue-400 hover:bg-blue-500/10 rounded-lg"
            >
              {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>
          
          {!collapsed && (
            <div className="mt-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-300">Learning Streak</span>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">47 Days</div>
              <div className="text-xs text-gray-400 flex items-center space-x-2">
                <span>Next milestone: 50 days</span>
                <Award className="w-3 h-3 text-yellow-400" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => item.items.length > 0 ? toggleSection(item.id) : onSheetChange(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-blue-500/10 transition-all duration-200 group",
                    selectedSheet === item.id && "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30",
                    collapsed && "justify-center"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors",
                      selectedSheet === item.id ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400"
                    )} />
                    {!collapsed && (
                      <>
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
                            item.badge === "Live" && "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
                            item.badge === "Beta" && "bg-purple-500/20 text-purple-400 border-purple-500/30",
                            item.badge === "Pro" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                            typeof item.badge === "string" && !["New", "Hot", "Live", "Beta", "Pro"].includes(item.badge) && "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          )}>
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                  {!collapsed && item.items.length > 0 && (
                    expandedSections.includes(item.id) ? 
                      <ChevronDown className="w-4 h-4 text-blue-400" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                  )}
                </button>
                
                {!collapsed && expandedSections.includes(item.id) && item.items.length > 0 && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-blue-500/20 pl-4">
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
                              subItem.badge === "Hot" && "bg-red-500/20 text-red-400",
                              subItem.badge === "Live" && "bg-red-500/20 text-red-400 animate-pulse",
                              subItem.badge === "Beta" && "bg-purple-500/20 text-purple-400",
                              subItem.badge === "Pro" && "bg-yellow-500/20 text-yellow-400"
                            )}>
                              {subItem.badge}
                            </Badge>
                          )}
                        </div>
                        {subItem.progress && (
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-700 rounded-full h-1">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full transition-all" 
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
        </ScrollArea>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-blue-500/20">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Today's Goal</span>
              </div>
              <div className="text-xs text-gray-400">Solve 3 problems</div>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full" style={{ width: '66%' }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">2/3 completed</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
