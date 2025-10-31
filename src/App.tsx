import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BrandsPage from "./pages/BrandsPage";
import CreatorsPage from "./pages/CreatorsPage"; // This will be replaced or augmented
import HowItWorksPage from "./pages/HowItWorksPage";
import LoginPage from "./pages/LoginPage";
import ExploreCampaignsPage from "./pages/ExploreCampaignsPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import CreatorDashboardPage from "./pages/CreatorDashboardPage"; // Import new page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/creators" element={<CreatorDashboardPage />} /> {/* Update Creators route to Dashboard */}
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/explore-campaigns" element={<ExploreCampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
          <Route path="/creator-dashboard" element={<CreatorDashboardPage />} /> {/* Explicit dashboard route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;