
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Target, Trophy, Zap } from "lucide-react";

interface CourseProgressStatsProps {
  totalProblems: number;
  solvedProblems: number;
  attemptedProblems: number;
  averageTime?: number;
  streak?: number;
  completionRate: number;
}

const CourseProgressStats = ({
  totalProblems,
  solvedProblems,
  attemptedProblems,
  averageTime = 25,
  streak = 3,
  completionRate
}: CourseProgressStatsProps) => {
  const progressPercentage = totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Overall Progress */}
      <Card className="bg-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-300">Overall Progress</CardTitle>
          <Target className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-2">
            {Math.round(progressPercentage)}%
          </div>
          <Progress 
            value={progressPercentage} 
            className="mb-2 h-2 bg-gray-800"
            style={{
              '--progress-foreground': 'rgb(59 130 246)', // blue-500
            } as React.CSSProperties}
          />
          <p className="text-xs text-blue-300">
            {solvedProblems} of {totalProblems} problems completed
          </p>
        </CardContent>
      </Card>

      {/* Problems Solved */}
      <Card className="bg-gray-900 border-gray-700 hover:border-green-500/50 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-300">Problems Solved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{solvedProblems}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs hover:bg-green-500/30">
              ✓ Solved
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs hover:bg-yellow-500/30">
              ⚡ {attemptedProblems} Attempted
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Average Time */}
      <Card className="bg-gray-900 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-300">Average Time</CardTitle>
          <Clock className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{averageTime}m</div>
          <p className="text-xs text-orange-300 mt-2">
            per problem solved
          </p>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card className="bg-gray-900 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Current Streak</CardTitle>
          <Zap className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{streak}</div>
          <p className="text-xs text-purple-300 mt-2">
            days in a row
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseProgressStats;
