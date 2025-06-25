
import { Search, Settings, User, Bell, Moon, Sun, Menu, Zap, Crown, Gift, MessageSquare } from "lucide-react";
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
    <header className="w-full bg-black/95 backdrop-blur-xl border-b border-blue-500/20 px-6 py-4 shadow-2xl shadow-blue-900/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-lg">BS</span>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-white bg-clip-text text-transparent">
                Byteskill
              </span>
              <div className="text-xs text-blue-400 font-medium flex items-center space-x-1">
                <Crown className="w-3 h-3" />
                <span>Pro Edition</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-300 font-medium">
                47 Day Streak • Keep it up! 🔥
              </span>
            </div>
            
            <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">1,247 XP</span>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
            <Input 
              placeholder="Search problems, companies, topics..." 
              className="pl-10 w-96 bg-gray-900/50 border-blue-500/30 text-white placeholder-blue-300/70 focus:border-blue-400 focus:ring-blue-500/20 rounded-xl" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-white hover:bg-blue-500/10 hover:text-blue-400 rounded-xl"
              onClick={() => setNotifications(0)}
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-blue-500/10 hover:text-blue-400 rounded-xl"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-blue-500/10 hover:text-blue-400 rounded-xl"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-blue-500/10 hover:text-blue-400 rounded-xl"
            >
              <Gift className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-blue-500/10 rounded-xl px-4"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Pro
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-blue-500/10 relative rounded-xl"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
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
