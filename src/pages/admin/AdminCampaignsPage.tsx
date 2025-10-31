"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminCampaignOverview from "@/components/admin/AdminCampaignOverview";
import { simulateAdminActivity } from "@/utils/adminData";

const AdminCampaignsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      simulateAdminActivity();
      triggerRefresh();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <AdminCampaignOverview onRefresh={triggerRefresh} />
    </AdminLayout>
  );
};

export default AdminCampaignsPage;