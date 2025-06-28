
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Shield, Ban, User, Mail, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface UserRole {
  role: string;
}

interface UserActivity {
  activity_type: string;
  created_at: string;
  points_earned: number;
}

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
  updated_at: string;
  is_banned: boolean;
  user_roles?: UserRole[];
  recent_activity?: UserActivity[];
}

interface EnhancedUserManagementProps {
  searchQuery: string;
}

const EnhancedUserManagement = ({ searchQuery }: EnhancedUserManagementProps) => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Fetch users with real-time updates
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchQuery],
    queryFn: async (): Promise<UserProfile[]> => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          user_activity(
            activity_type,
            created_at,
            points_earned
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data?.map(user => ({
        ...user,
        user_roles: Array.isArray(user.user_roles) ? user.user_roles : [],
        recent_activity: Array.isArray(user.user_activity) ? user.user_activity.slice(0, 5) : []
      })) || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Ban/Unban user mutation
  const banUserMutation = useMutation({
    mutationFn: async ({ userId, banned }: { userId: string; banned: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: banned, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_type_param: banned ? 'user_banned' : 'user_unbanned',
        target_type_param: 'user',
        target_id_param: userId,
        payload_param: { banned, timestamp: new Date().toISOString() }
      });
    },
    onSuccess: (_, { banned }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(`User ${banned ? 'banned' : 'unbanned'} successfully`);
    },
    onError: (error) => {
      toast.error('Failed to update user status: ' + error.message);
    },
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // First remove existing roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Add new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role
        });

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_type_param: 'role_change',
        target_type_param: 'user',
        target_id_param: userId,
        payload_param: { new_role: role, timestamp: new Date().toISOString() }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update user role: ' + error.message);
    },
  });

  const getUserRoleBadge = (user: UserProfile) => {
    const role = user.user_roles?.[0]?.role || 'user';
    const colors = {
      super_admin: 'bg-red-900 text-red-300 border-red-800',
      admin: 'bg-purple-900 text-purple-300 border-purple-800',
      moderator: 'bg-blue-900 text-blue-300 border-blue-800',
      user: 'bg-gray-800 text-gray-300 border-gray-700'
    };
    
    return (
      <Badge className={colors[role as keyof typeof colors] || colors.user}>
        {role.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getActivityBadge = (activityType: string) => {
    const colors = {
      problem_solved: 'bg-green-900 text-green-300',
      lesson_completed: 'bg-blue-900 text-blue-300',
      course_progress: 'bg-purple-900 text-purple-300',
      login: 'bg-gray-800 text-gray-300'
    };
    
    return (
      <Badge variant="outline" className={colors[activityType as keyof typeof colors] || colors.login}>
        {activityType.replace('_', ' ')}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{users?.length || 0}</p>
                <p className="text-sm text-gray-400">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {users?.filter(u => {
                    const lastActive = new Date(u.updated_at);
                    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    return lastActive > dayAgo;
                  }).length || 0}
                </p>
                <p className="text-sm text-gray-400">Active Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {users?.filter(u => u.user_roles?.some(r => ['admin', 'super_admin'].includes(r.role))).length || 0}
                </p>
                <p className="text-sm text-gray-400">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Ban className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {users?.filter(u => u.is_banned).length || 0}
                </p>
                <p className="text-sm text-gray-400">Banned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Stats</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Last Activity</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id} className="border-gray-800">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.full_name || user.username}</p>
                        <p className="text-gray-400 text-sm">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getUserRoleBadge(user)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-white text-sm">{user.xp_points} XP</div>
                      <div className="text-gray-400 text-xs">
                        {user.problems_solved} problems • {user.current_streak} streak
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_banned ? "destructive" : "default"}>
                      {user.is_banned ? 'Banned' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-gray-300 text-sm">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </div>
                      {user.recent_activity && user.recent_activity.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {user.recent_activity.slice(0, 2).map((activity, idx) => (
                            <div key={idx}>
                              {getActivityBadge(activity.activity_type)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem
                          onClick={() => updateRoleMutation.mutate({ userId: user.id, role: 'admin' })}
                          className="text-white hover:bg-gray-700"
                        >
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateRoleMutation.mutate({ userId: user.id, role: 'user' })}
                          className="text-white hover:bg-gray-700"
                        >
                          Make User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => banUserMutation.mutate({ userId: user.id, banned: !user.is_banned })}
                          className={user.is_banned ? "text-green-400 hover:bg-gray-700" : "text-red-400 hover:bg-gray-700"}
                        >
                          {user.is_banned ? 'Unban User' : 'Ban User'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUserManagement;

