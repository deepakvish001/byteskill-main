
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProblemDashboard from "@/components/ProblemDashboard";
import Header from "@/components/Header";

const Index = () => {
  const [selectedSheet, setSelectedSheet] = useState("striver-sde");

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar selectedSheet={selectedSheet} onSheetChange={setSelectedSheet} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-black">
          <ProblemDashboard selectedSheet={selectedSheet} />
        </main>
      </div>
    </div>
  );
};

export default Index;
