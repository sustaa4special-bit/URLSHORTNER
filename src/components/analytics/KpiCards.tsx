"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus, TrendingUp, DollarSign, Users, Percent } from "lucide-react";
import { motion } from "framer-motion";

interface KpiMetric {
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
}

interface KpiData {
  engagementRate: KpiMetric;
  totalViews: KpiMetric;
  avgPayoutPerClip: KpiMetric;
  creatorRoi: KpiMetric;
}

interface KpiCardsProps {
  kpiData: KpiData;
}

const KpiCards: React.FC<KpiCardsProps> = ({ kpiData }) => {
  const metrics = [
    {
      title: "Engagement Rate",
      value: kpiData.engagementRate.value,
      trend: kpiData.engagementRate.trend,
      trendDirection: kpiData.engagementRate.trendDirection,
      icon: <Percent className="h-6 w-6 text-purple-400" />,
    },
    {
      title: "Total Views",
      value: kpiData.totalViews.value,
      trend: kpiData.totalViews.trend,
      trendDirection: kpiData.totalViews.trendDirection,
      icon: <Users className="h-6 w-6 text-indigo-400" />,
    },
    {
      title: "Avg. Payout per Clip",
      value: `$${kpiData.avgPayoutPerClip.value}`,
      trend: kpiData.avgPayoutPerClip.trend,
      trendDirection: kpiData.avgPayoutPerClip.trendDirection,
      icon: <DollarSign className="h-6 w-6 text-pink-400" />,
    },
    {
      title: "Creator ROI",
      value: kpiData.creatorRoi.value,
      trend: kpiData.creatorRoi.trend,
      trendDirection: kpiData.creatorRoi.trendDirection,
      icon: <TrendingUp className="h-6 w-6 text-green-400" />,
    },
  ];

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-400" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-400" />;
      case 'neutral': return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'neutral': return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
          className="relative rounded-xl overflow-hidden"
        >
          <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 flex flex-col justify-between h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
              <CardTitle className="text-sm font-medium text-gray-300">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent className="px-0 py-0 mt-4">
              <div className="text-3xl font-bold text-white">{metric.value}</div>
              <p className={`text-xs mt-1 flex items-center ${getTrendColor(metric.trendDirection)}`}>
                {getTrendIcon(metric.trendDirection)} {metric.trend}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default KpiCards;