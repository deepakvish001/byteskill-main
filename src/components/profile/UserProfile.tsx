
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, Calendar, Trophy, Target, Zap, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  created_at: string;
  updated_at: string;
}

interface ActivityLog {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  metadata: any;
}

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    mobile_number: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchActivityLogs();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        username: data.username || '',
        mobile_number: data.mobile_number || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const { error } = await updateProfile(formData);
      if (!error) {
        setEditMode(false);
        await fetchProfile();
      }
    } finally {
      setSaving(false);
    }
  };

  const getXPBadge = (xp: number) => {
    if (xp >= 10000) return { name: 'Master', color: 'bg-purple-600', icon: '👑' };
    if (xp >= 5000) return { name: 'Expert', color: 'bg-blue-600', icon: '🏆' };
    if (xp >= 2000) return { name: 'Advanced', color: 'bg-green-600', icon: '⭐' };
    if (xp >= 500) return { name: 'Intermediate', color: 'bg-yellow-600', icon: '🔥' };
    return { name: 'Beginner', color: 'bg-gray-600', icon: '🌱' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return '🔐';
      case 'logout': return '👋';
      case 'registration': return '🎉';
      case 'profile_update': return '✏️';
      case 'problem_solved': return '✅';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Profile not found</p>
      </div>
    );
  }

  const xpBadge = getXPBadge(profile.xp_points);

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {profile.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
                  <Badge className={`${xpBadge.color} text-white`}>
                    {xpBadge.icon} {xpBadge.name}
                  </Badge>
                </div>
                <p className="text-gray-400 mb-2">@{profile.username}</p>
                <p className="text-gray-300 flex items-center justify-center sm:justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  {user?.email}
                </p>
                {profile.mobile_number && (
                  <p className="text-gray-300 flex items-center justify-center sm:justify-start mt-1">
                    <Phone className="w-4 h-4 mr-2" />
                    {profile.mobile_number}
                  </p>
                )}
                <p className="text-gray-400 flex items-center justify-center sm:justify-start mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {formatDate(profile.created_at)}
                </p>
              </div>

              <Button
                onClick={() => setEditMode(!editMode)}
                variant="outline"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{profile.xp_points}</p>
              <p className="text-gray-400 text-sm">XP Points</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{profile.problems_solved}</p>
              <p className="text-gray-400 text-sm">Problems Solved</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{profile.current_streak}</p>
              <p className="text-gray-400 text-sm">Current Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{profile.max_streak}</p>
              <p className="text-gray-400 text-sm">Max Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-blue-600">
              Profile Details
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-white data-[state=active]:bg-blue-600">
              Activity Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-white">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile_number" className="text-white">Mobile Number</Label>
                      <Input
                        id="mobile_number"
                        value={formData.mobile_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Full Name</p>
                        <p className="text-gray-400">{profile.full_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Username</p>
                        <p className="text-gray-400">@{profile.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Email</p>
                        <p className="text-gray-400">{user?.email}</p>
                      </div>
                    </div>

                    {profile.mobile_number && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-white font-medium">Mobile Number</p>
                          <p className="text-gray-400">{profile.mobile_number}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                      <span className="text-xl">{getActivityIcon(log.activity_type)}</span>
                      <div className="flex-1">
                        <p className="text-white">{log.description}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(log.created_at).toLocaleDateString()} at{' '}
                          {new Date(log.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {activityLogs.length === 0 && (
                    <p className="text-gray-400 text-center py-8">No activity logs found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
