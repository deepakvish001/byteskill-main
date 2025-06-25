
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProblemDashboard from "@/components/ProblemDashboard";
import Header from "@/components/Header";

const Index = () => {
  const [selectedSheet, setSelectedSheet] = useState("sde-sheet");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar selectedSheet={selectedSheet} onSheetChange={setSelectedSheet} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <ProblemDashboard />
        </main>
      </div>
    </div>
  );
};

export default Index;
