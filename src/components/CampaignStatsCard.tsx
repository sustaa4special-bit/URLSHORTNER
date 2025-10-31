"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, Percent } from "lucide-react";

interface CampaignStatsCardProps {
  totalBudget: number;
  clipsApproved: number;
  avgCreatorPayout: number;
  engagementRate: number;
}

const CampaignStatsCard: React.FC<CampaignStatsCardProps> = ({
  totalBudget,
  clipsApproved,
  avgCreatorPayout,
  engagementRate,
}) => {
  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 animate-in fade-in-0 slide-in-from-right-8 duration-700 delay-300">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-2xl font-bold text-white">Campaign Stats</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-300">
            <DollarSign className="h-5 w-5 mr-2 text-indigo-400" /> Total Budget
          </div>
          <span className="font-semibold text-white">${totalBudget.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-300">
            <Users className="h-5 w-5 mr-2 text-purple-400" /> Clips Approved
          </div>
          <span className="font-semibold text-white">{clipsApproved.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-300">
            <DollarSign className="h-5 w-5 mr-2 text-pink-400" /> Avg. Creator Payout
          </div>
          <span className="font-semibold text-white">${avgCreatorPayout.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-300">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" /> Engagement Rate
          </div>
          <span className="font-semibold text-white">{engagementRate.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignStatsCard;