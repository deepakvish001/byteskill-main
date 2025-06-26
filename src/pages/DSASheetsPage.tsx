
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
import { BookOpen, Clock, Target, Users, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DSASheet {
  course_id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_duration: string;
  problem_count: number;
  tags: string[];
  created_at: string;
  is_free: boolean;
  rating?: number;
  enrolled_count?: number;
}

interface UserProgress {
  course_id: string;
  progress_percentage: number;
  problems_solved: number;
}

const DSASheetsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dsaSheets, setDsaSheets] = useState<DSASheet[]>([]);
  const [userProgress, setUserProgress] = useState<{ [key: string]: UserProgress }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDSASheets();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchDSASheets = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('category', 'dsa-sheet')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDsaSheets(data || []);
    } catch (error) {
      console.error('Error fetching DSA sheets:', error);
      toast.error('Failed to load DSA sheets');
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
          problems_solved: Math.floor((progress.progress_percentage || 0) / 10) // Estimate
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
        return 'bg-green-900 text-green-400 border-green-800';
      case 'intermediate':
        return 'bg-yellow-900 text-yellow-400 border-yellow-800';
      case 'advanced':
        return 'bg-red-900 text-red-400 border-red-800';
      default:
        return 'bg-gray-900 text-gray-400 border-gray-800';
    }
  };

  const filteredSheets = dsaSheets.filter(sheet =>
    sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">Please sign in to access DSA sheets.</p>
          <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

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
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">DSA Sheets</h1>
              <p className="text-gray-400 text-lg">
                Master Data Structures and Algorithms with our comprehensive problem sheets
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredSheets.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No DSA Sheets Available</h3>
                <p className="text-gray-400">
                  {searchQuery ? 'No sheets match your search criteria.' : 'DSA sheets will be available soon.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSheets.map((sheet) => {
                  const progress = userProgress[sheet.course_id];
                  const progressPercentage = progress?.progress_percentage || 0;
                  
                  return (
                    <Card key={sheet.course_id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={getDifficultyColor(sheet.difficulty)}>
                            {sheet.difficulty}
                          </Badge>
                          {sheet.is_free && (
                            <Badge className="bg-green-900 text-green-400 border-green-800">
                              Free
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-white text-xl group-hover:text-blue-400 transition-colors">
                          {sheet.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 line-clamp-2">
                          {sheet.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Progress Bar (if user has progress) */}
                        {progress && progressPercentage > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-white">{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Target className="w-4 h-4 mr-1" />
                              <span>{sheet.problem_count} problems</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{sheet.estimated_duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {sheet.tags && sheet.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {sheet.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                            {sheet.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                                +{sheet.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Action Button */}
                        <Button 
                          onClick={() => navigate(`/sheet/${sheet.course_id}`)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-500 transition-colors"
                        >
                          {progress && progressPercentage > 0 ? 'Continue' : 'Start Sheet'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
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

export default DSASheetsPage;
