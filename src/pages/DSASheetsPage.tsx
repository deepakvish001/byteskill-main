import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserMenu from '@/components/UserMenu';

const DSASheetsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch courses from Supabase
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('category', 'dsa-sheet');

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  // Function to filter courses based on difficulty
  const filteredCourses = React.useMemo(() => {
    if (!courses) return [];

    let filtered = courses;

    if (selectedFilter !== 'all') {
      filtered = courses.filter(
        (course) => course.difficulty === selectedFilter
      );
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return filtered;
  }, [courses, selectedFilter, searchQuery]);

  // Mock function to get enrollment status (replace with actual logic)
  const getEnrollmentStatus = (courseId: string) => {
    // Replace this with actual logic to fetch enrollment status
    return {
      course_id: courseId,
      progress_percentage: Math.floor(Math.random() * 100), // Mock progress
    };
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <Sidebar 
          selectedSheet="dsa-sheets" 
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
            <UserMenu />
          </div>
        </div>
        
        {/* Main Content */}
        <main className="pt-16 p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                DSA Practice Sheets
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Master Data Structures and Algorithms with our curated problem sheets
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter.toLowerCase() ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter(filter.toLowerCase())}
                  className="text-sm"
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => {
                const enrollment = getEnrollmentStatus(course.course_id);
                const progressPercentage = enrollment?.progress_percentage || 0;

                return (
                  <Card key={course.course_id} className="bg-gray-900 border-gray-700 hover:border-blue-500 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={course.difficulty === 'beginner' ? 'secondary' : 
                                     course.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                          {course.difficulty}
                        </Badge>
                        {course.is_premium && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-white text-lg group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-sm line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress Bar (if enrolled) */}
                      {enrollment && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-blue-400">{progressPercentage}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      )}
                      
                      {/* Course Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.total_lessons} problems</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{course.estimated_hours}h</span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {course.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Action Button */}
                      <Link to={`/sheet/${course.course_id}`} className="block">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          {enrollment ? 'Continue' : 'Start Practice'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No sheets found</h3>
                <p className="text-gray-500">Try adjusting your filter or search query.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DSASheetsPage;
