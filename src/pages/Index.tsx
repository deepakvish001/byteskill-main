
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
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <Sidebar 
          selectedSheet={selectedSheet} 
          onSheetChange={setSelectedSheet}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-72'
      }`}>
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 z-30 transition-all duration-300" style={{
          left: sidebarCollapsed ? '5rem' : '18rem'
        }}>
          <Header 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>
        
        {/* Main Content with top padding to account for fixed header */}
        <main className="flex-1 pt-20 p-6 bg-black min-h-screen">
          <ProblemDashboard selectedSheet={selectedSheet} searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
};

export default Index;
