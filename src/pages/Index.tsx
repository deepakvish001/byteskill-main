
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProblemDashboard from "@/components/ProblemDashboard";
import Header from "@/components/Header";

const Index = () => {
  const [selectedSheet, setSelectedSheet] = useState("striver-sde");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Fixed Sidebar - Responsive */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'
      } ${sidebarCollapsed ? '' : 'translate-x-0'}`}>
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
          <Header 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>
        
        {/* Main Content with responsive padding */}
        <main className="flex-1 pt-16 sm:pt-20 p-3 sm:p-6 bg-black min-h-screen">
          <ProblemDashboard selectedSheet={selectedSheet} searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
};

export default Index;
