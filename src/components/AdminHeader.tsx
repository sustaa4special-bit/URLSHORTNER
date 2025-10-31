"use client";

import React, { useState, useEffect } from "react";
import { getAdminMetrics, simulateAdminActivity } from "@/utils/adminData";
import { DollarSign, Users, Building2, Rocket } from "lucide-react";

const AdminHeader = () => {
  const [metrics, setMetrics] = useState(getAdminMetrics());

  useEffect(() => {
    const refreshMetrics = () => {
      setMetrics(getAdminMetrics());
    };

    const interval = setInterval(refreshMetrics, 5000); // Refresh metrics every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gray-900/70 backdrop-blur-lg border-b border-gray-800 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 z-20 shadow-lg">
      <div className="mb-4 md:mb-0">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Clipverse Admin Panel</h1>
        <p className="text-md md:text-lg text-gray-400 mt-1">
          Monitor campaigns, creators, and system health in real time.
        </p>
        <p className="text-sm text-gray-500 mt-2">Logged in as: <span className="font-semibold text-indigo-400">Super Admin</span></p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:flex md:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Rocket className="h-5 w-5 text-indigo-400" />
          <div>
            <p className="text-sm text-gray-400">Active Campaigns</p>
            <p className="text-lg font-bold text-white">{metrics.activeCampaigns}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-sm text-gray-400">Creators</p>
            <p className="text-lg font-bold text-white">{metrics.totalCreators.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-pink-400" />
          <div>
            <p className="text-sm text-gray-400">Brands</p>
            <p className="text-lg font-bold text-white">{metrics.totalBrands.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-400" />
          <div>
            <p className="text-sm text-gray-400">Total Payouts</p>
            <p className="text-lg font-bold text-white">${metrics.totalPayouts.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;