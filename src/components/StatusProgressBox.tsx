
import { TrendingUp, Zap, Target, Award } from "lucide-react";

const StatusProgressBox = () => {
  const progressData = [
    {
      solved: 12,
      total: 455,
      label: "Total Progress",
      percentage: 3,
      icon: TrendingUp,
      color: "from-purple-500 to-indigo-500"
    },
    {
      solved: 8,
      total: 131,
      label: "Easy Problems",
      percentage: 6,
      icon: Zap,
      color: "from-green-500 to-emerald-500"
    },
    {
      solved: 3,
      total: 187,
      label: "Medium Problems",
      percentage: 2,
      icon: Target,
      color: "from-yellow-500 to-orange-500"
    },
    {
      solved: 1,
      total: 136,
      label: "Hard Problems",
      percentage: 1,
      icon: Award,
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {progressData.map((item, index) => (
        <div
          key={index}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}>
              <item.icon className={`w-6 h-6 text-transparent bg-gradient-to-r ${item.color} bg-clip-text`} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {item.solved} / {item.total}
              </div>
              <div className="text-sm text-gray-400">{item.label}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">
                {item.percentage}% completed
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-500 ease-out`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusProgressBox;
