
import { Card, CardContent } from "@/components/ui/card";

const ProblemsSolvedChart = () => {
  const totalProblems = 3595;
  const solvedProblems = {
    easy: { solved: 333, total: 883, percentage: 37.7 },
    medium: { solved: 829, total: 1827, percentage: 45.4 },
    hard: { solved: 190, total: 845, percentage: 22.5 }
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Circular Progress */}
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle cx="60" cy="60" r="54" stroke="#374151" strokeWidth="8" fill="transparent" />
              
              {/* Easy progress */}
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                stroke="#10B981" 
                strokeWidth="8" 
                fill="transparent"
                strokeDasharray={`${solvedProblems.easy.percentage * 3.39} 339`}
                strokeDashoffset="0"
              />
              
              {/* Medium progress */}
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                stroke="#F59E0B" 
                strokeWidth="8" 
                fill="transparent"
                strokeDasharray={`${solvedProblems.medium.percentage * 3.39} 339`}
                strokeDashoffset={`-${solvedProblems.easy.percentage * 3.39}`}
              />
              
              {/* Hard progress */}
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                stroke="#EF4444" 
                strokeWidth="8" 
                fill="transparent"
                strokeDasharray={`${solvedProblems.hard.percentage * 3.39} 339`}
                strokeDashoffset={`-${(solvedProblems.easy.percentage + solvedProblems.medium.percentage) * 3.39}`}
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">1152</span>
              <span className="text-sm text-gray-400">/{totalProblems}</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-green-400 text-sm">Easy</span>
                <span className="text-white text-sm">{solvedProblems.easy.solved}/{solvedProblems.easy.total}</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-yellow-400 text-sm">Med.</span>
                <span className="text-white text-sm">{solvedProblems.medium.solved}/{solvedProblems.medium.total}</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-red-400 text-sm">Hard</span>
                <span className="text-white text-sm">{solvedProblems.hard.solved}/{solvedProblems.hard.total}</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400">0 Attempting</p>
            </div>
          </div>
          
          {/* Badges */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Badges</p>
            <p className="text-2xl font-bold text-white mb-1">21</p>
            <div className="flex space-x-1">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg"></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Most Recent Badge</p>
            <p className="text-xs text-white">100 Days Badge 2025</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemsSolvedChart;
