import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClassTimetable from "./pages/ClassTimetable";
import ClassFeePayment from "./pages/ClassFeePayment";
import JoinClass from "./pages/JoinClass";
import ClassMaterials from "./pages/ClassMaterials";
import RecordingBundles from "./pages/RecordingBundles";
import TeacherPortfolio from "./pages/TeacherPortfolio";
import StudentRegistration from "./pages/StudentRegistration";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudentManagement from "./pages/AdminStudentManagement";
import AdminRecordingsManagement from "./pages/AdminRecordingsManagement";
import AdminBundleManagement from "./pages/AdminBundleManagement";
import PaymentVerifications from './pages/PaymentVerifications';
import AdminClassFeeManagement from './pages/AdminClassFeeManagement';
import AdminOfflinePayments from './pages/AdminOfflinePayments';
import PortfolioManagement from "./pages/PortfolioManagement";
import { SessionBootstrap, SessionGuard } from "./components/SessionGuard";

const queryClient = new QueryClient();

const PortfolioRedirect = () => {
  useEffect(() => {
    window.location.href = "https://portfolio.nextlvlict.com/";
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionBootstrap />
        <Routes>
          <Route path="/" element={<PortfolioRedirect />} />
          {/* Existing login route - now accessible via portfolio */}
          <Route path="/login" element={<Index />} />
          <Route path="/dashboard" element={<SessionGuard kind="student"><Dashboard /></SessionGuard>} />
          <Route path="/timetable" element={<SessionGuard kind="student"><ClassTimetable /></SessionGuard>} />
          <Route path="/payment" element={<SessionGuard kind="student"><ClassFeePayment /></SessionGuard>} />
          <Route path="/join-class" element={<SessionGuard kind="student"><JoinClass /></SessionGuard>} />
          <Route path="/materials" element={<SessionGuard kind="student"><ClassMaterials /></SessionGuard>} />
          <Route path="/bundles" element={<SessionGuard kind="student"><RecordingBundles /></SessionGuard>} />
          <Route path="/teachers" element={<SessionGuard kind="student"><TeacherPortfolio /></SessionGuard>} />
          <Route path="/register" element={<StudentRegistration />} />
          <Route path="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6" element={<AdminLogin />} />
          <Route path="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard" element={<SessionGuard kind="admin"><AdminDashboard /></SessionGuard>} />
          <Route path="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/students" element={<SessionGuard kind="admin"><AdminStudentManagement /></SessionGuard>} />
          <Route path="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/recordings" element={<SessionGuard kind="admin"><AdminRecordingsManagement /></SessionGuard>} />
          <Route path="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/bundles" element={<SessionGuard kind="admin"><AdminBundleManagement /></SessionGuard>} />
          <Route path="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/payment-verifications" element={<SessionGuard kind="admin"><PaymentVerifications /></SessionGuard>} />
          <Route path="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/portfolio" element={<SessionGuard kind="admin"><PortfolioManagement /></SessionGuard>} />
          <Route path="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/class-fees" element={<SessionGuard kind="admin"><AdminClassFeeManagement /></SessionGuard>} />
          <Route path="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/offline-payments" element={<SessionGuard kind="admin"><AdminOfflinePayments /></SessionGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
