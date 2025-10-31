"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { getAdminCampaignsSummary, BrandCampaign, CampaignStatus } from "@/utils/adminData";

interface AdminCampaignOverviewProps {
  onRefresh: () => void;
}

const AdminCampaignOverview: React.FC<AdminCampaignOverviewProps> = ({ onRefresh }) => {
  const [campaigns, setCampaigns] = useState<
    (BrandCampaign & { campaignName: string; roi: number })[]
  >([]);
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | 'All'>('All');
  const [filterPlatform, setFilterPlatform] = useState<string | 'All'>('All');

  useEffect(() => {
    setCampaigns(getAdminCampaignsSummary());
  }, [onRefresh]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesStatus = filterStatus === 'All' || campaign.status === filterStatus;
      const matchesPlatform = filterPlatform === 'All' || campaign.platforms.includes(filterPlatform as Platform);
      return matchesStatus && matchesPlatform;
    });
  }, [campaigns, filterStatus, filterPlatform]);

  // Chart Data: Active vs Completed Campaigns
  const campaignStatusData = useMemo(() => {
    const statusCounts = campaigns.reduce((acc, campaign) => {
      acc[campaign.status] = (acc[campaign.status] || 0) + 1;
      return acc;
    }, {} as Record<CampaignStatus, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [campaigns]);

  const PIE_COLORS = {
    'Live': '#82ca9d', // Green
    'Paused': '#ffc658', // Yellow
    'Completed': '#8884d8', // Purple
  };

  // Chart Data: Total Budget vs Spent (Top 5 campaigns by budget)
  const budgetSpentData = useMemo(() => {
    return campaigns
      .sort((a, b) => b.totalBudget - a.totalBudget)
      .slice(0, 5)
      .map(campaign => ({
        name: campaign.campaignName,
        spent: campaign.spent,
        remaining: campaign.totalBudget - campaign.spent,
      }));
  }, [campaigns]);

  const allPlatforms = useMemo(() => {
    const platforms = new Set<string>();
    campaigns.forEach(c => c.platforms.forEach(p => platforms.add(p)));
    return Array.from(platforms);
  }, [campaigns]);

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'Live':
        return <Badge className="bg-green-500/20 text-green-400">Live</Badge>;
      case 'Paused':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Paused</Badge>;
      case 'Completed':
        return <Badge className="bg-gray-500/20 text-gray-400">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white mb-6">Campaign Overview</h2>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-xl font-bold text-white">Campaign Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] px-0 py-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={campaignStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {campaignStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as CampaignStatus] || '#cccccc'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--gray-800))', border: '1px solid hsl(var(--gray-700))', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'hsl(var(--white))' }}
                  labelStyle={{ color: 'hsl(var(--gray-300))' }}
                />
                <Legend wrapperStyle={{ color: 'hsl(var(--gray-300))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-xl font-bold text-white">Top Campaigns: Budget vs Spent</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] px-0 py-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetSpentData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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

      {/* Campaign Summary Table */}
      <Card className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-700 shadow-xl">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-bold text-white mb-4">Campaign Summary</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterStatus} onValueChange={(value: CampaignStatus | 'All') => setFilterStatus(value)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="All" className="hover:bg-gray-700 focus:bg-gray-700">All Statuses</SelectItem>
                <SelectItem value="Live" className="hover:bg-gray-700 focus:bg-gray-700">Live</SelectItem>
                <SelectItem value="Paused" className="hover:bg-gray-700 focus:bg-gray-700">Paused</SelectItem>
                <SelectItem value="Completed" className="hover:bg-gray-700 focus:bg-gray-700">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPlatform} onValueChange={(value: string | 'All') => setFilterPlatform(value)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by Platform" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="All" className="hover:bg-gray-700 focus:bg-gray-700">All Platforms</SelectItem>
                {allPlatforms.map(platform => (
                  <SelectItem key={platform} value={platform} className="hover:bg-gray-700 focus:bg-gray-700">{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        {filteredCampaigns.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No campaigns found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Campaign</TableHead>
                  <TableHead className="text-gray-300">Brand</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Spent</TableHead>
                  <TableHead className="text-gray-300">Budget</TableHead>
                  <TableHead className="text-gray-300">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                    <TableCell className="font-medium text-white">{campaign.campaignName}</TableCell>
                    <TableCell className="text-gray-300">{campaign.brandName}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell className="text-gray-300">${campaign.spent.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-300">${campaign.totalBudget.toLocaleString()}</TableCell>
                    <TableCell className="text-green-400 font-semibold">+{campaign.roi.toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminCampaignOverview;