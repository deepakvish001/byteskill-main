
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import AuthPageWrapper from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import DSASheetsPage from "@/pages/DSASheetsPage";
import CoursesOverview from "@/pages/CoursesOverview";
import CoreCSPage from "@/pages/CoreCSPage";
import InterviewPrepPage from "@/pages/InterviewPrepPage";
import CoursePage from "@/pages/CoursePage";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import PublicProfile from "@/pages/PublicProfile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPageWrapper />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dsa-sheets" element={<DSASheetsPage />} />
              <Route path="/courses" element={<CoursesOverview />} />
              <Route path="/core-cs" element={<CoreCSPage />} />
              <Route path="/interview-prep" element={<InterviewPrepPage />} />
              <Route path="/course/:courseId" element={<CoursePage />} />
              <Route path="/sheet/:courseId" element={<CoursePage />} />
              <Route path="/u/:username" element={<UserDashboard />} />
              <Route path="/public/:username" element={<PublicProfile />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
