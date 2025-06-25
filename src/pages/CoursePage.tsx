import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Zap,
  ChevronDown,
  Filter,
  RotateCcw,
  Video,
  Award
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";
import CourseBreadcrumb from "@/components/CourseBreadcrumb";
import CourseContent from "@/components/CourseContent";

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

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [stepsCollapsed, setStepsCollapsed] = useState(false);
  const [lecturesCollapsed, setLecturesCollapsed] = useState(false);

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

  const getBreadcrumbItems = () => {
    if (!course) return [];
    
    const categoryMap: { [key: string]: { label: string; href: string } } = {
      'dsa-sheet': { label: 'DSA Sheets', href: '/dsa-sheets' },
      'course': { label: 'Courses', href: '/courses' },
      'interview-prep': { label: 'Interview Prep', href: '/interview-prep' },
      'core-cs': { label: 'Core CS', href: '/core-cs' }
    };

    const category = categoryMap[course.category] || { label: 'Courses', href: '/courses' };
    
    return [
      { label: 'Home', href: '/dashboard' },
      category,
      { label: course.title }
    ];
  };

  const getBackUrl = () => {
    if (!course) return '/courses';
    
    const categoryMap: { [key: string]: string } = {
      'dsa-sheet': '/dsa-sheets',
      'course': '/courses',
      'interview-prep': '/interview-prep',
      'core-cs': '/core-cs'
    };

    return categoryMap[course.category] || '/courses';
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

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'
      }`}>
        <Sidebar 
          selectedSheet={course?.category || "courses"} 
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
          <div className="flex items-center justify-between p-4 bg-black border-b border-gray-900">
            <Header 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery}
              sidebarCollapsed={sidebarCollapsed}
            />
            <UserMenu />
          </div>
        </div>
        
        {/* Main Content with increased top padding to pt-48 */}
        <main className="flex-1 pt-48 p-3 sm:p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb - Now visible with proper spacing */}
            <div className="mb-6">
              <CourseBreadcrumb 
                items={getBreadcrumbItems()}
                showBackButton={true}
                backUrl={getBackUrl()}
              />
            </div>

            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{course?.title}</h1>
                  <p className="text-gray-400 text-lg">{course?.description}</p>
                </div>
                {!enrollment && course && (
                  <Button 
                    onClick={handleEnroll}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={!user}
                  >
                    {user ? 'Free Enroll' : 'Login to Enroll'}
                  </Button>
                )}
              </div>

              {course && (
                <div className="flex items-center space-x-4 mb-6">
                  <Badge className="bg-blue-900 text-blue-400 border-blue-800">
                    {course.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.total_lessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{course.estimated_hours}h</span>
                  </div>
                  {enrollment && (
                    <Badge className="bg-green-900 text-green-400 border-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enrolled - {enrollment.progress_percentage}% Complete
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Filter and Progress Section */}
            <div className="mb-6 space-y-4">
              {/* Control Buttons Row */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    All Problems Revision (0)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStepsCollapsed(!stepsCollapsed)}
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${stepsCollapsed ? 'rotate-180' : ''}`} />
                    Collapse Steps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLecturesCollapsed(!lecturesCollapsed)}
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${lecturesCollapsed ? 'rotate-180' : ''}`} />
                    Collapse Lectures
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filter
                  </Button>
                </div>
              </div>

              {/* Progress Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">0</div>
                  <div className="text-sm text-gray-400">Total Points</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 mr-1" />
                    3
                  </div>
                  <div className="text-sm text-gray-400">Articles Read</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1 flex items-center justify-center">
                    <Video className="w-5 h-5 mr-1" />
                    1
                  </div>
                  <div className="text-sm text-gray-400">Videos Watched</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1 flex items-center justify-center">
                    <Award className="w-5 h-5 mr-1" />
                    1
                  </div>
                  <div className="text-sm text-gray-400">Awards Earned</div>
                </div>
              </div>
            </div>

            {/* Course Content - Using CourseContent component */}
            <CourseContent 
              selectedSheet={courseId || ""}
              searchQuery={searchQuery}
              isEnrolled={!!enrollment}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
