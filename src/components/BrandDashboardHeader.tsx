"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface BrandDashboardHeaderProps {
  onOpenCreateCampaign: () => void;
}

const BrandDashboardHeader: React.FC<BrandDashboardHeaderProps> = ({ onOpenCreateCampaign }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 animate-in fade-in-0 slide-in-from-top-8 duration-700">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
          Welcome back, <span className="text-indigo-400">Nova Cosmetics</span> 👋
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Here’s how your campaigns are performing this week.
        </p>
      </div>
      <Button
        onClick={onOpenCreateCampaign}
        className="mt-6 md:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <PlusCircle className="mr-2 h-5 w-5" /> Create New Campaign
      </Button>
    </div>
  );
};

export default BrandDashboardHeader;