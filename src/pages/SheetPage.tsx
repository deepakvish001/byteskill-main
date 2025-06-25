
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import ProblemDashboard from "@/components/ProblemDashboard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";
import CourseBreadcrumb from "@/components/CourseBreadcrumb";
import CoursePageToolbar from "@/components/CoursePageToolbar";
import CourseProgressStats from "@/components/CourseProgressStats";

interface AdvancedFilters {
  difficulty: string;
  status: string;
  hasArticle: boolean;
  hasVideo: boolean;
  hasPractice: boolean;
  searchQuery: string;
}

const SheetPage = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [allStepsCollapsed, setAllStepsCollapsed] = useState(false);
  const [allLecturesCollapsed, setAllLecturesCollapsed] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilters>({
    difficulty: "all",
    status: "all",
    hasArticle: false,
    hasVideo: false,
    hasPractice: false,
    searchQuery: ""
  });

  const getBreadcrumbItems = () => {
    const sheetNames: { [key: string]: string } = {
      'striver-a2z': 'Striver A2Z Sheet',
      'striver-sde': 'Striver SDE Sheet',
      'striver-79': 'Striver 79 Sheet',
      'blind-75': 'Blind 75 Sheet',
      'neetcode-150': 'NeetCode 150',
      'top-interview': 'Top Interview Questions'
    };

    return [
      { label: 'Home', href: '/dashboard' },
      { label: 'DSA Sheets', href: '/dsa-sheets' },
      { label: sheetNames[sheetId || ''] || sheetId || 'Sheet' }
    ];
  };

  const handleRevisionModeToggle = () => {
    console.log("Revision mode toggled");
  };

  const handleCollapseAllSteps = () => {
    setAllStepsCollapsed(true);
  };

  const handleExpandAllSteps = () => {
    setAllStepsCollapsed(false);
  };

  const handleCollapseAllLectures = () => {
    setAllLecturesCollapsed(true);
  };

  const handleExpandAllLectures = () => {
    setAllLecturesCollapsed(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">Please log in to view this content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Fixed Sidebar - Responsive */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'
      }`}>
        <Sidebar 
          selectedSheet="dsa-sheets" 
          onSheetChange={() => {}}
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
            />
            <UserMenu />
          </div>
        </div>
        
        {/* Main Content with proper spacing */}
        <main className="flex-1 pt-24 p-3 sm:p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb with proper spacing */}
            <div className="mb-8 mt-4">
              <CourseBreadcrumb 
                items={getBreadcrumbItems()}
                showBackButton={true}
                backUrl="/dsa-sheets"
              />
            </div>

            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {getBreadcrumbItems()[2]?.label}
              </h1>
              <p className="text-gray-400 text-lg">
                Complete this curated set of coding problems to master data structures and algorithms
              </p>
            </div>

            {/* Progress Stats */}
            <CourseProgressStats
              totalProblems={180}
              solvedProblems={45}
              attemptedProblems={23}
              averageTime={28}
              streak={5}
              completionRate={25}
            />

            {/* Course Toolbar */}
            <CoursePageToolbar
              onRevisionModeToggle={handleRevisionModeToggle}
              onCollapseAllSteps={handleCollapseAllSteps}
              onExpandAllSteps={handleExpandAllSteps}
              onCollapseAllLectures={handleCollapseAllLectures}
              onExpandAllLectures={handleExpandAllLectures}
              allStepsCollapsed={allStepsCollapsed}
              allLecturesCollapsed={allLecturesCollapsed}
              filters={filters}
              onFiltersChange={setFilters}
            />
            
            <ProblemDashboard 
              selectedSheet={sheetId || "striver-a2z"} 
              searchQuery={searchQuery} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SheetPage;
