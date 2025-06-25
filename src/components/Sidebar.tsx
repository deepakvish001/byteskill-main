
import { ChevronDown, ChevronRight, FileText, Users, BookOpen, Cpu, Network, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
      id: "course",
      label: "Course",
      icon: BookOpen,
      items: []
    },
    {
      id: "dsa-sheet",
      label: "DSA Sheet",
      icon: FileText,
      items: [
        { id: "striver-a2z", label: "Striver A2Z Sheet" },
        { id: "striver-sde", label: "Striver SDE Sheet" },
        { id: "striver-79", label: "Striver 79 Sheet" },
        { id: "blind-75", label: "Blind 75 Sheet" }
      ]
    },
    {
      id: "dsa-playlist",
      label: "DSA Playlist",
      icon: Users,
      items: [
        { id: "array-series", label: "Array Series" },
        { id: "binary-search", label: "Binary Search Series" },
        { id: "string-series", label: "String Series" },
        { id: "linkedlist", label: "LinkedList Series" },
        { id: "recursion", label: "Recursion Series" },
        { id: "stack-queue", label: "Stack and Queue Series" },
        { id: "tree-series", label: "Tree Series" },
        { id: "graph-series", label: "Graph Series" },
        { id: "dp-series", label: "DP Series" }
      ]
    },
    {
      id: "interview",
      label: "Interview",
      icon: Users,
      items: []
    },
    {
      id: "core-subjects",
      label: "Core Subjects",
      icon: Cpu,
      items: [
        { id: "dbms", label: "DBMS" },
        { id: "operating-system", label: "Operating System" },
        { id: "computer-networks", label: "Computer Networks" }
      ]
    },
    {
      id: "others",
      label: "Others",
      icon: Settings,
      items: [
        { id: "system-design", label: "System Design" },
        { id: "striver-cp", label: "Striver's CP Sheet" }
      ]
    }
  ];

  return (
    <div className="w-64 bg-black border-r border-gray-800 text-white h-screen overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BS</span>
          </div>
          <span className="text-xl font-bold text-white">Byteskill</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => toggleSection(item.id)}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-gray-800 transition-colors",
                  selectedSheet === item.id && "bg-blue-600"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">{item.label}</span>
                </div>
                {item.items.length > 0 && (
                  expandedSections.includes(item.id) ? 
                    <ChevronDown className="w-4 h-4 text-blue-400" /> : 
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                )}
              </button>
              
              {expandedSections.includes(item.id) && item.items.length > 0 && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.items.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onSheetChange(subItem.id)}
                      className={cn(
                        "w-full text-left p-2 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors",
                        selectedSheet === subItem.id && "text-blue-400 bg-gray-800 font-medium"
                      )}
                    >
                      {subItem.label}
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
