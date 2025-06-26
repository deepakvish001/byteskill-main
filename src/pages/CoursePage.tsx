
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BookOpen, Clock, Users, Star, Trophy, Target, CheckCircle, PlayCircle, Lock, Zap, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";
import CourseBreadcrumb from "@/components/CourseBreadcrumb";
import CourseContent from "@/components/CourseContent";
import CoursePageToolbar from "@/components/CoursePageToolbar";
import CourseProgressStats from "@/components/CourseProgressStats";

interface Course {
  id: string;
  course_id: string;
  title: string;
  description: string;
  tagline?: string;
  category: string;
  difficulty: string;
  total_lessons: number;
  estimated_hours: number;
  tags: string[];
  is_premium: boolean;
  module_count?: number;
  problem_count?: number;
}

interface Enrollment {
  id: string;
  enrolled_at: string;
  progress_percentage: number;
  completed_at: string | null;
}

interface AdvancedFilters {
  difficulty: string;
  status: string;
  hasArticle: boolean;
  hasVideo: boolean;
  hasPractice: boolean;
  searchQuery: string;
}

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default to collapsed
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [allStepsCollapsed, setAllStepsCollapsed] = useState(false);
  const [allLecturesCollapsed, setAllLecturesCollapsed] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilters>({
    difficulty: "all",
    status: "all",
    hasArticle: false,
    hasVideo: false,
    hasPractice: false,
    searchQuery: ""
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const {
        data: courseData,
        error: courseError
      } = await supabase.from('courses').select('*').eq('course_id', courseId).single();
      if (courseError) throw courseError;
      setCourse(courseData);

      // Set SEO meta tags
      if (courseData) {
        document.title = `${courseData.title} - ByteSkill`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', courseData.description || `Learn ${courseData.title} with ByteSkill's comprehensive course.`);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = courseData.description || `Learn ${courseData.title} with ByteSkill's comprehensive course.`;
          document.getElementsByTagName('head')[0].appendChild(meta);
        }

        // Update canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        const canonicalUrl = `${window.location.origin}/course/${courseData.course_id}`;
        if (canonical) {
          canonical.setAttribute('href', canonicalUrl);
        } else {
          const link = document.createElement('link');
          link.rel = 'canonical';
          link.href = canonicalUrl;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      }

      // Fetch enrollment if user is logged in
      if (user) {
        const {
          data: enrollmentData,
          error: enrollmentError
        } = await supabase.from('course_enrollments').select('*').eq('course_id', courseId).eq('user_id', user.id).maybeSingle();
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

  const getBreadcrumbItems = () => {
    if (!course) return [];
    const categoryMap: {
      [key: string]: {
        label: string;
        href: string;
      };
    } = {
      'dsa-sheet': {
        label: 'DSA Sheets',
        href: '/dsa-sheets'
      },
      'course': {
        label: 'Courses',
        href: '/courses'
      },
      'interview-prep': {
        label: 'Interview Prep',
        href: '/interview-prep'
      },
      'core-cs': {
        label: 'Core CS',
        href: '/core-cs'
      }
    };
    const category = categoryMap[course.category] || {
      label: 'Courses',
      href: '/courses'
    };
    return [{
      label: 'Home',
      href: '/dashboard'
    }, category, {
      label: course.title
    }];
  };

  const getBackUrl = () => {
    if (!course) return '/courses';
    const categoryMap: {
      [key: string]: string;
    } = {
      'dsa-sheet': '/dsa-sheets',
      'course': '/courses',
      'interview-prep': '/interview-prep',
      'core-cs': '/core-cs'
    };
    return categoryMap[course.category] || '/courses';
  };

  const handleRevisionModeToggle = () => {
    console.log("Revision mode toggled");
  };

  const handleCollapseAllSteps = () => {
    setAllStepsCollapsed(true);
  };

  const handleExpandAllSteps = () => {
    setAllStepsCollapsed(false);
  };

  const handleCollapseAllLectures = () => {
    setAllLecturesCollapsed(true);
  };

  const handleExpandAllLectures = () => {
    setAllLecturesCollapsed(false);
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
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <Sidebar 
          selectedSheet={course?.category || "courses"} 
          onSheetChange={() => {}}
          collapsed={sidebarCollapsed}
        />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-72'
      }`}>
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 z-30 h-16 bg-black border-b border-gray-800 transition-all duration-300" style={{
          left: sidebarCollapsed ? '5rem' : '18rem',
        }}>
          <div className="flex items-center justify-between h-full px-4">
            <Header 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Main Content with proper spacing */}
        <main className="flex-1 pt-16 p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb with proper spacing */}
            <div className="mb-8 mt-4">
              <CourseBreadcrumb items={getBreadcrumbItems()} showBackButton={true} backUrl={getBackUrl()} />
            </div>

            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{course?.title}</h1>
                  {course?.tagline && (
                    <p className="text-blue-400 text-lg font-medium mb-2">{course.tagline}</p>
                  )}
                  <p className="text-gray-400 text-lg">{course?.description}</p>
                </div>
              </div>

              {course && <div className="flex items-center space-x-4">
                  <Badge className="bg-blue-900 text-blue-400 border-blue-800">
                    {course.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.module_count || 0} modules</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{course.estimated_hours}h</span>
                  </div>
                  {user && enrollment && <Badge className="bg-green-900 text-green-400 border-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enrolled - {enrollment.progress_percentage}% Complete
                    </Badge>}
                </div>}
            </div>

            {/* Progress Stats - Only show if enrolled and user is logged in */}
            {user && enrollment && <CourseProgressStats totalProblems={course.problem_count || 0} solvedProblems={Math.floor(enrollment.progress_percentage / 100 * (course.problem_count || 0))} attemptedProblems={Math.floor((enrollment.progress_percentage + 10) / 100 * (course.problem_count || 0))} averageTime={22} streak={4} completionRate={enrollment.progress_percentage} />}

            {/* Course Toolbar - Show for all users */}
            <CoursePageToolbar onRevisionModeToggle={handleRevisionModeToggle} onCollapseAllSteps={handleCollapseAllSteps} onExpandAllSteps={handleExpandAllSteps} onCollapseAllLectures={handleCollapseAllLectures} onExpandAllLectures={handleExpandAllLectures} allStepsCollapsed={allStepsCollapsed} allLecturesCollapsed={allLecturesCollapsed} filters={filters} onFiltersChange={setFilters} />

            {/* Course Content - Accessible to all users */}
            <CourseContent selectedSheet={courseId || ""} searchQuery={searchQuery} isEnrolled={true} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
