
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Trophy, Target } from "lucide-react";

const EnrolledCoursesProgress = () => {
  const enrolledCourses = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      progress: 65,
      totalLessons: 120,
      completedLessons: 78,
      nextLesson: "Binary Search Trees",
      timeSpent: "24h 30m",
      difficulty: "Intermediate"
    },
    {
      id: 2,
      title: "System Design Fundamentals",
      progress: 35,
      totalLessons: 45,
      completedLessons: 16,
      nextLesson: "Load Balancing",
      timeSpent: "8h 15m",
      difficulty: "Advanced"
    },
    {
      id: 3,
      title: "JavaScript Mastery",
      progress: 90,
      totalLessons: 80,
      completedLessons: 72,
      nextLesson: "Async/Await Patterns",
      timeSpent: "32h 45m",
      difficulty: "Beginner"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-900 text-green-400 border-green-800";
      case "Intermediate": return "bg-yellow-900 text-yellow-400 border-yellow-800";
      case "Advanced": return "bg-red-900 text-red-400 border-red-800";
      default: return "bg-gray-900 text-gray-400 border-gray-800";
    }
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-400" />
          Enrolled Courses Progress
        </CardTitle>
        <CardDescription className="text-gray-400">
          Continue where you left off
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">{course.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.timeSpent}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-white">{course.progress}%</span>
                <p className="text-xs text-gray-400">{course.completedLessons}/{course.totalLessons} lessons</p>
              </div>
            </div>
            <Progress value={course.progress} className="h-2 mb-3" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Next: {course.nextLesson}</span>
              <button className="text-sm bg-blue-900 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-800 transition-colors">
                Continue
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EnrolledCoursesProgress;
