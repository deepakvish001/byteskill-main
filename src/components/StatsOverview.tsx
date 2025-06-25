
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Target, Crown, Brain, Zap, Star, TrendingUp } from "lucide-react";

interface Award {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface StatsOverviewProps {
  totalPoints: number;
  totalArticlesRead: number;
  totalVideosWatched: number;
  awards: Award[];
}

const StatsOverview = ({ totalPoints, totalArticlesRead, totalVideosWatched, awards }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Points */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-400">Total Points</CardDescription>
          <CardTitle className="text-2xl text-white flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
            {totalPoints.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Articles Read */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-400">Articles Read</CardDescription>
          <CardTitle className="text-2xl text-white flex items-center">
            <Brain className="w-5 h-5 text-blue-400 mr-2" />
            {totalArticlesRead}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Videos Watched */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-400">Videos Watched</CardDescription>
          <CardTitle className="text-2xl text-white flex items-center">
            <Zap className="w-5 h-5 text-purple-400 mr-2" />
            {totalVideosWatched}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Awards */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-400">Awards Earned</CardDescription>
          <CardTitle className="text-2xl text-white flex items-center">
            <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
            {awards.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {awards.slice(0, 3).map((award, index) => {
              const IconComponent = award.icon;
              return (
                <Badge 
                  key={index} 
                  className="text-xs bg-gray-800 border-gray-700"
                  title={award.name}
                >
                  <IconComponent className={`w-3 h-3 ${award.color}`} />
                </Badge>
              );
            })}
            {awards.length > 3 && (
              <Badge className="text-xs bg-gray-800 border-gray-700">
                +{awards.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
