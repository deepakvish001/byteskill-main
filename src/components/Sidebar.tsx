
import { ChevronDown, ChevronRight, FileText, Users, BookOpen, Cpu, Network, Settings, Trophy, Target, TrendingUp, Star, Code, GitBranch, ChevronLeft, Menu, Award, Calendar, Brain, Timer, Bookmark, PenTool, MessageCircle, Lightbulb, History } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  selectedSheet: string;
  onSheetChange: (sheet: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ selectedSheet, onSheetChange, collapsed, onToggleCollapse }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["dsa-sheet", "study-tools"]);

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
      id: "study-tools",
      label: "Study Tools",
      icon: PenTool,
      items: [
        { id: "pomodoro-timer", label: "Pomodoro Timer", badge: "Focus" },
        { id: "flashcards", label: "Flashcards", badge: "Memory" },
        { id: "code-snippets", label: "Code Snippets Library" },
        { id: "study-notes", label: "Study Notes", progress: 45 },
        { id: "progress-tracker", label: "Progress Tracker" },
        { id: "bookmarks", label: "Bookmarked Problems", progress: 23 }
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
      id: "learning-resources",
      label: "Learning Hub",
      icon: Lightbulb,
      items: [
        { id: "video-tutorials", label: "Video Tutorials" },
        { id: "articles", label: "Articles & Blogs" },
        { id: "cheat-sheets", label: "Cheat Sheets" },
        { id: "interview-tips", label: "Interview Tips", badge: "Pro" },
        { id: "company-guides", label: "Company Guides" }
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
      id: "history",
      label: "Study History",
      icon: History,
      items: [],
      badge: "Track"
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

  const SidebarButton = ({ item, isActive }: { item: any, isActive: boolean }) => {
    const button = (
      <button
        onClick={() => item.items.length > 0 ? toggleSection(item.id) : onSheetChange(item.id)}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-gray-800 transition-all duration-200 group",
          isActive && "bg-gray-800 border border-gray-700",
          collapsed && "justify-center p-4"
        )}
      >
        <div className="flex items-center space-x-3">
          <item.icon className={cn(
            "transition-colors",
            collapsed ? "w-6 h-6" : "w-5 h-5",
            isActive ? "text-white" : "text-gray-400 group-hover:text-white"
          )} />
          {!collapsed && (
            <>
              <span className={cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-white" : "text-gray-300 group-hover:text-white"
              )}>
                {item.label}
              </span>
              {item.badge && (
                <Badge className={cn(
                  "text-xs px-2 py-0.5",
                  item.badge === "New" && "bg-green-900 text-green-400 border-green-800",
                  item.badge === "Hot" && "bg-red-900 text-red-400 border-red-800",
                  item.badge === "Live" && "bg-red-900 text-red-400 border-red-800 animate-pulse",
                  item.badge === "Beta" && "bg-purple-900 text-purple-400 border-purple-800",
                  item.badge === "Pro" && "bg-yellow-900 text-yellow-400 border-yellow-800",
                  item.badge === "Focus" && "bg-blue-900 text-blue-400 border-blue-800",
                  item.badge === "Memory" && "bg-pink-900 text-pink-400 border-pink-800",
                  item.badge === "Track" && "bg-cyan-900 text-cyan-400 border-cyan-800",
                  typeof item.badge === "string" && !["New", "Hot", "Live", "Beta", "Pro", "Focus", "Memory", "Track"].includes(item.badge) && "bg-gray-800 text-gray-400 border-gray-700"
                )}>
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </div>
        {!collapsed && item.items.length > 0 && (
          expandedSections.includes(item.id) ? 
            <ChevronDown className="w-4 h-4 text-white" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
        )}
      </button>
    );

    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 border-gray-700">
              <p className="text-white">{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  return (
    <div className={cn(
      "h-screen bg-black border-r border-gray-800 text-white transition-all duration-300",
      collapsed ? "w-16" : "w-72"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-black font-bold text-lg">BS</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">
                    Byteskill
                  </span>
                  <div className="text-xs text-gray-400 flex items-center space-x-1">
                    <span>Learning Platform</span>
                  </div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <SidebarButton item={item} isActive={selectedSheet === item.id} />
                
                {!collapsed && expandedSections.includes(item.id) && item.items.length > 0 && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-gray-800 pl-4">
                    {item.items.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => onSheetChange(subItem.id)}
                        className={cn(
                          "w-full text-left p-2 rounded-lg text-sm transition-all duration-200 group flex items-center justify-between",
                          selectedSheet === subItem.id 
                            ? "text-white bg-gray-800 font-medium" 
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{subItem.label}</span>
                          {subItem.badge && (
                            <Badge className={cn(
                              "text-xs px-1.5 py-0.5",
                              subItem.badge === "New" && "bg-green-900 text-green-400",
                              subItem.badge === "Hot" && "bg-red-900 text-red-400",
                              subItem.badge === "Live" && "bg-red-900 text-red-400 animate-pulse",
                              subItem.badge === "Beta" && "bg-purple-900 text-purple-400",
                              subItem.badge === "Pro" && "bg-yellow-900 text-yellow-400",
                              subItem.badge === "Focus" && "bg-blue-900 text-blue-400",
                              subItem.badge === "Memory" && "bg-pink-900 text-pink-400"
                            )}>
                              {subItem.badge}
                            </Badge>
                          )}
                        </div>
                        {subItem.progress && (
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-700 rounded-full h-1">
                              <div 
                                className="bg-white h-1 rounded-full transition-all" 
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
          <div className="p-4 border-t border-gray-800">
            <div className="bg-black border border-gray-700 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-gray-300">Today's Goal</span>
              </div>
              <div className="text-xs text-gray-400">Solve 5 problems</div>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                <div className="bg-white h-1 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">3/5 completed</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
