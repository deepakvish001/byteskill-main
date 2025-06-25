
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserMenu from '@/components/UserMenu';
import StatsOverview from '@/components/StatsOverview';
import ProgressSection from '@/components/ProgressSection';
import { Trophy, Flame, Target } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock awards data with proper Award type structure
  const mockAwards = [
    { 
      name: 'First Problem Solved', 
      icon: Trophy, 
      color: 'text-yellow-400'
    },
    { 
      name: 'Streak Master', 
      icon: Flame, 
      color: 'text-red-400'
    },
    { 
      name: 'Problem Hunter', 
      icon: Target, 
      color: 'text-blue-400'
    }
  ];

  // Mock progress data with proper ProgressData structure
  const mockProgressData = {
    total: { solved: 85, total: 150, percentage: 56.7 },
    easy: { solved: 45, total: 60, percentage: 75 },
    medium: { solved: 32, total: 70, percentage: 45.7 },
    hard: { solved: 8, total: 20, percentage: 40 }
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
