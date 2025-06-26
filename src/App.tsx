
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import DSASheetsPage from "@/pages/DSASheetsPage";
import CoursesOverview from "@/pages/CoursesOverview";
import CoreCSPage from "@/pages/CoreCSPage";
import InterviewPrepPage from "@/pages/InterviewPrepPage";
import CoursePage from "@/pages/CoursePage";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dsa-sheets" element={<DSASheetsPage />} />
              <Route path="/courses" element={<CoursesOverview />} />
              <Route path="/core-cs" element={<CoreCSPage />} />
              <Route path="/interview-prep" element={<InterviewPrepPage />} />
              <Route path="/course/:courseId" element={<CoursePage />} />
              <Route path="/sheet/:courseId" element={<CoursePage />} />
              <Route path="/u/:username" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
