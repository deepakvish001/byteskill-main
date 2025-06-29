
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserMenu from '@/components/UserMenu';
import CourseContent from '@/components/CourseContent';
import AdvancedFilter from '@/components/AdvancedFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen, Trophy, Target, Code, Play, Star, Clock, Users, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const DSASheetsPage = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    status: 'all',
    hasArticle: false,
    hasVideo: false,
    hasPractice: false,
    searchQuery: ''
  });

  const sheets = [
    {
      id: "striver-a2z-dsa",
      title: "Striver's A2Z DSA Sheet",
      description: "Master Data Structures and Algorithms from zero to hero.",
      problems: 456,
      difficulty: "All Levels",
      badge: "FREE",
      badgeColor: "bg-green-500",
      estimatedTime: "120h",
      rating: 4.9,
      topics: 25,
      color: "from-orange-500 to-red-500"
    },
    {
      id: "blind-75-leetcode",
      title: "Blind 75 LeetCode",
      description: "Essential coding interview problems for FAANG companies.",
      problems: 75,
      difficulty: "Medium-Hard",
      badge: "FREE",
      badgeColor: "bg-green-500",
      estimatedTime: "40h",
      rating: 4.8,
      topics: 15,
      color: "from-red-500 to-pink-500"
    },
    {
      id: "neetcode-150",
      title: "NeetCode 150",
      description: "Comprehensive coding interview preparation course.",
      problems: 150,
      difficulty: "All Levels",
      badge: "FREE",
      badgeColor: "bg-green-500",
      estimatedTime: "80h",
      rating: 4.9,
      topics: 18,
      color: "from-orange-400 to-yellow-500"
    },
    {
      id: "dsa-fundamentals",
      title: "DSA Fundamentals",
      description: "Master the fundamentals of Data Structures and Algorithms.",
      problems: 200,
      difficulty: "Beginner",
      badge: "FREE",
      badgeColor: "bg-green-500",
      estimatedTime: "60h",
      rating: 4.7,
      topics: 20,
      color: "from-pink-500 to-purple-500"
    },
    {
      id: "advanced-algorithms",
      title: "Advanced Algorithms",
      description: "Advanced algorithmic concepts and problem-solving techniques.",
      problems: 180,
      difficulty: "Hard",
      badge: "PREMIUM",
      badgeColor: "bg-yellow-500",
      estimatedTime: "90h",
      rating: 4.6,
      topics: 16,
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "system-design-prep",
      title: "System Design Prep",
      description: "System design problems and solutions for interviews.",
      problems: 120,
      difficulty: "Advanced",
      badge: "PREMIUM",
      badgeColor: "bg-yellow-500",
      estimatedTime: "70h",
      rating: 4.8,
      topics: 12,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "dynamic-programming",
      title: "Dynamic Programming",
      description: "Master dynamic programming with comprehensive problems.",
      problems: 100,
      difficulty: "Medium-Hard",
      badge: "PREMIUM",
      badgeColor: "bg-yellow-500",
      estimatedTime: "50h",
      rating: 4.9,
      topics: 10,
      color: "from-green-500 to-teal-500"
    }
  ];

  const handleSheetClick = (sheetId: string) => {
    setSelectedSheet(sheetId);
  };

  const handleBackToSheets = () => {
    setSelectedSheet(null);
  };

  const currentSheet = sheets.find(sheet => sheet.id === selectedSheet);

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
            {selectedSheet && currentSheet ? (
              // Individual Sheet View
              <>
                {/* Back Button */}
                <div className="flex items-center space-x-4 mb-6">
                  <Button
                    onClick={handleBackToSheets}
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to DSA Sheets
                  </Button>
                </div>

                {/* Sheet Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{currentSheet.title}</h1>
                      <p className="text-gray-400 text-lg mb-4">{currentSheet.description}</p>
                      <div className="flex items-center space-x-4">
                        <Badge className={`${currentSheet.badgeColor} text-white font-bold px-3 py-1 rounded-full`}>
                          {currentSheet.badge}
                        </Badge>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <BookOpen className="w-4 h-4" />
                          <span>{currentSheet.topics} topics</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{currentSheet.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Code className="w-4 h-4" />
                          <span>{currentSheet.problems} problems</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Star className="w-4 h-4 fill-current text-yellow-400" />
                          <span>{currentSheet.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <CourseContent 
                  selectedSheet={selectedSheet} 
                  searchQuery={searchQuery} 
                  isEnrolled={true}
                />
              </>
            ) : (
              // Sheets Grid View
              <>
                {/* Page Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                    All DSA Sheets
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                    Explore our comprehensive collection of Data Structures and Algorithms practice sheets
                  </p>

                  {/* Search Bar */}
                  <div className="max-w-2xl mx-auto">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search courses, topics, or technologies..."
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
                    <AdvancedFilter 
                      filters={filters} 
                      onFiltersChange={setFilters} 
                    />
                  </div>
                )}

                {/* DSA Sheets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="relative bg-gradient-to-br group hover:scale-105 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden"
                      onClick={() => handleSheetClick(sheet.id)}
                      style={{
                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                      }}
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${sheet.color} opacity-90`}></div>
                      
                      {/* Content */}
                      <div className="relative z-10 p-6 text-white h-full flex flex-col">
                        {/* Badge */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <Badge className={`${sheet.badgeColor} text-white font-bold px-3 py-1 rounded-full`}>
                            {sheet.badge}
                          </Badge>
                        </div>
                        
                        {/* Title and Description */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-3 leading-tight">
                            {sheet.title}
                          </h3>
                          
                          <p className="text-white/80 text-sm mb-4 leading-relaxed">
                            {sheet.description}
                          </p>
                        </div>
                        
                        {/* Stats */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{sheet.topics} topics</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{sheet.estimatedTime}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <Code className="w-3 h-3" />
                              <span>{sheet.problems} problems</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{sheet.rating}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs bg-white/10 rounded-full px-3 py-1 text-center backdrop-blur-sm">
                            {sheet.difficulty.toUpperCase()}
                          </div>
                        </div>
                        
                        {/* Buttons */}
                        <div className="space-y-2">
                          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-200">
                            <Play className="w-4 h-4 mr-2" />
                            View Sheet
                          </Button>
                          <Button className="w-full bg-white text-black hover:bg-gray-100 font-semibold transition-all duration-200">
                            <Play className="w-4 h-4 mr-2" />
                            Start Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DSASheetsPage;
