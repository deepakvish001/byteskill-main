
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Crown, UserCheck, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RoleManagementProps {
  searchQuery: string;
}

interface UserRoleWithProfile {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profile?: {
    id: string;
    username: string;
    full_name: string;
  };
}

const RoleManagement = ({ searchQuery }: RoleManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all user roles with manual join
  const { data: userRoles, isLoading } = useQuery({
    queryKey: ['admin-user-roles', searchQuery],
    queryFn: async (): Promise<UserRoleWithProfile[]> => {
      // First get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Then get profiles for the users
      if (rolesData && rolesData.length > 0) {
        const userIds = [...new Set(rolesData.map(role => role.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Manually combine the data
        return rolesData.map(role => ({
          ...role,
          profile: profilesData?.find(profile => profile.id === role.user_id)
        }));
      }

      return rolesData || [];
    },
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ roleId, newRole }: { roleId: string; newRole: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', roleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast({ title: "Role updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating role", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'moderator':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'default';
      case 'moderator': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredRoles = userRoles?.filter(roleEntry => 
    roleEntry.profile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    roleEntry.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    roleEntry.role.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((roleEntry) => (
                  <TableRow key={roleEntry.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{roleEntry.profile?.full_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">@{roleEntry.profile?.username || 'unknown'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(roleEntry.role)}
                        <Badge variant={getRoleBadgeVariant(roleEntry.role)}>
                          {roleEntry.role}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(roleEntry.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={roleEntry.role}
                        onValueChange={(newRole) => {
                          updateRoleMutation.mutate({
                            roleId: roleEntry.id,
                            newRole
                          });
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
