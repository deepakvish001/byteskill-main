import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserMenu from '@/components/UserMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Flame, Calendar, Edit, Save, X, BookOpen, Code, Star, TrendingUp, Award, Clock, Brain, Zap, CheckCircle, XCircle, AlertCircle, Activity, BarChart3, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  mobile_number: string | null;
  avatar_url: string | null;
  xp_points: number;
  problems_solved: number;
  current_streak: number;
  max_streak: number;
  created_at: string;
}

const UserDashboard = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default closed
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
  });

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          toast.error('User not found');
        } else {
          toast.error('Failed to load user profile');
        }
        return;
      }

      setUserProfile(profile);
      setFormData({
        full_name: profile.full_name || '',
        mobile_number: profile.mobile_number || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !userProfile || user.id !== userProfile.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          mobile_number: formData.mobile_number,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile();
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const getXPBadge = (xp: number) => {
    if (xp >= 10000) return { name: "Legendary", color: "bg-purple-600", textColor: "text-purple-400" };
    if (xp >= 5000) return { name: "Expert", color: "bg-red-600", textColor: "text-red-400" };
    if (xp >= 2500) return { name: "Advanced", color: "bg-orange-600", textColor: "text-orange-400" };
    if (xp >= 1000) return { name: "Intermediate", color: "bg-blue-600", textColor: "text-blue-400" };
    if (xp >= 500) return { name: "Beginner", color: "bg-green-600", textColor: "text-green-400" };
    return { name: "Newbie", color: "bg-gray-600", textColor: "text-gray-400" };
  };

  const progressData = [
    { topic: "Arrays & Hashing", solved: Math.floor((userProfile?.problems_solved || 0) * 0.3), total: 30, difficulty: "Easy", color: "text-green-400" },
    { topic: "Two Pointers", solved: Math.floor((userProfile?.problems_solved || 0) * 0.2), total: 20, difficulty: "Medium", color: "text-yellow-400" },
    { topic: "Binary Search", solved: Math.floor((userProfile?.problems_solved || 0) * 0.15), total: 25, difficulty: "Medium", color: "text-yellow-400" },
    { topic: "Dynamic Programming", solved: Math.floor((userProfile?.problems_solved || 0) * 0.1), total: 40, difficulty: "Hard", color: "text-red-400" },
    { topic: "Trees & Graphs", solved: Math.floor((userProfile?.problems_solved || 0) * 0.25), total: 35, difficulty: "Hard", color: "text-red-400" }
  ];

  const recentActivity = [
    { problem: "Two Sum", difficulty: "Easy", status: "solved", time: "2 hours ago", xp: 10 },
    { problem: "Longest Substring", difficulty: "Medium", status: "attempted", time: "1 day ago", xp: 0 },
    { problem: "Binary Tree Inorder", difficulty: "Medium", status: "solved", time: "2 days ago", xp: 15 },
    { problem: "Maximum Subarray", difficulty: "Easy", status: "solved", time: "3 days ago", xp: 10 },
    { problem: "Valid Parentheses", difficulty: "Easy", status: "solved", time: "1 week ago", xp: 10 }
  ];

  const achievements = [
    { name: "First Steps", description: "Solved your first problem", icon: Star, earned: (userProfile?.problems_solved || 0) >= 1, progress: Math.min((userProfile?.problems_solved || 0) / 1 * 100, 100) },
    { name: "Problem Solver", description: "Solved 50 problems", icon: Trophy, earned: (userProfile?.problems_solved || 0) >= 50, progress: Math.min((userProfile?.problems_solved || 0) / 50 * 100, 100) },
    { name: "Streak Master", description: "7-day solving streak", icon: Flame, earned: (userProfile?.current_streak || 0) >= 7, progress: Math.min((userProfile?.current_streak || 0) / 7 * 100, 100) },
    { name: "XP Hunter", description: "Earned 1000 XP points", icon: Zap, earned: (userProfile?.xp_points || 0) >= 1000, progress: Math.min((userProfile?.xp_points || 0) / 1000 * 100, 100) },
    { name: "Consistent Learner", description: "15-day max streak", icon: Calendar, earned: (userProfile?.max_streak || 0) >= 15, progress: Math.min((userProfile?.max_streak || 0) / 15 * 100, 100) },
    { name: "Algorithm Master", description: "Solved 100 problems", icon: Brain, earned: (userProfile?.problems_solved || 0) >= 100, progress: Math.min((userProfile?.problems_solved || 0) / 100 * 100, 100) }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black">
        <div className="fixed top-0 left-0 right-0 z-30 bg-black border-b border-gray-800">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl shadow-2xl">
                    <BookOpen className="w-6 h-6 text-white animate-bounce" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Byteskill
                </span>
              </button>
            </div>
            {user ? <UserMenu /> : (
              <Link to="/login">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
            <p className="text-gray-400">The user @{username} doesn't exist.</p>
            <Button 
              onClick={() => navigate('/')} 
              className="mt-4 bg-orange-600 hover:bg-orange-700"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const badge = getXPBadge(userProfile.xp_points);
  const isOwnProfile = user?.id === userProfile.id;

  return (
    <div className="min-h-screen bg-black flex">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <Sidebar 
          selectedSheet="profile" 
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
            {user ? <UserMenu /> : (
              <Link to="/login">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="pt-20 p-6 bg-black min-h-screen">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24 ring-4 ring-orange-500/20">
                    <AvatarImage src={userProfile.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-3xl">
                      {userProfile.full_name?.charAt(0) || userProfile.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold text-white">{userProfile.full_name || userProfile.username}</h1>
                      <Badge className={`${badge.color} text-white text-lg px-3 py-1 shadow-lg`}>
                        {badge.name}
                      </Badge>
                    </div>
                    <p className="text-xl text-gray-400 mb-2">@{userProfile.username}</p>
                    <div className="flex items-center space-x-4 text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Activity className="w-4 h-4" />
                        <span>Active learner</span>
                      </span>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <Button
                      onClick={() => setEditing(!editing)}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800 hover:border-orange-500 transition-colors"
                    >
                      {editing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                      {editing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-900/50 border-gray-800 hover:border-yellow-500/50 transition-colors shadow-lg backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">XP Points</p>
                      <p className="text-3xl font-bold text-white">{userProfile.xp_points}</p>
                      <p className="text-xs text-yellow-400 mt-1">+50 this week</p>
                    </div>
                    <div className="bg-yellow-500/10 p-3 rounded-full">
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-colors shadow-lg backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Problems Solved</p>
                      <p className="text-3xl font-bold text-white">{userProfile.problems_solved}</p>
                      <p className="text-xs text-green-400 mt-1">+3 this week</p>
                    </div>
                    <div className="bg-green-500/10 p-3 rounded-full">
                      <Target className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-colors shadow-lg backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Current Streak</p>
                      <p className="text-3xl font-bold text-white">{userProfile.current_streak}</p>
                      <p className="text-xs text-orange-400 mt-1">Keep it up!</p>
                    </div>
                    <div className="bg-orange-500/10 p-3 rounded-full">
                      <Flame className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-colors shadow-lg backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Max Streak</p>
                      <p className="text-3xl font-bold text-white">{userProfile.max_streak}</p>
                      <p className="text-xs text-blue-400 mt-1">Personal best</p>
                    </div>
                    <div className="bg-blue-500/10 p-3 rounded-full">
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="progress" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <TabsTrigger value="progress" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="achievements" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">
                  <Award className="w-4 h-4 mr-2" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="activity" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity
                </TabsTrigger>
                {isOwnProfile && (
                  <TabsTrigger value="settings" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">
                    <Edit className="w-4 h-4 mr-2" />
                    Settings
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="progress" className="space-y-6">
                <Card className="bg-gray-900/50 border-gray-800 shadow-lg backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      Topic Progress
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Your progress across different coding topics and difficulty levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {progressData.map((topic) => {
                      const progress = Math.min((topic.solved / topic.total) * 100, 100);
                      return (
                        <div key={topic.topic} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <span className="text-white font-medium">{topic.topic}</span>
                              <Badge className={`text-xs px-2 py-1 ${
                                topic.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-800' :
                                topic.difficulty === 'Medium' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800' :
                                'bg-red-900/20 text-red-400 border-red-800'
                              }`}>
                                {topic.difficulty}
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-400">{topic.solved}/{topic.total}</span>
                          </div>
                          <Progress value={progress} className="h-3" />
                          <div className="flex justify-between items-center text-xs">
                            <span className={topic.color}>{Math.round(progress)}% complete</span>
                            <span className="text-gray-500">+{Math.floor(topic.solved * 0.1)} XP earned</span>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <Card className="bg-gray-900/50 border-gray-800 shadow-lg backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-400" />
                      Achievements
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Unlock achievements by reaching milestones in your coding journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border transition-all duration-300 ${
                            achievement.earned 
                              ? 'bg-gray-800/50 border-green-800 shadow-lg ring-1 ring-green-500/20' 
                              : 'bg-gray-800/30 border-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-green-500/20' : 'bg-gray-700/50'}`}>
                              <achievement.icon className={`w-6 h-6 ${achievement.earned ? 'text-green-400' : 'text-gray-500'}`} />
                            </div>
                            <div className="flex-1">
                              <span className={`font-medium ${achievement.earned ? 'text-white' : 'text-gray-500'}`}>
                                {achievement.name}
                              </span>
                              {achievement.earned && (
                                <Badge className="ml-2 bg-green-900/20 text-green-400 border-green-800 text-xs">
                                  Earned
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm mb-3 ${achievement.earned ? 'text-gray-400' : 'text-gray-600'}`}>
                            {achievement.description}
                          </p>
                          <div className="space-y-1">
                            <Progress value={achievement.progress} className="h-2" />
                            <div className="text-xs text-gray-500 text-right">{Math.round(achievement.progress)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="bg-gray-900/50 border-gray-800 shadow-lg backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-400" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Your latest problem-solving activities and progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.status === 'solved' ? 'bg-green-500/20' : 'bg-gray-600/20'
                          }`}>
                            {activity.status === 'solved' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">{activity.problem}</span>
                              <Badge className={`text-xs px-2 py-1 ${
                                activity.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-800' :
                                activity.difficulty === 'Medium' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800' :
                                'bg-red-900/20 text-red-400 border-red-800'
                              }`}>
                                {activity.difficulty}
                              </Badge>
                              {activity.status === 'solved' && (
                                <Badge className="bg-blue-900/20 text-blue-400 border-blue-800 text-xs">
                                  +{activity.xp} XP
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'solved' 
                              ? 'bg-green-900/20 text-green-400' 
                              : 'bg-gray-700/50 text-gray-400'
                          }`}>
                            {activity.status === 'solved' ? 'Solved' : 'Attempted'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {isOwnProfile && (
                <TabsContent value="settings" className="space-y-6">
                  <Card className="bg-gray-900/50 border-gray-800 shadow-lg backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Profile Settings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your personal information and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="full_name" className="text-white">Full Name</Label>
                          <Input
                            id="full_name"
                            value={editing ? formData.full_name : userProfile.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            disabled={!editing}
                            className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-400"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-white">Username</Label>
                          <Input
                            id="username"
                            value={userProfile.username}
                            disabled
                            className="bg-gray-800/50 border-gray-600 text-white opacity-50"
                          />
                          <p className="text-xs text-gray-500">Username cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">Email</Label>
                          <Input
                            id="email"
                            value={user?.email || ''}
                            disabled
                            className="bg-gray-800/50 border-gray-600 text-white opacity-50"
                          />
                          <p className="text-xs text-gray-500">Email is managed by your account settings</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobile_number" className="text-white">Mobile Number</Label>
                          <Input
                            id="mobile_number"
                            value={editing ? formData.mobile_number : (userProfile.mobile_number || '')}
                            onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                            disabled={!editing}
                            className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-400"
                            placeholder="Enter your mobile number"
                          />
                        </div>
                      </div>

                      {editing && (
                        <>
                          <Separator className="bg-gray-700" />
                          <div className="flex justify-end space-x-3">
                            <Button
                              onClick={() => setEditing(false)}
                              variant="outline"
                              className="border-gray-600 text-white hover:bg-gray-800"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSave}
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
