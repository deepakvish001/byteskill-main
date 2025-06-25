
import { Search, Menu, BookOpen, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sidebarCollapsed: boolean;
  onExpandSidebar?: () => void;
}

const Header = ({ searchQuery, onSearchChange, sidebarCollapsed, onExpandSidebar }: HeaderProps) => {
  return (
    <header className="w-full bg-black border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Expand button when sidebar is collapsed */}
          {sidebarCollapsed && onExpandSidebar && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onExpandSidebar}
              className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
          
          {/* Show logo/branding only when sidebar is collapsed */}
          {sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl shadow-2xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  Byteskill
                </span>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                    Platform
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Enhanced Search - Responsive */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search problems, topics, companies..." 
              className="pl-9 pr-4 w-80 bg-black border-gray-700 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl transition-all duration-300 hover:border-gray-600 text-sm h-9" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {/* Mobile Menu */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl p-2"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
