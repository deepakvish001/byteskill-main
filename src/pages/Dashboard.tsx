
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Calendar, TrendingUp, Code, Clock, Star, Award, BookOpen, Users, Brain } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

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

  const achievements = [
    { name: "Problem Solver", description: "Solved 100+ problems", icon: Trophy, color: "text-yellow-400" },
    { name: "Streak Master", description: "7-day solving streak", icon: Target, color: "text-green-400" },
    { name: "Fast Learner", description: "Completed 5 courses", icon: BookOpen, color: "text-blue-400" },
    { name: "Team Player", description: "Helped 10 peers", icon: Users, color: "text-purple-400" }
  ];

  const progressData = [
    { topic: "Arrays & Hashing", solved: 25, total: 30, progress: 83 },
    { topic: "Two Pointers", solved: 18, total: 20, progress: 90 },
    { topic: "Binary Search", solved: 12, total: 25, progress: 48 },
    { topic: "Dynamic Programming", solved: 8, total: 40, progress: 20 },
    { topic: "Trees & Graphs", solved: 15, total: 35, progress: 43 }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-400 mt-2">Track your progress and continue your coding journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Problems Solved</CardTitle>
            <Code className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.problemsSolved}</div>
            <p className="text-xs text-gray-400">+12 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Current Streak</CardTitle>
            <Target className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.currentStreak} days</div>
            <p className="text-xs text-gray-400">Max: {stats.maxStreak} days</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">XP Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.xpPoints.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Rank #{stats.rank}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Topic Progress
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your progress across different DSA topics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressData.map((topic) => (
              <div key={topic.topic} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{topic.topic}</span>
                  <span className="text-xs text-gray-400">{topic.solved}/{topic.total}</span>
                </div>
                <Progress value={topic.progress} className="h-2" />
                <div className="text-xs text-gray-400 text-right">{topic.progress}% complete</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-gray-800">
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
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

      {/* Achievements */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Achievements
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your accomplishments and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                  <span className="font-medium text-white">{achievement.name}</span>
                </div>
                <p className="text-sm text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-gray-400">
            Continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-800/50 hover:border-blue-700 transition-colors cursor-pointer">
              <h3 className="font-medium text-white mb-2">Continue Learning</h3>
              <p className="text-sm text-gray-300">Resume your current course</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-lg border border-green-800/50 hover:border-green-700 transition-colors cursor-pointer">
              <h3 className="font-medium text-white mb-2">Practice Problems</h3>
              <p className="text-sm text-gray-300">Solve recommended problems</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-lg border border-orange-800/50 hover:border-orange-700 transition-colors cursor-pointer">
              <h3 className="font-medium text-white mb-2">Take Assessment</h3>
              <p className="text-sm text-gray-300">Test your knowledge</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
