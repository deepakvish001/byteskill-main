
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
import { BookOpen, Clock, Target, Users, Star, ArrowRight, Trophy, Code, GitBranch, TrendingUp, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

interface DSASheet {
  course_id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_hours: number;
  problem_count: number;
  tags: string[];
  created_at: string;
  is_premium: boolean;
  rating?: number;
  enrolled_count?: number;
  category: string;
  tagline?: string;
}

interface UserProgress {
  course_id: string;
  progress_percentage: number;
  problems_solved: number;
}

const DSASheetsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default closed
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
          problems_solved: Math.floor((progress.progress_percentage || 0) / 10)
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

  const filteredSheets = dsaSheets.filter(sheet =>
    sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white">DSA Practice Sheets</h1>
                  <p className="text-gray-400 text-lg mt-2">
                    Master Data Structures and Algorithms with curated problem collections
                  </p>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    <span className="text-sm text-gray-400">Total Sheets</span>
                  </div>
                  <p className="text-3xl font-bold text-white text-center">{dsaSheets.length}</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Target className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-gray-400">Total Problems</span>
                  </div>
                  <p className="text-3xl font-bold text-white text-center">
                    {dsaSheets.reduce((sum, sheet) => sum + (sheet.problem_count || 0), 0)}
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <span className="text-sm text-gray-400">In Progress</span>
                  </div>
                  <p className="text-3xl font-bold text-white text-center">
                    {user ? Object.values(userProgress).filter(p => p.progress_percentage > 0).length : 0}
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm text-gray-400">Completed</span>
                  </div>
                  <p className="text-3xl font-bold text-white text-center">
                    {user ? Object.values(userProgress).filter(p => p.progress_percentage === 100).length : 0}
                  </p>
                </div>
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSheets.map((sheet) => {
                  const progress = userProgress[sheet.course_id];
                  const progressPercentage = progress?.progress_percentage || 0;
                  
                  return (
                    <Card key={sheet.course_id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 group cursor-pointer backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={getDifficultyColor(sheet.difficulty)}>
                            {sheet.difficulty}
                          </Badge>
                          <Badge className={sheet.is_premium ? "bg-yellow-900/20 text-yellow-400 border-yellow-800" : "bg-green-900/20 text-green-400 border-green-800"}>
                            {sheet.is_premium ? 'Premium' : 'Free'}
                          </Badge>
                        </div>
                        <CardTitle className="text-white text-xl group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                          {sheet.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 line-clamp-3 leading-relaxed">
                          {sheet.description}
                        </CardDescription>
                        {sheet.tagline && (
                          <p className="text-sm text-blue-400 font-medium mt-2">{sheet.tagline}</p>
                        )}
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Progress Bar - Only show for logged in users */}
                        {user && progress && progressPercentage > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-white font-medium">{progressPercentage}%</span>
                            </div>
                            <Progress 
                              value={progressPercentage} 
                              className="h-2 bg-gray-800" 
                            />
                            <p className="text-xs text-gray-500">
                              {Math.floor(progressPercentage / 10)} problems solved
                            </p>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Target className="w-4 h-4 mr-1" />
                              <span>{sheet.problem_count || 0} problems</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{sheet.estimated_hours || 0}h</span>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {sheet.tags && sheet.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {sheet.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-800/50 text-gray-300 border-gray-700">
                                {tag}
                              </Badge>
                            ))}
                            {sheet.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-800/50 text-gray-300 border-gray-700">
                                +{sheet.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Action Button */}
                        <Button 
                          onClick={() => user ? navigate(`/sheet/${sheet.course_id}`) : navigate('/login')}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:shadow-lg transition-all duration-300"
                        >
                          {user ? (
                            progress && progressPercentage > 0 ? (
                              progressPercentage === 100 ? 'Review Sheet' : 'Continue Practice'
                            ) : 'Start Practicing'
                          ) : 'Sign In to Practice'}
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
