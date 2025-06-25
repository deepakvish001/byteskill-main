
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageCircle, Code, Users } from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      title: "Count the Number of Good Subarrays",
      type: "Recent AC",
      time: "2 months ago",
      icon: Code,
      badge: "Medium"
    },
    {
      title: "Count Equal and Divisible Pairs in an Array",
      type: "Recent AC",
      time: "2 months ago",
      icon: Code,
      badge: "Easy"
    },
    {
      title: "Reshape the Matrix",
      type: "Recent AC",
      time: "2 months ago",
      icon: Code,
      badge: "Easy"
    },
    {
      title: "Count Good Triplets in an Array",
      type: "Recent AC",
      time: "2 months ago",
      icon: Code,
      badge: "Hard"
    },
    {
      title: "Count Good Triplets",
      type: "Recent AC",
      time: "2 months ago",
      icon: Code,
      badge: "Easy"
    }
  ];

  const tabs = [
    { name: "Recent AC", icon: Code, active: true },
    { name: "List", icon: FileText, active: false },
    { name: "Solutions", icon: Users, active: false },
    { name: "Discuss", icon: MessageCircle, active: false }
  ];

  const getBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-900 text-green-400 border-green-800";
      case "Medium": return "bg-yellow-900 text-yellow-400 border-yellow-800";
      case "Hard": return "bg-red-900 text-red-400 border-red-800";
      default: return "bg-gray-900 text-gray-400 border-gray-800";
    }
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                  tab.active 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
          <button className="text-blue-400 text-sm hover:underline">
            View all submissions →
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-3">
                <activity.icon className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-white text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-400">{activity.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getBadgeColor(activity.badge)}>
                  {activity.badge}
                </Badge>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
