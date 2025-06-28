
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserMenu from '@/components/UserMenu';
import ProblemTable from '@/components/ProblemTable';
import AdvancedFilter from '@/components/AdvancedFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen, Trophy, Target, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DSASheetsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const sheets = [
    {
      id: 1,
      title: "Striver's A2Z DSA Sheet",
      description: "Complete DSA preparation with 400+ problems",
      problems: 456,
      difficulty: "All Levels",
      badge: "Popular",
      color: "bg-gradient-to-r from-blue-600 to-purple-600"
    },
    {
      id: 2,
      title: "Blind 75 LeetCode",
      description: "Essential coding interview problems",
      problems: 75,
      difficulty: "Medium-Hard",
      badge: "Essential",
      color: "bg-gradient-to-r from-green-600 to-blue-600"
    },
    {
      id: 3,
      title: "NeetCode 150",
      description: "Comprehensive coding interview prep",
      problems: 150,
      difficulty: "All Levels",
      badge: "Trending",
      color: "bg-gradient-to-r from-purple-600 to-pink-600"
    },
    {
      id: 4,
      title: "Top Interview Questions",
      description: "Most frequently asked in interviews",
      problems: 200,
      difficulty: "Easy-Medium",
      badge: "Hot",
      color: "bg-gradient-to-r from-orange-600 to-red-600"
    }
  ];

  // Mock problem table props
  const mockProblemTableProps = {
    steps: [],
    expandedSteps: {},
    expandedLectures: {},
    problemStatuses: {},
    bookmarkedProblems: new Set(),
    onStepExpand: () => {},
    onLectureExpand: () => {},
    onToggleBookmark: () => {},
    onProgressUpdate: () => {},
    onNotesUpdate: () => {},
    problemNotes: {},
    currentSheet: 'dsa-sheets'
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <Sidebar 
          selectedSheet="dsa-sheets" 
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
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                DSA Practice Sheets
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                Master Data Structures and Algorithms with our curated problem sets. 
                Track your progress and improve your coding skills systematically.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search DSA sheets, topics, or problems..."
                    className="pl-12 pr-12 h-12 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filter */}
            {showAdvancedFilter && (
              <div className="max-w-4xl mx-auto">
                <AdvancedFilter onFiltersChange={() => {}} />
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-gray-400 text-sm">DSA Sheets</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">1,200+</div>
                <div className="text-gray-400 text-sm">Problems</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Code className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">15</div>
                <div className="text-gray-400 text-sm">Topics</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white">85%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
            </div>

            {/* DSA Sheets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {sheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 ${sheet.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${sheet.color} rounded-xl flex items-center justify-center`}>
                        <Code className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-orange-900 text-orange-300 border-orange-800">
                        {sheet.badge}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      {sheet.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {sheet.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-white">{sheet.problems}</span>
                          <span className="text-gray-400">problems</span>
                        </div>
                        <div className="text-sm text-gray-500">{sheet.difficulty}</div>
                      </div>
                      
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6">
                        Start Practice
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Problem Table */}
            <div className="mt-12">
              <ProblemTable {...mockProblemTableProps} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DSASheetsPage;

