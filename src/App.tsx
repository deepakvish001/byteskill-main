
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UserDashboard from "./pages/UserDashboard";
import DashboardPage from "./pages/DashboardPage";
import DSASheetsPage from "./pages/DSASheetsPage";
import CoursesOverview from "./pages/CoursesOverview";
import CoursePage from "./pages/CoursePage";
import SheetPage from "./pages/SheetPage";
import CoreCSPage from "./pages/CoreCSPage";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/u/:username" element={<ProfilePage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/my-dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/dsa-sheets" element={<DSASheetsPage />} />
              <Route path="/courses" element={<CoursesOverview />} />
              <Route path="/course/:courseId" element={<CoursePage />} />
              <Route path="/sheet/:sheetId" element={<SheetPage />} />
              <Route path="/core-cs" element={<CoreCSPage />} />
              <Route path="/interview-prep" element={<InterviewPrepPage />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
