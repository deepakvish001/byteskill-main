
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Flame, Calendar, Code, TrendingUp, Star, Award, BookOpen, Users, Brain } from 'lucide-react';

interface PublicProfileData {
  username: string;
  full_name: string;
  avatar_url: string | null;
  xp_points: number;
  problems_solved: number;
  current_streak: number;
  max_streak: number;
  created_at: string;
}

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      fetchPublicProfile();
    }
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, xp_points, problems_solved, current_streak, max_streak, created_at')
        .eq('username', username)
        .single();

      if (error) throw error;
      
      setProfile(data);
    } catch (error: any) {
      setError('Profile not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getXPBadge = (xp: number) => {
    if (xp >= 10000) return { name: "Legendary", color: "bg-purple-600" };
    if (xp >= 5000) return { name: "Expert", color: "bg-red-600" };
    if (xp >= 2500) return { name: "Advanced", color: "bg-orange-600" };
    if (xp >= 1000) return { name: "Intermediate", color: "bg-blue-600" };
    if (xp >= 500) return { name: "Beginner", color: "bg-green-600" };
    return { name: "Newbie", color: "bg-gray-600" };
  };

  const badge = getXPBadge(profile.xp_points);

  const stats = [
    { label: "XP Points", value: profile.xp_points, icon: Trophy, color: "text-yellow-500" },
    { label: "Problems Solved", value: profile.problems_solved, icon: Target, color: "text-green-500" },
    { label: "Current Streak", value: profile.current_streak, icon: Flame, color: "text-orange-500" },
    { label: "Max Streak", value: profile.max_streak, icon: Calendar, color: "text-blue-500" }
  ];

  const achievements = [
    { name: "Problem Solver", description: "Solved 100+ problems", icon: Trophy, earned: profile.problems_solved >= 100 },
    { name: "Streak Master", description: "7-day solving streak", icon: Target, earned: profile.current_streak >= 7 },
    { name: "Rising Star", description: "1000+ XP points", icon: Star, earned: profile.xp_points >= 1000 },
    { name: "Dedicated Learner", description: "Max streak of 15+ days", icon: Award, earned: profile.max_streak >= 15 }
  ];

  const progressData = [
    { topic: "Arrays & Hashing", solved: Math.floor(profile.problems_solved * 0.3), total: 30 },
    { topic: "Two Pointers", solved: Math.floor(profile.problems_solved * 0.2), total: 20 },
    { topic: "Binary Search", solved: Math.floor(profile.problems_solved * 0.15), total: 25 },
    { topic: "Dynamic Programming", solved: Math.floor(profile.problems_solved * 0.1), total: 40 },
    { topic: "Trees & Graphs", solved: Math.floor(profile.problems_solved * 0.25), total: 35 }
  ];

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
            ByteSkill Profile
          </h1>
          <p className="text-gray-400">Public coding profile for recruiters</p>
        </div>

        {/* Profile Header */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
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
                <p className="text-gray-500">
                  Coding since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* Achievements */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                Achievements
              </CardTitle>
              <CardDescription className="text-gray-400">
                Earned accomplishments and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border transition-colors ${
                      achievement.earned 
                        ? 'bg-gray-800 border-green-800 shadow-lg' 
                        : 'bg-gray-800/50 border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <achievement.icon className={`w-6 h-6 ${achievement.earned ? 'text-green-400' : 'text-gray-500'}`} />
                      <span className={`font-medium ${achievement.earned ? 'text-white' : 'text-gray-500'}`}>
                        {achievement.name}
                      </span>
                      {achievement.earned && (
                        <Badge className="bg-green-900 text-green-400 border-green-800 text-xs">
                          Earned
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${achievement.earned ? 'text-gray-400' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-400">
            This is a public profile showcasing coding achievements on ByteSkill Platform
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Visit byteskill.com to start your coding journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
