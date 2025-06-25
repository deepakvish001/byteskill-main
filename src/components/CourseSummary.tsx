
import { Star, BookOpen, Video, Trophy, Award, Medal, Target, Crown, Brain, Zap } from "lucide-react";

interface Award {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface CourseSummaryProps {
  totalPoints: number;
  totalArticlesRead: number;
  totalVideosWatched: number;
  awards: Award[];
}

const CourseSummary = ({ totalPoints, totalArticlesRead, totalVideosWatched, awards }: CourseSummaryProps) => {
  return (
    <div className="bg-black backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center justify-center sm:justify-start">
        <div className="w-2 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full mr-3"></div>
        Course Summary & Achievements
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points and Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Total Points Earned</span>
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">{totalPoints.toLocaleString()}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">
              <div className="flex items-center space-x-2 mb-1">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-300">Articles Read</span>
              </div>
              <div className="text-lg font-bold text-blue-400">{totalArticlesRead}</div>
            </div>
            
            <div className="bg-red-600/20 rounded-lg p-3 border border-red-500/30">
              <div className="flex items-center space-x-2 mb-1">
                <Video className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-300">Videos Watched</span>
              </div>
              <div className="text-lg font-bold text-red-400">{totalVideosWatched}</div>
            </div>
          </div>
        </div>

        {/* Awards */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center">
            <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
            Your Awards ({awards.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {awards.map((award, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30 flex items-center space-x-3">
                <award.icon className={`w-5 h-5 ${award.color}`} />
                <span className="text-sm font-medium text-white">{award.name}</span>
              </div>
            ))}
            {awards.length === 0 && (
              <div className="col-span-2 text-center text-gray-400 py-4">
                <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start solving problems to earn awards!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSummary;
