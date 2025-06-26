
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserMenu from '@/components/UserMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Target, Users, Star, ArrowRight, Trophy, GraduationCap, Play, CheckCircle, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Course {
  course_id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_hours: number; // Changed from estimated_duration
  tags: string[];
  created_at: string;
  is_premium: boolean; // Changed from is_free
  rating?: number;
  enrolled_count?: number;
  category: string;
  tagline?: string;
}

interface UserProgress {
  course_id: string;
  progress_percentage: number;
  lessons_completed: number;
}

const CoursesOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default closed
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<{ [key: string]: UserProgress }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('category', 'course')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('course_id, progress_percentage')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap: { [key: string]: UserProgress } = {};
      data?.forEach(progress => {
        progressMap[progress.course_id] = {
          course_id: progress.course_id,
          progress_percentage: progress.progress_percentage || 0,
          lessons_completed: Math.floor((progress.progress_percentage || 0) / 5) // Estimate
        };
      });

      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-900/20 text-green-400 border-green-800';
      case 'intermediate':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-800';
      case 'advanced':
        return 'bg-red-900/20 text-red-400 border-red-800';
      default:
        return 'bg-gray-900/20 text-gray-400 border-gray-800';
    }
  };

  const getCardGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-orange-500 to-amber-600',
      'bg-gradient-to-br from-red-500 to-orange-600',
      'bg-gradient-to-br from-amber-500 to-orange-600',
      'bg-gradient-to-br from-pink-500 to-red-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-blue-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-teal-600',
      'bg-gradient-to-br from-teal-500 to-cyan-600'
    ];
    return gradients[index % gradients.length];
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black flex">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <Sidebar 
          selectedSheet="courses" 
          onSheetChange={() => {}}
          collapsed={sidebarCollapsed}
        />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-72'
      }`}>
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 z-30 h-16 bg-black border-b border-gray-800" style={{
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
              <Link to="/login">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Main Content */}
        <main className="pt-16 p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white">Programming Courses</h1>
                  <p className="text-gray-400 text-lg mt-2">
                    Learn programming languages and frameworks with hands-on projects
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Courses Available</h3>
                <p className="text-gray-400">
                  {searchQuery ? 'No courses match your search criteria.' : 'Courses will be available soon.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course, index) => {
                  const progress = userProgress[course.course_id];
                  const progressPercentage = progress?.progress_percentage || 0;
                  
                  return (
                    <div key={course.course_id} className={`${getCardGradient(index)} rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer`}>
                      {/* Free Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-600 text-white border-none text-xs font-semibold px-2 py-1">
                          {!course.is_premium ? 'FREE' : 'PREMIUM'}
                        </Badge>
                      </div>

                      {/* Icon */}
                      <div className="mb-6 mt-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-xl font-bold mb-3 text-white">
                        {course.title}
                      </h3>

                      {/* Course Description */}
                      <p className="text-white/80 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Difficulty Badge */}
                      <div className="mb-4">
                        <Badge className="bg-white/20 text-white border-none text-xs font-medium px-2 py-1 backdrop-blur-sm">
                          {course.difficulty.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-white/80 mb-6">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>15 topics</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.estimated_hours}h</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-300" />
                          <span>4.9</span>
                        </div>
                      </div>

                      {/* Progress Bar - Only show for logged in users */}
                      {user && progress && progressPercentage > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/80">Progress</span>
                            <span className="text-white font-medium">{progressPercentage}%</span>
                          </div>
                          <Progress 
                            value={progressPercentage} 
                            className="h-2 bg-white/20" 
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button 
                          onClick={() => user ? navigate(`/course/${course.course_id}`) : navigate('/login')}
                          className="w-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm transition-all duration-200"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          View Course
                        </Button>
                        <Button 
                          onClick={() => user ? navigate(`/course/${course.course_id}`) : navigate('/login')}
                          className="w-full bg-white hover:bg-gray-100 text-gray-800 border-none font-semibold transition-all duration-200"
                        >
                          {user ? (
                            progress && progressPercentage > 0 ? (
                              progressPercentage === 100 ? 'Review Course' : 'Continue Learning'
                            ) : 'Enroll Now'
                          ) : 'Enroll Now'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursesOverview;
