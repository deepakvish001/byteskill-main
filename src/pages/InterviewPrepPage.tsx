
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Clock, 
  Search,
  Target,
  CheckCircle,
  Lock,
  MessageCircle,
  Star,
  BookOpen,
  TrendingUp,
  Award
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

const InterviewPrepPage = () => {
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
    { label: 'Interview Prep' }
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch interview prep courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('category', 'interview-prep')
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
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
          selectedSheet="interview-prep" 
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
        
        {/* Main Content with proper spacing */}
        <main className="flex-1 pt-24 p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Breadcrumb */}
            <div className="bg-black">
              <CourseBreadcrumb items={breadcrumbItems} />
            </div>

            {/* Page Header */}
            <div className="text-center mb-8 bg-black">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4">
                Interview Preparation
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Ace your technical interviews with expert guidance, mock interviews, and comprehensive practice
              </p>
            </div>

            {/* Search Card */}
            <Card className="bg-gray-900/90 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search interview prep courses by company, topic, or difficulty..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="pl-12 bg-gray-800/70 border-gray-600 text-white placeholder-gray-400 h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Course Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const enrollment = getEnrollmentStatus(course.course_id);
                
                return (
                  <Card key={course.id} className="group bg-gray-900/90 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardHeader className="relative pb-4 bg-gray-900/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                            <Users className="w-6 h-6 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-white text-xl font-bold group-hover:text-purple-400 transition-colors">
                              {course.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={`${getDifficultyColor(course.difficulty)} text-xs font-medium`}>
                                {course.difficulty}
                              </Badge>
                              {course.is_premium && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Pro
                                </Badge>
                              )}
                              {enrollment && (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Enrolled
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-gray-300 text-sm leading-relaxed bg-transparent">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative pt-0 bg-gray-900/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4 text-purple-400" />
                            <span className="font-medium text-gray-300">{course.total_lessons} sessions</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-green-400" />
                            <span className="font-medium text-gray-300">{course.estimated_hours}h</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="font-medium text-gray-300">4.8</span>
                          </div>
                        </div>
                      </div>
                      
                      {enrollment && (
                        <div className="mb-6">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400 font-medium">Progress</span>
                            <span className="text-white font-bold">{enrollment.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${enrollment.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-6">
                        {course.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50">
                            {tag}
                          </Badge>
                        ))}
                        {course.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-800/50 text-gray-300 border-gray-600">
                            +{course.tags.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        {!enrollment && (
                          <Button 
                            onClick={() => handleEnrollment(course.course_id)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2.5 transition-all duration-200"
                          >
                            Free Enroll
                          </Button>
                        )}
                        <Button 
                          onClick={() => navigate(`/course/${course.course_id}`)}
                          className={`${enrollment ? 'flex-1' : 'flex-1'} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2.5 transition-all duration-200`}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          {enrollment ? 'Continue Learning' : 'View Course'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center bg-transparent">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{filteredCourses.length}</div>
                  <div className="text-sm text-purple-300">Interview Courses</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-pink-900/30 to-pink-800/30 border-pink-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center bg-transparent">
                  <MessageCircle className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-sm text-pink-300">Mock Interviews</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center bg-transparent">
                  <Award className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">5k+</div>
                  <div className="text-sm text-red-300">Job Offers</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center bg-transparent">
                  <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">87%</div>
                  <div className="text-sm text-yellow-300">Success Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewPrepPage;
