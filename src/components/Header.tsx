
import { Search, Settings, User, Bell, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">BS</span>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Byteskill
              </span>
              <div className="text-xs text-blue-400 font-medium">Pro Edition</div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-300 font-medium">
                Unlock AI-powered learning • Get Premium
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search problems, topics..." 
              className="pl-10 w-80 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-white hover:bg-gray-800 hover:text-blue-400"
              onClick={() => setNotifications(0)}
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-gray-800 hover:text-blue-400"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-blue-500/10"
            >
              Upgrade Pro
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-gray-800 relative"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
