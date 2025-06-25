
import { ChevronDown, ChevronRight, FileText, Users, BookOpen, Cpu, Settings, Trophy, Target, TrendingUp, Star, Code, GitBranch, ChevronLeft, Menu, Award, Calendar, Brain, Timer, Bookmark, PenTool, MessageCircle, Lightbulb, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [expandedSections, setExpandedSections] = useState<string[]>(["dsa-sheet", "courses"]);
  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    if (collapsed) return;
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSheetClick = (sheetId: string) => {
    onSheetChange(sheetId);
    navigate(`/sheet/${sheetId}`);
  };

  const handleCourseClick = (courseId: string) => {
    onSheetChange(courseId);
    navigate(`/course/${courseId}`);
  };

  const handleDashboardClick = () => {
    onSheetChange("dashboard");
    navigate("/dashboard");
  };

  const handleCoursesClick = () => {
    onSheetChange("courses");
    navigate("/courses");
  };

  const handleDSASheetsClick = () => {
    onSheetChange("dsa-sheets");
    navigate("/dsa-sheets");
  };

  const handleInterviewPrepClick = () => {
    onSheetChange("interview-prep");
    navigate("/interview-prep");
  };

  const handleCoreCSClick = () => {
    onSheetChange("core-cs");
    navigate("/core-cs");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: TrendingUp,
      items: [],
      badge: "Home",
      action: handleDashboardClick
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
      ],
      action: handleDSASheetsClick
    },
    {
      id: "courses",
      label: "Courses",
      icon: GraduationCap,
      items: [
        { id: "dsa-fundamentals", label: "DSA Fundamentals", progress: 65, badge: "New", action: () => handleCourseClick("dsa-fundamentals") },
        { id: "system-design", label: "System Design", progress: 30, badge: "Pro", action: () => handleCourseClick("system-design") },
        { id: "algorithms-advanced", label: "Advanced Algorithms", progress: 20, action: () => handleCourseClick("algorithms-advanced") },
        { id: "competitive-programming", label: "Competitive Programming", progress: 40, action: () => handleCourseClick("competitive-programming") },
        { id: "interview-prep", label: "Interview Preparation", progress: 85, badge: "Popular", action: () => handleCourseClick("interview-prep") }
      ],
      action: handleCoursesClick
    },
    {
      id: "interview",
      label: "Interview Prep",
      icon: Users,
      items: [
        { id: "behavioral", label: "Behavioral Questions", action: () => handleCourseClick("behavioral") },
        { id: "company-specific", label: "Company Specific", action: () => handleCourseClick("company-specific") },
        { id: "salary-negotiation", label: "Salary Negotiation", badge: "Pro", action: () => handleCourseClick("salary-negotiation") },
        { id: "resume-review", label: "Resume Review", badge: "Pro" }
      ],
      action: handleInterviewPrepClick
    },
    {
      id: "core-subjects",
      label: "Core CS",
      icon: Cpu,
      items: [
        { id: "dbms", label: "Database Management", progress: 45, action: () => handleCourseClick("dbms") },
        { id: "operating-system", label: "Operating Systems", progress: 23, action: () => handleCourseClick("operating-system") },
        { id: "computer-networks", label: "Computer Networks", progress: 67, action: () => handleCourseClick("computer-networks") },
        { id: "oops", label: "Object Oriented Programming", progress: 89, action: () => handleCourseClick("oops") }
      ],
      action: handleCoreCSClick
    }
  ];

  const SidebarButton = ({ item, isActive }: { item: any, isActive: boolean }) => {
    const button = (
      <button
        onClick={() => {
          if (item.action) {
            item.action();
          } else if (item.items.length > 0) {
            toggleSection(item.id);
          } else {
            onSheetChange(item.id);
          }
        }}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-gray-900 transition-all duration-200 group",
          isActive && "bg-gray-900 border border-gray-800",
          collapsed && "justify-center p-4"
        )}
      >
        <div className="flex items-center space-x-3">
          <item.icon className={cn(
            "transition-colors",
            collapsed ? "w-7 h-7" : "w-5 h-5",
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
                  item.badge === "Home" && "bg-blue-900 text-blue-400 border-blue-800",
                  item.badge === "Track" && "bg-cyan-900 text-cyan-400 border-cyan-800",
                  item.badge === "Popular" && "bg-orange-900 text-orange-400 border-orange-800",
                  typeof item.badge === "string" && !["New", "Hot", "Live", "Beta", "Pro", "Home", "Track", "Popular"].includes(item.badge) && "bg-gray-800 text-gray-400 border-gray-700"
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
      "h-screen bg-black border-r border-gray-900 text-white transition-all duration-300",
      collapsed ? "w-20" : "w-72"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-900">
          <div className="flex items-center justify-between">
            {collapsed ? (
              <div className="flex flex-col items-center space-y-3 w-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-sm opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg p-2"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-2xl">
                      <BookOpen className="w-8 h-8 text-white animate-bounce" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                      Byteskill
                    </span>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                      <span className="text-sm bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                        Platform
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <SidebarButton item={item} isActive={selectedSheet === item.id} />
                
                {!collapsed && expandedSections.includes(item.id) && item.items.length > 0 && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-gray-900 pl-4">
                    {item.items.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          if (subItem.action) {
                            subItem.action();
                          } else {
                            handleSheetClick(subItem.id);
                          }
                        }}
                        className={cn(
                          "w-full text-left p-2 rounded-lg text-sm transition-all duration-200 group flex items-center justify-between",
                          selectedSheet === subItem.id 
                            ? "text-white bg-gray-900 font-medium" 
                            : "text-gray-400 hover:text-white hover:bg-gray-900"
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
                              subItem.badge === "Popular" && "bg-orange-900 text-orange-400"
                            )}>
                              {subItem.badge}
                            </Badge>
                          )}
                        </div>
                        {subItem.progress && (
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-800 rounded-full h-1">
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
          <div className="p-4 border-t border-gray-900">
            <div className="bg-black border border-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-gray-300">Today's Goal</span>
              </div>
              <div className="text-xs text-gray-400">Solve 5 problems</div>
              <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
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
