
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
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
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-black rounded-lg border border-gray-800">
      <div className="flex flex-wrap items-center gap-3">
        {/* Advanced Filter */}
        {filters && onFiltersChange && (
          <AdvancedFilter 
            filters={filters} 
            onFiltersChange={onFiltersChange} 
          />
        )}
        
        {/* Revision Button */}
        <Button
          onClick={onRevisionModeToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 text-xs sm:text-sm"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Revision Mode</span>
          <span className="sm:hidden">Revision</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Collapse/Expand Steps */}
        <Button
          onClick={allStepsCollapsed ? onExpandAllSteps : onCollapseAllSteps}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-xs"
        >
          {allStepsCollapsed ? (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Expand Steps
            </>
          ) : (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Collapse Steps
            </>
          )}
        </Button>

        {/* Collapse/Expand Lectures */}
        <Button
          onClick={allLecturesCollapsed ? onExpandAllLectures : onCollapseAllLectures}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-xs"
        >
          {allLecturesCollapsed ? (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Expand Lectures
            </>
          ) : (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Collapse Lectures
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CoursePageToolbar;
