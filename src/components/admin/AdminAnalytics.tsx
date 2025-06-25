
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Users, Eye, Award, TrendingUp, Clock } from 'lucide-react';

const AdminAnalytics = () => {
  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      // Get total courses by category
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('category, is_published, is_premium');
      
      if (coursesError) throw coursesError;

      // Get total enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('course_id, progress_percentage');
      
      if (enrollmentsError) throw enrollmentsError;

      // Get total users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, problems_solved, current_streak');
      
      if (profilesError) throw profilesError;

      // Calculate analytics
      const totalCourses = courses?.length || 0;
      const publishedCourses = courses?.filter(c => c.is_published).length || 0;
      const premiumCourses = courses?.filter(c => c.is_premium).length || 0;
      
      const coursesByCategory = {
        'course': courses?.filter(c => c.category === 'course').length || 0,
        'dsa-sheet': courses?.filter(c => c.category === 'dsa-sheet').length || 0,
        'interview-prep': courses?.filter(c => c.category === 'interview-prep').length || 0,
        'core-cs': courses?.filter(c => c.category === 'core-cs').length || 0,
      };

      const totalEnrollments = enrollments?.length || 0;
      const avgProgress = enrollments?.length > 0 
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollments.length)
        : 0;

      const totalUsers = profiles?.length || 0;
      const avgProblemsSolved = profiles?.length > 0 
        ? Math.round(profiles.reduce((sum, p) => sum + (p.problems_solved || 0), 0) / profiles.length)
        : 0;

      return {
        totalCourses,
        publishedCourses,
        premiumCourses,
        coursesByCategory,
        totalEnrollments,
        avgProgress,
        totalUsers,
        avgProblemsSolved,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Courses',
      value: analytics?.totalCourses || 0,
      icon: BookOpen,
      description: `${analytics?.publishedCourses || 0} published`,
      color: 'text-blue-500'
    },
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: Users,
      description: `Avg ${analytics?.avgProblemsSolved || 0} problems solved`,
      color: 'text-green-500'
    },
    {
      title: 'Total Enrollments',
      value: analytics?.totalEnrollments || 0,
      icon: Eye,
      description: `${analytics?.avgProgress || 0}% avg progress`,
      color: 'text-purple-500'
    },
    {
      title: 'Premium Courses',
      value: analytics?.premiumCourses || 0,
      icon: Award,
      description: 'Premium content',
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Content by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analytics?.coursesByCategory || {}).map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 capitalize">
                    {category.replace('-', ' ')}
                  </span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
                <Progress 
                  value={(count / (analytics?.totalCourses || 1)) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Publishing Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Published</span>
                <span className="text-green-400 font-semibold">{analytics?.publishedCourses || 0}</span>
              </div>
              <Progress 
                value={((analytics?.publishedCourses || 0) / (analytics?.totalCourses || 1)) * 100} 
                className="h-2" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Draft</span>
                <span className="text-yellow-400 font-semibold">
                  {(analytics?.totalCourses || 0) - (analytics?.publishedCourses || 0)}
                </span>
              </div>
              <Progress 
                value={((analytics?.totalCourses || 0) - (analytics?.publishedCourses || 0)) / (analytics?.totalCourses || 1) * 100} 
                className="h-2" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Premium</span>
                <span className="text-purple-400 font-semibold">{analytics?.premiumCourses || 0}</span>
              </div>
              <Progress 
                value={((analytics?.premiumCourses || 0) / (analytics?.totalCourses || 1)) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
