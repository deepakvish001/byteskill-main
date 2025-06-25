
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Trophy, 
  Target,
  CheckCircle,
  PlayCircle,
  Lock,
  Zap
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";

interface Course {
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
}

interface Enrollment {
  id: string;
  enrolled_at: string;
  progress_percentage: number;
  completed_at: string | null;
}

interface Lesson {
  id: string;
  lesson_number: number;
  title: string;
  content: string;
  duration_minutes: number;
}

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('course_id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_number');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Fetch enrollment if user is logged in
      if (user) {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (enrollmentError) {
          console.error('Error fetching enrollment:', enrollmentError);
        } else {
          setEnrollment(enrollmentData);
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll in this course');
      return;
    }

    if (!course) return;

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: course.course_id,
          progress_percentage: 0
        });

      if (error) throw error;

      toast.success('Successfully enrolled in the course!');
      fetchCourseData(); // Refresh data
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      if (error.code === '23505') {
        toast.error('You are already enrolled in this course');
      } else {
        toast.error('Failed to enroll in course');
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-900 text-green-400 border-green-800';
      case 'intermediate': return 'bg-yellow-900 text-yellow-400 border-yellow-800';
      case 'advanced': return 'bg-red-900 text-red-400 border-red-800';
      default: return 'bg-gray-900 text-gray-400 border-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dsa-sheet': return BookOpen;
      case 'course': return Target;
      case 'interview-prep': return Users;
      case 'core-cs': return Zap;
      default: return BookOpen;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
          <p className="text-gray-400">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(course.category);

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'
      }`}>
        <Sidebar 
          selectedSheet={courseId || "dashboard"} 
          onSheetChange={() => {}}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16 sm:ml-20' : 'ml-64 sm:ml-72'
      }`}>
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 z-30 transition-all duration-300" style={{
          left: sidebarCollapsed ? '4rem' : '16rem',
        }}>
          <div className="flex items-center justify-between p-4">
            <Header 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery}
              sidebarCollapsed={sidebarCollapsed}
            />
            <UserMenu />
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 pt-16 sm:pt-20 p-3 sm:p-6 bg-black min-h-screen">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Course Header */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-900/50 rounded-xl">
                      <CategoryIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold text-white mb-2">
                        {course.title}
                      </CardTitle>
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </Badge>
                        {course.is_premium && (
                          <Badge className="bg-purple-900 text-purple-400 border-purple-800">
                            <Lock className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {course.tags.map((tag) => (
                          <Badge key={tag} className="bg-gray-800 text-gray-400 border-gray-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardDescription className="text-gray-400 text-lg">
                        {course.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    {enrollment ? (
                      <div className="space-y-2">
                        <Badge className="bg-green-900 text-green-400 border-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enrolled
                        </Badge>
                        <div className="text-sm text-gray-400">
                          Progress: {enrollment.progress_percentage}%
                        </div>
                        <Progress value={enrollment.progress_percentage} className="w-32" />
                      </div>
                    ) : (
                      <Button 
                        onClick={handleEnroll}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!user}
                      >
                        {user ? 'Enroll Now' : 'Login to Enroll'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Lessons</p>
                      <p className="text-2xl font-bold text-white">{course.total_lessons}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Estimated Hours</p>
                      <p className="text-2xl font-bold text-white">{course.estimated_hours}h</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Difficulty</p>
                      <p className="text-2xl font-bold text-white capitalize">{course.difficulty}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="text-2xl font-bold text-white capitalize">
                        {course.category.replace('-', ' ')}
                      </p>
                    </div>
                    <Trophy className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Content */}
            {lessons.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-blue-400" />
                    Course Content
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {lessons.length} lessons • {course.estimated_hours} hours total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div 
                        key={lesson.id}
                        className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-300">
                              {lesson.lesson_number}
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{lesson.title}</h4>
                              <p className="text-sm text-gray-400">{lesson.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">{lesson.duration_minutes}m</span>
                            {enrollment && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <PlayCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enrollment CTA for non-enrolled users */}
            {!enrollment && (
              <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-800/50">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Ready to start your learning journey?
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Enroll now to get access to all lessons, track your progress, and earn certificates.
                  </p>
                  <Button 
                    onClick={handleEnroll}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!user}
                  >
                    {user ? 'Enroll Now - Free' : 'Login to Enroll'}
                  </Button>
                  {!user && (
                    <p className="text-sm text-gray-400 mt-2">
                      Please log in to enroll in this course
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
