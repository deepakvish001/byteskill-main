
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Target, Calendar, TrendingUp } from "lucide-react";

const UserStreak = () => {
  const streakData = {
    currentStreak: 12,
    longestStreak: 45,
    totalDays: 89,
    weeklyGoal: 5,
    weeklyProgress: 3
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          Coding Streak
        </CardTitle>
        <CardDescription className="text-gray-400">
          Keep the momentum going!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-orange-400 mb-1">{streakData.currentStreak}</div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </div>
          <div className="text-center p-3 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{streakData.longestStreak}</div>
            <div className="text-sm text-gray-400">Longest Streak</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Weekly Goal</span>
            </div>
            <span className="text-sm text-white">{streakData.weeklyProgress}/{streakData.weeklyGoal} days</span>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(streakData.weeklyProgress / streakData.weeklyGoal) * 100}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Active Days: {streakData.totalDays}</span>
            <span className="text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +2 this week
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStreak;
