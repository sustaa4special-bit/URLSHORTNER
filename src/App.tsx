import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BrandDashboardPage from "./pages/BrandDashboardPage";
import CreatorsPage from "./pages/CreatorsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import LoginPage from "./pages/LoginPage";
import ExploreCampaignsPage from "./pages/ExploreCampaignsPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import CreatorDashboardPage from "./pages/CreatorDashboardPage";
import CreatorWalletPage from "./pages/CreatorWalletPage";
// Admin Pages
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminVerificationQueuePage from "./pages/admin/AdminVerificationQueuePage";
import AdminWithdrawalRequestsPage from "./pages/admin/AdminWithdrawalRequestsPage";
import AdminCampaignsPage from "./pages/admin/AdminCampaignsPage";
import AdminCreatorsPage from "./pages/admin/AdminCreatorsPage";
import AdminBrandsPage from "./pages/admin/AdminBrandsPage";
import AdminSystemLogsPage from "./pages/admin/AdminSystemLogsPage";
import AdminFraudAlertsPage from "./pages/admin/AdminFraudAlertsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
// Analytics Page
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Public Routes */}
          <Route path="/brands" element={<BrandDashboardPage />} />
          <Route path="/creators" element={<CreatorDashboardPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/explore-campaigns" element={<ExploreCampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
          <Route path="/creator-dashboard" element={<CreatorDashboardPage />} />
          <Route path="/wallet" element={<CreatorWalletPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} /> {/* New Analytics Route */}

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/verifications" element={<AdminVerificationQueuePage />} />
          <Route path="/admin/withdrawals" element={<AdminWithdrawalRequestsPage />} />
          <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
          <Route path="/admin/creators" element={<AdminCreatorsPage />} />
          <Route path="/admin/brands" element={<AdminBrandsPage />} />
          <Route path="/admin/logs" element={<AdminSystemLogsPage />} />
          <Route path="/admin/fraud-alerts" element={<AdminFraudAlertsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;