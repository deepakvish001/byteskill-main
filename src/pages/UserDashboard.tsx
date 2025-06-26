
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
import { Trophy, Target, Flame, Calendar, Edit, Save, X, BookOpen, Code, Star, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    if (xp >= 10000) return { name: "Legendary", color: "bg-purple-600" };
    if (xp >= 5000) return { name: "Expert", color: "bg-red-600" };
    if (xp >= 2500) return { name: "Advanced", color: "bg-orange-600" };
    if (xp >= 1000) return { name: "Intermediate", color: "bg-blue-600" };
    if (xp >= 500) return { name: "Beginner", color: "bg-green-600" };
    return { name: "Newbie", color: "bg-gray-600" };
  };

  const progressData = [
    { topic: "Arrays & Hashing", solved: Math.floor((userProfile?.problems_solved || 0) * 0.3), total: 30 },
    { topic: "Two Pointers", solved: Math.floor((userProfile?.problems_solved || 0) * 0.2), total: 20 },
    { topic: "Binary Search", solved: Math.floor((userProfile?.problems_solved || 0) * 0.15), total: 25 },
    { topic: "Dynamic Programming", solved: Math.floor((userProfile?.problems_solved || 0) * 0.1), total: 40 },
    { topic: "Trees & Graphs", solved: Math.floor((userProfile?.problems_solved || 0) * 0.25), total: 35 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
            <UserMenu />
          </div>
        </div>
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
            <p className="text-gray-400">The user @{username} doesn't exist.</p>
            <Button 
              onClick={() => navigate('/')} 
              className="mt-4 bg-blue-600 hover:bg-blue-700"
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
            <UserMenu />
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="pt-20 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile.avatar_url || undefined} />
                    <AvatarFallback className="bg-blue-600 text-white text-3xl">
                      {userProfile.full_name?.charAt(0) || userProfile.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold text-white">{userProfile.full_name || userProfile.username}</h1>
                      <Badge className={`${badge.color} text-white text-lg px-3 py-1`}>
                        {badge.name}
                      </Badge>
                    </div>
                    <p className="text-xl text-gray-400 mb-2">@{userProfile.username}</p>
                    <p className="text-gray-500">
                      Member since {new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  {isOwnProfile && (
                    <Button
                      onClick={() => setEditing(!editing)}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800"
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
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">XP Points</p>
                      <p className="text-3xl font-bold text-white">{userProfile.xp_points}</p>
                    </div>
                    <Trophy className="h-10 w-10 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Problems Solved</p>
                      <p className="text-3xl font-bold text-white">{userProfile.problems_solved}</p>
                    </div>
                    <Target className="h-10 w-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Current Streak</p>
                      <p className="text-3xl font-bold text-white">{userProfile.current_streak}</p>
                    </div>
                    <Flame className="h-10 w-10 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Max Streak</p>
                      <p className="text-3xl font-bold text-white">{userProfile.max_streak}</p>
                    </div>
                    <Calendar className="h-10 w-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Information */}
              {isOwnProfile && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-white">Full Name</Label>
                        <Input
                          id="full_name"
                          value={editing ? formData.full_name : userProfile.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          disabled={!editing}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-white">Username</Label>
                        <Input
                          id="username"
                          value={userProfile.username}
                          disabled
                          className="bg-gray-800 border-gray-600 text-white opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          value={user?.email || ''}
                          disabled
                          className="bg-gray-800 border-gray-600 text-white opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mobile_number" className="text-white">Mobile Number</Label>
                        <Input
                          id="mobile_number"
                          value={editing ? formData.mobile_number : (userProfile.mobile_number || '')}
                          onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                          disabled={!editing}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Enter your mobile number"
                        />
                      </div>
                    </div>

                    {editing && (
                      <>
                        <Separator className="bg-gray-700" />
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={() => setEditing(false)}
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-800"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Progress Section */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Topic Progress
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Progress across different coding topics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {progressData.map((topic) => {
                    const progress = Math.min((topic.solved / topic.total) * 100, 100);
                    return (
                      <div key={topic.topic} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">{topic.topic}</span>
                          <span className="text-xs text-gray-400">{topic.solved}/{topic.total}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-xs text-gray-400 text-right">{Math.round(progress)}% complete</div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
