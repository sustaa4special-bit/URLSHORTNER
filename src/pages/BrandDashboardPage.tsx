"use client";

import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import BrandDashboardHeader from "@/components/BrandDashboardHeader";
import BrandMetricsCards from "@/components/BrandMetricsCards";
import BrandCampaignsTable from "@/components/BrandCampaignsTable";
import CampaignCharts from "@/components/CampaignCharts";
import CreateCampaignForm from "@/components/CreateCampaignForm";
import EditCampaignForm from "@/components/EditCampaignForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  getBrandCampaigns,
  getBrandDashboardMetrics,
  simulateCampaignProgress,
  updateBrandCampaign,
  BrandCampaign,
  CampaignStatus,
} from "@/utils/brandCampaignData";
import { showError, showSuccess } from "@/utils/toast";

const BrandDashboardPage = () => {
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>([]);
  const [metrics, setMetrics] = useState(getBrandDashboardMetrics());
  const [isCreateCampaignDialogOpen, setIsCreateCampaignDialogOpen] = useState(false);
  const [isEditCampaignDialogOpen, setIsEditCampaignDialogOpen] = useState(false);
  const [selectedCampaignToEdit, setSelectedCampaignToEdit] = useState<BrandCampaign | null>(null);
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | 'All'>('All');

  // Function to refresh all data from localStorage
  const refreshData = () => {
    setCampaigns(getBrandCampaigns());
    setMetrics(getBrandDashboardMetrics());
  };

  useEffect(() => {
    refreshData(); // Initial load

    // Set up interval for simulating real-time updates
    const interval = setInterval(() => {
      simulateCampaignProgress();
      refreshData();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleCreateCampaignSuccess = () => {
    refreshData();
    setIsCreateCampaignDialogOpen(false);
  };

  const handleEditCampaign = (campaign: BrandCampaign) => {
    setSelectedCampaignToEdit(campaign);
    setIsEditCampaignDialogOpen(true);
  };

  const handleEditCampaignSuccess = () => {
    refreshData();
    setIsEditCampaignDialogOpen(false);
    setSelectedCampaignToEdit(null);
  };

  const handleToggleCampaignStatus = (campaignId: string, newStatus: CampaignStatus) => {
    const updated = updateBrandCampaign(campaignId, { status: newStatus });
    if (updated) {
      showSuccess(`Campaign "${updated.headline}" status updated to ${newStatus}.`);
      refreshData();
    } else {
      showError("Failed to update campaign status.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <BrandDashboardHeader onOpenCreateCampaign={() => setIsCreateCampaignDialogOpen(true)} />
          <BrandMetricsCards {...metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Campaigns Table */}
            <div className="lg:col-span-2">
              <BrandCampaignsTable
                campaigns={campaigns}
                onEditCampaign={handleEditCampaign}
                onToggleCampaignStatus={handleToggleCampaignStatus}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
              />
            </div>

            {/* Right Column: Performance Charts */}
            <div className="lg:col-span-1">
              <CampaignCharts campaigns={campaigns} />
            </div>
          </div>
        </div>
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateCampaignDialogOpen} onOpenChange={setIsCreateCampaignDialogOpen}>
        <CreateCampaignForm onClose={() => setIsCreateCampaignDialogOpen(false)} onCampaignCreated={handleCreateCampaignSuccess} />
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditCampaignDialogOpen} onOpenChange={setIsEditCampaignDialogOpen}>
        {selectedCampaignToEdit && (
          <EditCampaignForm
            campaign={selectedCampaignToEdit}
            onClose={() => setIsEditCampaignDialogOpen(false)}
            onCampaignUpdated={handleEditCampaignSuccess}
          />
        )}
      </Dialog>
    </Layout>
  );
};

export default BrandDashboardPage;