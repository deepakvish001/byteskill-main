
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Dashboard from "./Dashboard";
import { useState } from "react";

const UserDashboard = () => {
  const { username } = useParams<{ username: string }>();
  const { user, loading } = useAuth();
  const [selectedSheet, setSelectedSheet] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Extract username from user metadata or email
  const currentUsername = user.user_metadata?.username || user.email?.split('@')[0];
  
  // If the username in URL doesn't match current user, redirect to their dashboard
  if (username !== currentUsername) {
    return <Navigate to={`/u/${currentUsername}`} replace />;
  }

  return (
    <Layout selectedSheet={selectedSheet} onSheetChange={setSelectedSheet}>
      <Dashboard />
    </Layout>
  );
};

export default UserDashboard;
