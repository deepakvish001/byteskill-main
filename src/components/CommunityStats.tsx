
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageCircle, Star, Award } from "lucide-react";

const CommunityStats = () => {
  const stats = [
    { label: "Views", value: "101.9K", change: "+134", icon: Eye, color: "text-blue-400" },
    { label: "Solution", value: "10", change: "0", icon: Star, color: "text-green-400" },
    { label: "Discuss", value: "81", change: "0", icon: MessageCircle, color: "text-cyan-400" },
    { label: "Reputation", value: "286", change: "0", icon: Award, color: "text-yellow-400" }
  ];

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white text-lg">Community Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-gray-300">{stat.label}</span>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{stat.value}</p>
              <p className="text-xs text-gray-400">Last week {stat.change}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CommunityStats;
