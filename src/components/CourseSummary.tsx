
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Star, Users, CheckCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseSummaryProps {
  course: {
    id: string;
    course_id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    total_lessons: number;
    estimated_hours: number;
    tags: string[];
    is_premium: boolean;
  };
  enrollment?: {
    progress_percentage: number;
  };
  compact?: boolean;
}

const CourseSummary = ({ course, enrollment, compact = false }: CourseSummaryProps) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-900 text-green-400 border-green-800';
      case 'intermediate': return 'bg-yellow-900 text-yellow-400 border-yellow-800';
      case 'advanced': return 'bg-red-900 text-red-400 border-red-800';
      default: return 'bg-gray-900 text-gray-400 border-gray-800';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
      <CardHeader className={compact ? "pb-2" : ""}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={`text-white ${compact ? 'text-lg' : 'text-xl'}`}>
              {course.title}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
              {course.is_premium && (
                <Badge className="bg-purple-900 text-purple-400 border-purple-800">
                  <Lock className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              {enrollment && (
                <Badge className="bg-green-900 text-green-400 border-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Enrolled
                </Badge>
              )}
            </div>
          </div>
          {!compact && (
            <div className="text-right">
              <div className="flex items-center text-yellow-400 mb-1">
                <Star className="w-4 h-4 mr-1" />
                <span className="text-sm">4.8</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Users className="w-4 h-4 mr-1" />
                <span>2.1k</span>
              </div>
            </div>
          )}
        </div>
        {!compact && (
          <CardDescription className="text-gray-400 mt-2">
            {course.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={compact ? "pt-2" : ""}>
        <div className="space-y-4">
          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.total_lessons} lessons</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{course.estimated_hours}h</span>
              </div>
            </div>
          </div>

          {/* Progress for enrolled users */}
          {enrollment && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{enrollment.progress_percentage}%</span>
              </div>
              <Progress value={enrollment.progress_percentage} className="h-2" />
            </div>
          )}

          {/* Tags */}
          {!compact && (
            <div className="flex flex-wrap gap-1">
              {course.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-gray-800 text-gray-400 border-gray-700">
                  {tag}
                </Badge>
              ))}
              {course.tags.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-800 text-gray-400 border-gray-700">
                  +{course.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={() => navigate(`/course/${course.course_id}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size={compact ? "sm" : "default"}
          >
            {enrollment ? 'Continue Learning' : 'View Course'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseSummary;
