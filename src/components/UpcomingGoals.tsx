
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Flag, Calendar } from "lucide-react";

const UpcomingGoals = () => {
  const goals = [
    {
      id: 1,
      title: "Complete 50 Array Problems",
      description: "Master array manipulation techniques",
      progress: 35,
      total: 50,
      deadline: "2024-07-15",
      priority: "High",
      completed: false
    },
    {
      id: 2,
      title: "Weekly Contest Participation",
      description: "Participate in 4 coding contests this month",
      progress: 2,
      total: 4,
      deadline: "2024-07-31",
      priority: "Medium",
      completed: false
    },
    {
      id: 3,
      title: "System Design Course",
      description: "Complete the system design fundamentals course",
      progress: 8,
      total: 10,
      deadline: "2024-07-20",
      priority: "High",
      completed: false
    },
    {
      id: 4,
      title: "Daily Coding Streak",
      description: "Maintain a 30-day coding streak",
      progress: 30,
      total: 30,
      deadline: "2024-06-30",
      priority: "Low",
      completed: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-900 text-red-400 border-red-800";
      case "Medium": return "bg-yellow-900 text-yellow-400 border-yellow-800";
      case "Low": return "bg-green-900 text-green-400 border-green-800";
      default: return "bg-gray-900 text-gray-400 border-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Flag className="h-5 w-5 text-pink-400" />
          Upcoming Goals
        </CardTitle>
        <CardDescription className="text-gray-400">
          Track your learning objectives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                {goal.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-medium mb-1 ${goal.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{goal.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due {formatDate(goal.deadline)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-white">
                  {goal.progress}/{goal.total}
                </span>
                <div className="text-xs text-gray-400">
                  {Math.round((goal.progress / goal.total) * 100)}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  goal.completed ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(goal.progress / goal.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingGoals;
