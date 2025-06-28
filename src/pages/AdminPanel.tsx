
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  FileText, 
  BrainCircuit, 
  Code, 
  Shield, 
  Settings,
  Search
} from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import DSASheetManagement from '@/components/admin/DSASheetManagement';
import InterviewPrepManagement from '@/components/admin/InterviewPrepManagement';
import CoreCSManagement from '@/components/admin/CoreCSManagement';
import AuditTrail from '@/components/admin/AuditTrail';
import RoleManagement from '@/components/admin/RoleManagement';

const AdminPanel = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  // Check if user has admin role
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!user?.id,
  });

  // Get dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersCount, coursesCount, dsaSheetsCount, interviewPrepCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('courses').select('id', { count: 'exact' }).eq('category', 'course'),
        supabase.from('courses').select('id', { count: 'exact' }).eq('category', 'dsa-sheet'),
        supabase.from('courses').select('id', { count: 'exact' }).eq('category', 'interview-prep'),
      ]);

      return {
        users: usersCount.count || 0,
        courses: coursesCount.count || 0,
        dsaSheets: dsaSheetsCount.count || 0,
        interviewPrep: interviewPrepCount.count || 0,
      };
    },
  });

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  if (!userRole || !['admin', 'super_admin'].includes(userRole.role)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400 text-lg">Manage your platform content and users</p>
          </div>
          <Badge variant="destructive" className="text-sm px-4 py-2">
            {userRole.role.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.users || 0}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Courses</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.courses || 0}</p>
                </div>
                <BookOpen className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">DSA Sheets</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.dsaSheets || 0}</p>
                </div>
                <Code className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Interview Prep</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.interviewPrep || 0}</p>
                </div>
                <BrainCircuit className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-gray-900 border-gray-700 text-white focus:border-orange-400 focus:ring-orange-400/20"
            />
          </div>
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-700 p-1">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="dsa-sheets" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              <Code className="w-4 h-4 mr-2" />
              DSA Sheets
            </TabsTrigger>
            <TabsTrigger 
              value="interview-prep" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              <BrainCircuit className="w-4 h-4 mr-2" />
              Interview Prep
            </TabsTrigger>
            <TabsTrigger 
              value="core-cs" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Core CS
            </TabsTrigger>
            <TabsTrigger 
              value="roles" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              <Shield className="w-4 h-4 mr-2" />
              Roles
            </TabsTrigger>
            <TabsTrigger 
              value="audit" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Audit
            </TabsTrigger>
          </TabsList>

          <div className="bg-black min-h-[60vh]">
            <TabsContent value="users" className="mt-0">
              <UserManagement searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="courses" className="mt-0">
              <CourseManagement searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="dsa-sheets" className="mt-0">
              <DSASheetManagement searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="interview-prep" className="mt-0">
              <InterviewPrepManagement searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="core-cs" className="mt-0">
              <CoreCSManagement searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="roles" className="mt-0">
              <RoleManagement searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="audit" className="mt-0">
              <AuditTrail searchQuery={searchQuery} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
