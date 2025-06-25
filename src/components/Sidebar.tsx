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
const Sidebar = ({
  selectedSheet,
  onSheetChange,
  collapsed,
  onToggleCollapse
}: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const navigate = useNavigate();
  const toggleSection = (section: string) => {
    if (collapsed) return;
    setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };
  const handleDashboardClick = () => {
    onSheetChange("dashboard");
    navigate("/dashboard");
  };
  const handleDSASheetsClick = () => {
    onSheetChange("dsa-sheets");
    navigate("/dsa-sheets");
  };
  const handleCoursesClick = () => {
    onSheetChange("courses");
    navigate("/courses");
  };
  const handleInterviewPrepClick = () => {
    onSheetChange("interview-prep");
    navigate("/interview-prep");
  };
  const handleCoreCSClick = () => {
    onSheetChange("core-cs");
    navigate("/core-cs");
  };
  const menuItems = [{
    id: "dashboard",
    label: "Dashboard",
    icon: TrendingUp,
    items: [],
    badge: "Home",
    action: handleDashboardClick
  }, {
    id: "dsa-sheets",
    label: "DSA Sheets",
    icon: FileText,
    items: [],
    action: handleDSASheetsClick
  }, {
    id: "courses",
    label: "Courses",
    icon: GraduationCap,
    items: [],
    action: handleCoursesClick
  }, {
    id: "interview-prep",
    label: "Interview Prep",
    icon: Users,
    items: [],
    action: handleInterviewPrepClick
  }, {
    id: "core-cs",
    label: "Core CS",
    icon: Cpu,
    items: [],
    action: handleCoreCSClick
  }];
  const SidebarButton = ({
    item,
    isActive
  }: {
    item: any;
    isActive: boolean;
  }) => {
    const button = <button onClick={() => {
      if (item.action) {
        item.action();
      } else if (item.items.length > 0) {
        toggleSection(item.id);
      } else {
        onSheetChange(item.id);
      }
    }} className={cn("w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-gray-900 transition-all duration-200 group", isActive && "bg-gray-900 border border-gray-800", collapsed && "justify-center p-4")}>
        <div className="flex items-center space-x-3">
          <item.icon className={cn("transition-colors", collapsed ? "w-7 h-7" : "w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
          {!collapsed && <>
              <span className={cn("text-sm font-medium transition-colors", isActive ? "text-white" : "text-gray-300 group-hover:text-white")}>
                {item.label}
              </span>
              {item.badge && <Badge className={cn("text-xs px-2 py-0.5", item.badge === "New" && "bg-green-900 text-green-400 border-green-800", item.badge === "Hot" && "bg-red-900 text-red-400 border-red-800", item.badge === "Live" && "bg-red-900 text-red-400 border-red-800 animate-pulse", item.badge === "Beta" && "bg-purple-900 text-purple-400 border-purple-800", item.badge === "Pro" && "bg-yellow-900 text-yellow-400 border-yellow-800", item.badge === "Home" && "bg-blue-900 text-blue-400 border-blue-800", item.badge === "Track" && "bg-cyan-900 text-cyan-400 border-cyan-800", item.badge === "Popular" && "bg-orange-900 text-orange-400 border-orange-800", typeof item.badge === "string" && !["New", "Hot", "Live", "Beta", "Pro", "Home", "Track", "Popular"].includes(item.badge) && "bg-gray-800 text-gray-400 border-gray-700")}>
                  {item.badge}
                </Badge>}
            </>}
        </div>
        {!collapsed && item.items.length > 0 && (expandedSections.includes(item.id) ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />)}
      </button>;
    if (collapsed) {
      return <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 border-gray-700">
              <p className="text-white">{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>;
    }
    return button;
  };
  return <div className={cn("h-screen bg-black border-r border-gray-900 text-white transition-all duration-300", collapsed ? "w-20" : "w-72")}>
      <div className="flex flex-col h-full">
        {/* Header */}
        

        {/* Navigation */}
        <ScrollArea className="flex-1 p-2">
          <nav className="space-y-1">
            {menuItems.map(item => <div key={item.id}>
                <SidebarButton item={item} isActive={selectedSheet === item.id} />
              </div>)}
          </nav>
        </ScrollArea>
      </div>
    </div>;
};
export default Sidebar;