"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Rocket, TrendingUp, Users } from "lucide-react";

interface BrandMetricsCardsProps {
  totalSpend: number;
  activeCampaigns: number;
  avgCostPerClip: number;
  totalReach: number;
}

const BrandMetricsCards: React.FC<BrandMetricsCardsProps> = ({
  totalSpend,
  activeCampaigns,
  avgCostPerClip,
  totalReach,
}) => {
  const metrics = [
    {
      title: "Total Spend",
      value: `$${totalSpend.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6 text-purple-400" />,
      description: "Across all campaigns",
    },
    {
      title: "Active Campaigns",
      value: activeCampaigns.toLocaleString(),
      icon: <Rocket className="h-6 w-6 text-indigo-400" />,
      description: "Currently running",
    },
    {
      title: "Avg. Cost per Clip",
      value: `$${avgCostPerClip.toFixed(2)}`,
      icon: <Users className="h-6 w-6 text-pink-400" />,
      description: "Average across approved clips",
    },
    {
      title: "Total Reach",
      value: `${(totalReach / 1000000).toFixed(1)}M Views`,
      icon: <TrendingUp className="h-6 w-6 text-green-400" />,
      description: "Estimated total views",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card
          key={metric.title}
          className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 flex flex-col justify-between animate-in fade-in-0 slide-in-from-bottom-8 duration-700"
          style={{ animationDelay: `${index * 100 + 200}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
            <CardTitle className="text-sm font-medium text-gray-300">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent className="px-0 py-0">
            <div className="text-3xl font-bold text-white">{metric.value}</div>
            <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BrandMetricsCards;