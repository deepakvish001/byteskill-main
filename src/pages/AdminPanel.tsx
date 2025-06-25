
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Brain, 
  Settings, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Activity
} from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import DSASheetManagement from '@/components/admin/DSASheetManagement';
import InterviewPrepManagement from '@/components/admin/InterviewPrepManagement';
import CoreCSManagement from '@/components/admin/CoreCSManagement';
import AuditTrail from '@/components/admin/AuditTrail';
import RoleManagement from '@/components/admin/RoleManagement';

const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your platform content and users</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search across all content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="dsa-sheets" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              DSA Sheets
            </TabsTrigger>
            <TabsTrigger value="interview-prep" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Interview Prep
            </TabsTrigger>
            <TabsTrigger value="core-cs" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Core CS
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="courses">
            <CourseManagement searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="dsa-sheets">
            <DSASheetManagement searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="interview-prep">
            <InterviewPrepManagement searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="core-cs">
            <CoreCSManagement searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="roles">
            <RoleManagement searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTrail searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
