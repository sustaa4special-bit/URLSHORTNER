"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import FraudAlertsDisplay from "@/components/admin/FraudAlertsDisplay";
import { simulateAdminActivity } from "@/utils/adminData";

const AdminFraudAlertsPage = () => {
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
      <h2 className="text-3xl font-bold text-white mb-6">Fraud Alerts</h2>
      <FraudAlertsDisplay onRefresh={triggerRefresh} />
    </AdminLayout>
  );
};

export default AdminFraudAlertsPage;