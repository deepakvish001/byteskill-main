
import { Search, Menu, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sidebarCollapsed: boolean;
}

const Header = ({ searchQuery, onSearchChange, sidebarCollapsed }: HeaderProps) => {
  return (
    <header className="w-full bg-black border-b border-gray-800 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Show logo/branding only when sidebar is collapsed */}
          {sidebarCollapsed && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2 sm:p-3 rounded-xl shadow-2xl">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-bounce" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Byteskill
                </span>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-xs sm:text-sm bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                    Learning Platform
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Enhanced Search - Responsive */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input 
              placeholder="Search problems, topics, companies..." 
              className="pl-8 sm:pl-10 pr-4 w-64 sm:w-96 bg-black border-gray-700 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl transition-all duration-300 hover:border-gray-600 text-sm sm:text-base" 
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
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
