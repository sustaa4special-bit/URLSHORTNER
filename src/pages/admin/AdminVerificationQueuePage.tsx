"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import VerificationQueueTable from "@/components/admin/VerificationQueueTable";
import { simulateAdminActivity } from "@/utils/adminData";

const AdminVerificationQueuePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    // Set up interval for simulating real-time updates and refreshing data
    const interval = setInterval(() => {
      simulateAdminActivity(); // Keep simulating activity globally
      triggerRefresh();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold text-white mb-6">Verification Queue</h2>
      <VerificationQueueTable onRefresh={triggerRefresh} />
    </AdminLayout>
  );
};

export default AdminVerificationQueuePage;