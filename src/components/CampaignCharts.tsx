"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { BrandCampaign } from "@/utils/brandCampaignData";

interface CampaignChartsProps {
  campaigns: BrandCampaign[];
}

const CampaignCharts: React.FC<CampaignChartsProps> = ({ campaigns }) => {
  // Data for Approved Clips Over Time (simplified for demonstration)
  const approvedClipsData = useMemo(() => {
    const dataMap = new Map<string, number>(); // Date string -> total approved clips

    campaigns.forEach(campaign => {
      // For simplicity, we'll just use the current approved clips and spread them over a few "recent" days
      // In a real app, this would come from historical data points
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const clipsForDay = Math.floor(campaign.approvedClips / 7) + (i === 0 ? campaign.approvedClips % 7 : 0); // Distribute clips
        dataMap.set(dateString, (dataMap.get(dateString) || 0) + clipsForDay);
      }
    });

    const sortedData = Array.from(dataMap.entries())
      .map(([date, clips]) => ({ date, clips }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedData;
  }, [campaigns]);

  // Data for Budget Spent vs Remaining
  const budgetData = useMemo(() => {
    return campaigns.map(campaign => ({
      name: campaign.headline,
      spent: campaign.spent,
      remaining: campaign.totalBudget - campaign.spent,
    }));
  }, [campaigns]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Approved Clips Over Time Chart */}
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 animate-in fade-in-0 slide-in-from-left-8 duration-700 delay-500">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-xl font-bold text-white">Approved Clips Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] px-0 py-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={approvedClipsData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gray-700))" />
              <XAxis dataKey="date" stroke="hsl(var(--gray-400))" />
              <YAxis stroke="hsl(var(--gray-400))" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--gray-800))', border: '1px solid hsl(var(--gray-700))', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'hsl(var(--white))' }}
                labelStyle={{ color: 'hsl(var(--gray-300))' }}
              />
              <Line type="monotone" dataKey="clips" stroke="hsl(var(--indigo-400))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Spent vs Remaining Chart */}
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 animate-in fade-in-0 slide-in-from-right-8 duration-700 delay-600">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-xl font-bold text-white">Budget Spent vs Remaining</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] px-0 py-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gray-700))" />
              <XAxis dataKey="name" stroke="hsl(var(--gray-400))" />
              <YAxis stroke="hsl(var(--gray-400))" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--gray-800))', border: '1px solid hsl(var(--gray-700))', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'hsl(var(--white))' }}
                labelStyle={{ color: 'hsl(var(--gray-300))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--gray-300))' }} />
              <Bar dataKey="spent" fill="hsl(var(--purple-600))" name="Spent" />
              <Bar dataKey="remaining" fill="hsl(var(--indigo-600))" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCharts;