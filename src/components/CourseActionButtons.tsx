
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  Filter
} from "lucide-react";

interface CourseActionButtonsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stepsCollapsed: boolean;
  lecturesCollapsed: boolean;
  onToggleSteps: () => void;
  onToggleLectures: () => void;
  revisionCount: number;
  onRevision: () => void;
  onAdvancedFilter: () => void;
}

const CourseActionButtons = ({
  searchQuery,
  onSearchChange,
  stepsCollapsed,
  lecturesCollapsed,
  onToggleSteps,
  onToggleLectures,
  revisionCount,
  onRevision,
  onAdvancedFilter
}: CourseActionButtonsProps) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search problems, topics..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onRevision}
          variant="outline"
          size="sm"
          className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          All Problems Revision ({revisionCount})
        </Button>
        
        <Button
          onClick={onToggleSteps}
          variant="outline"
          size="sm"
          className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800"
        >
          {stepsCollapsed ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronUp className="w-4 h-4 mr-2" />}
          {stepsCollapsed ? 'Expand' : 'Collapse'} Steps
        </Button>
        
        <Button
          onClick={onToggleLectures}
          variant="outline"
          size="sm"
          className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800"
        >
          {lecturesCollapsed ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronUp className="w-4 h-4 mr-2" />}
          {lecturesCollapsed ? 'Expand' : 'Collapse'} Lectures
        </Button>
        
        <Button
          onClick={onAdvancedFilter}
          variant="outline"
          size="sm"
          className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filter
        </Button>
      </div>
    </div>
  );
};

export default CourseActionButtons;
