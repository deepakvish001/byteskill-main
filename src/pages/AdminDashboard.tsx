
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  Shield, 
  Search,
  GraduationCap,
  Brain,
  Code2,
  Trophy,
  Menu,
  X
} from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import RoleManagement from "@/components/admin/RoleManagement";
import AuditTrail from "@/components/admin/AuditTrail";
import CourseManagement from "@/components/admin/CourseManagement";
import DSASheetManagement from "@/components/admin/DSASheetManagement";
import InterviewPrepManagement from "@/components/admin/InterviewPrepManagement";
import CoreCSManagement from "@/components/admin/CoreCSManagement";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarItems = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "dsa-sheets", label: "DSA Sheets", icon: Code2 },
    { id: "interview-prep", label: "Interview Prep", icon: GraduationCap },
    { id: "core-cs", label: "Core CS", icon: Brain },
    { id: "users", label: "Users", icon: Users },
    { id: "roles", label: "Roles", icon: Shield },
    { id: "audit", label: "Audit Trail", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Custom Admin Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-500" />
                Admin Panel
              </h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 ${
                  activeTab === item.id ? 'bg-blue-600 text-white' : ''
                } ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'}`} />
                {!sidebarCollapsed && item.label}
              </Button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500">
              Admin Dashboard v1.0
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Admin Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <UserMenu />
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-black overflow-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === "analytics" && <AdminAnalytics />}
            {activeTab === "courses" && <CourseManagement searchQuery={searchQuery} />}
            {activeTab === "dsa-sheets" && <DSASheetManagement searchQuery={searchQuery} />}
            {activeTab === "interview-prep" && <InterviewPrepManagement searchQuery={searchQuery} />}
            {activeTab === "core-cs" && <CoreCSManagement searchQuery={searchQuery} />}
            {activeTab === "users" && <UserManagement searchQuery={searchQuery} />}
            {activeTab === "roles" && <RoleManagement />}
            {activeTab === "audit" && <AuditTrail />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
