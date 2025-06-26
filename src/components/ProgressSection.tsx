
import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressData {
  total: { solved: number; total: number; percentage: number };
  easy: { solved: number; total: number; percentage: number };
  medium: { solved: number; total: number; percentage: number };
  hard: { solved: number; total: number; percentage: number };
}

interface ProgressSectionProps {
  progress: ProgressData;
}

const ProgressSection = ({ progress }: ProgressSectionProps) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6 hover:border-gray-600 transition-all duration-300">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center justify-center sm:justify-start">
        <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
        DSA Progress Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Progress */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium text-blue-300">Total Progress</span>
            </div>
            <span className="text-xs text-blue-400 font-semibold">{progress.total.percentage}%</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white mb-2">
            {progress.total.solved} / {progress.total.total}
          </div>
          <Progress value={progress.total.percentage} className="h-2 bg-gray-700" />
        </div>

        {/* Easy Progress */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs sm:text-sm font-medium text-green-300">Easy</span>
            </div>
            <span className="text-xs text-green-400 font-semibold">{progress.easy.percentage}%</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white mb-2">
            {progress.easy.solved} / {progress.easy.total}
          </div>
          <Progress 
            value={progress.easy.percentage} 
            className="h-2 bg-gray-700"
            style={{
              '--progress-color': 'rgb(34 197 94)', // green-500
            } as React.CSSProperties}
          />
        </div>

        {/* Medium Progress */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-400" />
              <span className="text-xs sm:text-sm font-medium text-yellow-300">Medium</span>
            </div>
            <span className="text-xs text-yellow-400 font-semibold">{progress.medium.percentage}%</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white mb-2">
            {progress.medium.solved} / {progress.medium.total}
          </div>
          <Progress 
            value={progress.medium.percentage} 
            className="h-2 bg-gray-700"
            style={{
              '--progress-color': 'rgb(234 179 8)', // yellow-500
            } as React.CSSProperties}
          />
        </div>

        {/* Hard Progress */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-red-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span className="text-xs sm:text-sm font-medium text-red-300">Hard</span>
            </div>
            <span className="text-xs text-red-400 font-semibold">{progress.hard.percentage}%</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white mb-2">
            {progress.hard.solved} / {progress.hard.total}
          </div>
          <Progress 
            value={progress.hard.percentage} 
            className="h-2 bg-gray-700"
            style={{
              '--progress-color': 'rgb(239 68 68)', // red-500
            } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
