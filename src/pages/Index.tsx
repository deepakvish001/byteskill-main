
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProblemDashboard from "@/components/ProblemDashboard";
import Header from "@/components/Header";

const Index = () => {
  const [selectedSheet, setSelectedSheet] = useState("striver-sde");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex">
      <Sidebar selectedSheet={selectedSheet} onSheetChange={setSelectedSheet} />
      <div className="flex-1 flex flex-col">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 p-6 bg-black/50">
          <ProblemDashboard selectedSheet={selectedSheet} searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
};

export default Index;
