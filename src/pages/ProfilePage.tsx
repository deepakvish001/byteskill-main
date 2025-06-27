
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Flame, Calendar, BookOpen, Code, Star, TrendingUp, ExternalLink, Github, Linkedin, Globe, MapPin, Building } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import UserMenu from '@/components/UserMenu';
import EnhancedUserProfile from '@/components/profile/EnhancedUserProfile';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  mobile_number: string | null;
  avatar_url: string | null;
  xp_points: number;
  problems_solved: number;
  current_streak: number;
  max_streak: number;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  leetcode_url: string | null;
  portfolio_url: string | null;
  location: string | null;
  company: string | null;
  job_title: string | null;
  created_at: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
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
    { topic: "Arrays & Hashing", solved: Math.floor((profile?.problems_solved || 0) * 0.3), total: 30 },
    { topic: "Two Pointers", solved: Math.floor((profile?.problems_solved || 0) * 0.2), total: 20 },
    { topic: "Binary Search", solved: Math.floor((profile?.problems_solved || 0) * 0.15), total: 25 },
    { topic: "Dynamic Programming", solved: Math.floor((profile?.problems_solved || 0) * 0.1), total: 40 },
    { topic: "Trees & Graphs", solved: Math.floor((profile?.problems_solved || 0) * 0.25), total: 35 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sidebarCollapsed={false}
          onToggleSidebar={() => {}}
        />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
            <p className="text-gray-400">The user @{username} doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const badge = getXPBadge(profile.xp_points);
  const isOwnProfile = user?.id === profile.id;

  // If it's the user's own profile, show the enhanced version
  if (isOwnProfile) {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
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

        {/* Enhanced Profile Content */}
        <div className="pt-16">
          <EnhancedUserProfile />
        </div>
      </div>
    );
  }

  // For other users' profiles, show the simplified public view
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
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

      {/* Profile Content */}
      <div className="pt-20 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-blue-600 text-white text-3xl">
                    {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">{profile.full_name || profile.username}</h1>
                    <Badge className={`${badge.color} text-white text-lg px-3 py-1`}>
                      {badge.name}
                    </Badge>
                  </div>
                  <p className="text-xl text-gray-400 mb-2">@{profile.username}</p>
                  
                  {/* Location and Company */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-3">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.company && (
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{profile.job_title ? `${profile.job_title} at ` : ''}{profile.company}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-gray-300 mb-3 max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-3">
                    {profile.github_url && (
                      <Button variant="outline" size="sm" asChild className="border-gray-600 hover:border-gray-500">
                        <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {profile.linkedin_url && (
                      <Button variant="outline" size="sm" asChild className="border-gray-600 hover:border-gray-500">
                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {profile.leetcode_url && (
                      <Button variant="outline" size="sm" asChild className="border-gray-600 hover:border-gray-500">
                        <a href={profile.leetcode_url} target="_blank" rel="noopener noreferrer">
                          <Code className="h-4 w-4 mr-2" />
                          LeetCode
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {profile.portfolio_url && (
                      <Button variant="outline" size="sm" asChild className="border-gray-600 hover:border-gray-500">
                        <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Portfolio
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-gray-500 mt-2">
                    Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
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
                    <p className="text-3xl font-bold text-white">{profile.xp_points}</p>
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
                    <p className="text-3xl font-bold text-white">{profile.problems_solved}</p>
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
                    <p className="text-3xl font-bold text-white">{profile.current_streak}</p>
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
                    <p className="text-3xl font-bold text-white">{profile.max_streak}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

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
  );
};

export default ProfilePage;
