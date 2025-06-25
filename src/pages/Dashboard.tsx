
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Calendar, TrendingUp, Code, Clock, Star, Award, BookOpen, Users, Brain, Download, Mail } from "lucide-react";
import EnrolledCoursesProgress from "@/components/EnrolledCoursesProgress";
import HeatMapCalendar from "@/components/HeatMapCalendar";
import UserStreak from "@/components/UserStreak";
import XPGrowthChart from "@/components/XPGrowthChart";
import TopicProficiency from "@/components/TopicProficiency";
import UpcomingGoals from "@/components/UpcomingGoals";
import ProgressGraphs from "@/components/ProgressGraphs";

const Dashboard = () => {
  const { user } = useAuth();
  const [exportLoading, setExportLoading] = useState(false);

  const stats = {
    problemsSolved: 156,
    currentStreak: 7,
    maxStreak: 15,
    xpPoints: 2840,
    rank: 1234,
    contestsParticipated: 8
  };

  const recentActivity = [
    { date: "Today", activity: "Solved 3 problems", points: 75 },
    { date: "Yesterday", activity: "Completed Array section", points: 150 },
    { date: "2 days ago", activity: "Started new course", points: 50 },
    { date: "3 days ago", activity: "Solved hard problem", points: 100 }
  ];

  const handleExportProgress = async () => {
    setExportLoading(true);
    // Simulate export process
    setTimeout(() => {
      setExportLoading(false);
      // Create and download a sample CSV
      const csvContent = "Date,Activity,Points\n" + 
        recentActivity.map(item => `${item.date},${item.activity},${item.points}`).join('\n');
      
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-400 mt-2">Track your progress and continue your coding journey</p>
      </div>

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Problems Solved</CardTitle>
            <Code className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.problemsSolved}</div>
            <p className="text-xs text-gray-400">+12 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Current Streak</CardTitle>
            <Target className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.currentStreak} days</div>
            <p className="text-xs text-gray-400">Max: {stats.maxStreak} days</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">XP Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.xpPoints.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Rank #{stats.rank}</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Contests</CardTitle>
            <Trophy className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.contestsParticipated}</div>
            <p className="text-xs text-gray-400">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Courses Progress */}
        <EnrolledCoursesProgress />
        
        {/* User Streak */}
        <UserStreak />
        
        {/* Heat Map Calendar - Full Width */}
        <div className="lg:col-span-2">
          <HeatMapCalendar />
        </div>
        
        {/* XP Growth Chart */}
        <XPGrowthChart />
        
        {/* Topic Proficiency */}
        <TopicProficiency />
        
        {/* Upcoming Goals - Full Width */}
        <div className="lg:col-span-2">
          <UpcomingGoals />
        </div>
      </div>

      {/* Progress Graphs - Full Width */}
      <ProgressGraphs />

      {/* Recent Activity */}
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-400" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your latest achievements and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div>
                  <p className="text-sm text-white">{item.activity}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
                <Badge className="bg-blue-900 text-blue-400 border-blue-800">
                  +{item.points} XP
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
