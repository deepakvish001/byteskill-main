
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Target } from "lucide-react";

const TopicProficiency = () => {
  const topicData = [
    { topic: "Arrays & Strings", proficiency: 85, color: "bg-green-500" },
    { topic: "Linked Lists", proficiency: 72, color: "bg-blue-500" },
    { topic: "Trees & Graphs", proficiency: 68, color: "bg-yellow-500" },
    { topic: "Dynamic Programming", proficiency: 45, color: "bg-red-500" },
    { topic: "System Design", proficiency: 60, color: "bg-purple-500" },
    { topic: "Algorithms", proficiency: 78, color: "bg-cyan-500" }
  ];

  const getProficiencyLabel = (score: number) => {
    if (score >= 80) return { label: "Expert", color: "text-green-400" };
    if (score >= 60) return { label: "Advanced", color: "text-blue-400" };
    if (score >= 40) return { label: "Intermediate", color: "text-yellow-400" };
    return { label: "Beginner", color: "text-red-400" };
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyan-400" />
          Topic Proficiency
        </CardTitle>
        <CardDescription className="text-gray-400">
          Your skill level across different topics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topicData.map((topic, index) => {
          const proficiency = getProficiencyLabel(topic.proficiency);
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">{topic.topic}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${proficiency.color}`}>
                    {proficiency.label}
                  </span>
                  <span className="text-sm text-gray-400">{topic.proficiency}%</span>
                </div>
              </div>
              <Progress value={topic.proficiency} className="h-2" />
            </div>
          );
        })}
        
        <div className="mt-6 p-3 bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-orange-400" />
            <span className="font-medium text-white">Recommended Focus</span>
          </div>
          <p className="text-sm text-gray-300">
            Work on <span className="text-orange-400 font-medium">Dynamic Programming</span> to boost your overall proficiency score.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicProficiency;
