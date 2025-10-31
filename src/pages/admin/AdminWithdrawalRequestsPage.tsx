"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import WithdrawalRequestsTable from "@/components/admin/WithdrawalRequestsTable";
import { simulateAdminActivity } from "@/utils/adminData";

const AdminWithdrawalRequestsPage = () => {
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
      <h2 className="text-3xl font-bold text-white mb-6">Withdrawal Requests</h2>
      <WithdrawalRequestsTable onRefresh={triggerRefresh} />
    </AdminLayout>
  );
};

export default AdminWithdrawalRequestsPage;