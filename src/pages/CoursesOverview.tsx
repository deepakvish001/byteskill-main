
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Search,
  Target,
  Zap,
  CheckCircle,
  Lock,
  TrendingUp
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
  course_id: string;
  progress_percentage: number;
}

const CoursesOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch all courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dsa-sheet': return BookOpen;
      case 'course': return Target;
      case 'interview-prep': return Users;
      case 'core-cs': return Zap;
      default: return BookOpen;
    }
  };

  const getEnrollmentStatus = (courseId: string) => {
    return enrollments.find(e => e.course_id === courseId);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(filterQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const coursesByCategory = {
    'dsa-sheet': filteredCourses.filter(c => c.category === 'dsa-sheet'),
    'course': filteredCourses.filter(c => c.category === 'course'),
    'interview-prep': filteredCourses.filter(c => c.category === 'interview-prep'),
    'core-cs': filteredCourses.filter(c => c.category === 'core-cs'),
  };

  const renderCourseCard = (course: Course) => {
    const CategoryIcon = getCategoryIcon(course.category);
    const enrollment = getEnrollmentStatus(course.course_id);

    return (
      <Card key={course.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <CategoryIcon className="w-5 h-5 text-blue-400" />
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
                <BookOpen className="w-4 h-4" />
                <span>{course.total_lessons} lessons</span>
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
                  className="bg-blue-500 h-2 rounded-full transition-all" 
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

          <Button 
            onClick={() => navigate(`/course/${course.course_id}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {enrollment ? 'Continue Learning' : 'View Course'}
          </Button>
        </CardContent>
      </Card>
    );
  };

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
          selectedSheet="courses" 
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Explore Courses
              </h1>
              <p className="text-gray-400">Master coding skills with our comprehensive learning paths</p>
            </div>

            {/* Search and Filter */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search courses, topics, or skills..."
                      value={filterQuery}
                      onChange={(e) => setFilterQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Categories Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-5 bg-gray-900 border border-gray-800">
                <TabsTrigger value="all" className="text-gray-400 data-[state=active]:text-white">
                  All Courses
                </TabsTrigger>
                <TabsTrigger value="dsa-sheet" className="text-gray-400 data-[state=active]:text-white">
                  DSA Sheets
                </TabsTrigger>
                <TabsTrigger value="course" className="text-gray-400 data-[state=active]:text-white">
                  Courses
                </TabsTrigger>
                <TabsTrigger value="interview-prep" className="text-gray-400 data-[state=active]:text-white">
                  Interview Prep
                </TabsTrigger>
                <TabsTrigger value="core-cs" className="text-gray-400 data-[state=active]:text-white">
                  Core CS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map(renderCourseCard)}
                </div>
              </TabsContent>

              <TabsContent value="dsa-sheet" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByCategory['dsa-sheet'].map(renderCourseCard)}
                </div>
              </TabsContent>

              <TabsContent value="course" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByCategory['course'].map(renderCourseCard)}
                </div>
              </TabsContent>

              <TabsContent value="interview-prep" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByCategory['interview-prep'].map(renderCourseCard)}
                </div>
              </TabsContent>

              <TabsContent value="core-cs" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByCategory['core-cs'].map(renderCourseCard)}
                </div>
              </TabsContent>
            </Tabs>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{coursesByCategory['dsa-sheet'].length}</div>
                  <div className="text-sm text-gray-400">DSA Sheets</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{coursesByCategory['course'].length}</div>
                  <div className="text-sm text-gray-400">Courses</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{coursesByCategory['interview-prep'].length}</div>
                  <div className="text-sm text-gray-400">Interview Prep</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{coursesByCategory['core-cs'].length}</div>
                  <div className="text-sm text-gray-400">Core CS</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursesOverview;
