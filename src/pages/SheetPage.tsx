
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProblemDashboard from "@/components/ProblemDashboard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";
import CourseBreadcrumb from "@/components/CourseBreadcrumb";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Filter, RotateCcw, BookOpen, Video, Award } from "lucide-react";

const SheetPage = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stepsCollapsed, setStepsCollapsed] = useState(false);
  const [lecturesCollapsed, setLecturesCollapsed] = useState(false);

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

  const getSheetDescription = () => {
    const descriptions: { [key: string]: string } = {
      'striver-a2z': 'Master the fundamentals of Data Structures and Algorithms',
      'striver-sde': 'Comprehensive SDE preparation with curated problems',
      'striver-79': 'Essential 79 problems for coding interviews',
      'blind-75': 'Most important 75 coding problems',
      'neetcode-150': 'Complete coding interview preparation',
      'top-interview': 'Top interview questions from leading companies'
    };
    return descriptions[sheetId || ''] || 'Complete your coding preparation with this curated problem set';
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
        
        {/* Main Content with increased top padding to pt-48 */}
        <main className="flex-1 pt-48 p-3 sm:p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb - Now visible with proper spacing */}
            <div className="mb-6">
              <CourseBreadcrumb 
                items={getBreadcrumbItems()}
                showBackButton={true}
                backUrl="/dsa-sheets"
              />
            </div>

            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {getBreadcrumbItems()[2]?.label || 'DSA Fundamentals'}
              </h1>
              <p className="text-gray-400 text-lg mb-4">
                {getSheetDescription()}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <Badge className="bg-blue-900 text-blue-400 border-blue-800">
                  beginner
                </Badge>
                <div className="flex items-center space-x-1 text-gray-400">
                  <BookOpen className="w-4 h-4" />
                  <span>24 lessons</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <span>⏱️ 40h</span>
                </div>
                <Badge className="bg-green-900 text-green-400 border-green-800">
                  <span>✅ Enrolled - 0% Complete</span>
                </Badge>
              </div>
            </div>

            {/* Filter and Progress Section */}
            <div className="mb-6 space-y-4">
              {/* Control Buttons Row */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    All Problems Revision (0)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStepsCollapsed(!stepsCollapsed)}
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${stepsCollapsed ? 'rotate-180' : ''}`} />
                    Collapse Steps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLecturesCollapsed(!lecturesCollapsed)}
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${lecturesCollapsed ? 'rotate-180' : ''}`} />
                    Collapse Lectures
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-gray-700 hover:bg-gray-800"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filter
                  </Button>
                </div>
              </div>

              {/* Progress Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">0</div>
                  <div className="text-sm text-gray-400">Total Points</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 mr-1" />
                    3
                  </div>
                  <div className="text-sm text-gray-400">Articles Read</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1 flex items-center justify-center">
                    <Video className="w-5 h-5 mr-1" />
                    1
                  </div>
                  <div className="text-sm text-gray-400">Videos Watched</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1 flex items-center justify-center">
                    <Award className="w-5 h-5 mr-1" />
                    1
                  </div>
                  <div className="text-sm text-gray-400">Awards Earned</div>
                </div>
              </div>
            </div>
            
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
