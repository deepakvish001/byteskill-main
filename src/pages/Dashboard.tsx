
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import ProfileHeader from "@/components/ProfileHeader";
import RatingChart from "@/components/RatingChart";
import ProblemsSolvedChart from "@/components/ProblemsSolvedChart";
import CommunityStats from "@/components/CommunityStats";
import LanguageSkills from "@/components/LanguageSkills";
import SubmissionCalendar from "@/components/SubmissionCalendar";
import RecentActivity from "@/components/RecentActivity";

const Dashboard = () => {
  const { user } = useAuth();
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportProgress = async () => {
    setExportLoading(true);
    // Simulate export process
    setTimeout(() => {
      setExportLoading(false);
      // Create and download a sample CSV
      const csvContent = "Date,Activity,Points\nToday,Solved 3 problems,75\nYesterday,Completed Array section,150";
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `progress_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, 2000);
  };

  const handleWeeklyDigest = () => {
    // This would typically trigger an API call to send weekly digest
    console.log("Weekly digest requested");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          onClick={handleExportProgress}
          disabled={exportLoading}
          className="bg-blue-900 text-blue-400 hover:bg-blue-800 border border-blue-800"
        >
          <Download className="w-4 h-4 mr-2" />
          {exportLoading ? "Exporting..." : "Export Progress"}
        </Button>
        <Button 
          onClick={handleWeeklyDigest}
          className="bg-purple-900 text-purple-400 hover:bg-purple-800 border border-purple-800"
        >
          <Mail className="w-4 h-4 mr-2" />
          Weekly Digest
        </Button>
      </div>

      {/* Profile Header */}
      <ProfileHeader />

      {/* Rating Chart */}
      <RatingChart />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problems Solved Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ProblemsSolvedChart />
        </div>
        
        {/* Community Stats */}
        <CommunityStats />
      </div>

      {/* Submission Calendar - Full Width */}
      <SubmissionCalendar />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language Skills */}
        <LanguageSkills />
        
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
