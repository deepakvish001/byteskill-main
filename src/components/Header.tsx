
import { Search, Settings, User, Bell, Moon, Sun, Menu, Zap, Crown, Gift, MessageSquare, Timer, BookOpen, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [studyTimer, setStudyTimer] = useState("25:00");
  const [isStudyActive, setIsStudyActive] = useState(false);

  return (
    <header className="w-full bg-black border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-lg">BS</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                Byteskill
              </span>
              <div className="text-xs text-gray-400 font-medium flex items-center space-x-1">
                <Crown className="w-3 h-3" />
                <span>Pro Edition</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            {/* Study Timer - Pomodoro Feature */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl">
              <Timer className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white font-mono">
                {studyTimer}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsStudyActive(!isStudyActive)}
                className={`text-xs px-2 py-1 ${isStudyActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
              >
                {isStudyActive ? 'Pause' : 'Start'}
              </Button>
            </div>
            
            {/* Daily Progress */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300 font-medium">
                Today: 3/5 problems
              </span>
            </div>
            
            {/* Study Streak */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300 font-medium">
                47 Day Streak 🔥
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Enhanced Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search problems, topics, companies..." 
              className="pl-10 pr-4 w-96 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-white/20 rounded-xl" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Focus Mode Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl"
              title="Focus Mode"
            >
              <Target className="w-5 h-5" />
            </Button>

            {/* Study Notes */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl"
              title="Study Notes"
            >
              <BookOpen className="w-5 h-5" />
            </Button>
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl"
              onClick={() => setNotifications(0)}
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            {/* Messages */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            {/* XP Points */}
            <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 rounded-xl">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">1,247 XP</span>
            </Button>
            
            {/* Upgrade Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white text-white hover:bg-white hover:text-black bg-transparent rounded-xl px-4"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Pro
            </Button>
            
            {/* Profile */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:bg-gray-800 relative rounded-xl"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
