
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import UserMenu from '@/components/UserMenu';
import { Shield, Users, FileText, Book, Settings, BarChart3, Database, Activity, GraduationCap, Cpu, Target, Code, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/admin/UserManagement';
import RoleManagement from '@/components/admin/RoleManagement';
import AuditTrail from '@/components/admin/AuditTrail';
import CourseManagement from '@/components/admin/CourseManagement';
import DSASheetManagement from '@/components/admin/DSASheetManagement';
import InterviewPrepManagement from '@/components/admin/InterviewPrepManagement';
import CoreCSManagement from '@/components/admin/CoreCSManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'super_admin']);

        if (!error && data && data.length > 0) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Admin sidebar menu items
  const adminMenuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: BookOpen,
      description: 'Go to main website',
      action: () => window.location.href = '/'
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Platform statistics and insights'
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: GraduationCap,
      description: 'Manage general courses'
    },
    {
      id: 'dsa-sheets',
      label: 'DSA Sheets',
      icon: FileText,
      description: 'Manage DSA problem sheets'
    },
    {
      id: 'interview-prep',
      label: 'Interview Prep',
      icon: Target,
      description: 'Manage interview preparation content'
    },
    {
      id: 'core-cs',
      label: 'Core CS',
      icon: Cpu,
      description: 'Manage computer science fundamentals'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      description: 'User management and roles'
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: Activity,
      description: 'System activity logs'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'System configuration'
    }
  ];

  // Mock admin stats
  const adminStats = [
    { title: 'Total Users', value: '1,234', icon: Users, trend: '+12%', color: 'text-blue-400' },
    { title: 'Active Courses', value: '89', icon: Book, trend: '+8%', color: 'text-green-400' },
    { title: 'DSA Sheets', value: '25', icon: FileText, trend: '+3%', color: 'text-purple-400' },
    { title: 'System Health', value: '99.9%', icon: Activity, trend: 'Stable', color: 'text-orange-400' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Admin Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminStats.map((stat, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-green-400 mt-1 flex items-center">
                      <span className="mr-1">↗</span>
                      {stat.trend}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your platform content efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-orange-500 transition-all"
                    onClick={() => setActiveSection('courses')}
                  >
                    <GraduationCap className="w-8 h-8 text-orange-400" />
                    <span className="text-white font-medium">Add Course</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-blue-500 transition-all"
                    onClick={() => setActiveSection('dsa-sheets')}
                  >
                    <FileText className="w-8 h-8 text-blue-400" />
                    <span className="text-white font-medium">Add DSA Sheet</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-green-500 transition-all"
                    onClick={() => setActiveSection('interview-prep')}
                  >
                    <Target className="w-8 h-8 text-green-400" />
                    <span className="text-white font-medium">Add Interview Prep</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-purple-500 transition-all"
                    onClick={() => setActiveSection('core-cs')}
                  >
                    <Cpu className="w-8 h-8 text-purple-400" />
                    <span className="text-white font-medium">Add Core CS</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-xl">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest updates and changes to your platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'New user registered', user: 'john.doe@example.com', time: '2 minutes ago', type: 'user' },
                    { action: 'Course "Advanced React" published', user: 'admin', time: '1 hour ago', type: 'course' },
                    { action: 'DSA Sheet "Binary Trees" updated', user: 'admin', time: '3 hours ago', type: 'sheet' },
                    { action: 'Interview prep questions added', user: 'admin', time: '1 day ago', type: 'interview' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-blue-400' :
                        activity.type === 'course' ? 'bg-green-400' :
                        activity.type === 'sheet' ? 'bg-purple-400' : 'bg-orange-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-xs">by {activity.user}</p>
                      </div>
                      <span className="text-gray-500 text-xs">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'courses':
        return <CourseManagement searchQuery={searchQuery} />;
      case 'dsa-sheets':
        return <DSASheetManagement searchQuery={searchQuery} />;
      case 'interview-prep':
        return <InterviewPrepManagement searchQuery={searchQuery} />;
      case 'core-cs':
        return <CoreCSManagement searchQuery={searchQuery} />;
      case 'users':
        return (
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 border-gray-800">
              <TabsTrigger value="users" className="text-gray-400 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="roles" className="text-gray-400 data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Roles
              </TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <UserManagement searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="roles">
              <RoleManagement searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        );
      case 'audit':
        return <AuditTrail searchQuery={searchQuery} />;
      case 'settings':
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              <p>System configuration and maintenance tools will be available here.</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Admin Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } bg-black border-r border-gray-900`}>
        {/* Admin Header */}
        <div className="p-4 border-b border-gray-900">
          <div className="flex items-center justify-center">
            {sidebarCollapsed ? (
              <div className="flex flex-col items-center space-y-3 w-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-sm opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-2xl">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                    Admin Panel
                  </span>
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                      Content Management
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            {adminMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveSection(item.id);
                  }
                }}
                className={`w-full flex items-center p-3 rounded-xl text-left hover:bg-gray-900 transition-all duration-200 group ${
                  activeSection === item.id ? 'bg-gray-900 border border-gray-800' : ''
                } ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                <item.icon className={`${
                  sidebarCollapsed ? 'w-7 h-7' : 'w-5 h-5'
                } ${
                  activeSection === item.id ? 'text-orange-400' : 'text-gray-400 group-hover:text-white'
                } transition-colors`} />
                {!sidebarCollapsed && (
                  <div className="ml-3">
                    <span className={`text-sm font-medium transition-colors ${
                      activeSection === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>
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
        
        {/* Main Content */}
        <main className="pt-16 p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Admin Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="w-8 h-8 text-orange-400" />
                  <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
                  <Badge className="bg-orange-900 text-orange-400 border-orange-800 px-3 py-1">
                    Administrator
                  </Badge>
                </div>
                <p className="text-gray-400 text-lg">
                  {adminMenuItems.find(item => item.id === activeSection)?.description || 'Manage platform content and users'}
                </p>
              </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
