"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminCampaignOverview from "@/components/admin/AdminCampaignOverview";
import SystemLogsDisplay from "@/components/admin/SystemLogsDisplay";
import FraudAlertsDisplay from "@/components/admin/FraudAlertsDisplay";
import VerificationQueueTable from "@/components/admin/VerificationQueueTable";
import WithdrawalRequestsTable from "@/components/admin/WithdrawalRequestsTable";
import { simulateAdminActivity } from "@/utils/adminData";

const AdminDashboardPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to trigger a refresh of all data
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    // Initial simulation and refresh
    simulateAdminActivity();
    triggerRefresh();

    // Set up interval for simulating real-time updates and refreshing data
    const interval = setInterval(() => {
      simulateAdminActivity();
      triggerRefresh();
    }, 10000); // Simulate activity and refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Admin Dashboard Overview</h2>

        {/* Quick Overview of Queues and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VerificationQueueTable onRefresh={triggerRefresh} />
          <WithdrawalRequestsTable onRefresh={triggerRefresh} />
        </div>

        <AdminCampaignOverview onRefresh={triggerRefresh} />
        <SystemLogsDisplay onRefresh={triggerRefresh} />
        <FraudAlertsDisplay onRefresh={triggerRefresh} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;