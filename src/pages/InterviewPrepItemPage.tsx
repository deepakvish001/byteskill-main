
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { 
  BookOpen, 
  Video, 
  Trophy, 
  Target
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";
import CourseStatsCard from "@/components/CourseStatsCard";
import ProgressOverviewCard from "@/components/ProgressOverviewCard";
import CourseActionButtons from "@/components/CourseActionButtons";
import ProblemDashboard from "@/components/ProblemDashboard";

const InterviewPrepItemPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stepsCollapsed, setStepsCollapsed] = useState(false);
  const [lecturesCollapsed, setLecturesCollapsed] = useState(false);

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
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'
      }`}>
        <Sidebar 
          selectedSheet="interview-prep" 
          onSheetChange={() => {}}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16 sm:ml-20' : 'ml-64 sm:ml-72'
      }`}>
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
        
        <main className="flex-1 pt-24 p-3 sm:p-6 bg-black min-h-screen">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <CourseStatsCard
                title="Total Points"
                value={0}
                icon={<Target className="w-5 h-5 text-white" />}
                color="bg-blue-600"
              />
              <CourseStatsCard
                title="Articles Read"
                value={0}
                icon={<BookOpen className="w-5 h-5 text-white" />}
                color="bg-green-600"
              />
              <CourseStatsCard
                title="Videos Watched"
                value={2}
                icon={<Video className="w-5 h-5 text-white" />}
                color="bg-purple-600"
              />
              <CourseStatsCard
                title="Awards Earned"
                value={0}
                icon={<Trophy className="w-5 h-5 text-white" />}
                color="bg-yellow-600"
              />
            </div>

            <ProgressOverviewCard
              totalProgress={0}
              totalCompleted={0}
              totalProblems={250}
              progressItems={[
                { label: "Easy", completed: 0, total: 75, color: "green" },
                { label: "Medium", completed: 0, total: 125, color: "yellow" },
                { label: "Hard", completed: 0, total: 50, color: "red" }
              ]}
            />

            <CourseActionButtons
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              stepsCollapsed={stepsCollapsed}
              lecturesCollapsed={lecturesCollapsed}
              onToggleSteps={() => setStepsCollapsed(!stepsCollapsed)}
              onToggleLectures={() => setLecturesCollapsed(!lecturesCollapsed)}
              revisionCount={0}
              onRevision={() => console.log("Revision clicked")}
              onAdvancedFilter={() => console.log("Advanced filter clicked")}
            />
            
            <ProblemDashboard 
              selectedSheet={itemId || "interview-prep"} 
              searchQuery={searchQuery} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewPrepItemPage;
