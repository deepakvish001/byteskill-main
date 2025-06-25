
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
    <div className="bg-black backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center justify-center sm:justify-start">
        <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
        DSA Progress Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Progress */}
        <div className="bg-black rounded-lg p-3 sm:p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">Total Progress</span>
            </div>
            <span className="text-xs text-gray-400">{progress.total.percentage}%</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-blue-400 mb-2">
            {progress.total.solved} / {progress.total.total}
          </div>
          <Progress value={progress.total.percentage} className="h-2" />
        </div>

        {/* Easy Progress */}
        <div className="bg-black rounded-lg p-3 sm:p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">Easy</span>
            </div>
            <span className="text-xs text-gray-400">{progress.easy.percentage}%</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-green-400 mb-2">
            {progress.easy.solved} / {progress.easy.total} completed
          </div>
          <Progress value={progress.easy.percentage} className="h-2" />
        </div>

        {/* Medium Progress */}
        <div className="bg-black rounded-lg p-3 sm:p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">Medium</span>
            </div>
            <span className="text-xs text-gray-400">{progress.medium.percentage}%</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-yellow-400 mb-2">
            {progress.medium.solved} / {progress.medium.total} completed
          </div>
          <Progress value={progress.medium.percentage} className="h-2" />
        </div>

        {/* Hard Progress */}
        <div className="bg-black rounded-lg p-3 sm:p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">Hard</span>
            </div>
            <span className="text-xs text-gray-400">{progress.hard.percentage}%</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-red-400 mb-2">
            {progress.hard.solved} / {progress.hard.total} completed
          </div>
          <Progress value={progress.hard.percentage} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
