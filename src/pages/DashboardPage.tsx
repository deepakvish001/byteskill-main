
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserMenu from '@/components/UserMenu';
import StatsOverview from '@/components/StatsOverview';
import ProgressSection from '@/components/ProgressSection';

const DashboardPage = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock awards data
  const mockAwards = [
    { id: '1', name: 'First Problem Solved', description: 'Solved your first coding problem', icon: '🏆', earnedAt: new Date().toISOString() },
    { id: '2', name: 'Streak Master', description: 'Maintained a 7-day solving streak', icon: '🔥', earnedAt: new Date().toISOString() },
    { id: '3', name: 'Problem Hunter', description: 'Solved 50 problems', icon: '🎯', earnedAt: new Date().toISOString() }
  ];

  // Mock progress data
  const mockProgressData = {
    total: 150,
    easy: 45,
    medium: 32,
    hard: 8
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <Sidebar 
          selectedSheet="dashboard" 
          onSheetChange={() => {}}
          collapsed={sidebarCollapsed}
        />
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
            {/* Dashboard Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Dashboard
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Track your progress and continue your learning journey
              </p>
            </div>

            {/* Stats Overview */}
            <StatsOverview 
              totalPoints={1250}
              totalArticlesRead={45}
              totalVideosWatched={32}
              awards={mockAwards}
            />
            
            {/* Progress Section */}
            <ProgressSection progress={mockProgressData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
