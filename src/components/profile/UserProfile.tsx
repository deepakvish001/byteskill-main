
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Target, Flame, Calendar } from 'lucide-react';

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
}

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        mobile_number: data.mobile_number || '',
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          mobile_number: formData.mobile_number,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await fetchProfile();
      setEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400">Unable to load your profile information.</p>
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

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{profile.full_name || profile.username}</h1>
                  <Badge className={`${badge.color} text-white`}>
                    {badge.name}
                  </Badge>
                </div>
                <p className="text-gray-400">@{profile.username}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                onClick={() => setEditing(!editing)}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">XP Points</p>
                  <p className="text-2xl font-bold text-white">{profile.xp_points}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Problems Solved</p>
                  <p className="text-2xl font-bold text-white">{profile.problems_solved}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold text-white">{profile.current_streak}</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Max Streak</p>
                  <p className="text-2xl font-bold text-white">{profile.max_streak}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Profile Information</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-white">Full Name</Label>
                <Input
                  id="full_name"
                  value={editing ? formData.full_name : profile.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!editing}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
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
                  value={editing ? formData.mobile_number : (profile.mobile_number || '')}
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
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
