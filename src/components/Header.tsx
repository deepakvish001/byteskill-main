
import { Search, Menu, BookOpen, Trophy, ChevronLeft, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Header = ({ searchQuery, onSearchChange, sidebarCollapsed, onToggleSidebar }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="w-full bg-black border-b border-gray-800 px-4 py-3 h-16 flex items-center backdrop-blur-md">
      <div className="flex items-center justify-between w-full">
        {/* Sidebar Toggle Button - Always visible */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar}
            className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg p-2"
          >
            {sidebarCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>

          {/* Logo section - Only show when sidebar is collapsed */}
          {sidebarCollapsed && (
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl shadow-2xl">
                  <BookOpen className="w-6 h-6 text-white animate-bounce" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Byteskill
                </span>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-xs bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                    Learning Platform
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Home Button - Show when sidebar is collapsed */}
          {sidebarCollapsed && (
            <Link to="/" className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group">
              <Home className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          )}
        </div>
        
        {/* Search and Menu section */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Search - Desktop only */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search problems, topics, companies..." 
              className="pl-10 pr-4 w-80 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl transition-all duration-300 hover:border-gray-600 text-sm h-10 backdrop-blur-sm" 
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
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
