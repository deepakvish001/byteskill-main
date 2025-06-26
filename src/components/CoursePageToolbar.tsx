import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw, ChevronDown, ChevronUp, Settings } from "lucide-react";
import AdvancedFilter from "./AdvancedFilter";
interface AdvancedFilters {
  difficulty: string;
  status: string;
  hasArticle: boolean;
  hasVideo: boolean;
  hasPractice: boolean;
  searchQuery: string;
}
interface CoursePageToolbarProps {
  onRevisionModeToggle: () => void;
  onCollapseAllSteps: () => void;
  onExpandAllSteps: () => void;
  onCollapseAllLectures: () => void;
  onExpandAllLectures: () => void;
  allStepsCollapsed: boolean;
  allLecturesCollapsed: boolean;
  filters?: AdvancedFilters;
  onFiltersChange?: (filters: AdvancedFilters) => void;
}
const CoursePageToolbar = ({
  onRevisionModeToggle,
  onCollapseAllSteps,
  onExpandAllSteps,
  onCollapseAllLectures,
  onExpandAllLectures,
  allStepsCollapsed,
  allLecturesCollapsed,
  filters,
  onFiltersChange
}: CoursePageToolbarProps) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(true);
  const defaultFilters: AdvancedFilters = {
    difficulty: "all",
    status: "all",
    hasArticle: false,
    hasVideo: false,
    hasPractice: false,
    searchQuery: ""
  };
  return <div className="bg-black text-white border-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex flex-wrap items-center gap-3">
          {/* Revision Button - Always visible */}
          <Button onClick={onRevisionModeToggle} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 text-xs sm:text-sm">
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Revision Mode</span>
            <span className="sm:hidden">Revision</span>
          </Button>
          
          {/* Advanced Filter - Always visible */}
          {filters && onFiltersChange && <AdvancedFilter filters={filters} onFiltersChange={onFiltersChange} />}
        </div>

        {/* Always show collapse/expand controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Collapse/Expand Steps */}
          <Button onClick={allStepsCollapsed ? onExpandAllSteps : onCollapseAllSteps} variant="outline" size="sm" className="border-gray-600 text-xs bg-zinc-950 hover:bg-zinc-800 text-slate-50">
            {allStepsCollapsed ? <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Expand Steps
              </> : <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Collapse Steps
              </>}
          </Button>

          {/* Collapse/Expand Lectures */}
          <Button onClick={allLecturesCollapsed ? onExpandAllLectures : onCollapseAllLectures} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-xs">
            {allLecturesCollapsed ? <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Expand Lectures
              </> : <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Collapse Lectures
              </>}
          </Button>

          {/* Advanced Options Toggle */}
          <Button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Advanced
          </Button>
        </div>
      </div>

      {/* Advanced Options Panel */}
      {showAdvancedOptions && <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-white mb-3">Course Options</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Progress Tracking</div>
              <div className="text-sm text-white">✓ Enabled</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Bookmarks</div>
              <div className="text-sm text-white">✓ Available</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Notes</div>
              <div className="text-sm text-white">✓ Available</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Auto-Save</div>
              <div className="text-sm text-white">✓ Enabled</div>
            </div>
          </div>
        </div>}
    </div>;
};
export default CoursePageToolbar;