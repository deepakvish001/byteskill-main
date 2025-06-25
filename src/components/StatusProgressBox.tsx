import { TrendingUp, Zap, Target, Award, Trophy, Star, CheckCircle2, Clock } from "lucide-react";
const StatusProgressBox = () => {
  const progressData = [{
    solved: 12,
    total: 455,
    label: "Total Progress",
    percentage: 3,
    icon: TrendingUp,
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400"
  }, {
    solved: 8,
    total: 131,
    label: "Easy Problems",
    percentage: 6,
    icon: CheckCircle2,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400"
  }, {
    solved: 3,
    total: 187,
    label: "Medium Problems",
    percentage: 2,
    icon: Target,
    color: "from-yellow-500 to-orange-600",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-400"
  }, {
    solved: 1,
    total: 136,
    label: "Hard Problems",
    percentage: 1,
    icon: Award,
    color: "from-red-500 to-pink-600",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400"
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {progressData.map((item, index) => {})}
    </div>;
};
export default StatusProgressBox;