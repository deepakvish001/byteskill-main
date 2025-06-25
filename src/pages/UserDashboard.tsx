
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";
import Dashboard from "./Dashboard";
import { useState } from "react";

const UserDashboard = () => {
  const { username } = useParams<{ username: string }>();
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState("dashboard");

  const handleExpandSidebar = () => {
    setSidebarCollapsed(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Extract username from user metadata or email
  const currentUsername = user.user_metadata?.username || user.email?.split('@')[0];
  
  // If the username in URL doesn't match current user, redirect to their dashboard
  if (username !== currentUsername) {
    return <Navigate to={`/u/${currentUsername}`} replace />;
  }

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Fixed Sidebar - Responsive */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'
      }`}>
        <Sidebar 
          selectedSheet={selectedSheet} 
          onSheetChange={setSelectedSheet}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Main Content Area - Responsive */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16 sm:ml-20' : 'ml-64 sm:ml-72'
      }`}>
        {/* Fixed Header - Responsive */}
        <div className="fixed top-0 right-0 z-30 transition-all duration-300" style={{
          left: sidebarCollapsed ? '4rem' : '16rem',
        }}>
          <div className="flex items-center justify-between p-4 bg-black border-b border-gray-900">
            <Header 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery}
              sidebarCollapsed={sidebarCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />
            <UserMenu />
          </div>
        </div>
        
        {/* Main Content with reduced top padding */}
        <main className="flex-1 pt-20 bg-black min-h-screen">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
