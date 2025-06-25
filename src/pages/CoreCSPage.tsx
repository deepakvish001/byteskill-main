import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Cpu, 
  Clock, 
  Search,
  CheckCircle,
  Database,
  Star,
  BookOpen,
  Play,
  TrendingUp,
  Users,
  Zap,
  Lock
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";
import CourseBreadcrumb from "@/components/CourseBreadcrumb";

interface Course {
  id: string;
  course_id: string;
  title: string;
  description: string;
  difficulty: string;
  total_lessons: number;
  estimated_hours: number;
  tags: string[];
  is_premium: boolean;
}

interface Enrollment {
  course_id: string;
  progress_percentage: number;
}

const CoreCSPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Core CS' }
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch core CS courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('category', 'core-cs')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Fetch user enrollments if logged in
      if (user) {
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('course_enrollments')
          .select('course_id, progress_percentage')
          .eq('user_id', user.id);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        } else {
          setEnrollments(enrollmentsData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-900/80 text-green-300 border-green-700';
      case 'intermediate': return 'bg-yellow-900/80 text-yellow-300 border-yellow-700';
      case 'advanced': return 'bg-red-900/80 text-red-300 border-red-700';
      default: return 'bg-gray-900/80 text-gray-300 border-gray-700';
    }
  };

  const getEnrollmentStatus = (courseId: string) => {
    return enrollments.find(e => e.course_id === courseId);
  };

  const handleEnrollment = async (courseId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId
        });

      if (error) throw error;
      
      // Refresh enrollments
      fetchData();
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
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
          selectedSheet="core-cs" 
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
        <div className="fixed top-0 right-0 z-30 bg-black border-b border-gray-800 transition-all duration-300" style={{
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
        
        {/* Main Content with increased top padding to show breadcrumb */}
        <main className="flex-1 pt-28 p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Breadcrumb - Now visible with proper spacing */}
            <div className="bg-black mb-4">
              <CourseBreadcrumb items={breadcrumbItems} />
            </div>

            {/* Page Header */}
            <div className="text-center mb-8 bg-black">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Core Computer Science
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Master fundamental CS concepts with comprehensive courses in algorithms, systems, and theory
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  placeholder="Search core CS topics, algorithms, or system design..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="pl-12 bg-black border-gray-800 text-white placeholder-gray-500 h-12 text-lg focus:border-blue-500"
                />
              </div>
            </div>

            {/* Course Cards Grid - Same design as DSA Sheets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => {
                const enrollment = getEnrollmentStatus(course.course_id);
                const cardColors = [
                  'from-yellow-600 to-orange-800',
                  'from-orange-600 to-red-700', 
                  'from-amber-600 to-yellow-800',
                  'from-red-500 to-orange-600'
                ];
                const cardColor = cardColors[filteredCourses.indexOf(course) % cardColors.length];
                
                return (
                  <Card key={course.id} className={`group bg-gradient-to-br ${cardColor} border-0 text-white relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}>
                    {/* Free Badge */}
                    {!course.is_premium && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-green-500/90 text-white border-0 text-xs font-bold px-2 py-1">
                          FREE
                        </Badge>
                      </div>
                    )}
                    
                    {/* Enrolled Badge */}
                    {enrollment && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-white/20 text-white border-0 text-xs font-bold px-2 py-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          ENROLLED
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4 bg-transparent relative z-10">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                          <Cpu className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <CardTitle className="text-white text-xl font-bold text-center mb-2">
                        {course.title}
                      </CardTitle>
                      
                      <CardDescription className="text-white/80 text-sm text-center leading-relaxed">
                        {course.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-center mt-3">
                        <Badge className={`${getDifficultyColor(course.difficulty)} text-xs font-medium border`}>
                          {course.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 bg-transparent relative z-10">
                      <div className="flex items-center justify-center space-x-6 mb-6 text-white/80">
                        <div className="flex items-center space-x-1 text-sm">
                          <Database className="w-4 h-4" />
                          <span>{course.total_lessons} topics</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{course.estimated_hours}h</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>4.9</span>
                        </div>
                      </div>
                      
                      {enrollment && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2 text-white/80">
                            <span>Progress</span>
                            <span className="font-bold text-white">{enrollment.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-white h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${enrollment.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Button 
                          onClick={() => navigate(`/course/${course.course_id}`)}
                          className="w-full bg-white/20 hover:bg-white/30 text-white border-0 font-medium py-2 transition-all duration-200"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          View Course
                        </Button>
                        
                        {!enrollment && (
                          <Button 
                            onClick={() => handleEnrollment(course.course_id)}
                            className="w-full bg-white text-gray-900 hover:bg-gray-100 border-0 font-medium py-2 transition-all duration-200"
                          >
                            Enroll Now
                          </Button>
                        )}
                      </div>
                    </CardContent>

                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                    <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-white/5 rounded-full blur-lg" />
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoreCSPage;
