
import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AdvancedFilters {
  difficulty: string;
  status: string;
  hasArticle: boolean;
  hasVideo: boolean;
  hasPractice: boolean;
  searchQuery: string;
}

interface AdvancedFilterProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
}

const AdvancedFilter = ({ filters, onFiltersChange }: AdvancedFilterProps) => {
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);

  const resetFilters = () => {
    onFiltersChange({
      difficulty: "all",
      status: "all",
      hasArticle: false,
      hasVideo: false,
      hasPractice: false,
      searchQuery: ""
    });
  };

  return (
    <Dialog open={advancedFilterOpen} onOpenChange={setAdvancedFilterOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-purple-600/20 text-xs sm:text-sm">
          <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Advanced Filter</span>
          <span className="sm:hidden">Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-gray-700 text-white max-w-xs sm:max-w-md mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">Advanced Filters</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Search Problems</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search problems..." 
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 rounded-lg" 
                value={filters.searchQuery}
                onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Difficulty</Label>
              <Select value={filters.difficulty} onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value })}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Status</Label>
              <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Solved">Solved</SelectItem>
                  <SelectItem value="Attempted">Attempted</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">Content Type</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={filters.hasArticle}
                  onChange={(e) => onFiltersChange({ ...filters, hasArticle: e.target.checked })}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Has Article</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={filters.hasVideo}
                  onChange={(e) => onFiltersChange({ ...filters, hasVideo: e.target.checked })}
                  className="rounded border-gray-600 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-300">Has Video</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={filters.hasPractice}
                  onChange={(e) => onFiltersChange({ ...filters, hasPractice: e.target.checked })}
                  className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-300">Has Practice</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="border-gray-600 text-white bg-black hover:bg-gray-800"
          >
            Reset
          </Button>
          <Button
            onClick={() => setAdvancedFilterOpen(false)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFilter;
