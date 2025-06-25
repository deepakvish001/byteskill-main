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
  Star,
  Search,
  Target,
  CheckCircle,
  Lock,
  Database
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
      case 'beginner': return 'bg-green-900 text-green-400 border-green-800';
      case 'intermediate': return 'bg-yellow-900 text-yellow-400 border-yellow-800';
      case 'advanced': return 'bg-red-900 text-red-400 border-red-800';
      default: return 'bg-gray-900 text-gray-400 border-gray-800';
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
        
        {/* Main Content */}
        <main className="flex-1 pt-20 p-3 sm:p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <CourseBreadcrumb items={breadcrumbItems} />

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Core Computer Science
              </h1>
              <p className="text-gray-400">Master fundamental CS concepts every developer should know</p>
            </div>

            {/* Search */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search core CS topics..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Course Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const enrollment = getEnrollmentStatus(course.course_id);
                
                return (
                  <Card key={course.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-900/50 rounded-lg">
                            <Cpu className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getDifficultyColor(course.difficulty)}>
                                {course.difficulty}
                              </Badge>
                              {course.is_premium && (
                                <Badge className="bg-purple-900 text-purple-400 border-purple-800">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Pro
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
                        </div>
                      </div>
                      <CardDescription className="text-gray-400">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Database className="w-4 h-4" />
                            <span>{course.total_lessons} topics</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.estimated_hours}h</span>
                          </div>
                        </div>
                      </div>
                      
                      {enrollment && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{enrollment.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full transition-all" 
                              style={{ width: `${enrollment.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mb-4">
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

                      <div className="flex space-x-2">
                        {!enrollment && (
                          <Button 
                            onClick={() => handleEnrollment(course.course_id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            Free Enroll
                          </Button>
                        )}
                        <Button 
                          onClick={() => navigate(`/course/${course.course_id}`)}
                          className={`${enrollment ? 'flex-1' : 'flex-1'} bg-yellow-600 hover:bg-yellow-700 text-white`}
                        >
                          {enrollment ? 'Continue Learning' : 'View Course'}
                        </Button>
                      </div>
                    </CardContent>
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
