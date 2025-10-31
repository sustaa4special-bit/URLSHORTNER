"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, Percent, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";

interface TopCampaignRoi {
  campaign: string;
  roi: string;
  avgEngagement: string;
  budgetUsed: string;
}

interface SpendBreakdownDataPoint {
  name: string;
  tiktok: number;
  instagram: number;
  youtube: number;
}

interface BrandInsightsProps {
  topCampaignRoi: TopCampaignRoi[];
  spendBreakdown: SpendBreakdownDataPoint[];
}

const BrandInsights: React.FC<BrandInsightsProps> = ({ topCampaignRoi, spendBreakdown }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-bold text-white mb-4">Brand Insights</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-400" /> Top Campaign ROI
            </h3>
            {topCampaignRoi.length === 0 ? (
              <p className="text-gray-400">No campaigns with ROI data found yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Campaign</TableHead>
                      <TableHead className="text-gray-300">ROI</TableHead>
                      <TableHead className="text-gray-300">Avg. Engagement</TableHead>
                      <TableHead className="text-gray-300">Budget Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCampaignRoi.map((campaign, index) => (
                      <TableRow key={index} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                        <TableCell className="font-medium text-white">{campaign.campaign}</TableCell>
                        <TableCell className="text-green-400 font-semibold">{campaign.roi}</TableCell>
                        <TableCell className="text-gray-300">{campaign.avgEngagement}</TableCell>
                        <TableCell className="text-gray-300">{campaign.budgetUsed}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-indigo-400" /> Spend Breakdown by Platform
            </h3>
            {spendBreakdown.length === 0 || (spendBreakdown[0].tiktok === 0 && spendBreakdown[0].instagram === 0 && spendBreakdown[0].youtube === 0) ? (
              <p className="text-gray-400">No spend data available for platform breakdown.</p>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gray-700))" />
                    <XAxis type="number" stroke="hsl(var(--gray-400))" unit="%" />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--gray-400))" hide />
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                      contentStyle={{ backgroundColor: 'hsl(var(--gray-800))', border: '1px solid hsl(var(--gray-700))', borderRadius: '0.5rem' }}
                      itemStyle={{ color: 'hsl(var(--white))' }}
                      labelStyle={{ color: 'hsl(var(--gray-300))' }}
                    />
                    <Legend wrapperStyle={{ color: 'hsl(var(--gray-300))' }} />
                    <Bar dataKey="tiktok" stackId="a" fill="#61DAFB" name="TikTok" />
                    <Bar dataKey="instagram" stackId="a" fill="#E1306C" name="Instagram" />
                    <Bar dataKey="youtube" stackId="a" fill="#FF0000" name="YouTube Shorts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BrandInsights;