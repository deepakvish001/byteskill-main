
import { TrendingUp, Zap, Target, Award, Trophy, Star, CheckCircle2, Clock } from "lucide-react";

const StatusProgressBox = () => {
  const progressData = [
    {
      solved: 12,
      total: 455,
      label: "Total Progress",
      percentage: 3,
      icon: TrendingUp,
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400"
    },
    {
      solved: 8,
      total: 131,
      label: "Easy Problems",
      percentage: 6,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400"
    },
    {
      solved: 3,
      total: 187,
      label: "Medium Problems",
      percentage: 2,
      icon: Target,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-400"
    },
    {
      solved: 1,
      total: 136,
      label: "Hard Problems",
      percentage: 1,
      icon: Award,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-500/10",
      textColor: "text-red-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {progressData.map((item, index) => (
        <div
          key={index}
          className="bg-black border border-gray-900 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:scale-105 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${item.bgColor} border border-gray-800`}>
              <item.icon className={`w-6 h-6 ${item.textColor}`} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>{item.solved}</span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-300">{item.total}</span>
              </div>
              <div className="text-sm text-gray-400 font-medium">{item.label}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-semibold ${item.textColor}`}>
                {item.percentage}% completed
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-500">+{item.solved * 10} XP</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-900 rounded-full h-2.5 overflow-hidden border border-gray-800">
                <div 
                  className={`h-2.5 rounded-full bg-gradient-to-r ${item.color} transition-all duration-700 ease-out relative`}
                  style={{ width: `${item.percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    Est. {Math.ceil((item.total - item.solved) * 0.5)}h left
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs text-gray-500">Rank: {index + 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusProgressBox;
