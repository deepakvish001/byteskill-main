
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Trophy, Target, Flame, Calendar, Code, TrendingUp, Star, Award, BookOpen, Users, Brain, CheckCircle, ExternalLink, Github, Linkedin, Mail, MapPin, Phone, Download, Share } from 'lucide-react';

interface PublicProfileData {
  username: string;
  full_name: string;
  avatar_url: string | null;
  xp_points: number;
  problems_solved: number;
  current_streak: number;
  max_streak: number;
  created_at: string;
  mobile_number?: string;
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
        .select('username, full_name, avatar_url, xp_points, problems_solved, current_streak, max_streak, created_at, mobile_number')
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">The profile you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getXPBadge = (xp: number) => {
    if (xp >= 10000) return { name: "Legendary", color: "bg-purple-600", desc: "Elite Coder" };
    if (xp >= 5000) return { name: "Expert", color: "bg-red-600", desc: "Senior Developer" };
    if (xp >= 2500) return { name: "Advanced", color: "bg-orange-600", desc: "Experienced Developer" };
    if (xp >= 1000) return { name: "Intermediate", color: "bg-blue-600", desc: "Mid-level Developer" };
    if (xp >= 500) return { name: "Beginner", color: "bg-green-600", desc: "Junior Developer" };
    return { name: "Newbie", color: "bg-gray-600", desc: "Entry Level" };
  };

  const badge = getXPBadge(profile.xp_points);

  const stats = [
    { label: "XP Points", value: profile.xp_points, icon: Trophy, color: "text-yellow-500", desc: "Total experience points earned" },
    { label: "Problems Solved", value: profile.problems_solved, icon: Target, color: "text-green-500", desc: "Successfully completed challenges" },
    { label: "Current Streak", value: profile.current_streak, icon: Flame, color: "text-orange-500", desc: "Consecutive days of coding" },
    { label: "Max Streak", value: profile.max_streak, icon: Calendar, color: "text-blue-500", desc: "Longest coding streak achieved" }
  ];

  const skills = [
    { name: "Data Structures", level: 85, problems: Math.floor(profile.problems_solved * 0.3) },
    { name: "Algorithms", level: 78, problems: Math.floor(profile.problems_solved * 0.25) },
    { name: "Dynamic Programming", level: 65, problems: Math.floor(profile.problems_solved * 0.15) },
    { name: "System Design", level: 72, problems: Math.floor(profile.problems_solved * 0.1) },
    { name: "Database Design", level: 68, problems: Math.floor(profile.problems_solved * 0.1) },
    { name: "Problem Solving", level: 88, problems: profile.problems_solved }
  ];

  const achievements = [
    { name: "Problem Solver", description: "Solved 100+ coding problems", icon: Trophy, earned: profile.problems_solved >= 100, highlight: true },
    { name: "Streak Master", description: "Maintained 7-day coding streak", icon: Target, earned: profile.current_streak >= 7, highlight: false },
    { name: "Rising Star", description: "Earned 1000+ XP points", icon: Star, earned: profile.xp_points >= 1000, highlight: true },
    { name: "Dedicated Learner", description: "Achieved 15+ day max streak", icon: Award, earned: profile.max_streak >= 15, highlight: false },
    { name: "Algorithm Expert", description: "Mastered multiple algorithm categories", icon: Brain, earned: profile.problems_solved >= 50, highlight: true },
    { name: "Consistent Coder", description: "Regular problem-solving activity", icon: Calendar, earned: profile.current_streak >= 3, highlight: false }
  ];

  const progressData = [
    { topic: "Arrays & Hashing", solved: Math.floor(profile.problems_solved * 0.3), total: 30, difficulty: "Beginner" },
    { topic: "Two Pointers", solved: Math.floor(profile.problems_solved * 0.2), total: 20, difficulty: "Intermediate" },
    { topic: "Binary Search", solved: Math.floor(profile.problems_solved * 0.15), total: 25, difficulty: "Intermediate" },
    { topic: "Dynamic Programming", solved: Math.floor(profile.problems_solved * 0.1), total: 40, difficulty: "Advanced" },
    { topic: "Trees & Graphs", solved: Math.floor(profile.problems_solved * 0.25), total: 35, difficulty: "Advanced" }
  ];

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${profile.full_name || profile.username}'s Coding Profile`,
        text: `Check out ${profile.full_name || profile.username}'s coding achievements on Byteskill`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      // You might want to show a toast here
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-2xl">
                  <BookOpen className="w-8 h-8 text-white animate-bounce" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Byteskill
                </span>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-sm bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                    Public Profile
                  </span>
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button onClick={handleShare} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Share className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Link to="/">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Join Byteskill
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <Card className="bg-gray-900 border-gray-700 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-32 w-32 ring-4 ring-orange-500/20 mx-auto md:mx-0">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-4xl">
                  {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-white">{profile.full_name || profile.username}</h1>
                  <Badge className={`${badge.color} text-white text-lg px-4 py-2 shadow-lg w-fit mx-auto md:mx-0`}>
                    {badge.name}
                  </Badge>
                </div>
                
                <p className="text-xl text-gray-400 mb-2">@{profile.username}</p>
                <p className="text-lg text-orange-400 mb-4">{badge.desc}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-gray-500">
                  <span className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Coding since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Code className="w-5 h-5" />
                    <span>Active problem solver</span>
                  </span>
                  {profile.mobile_number && (
                    <span className="flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span>Contact available</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-full bg-gray-800`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills & Expertise */}
          <Card className="bg-gray-900 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-400" />
                Technical Skills
              </CardTitle>
              <CardDescription className="text-gray-400">
                Core competencies and problem-solving expertise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">{skill.problems} problems</span>
                      <span className="text-sm font-semibold text-orange-400">{skill.level}%</span>
                    </div>
                  </div>
                  <Progress value={skill.level} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gray-900 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-400" />
                Key Achievements
              </CardTitle>
              <CardDescription className="text-gray-400">
                Notable milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.filter(a => a.earned).map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      achievement.highlight 
                        ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-700 shadow-lg' 
                        : 'bg-gray-800 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.highlight ? 'bg-orange-500/20' : 'bg-green-500/20'
                      }`}>
                        <achievement.icon className={`w-5 h-5 ${
                          achievement.highlight ? 'text-orange-400' : 'text-green-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{achievement.name}</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problem Solving Progress */}
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              Problem Solving Progress
            </CardTitle>
            <CardDescription className="text-gray-400">
              Detailed breakdown of coding challenges completed by topic and difficulty
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {progressData.map((topic) => {
              const progress = Math.min((topic.solved / topic.total) * 100, 100);
              return (
                <div key={topic.topic} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium text-lg">{topic.topic}</span>
                      <Badge className={`text-xs px-3 py-1 ${
                        topic.difficulty === 'Beginner' ? 'bg-green-900 text-green-400 border-green-800' :
                        topic.difficulty === 'Intermediate' ? 'bg-yellow-900 text-yellow-400 border-yellow-800' :
                        'bg-red-900 text-red-400 border-red-800'
                      }`}>
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <span className="text-gray-400 font-medium">{topic.solved}/{topic.total} solved</span>
                  </div>
                  <Progress value={progress} className="h-4" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-400 font-medium">{Math.round(progress)}% mastery</span>
                    <span className="text-gray-500">
                      {topic.solved * 5} XP earned from this topic
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Contact & Hire Section */}
        <Card className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-700 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Interested in Hiring?</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              {profile.full_name || profile.username} is actively solving coding challenges and growing their skills
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-green-900 text-green-400 border-green-800 text-sm px-4 py-2">
                {profile.problems_solved}+ Problems Solved
              </Badge>
              <Badge className="bg-blue-900 text-blue-400 border-blue-800 text-sm px-4 py-2">
                {profile.xp_points} XP Points
              </Badge>
              <Badge className="bg-orange-900 text-orange-400 border-orange-800 text-sm px-4 py-2">
                {Math.floor((new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 3600 * 24))} Days Active
              </Badge>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                <Mail className="w-4 h-4 mr-2" />
                Contact for Opportunities
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-800">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <BookOpen className="w-6 h-6 text-orange-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Byteskill
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            This profile showcases coding achievements and skills developed on the Byteskill platform
          </p>
          <p className="text-sm text-gray-500">
            Join thousands of developers improving their coding skills • Visit{' '}
            <Link to="/" className="text-orange-400 hover:text-orange-300 transition-colors">
              byteskill.com
            </Link>{' '}
            to start your journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
