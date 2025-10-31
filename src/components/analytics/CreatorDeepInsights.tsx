"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Video, TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";

interface MostProfitableCampaign {
  campaign: string;
  totalEarned: number;
  clips: number;
  avgViews: string;
}

interface CreatorDeepInsightsProps {
  mostProfitableCampaigns: MostProfitableCampaign[];
  topPlatform: string;
}

const CreatorDeepInsights: React.FC<CreatorDeepInsightsProps> = ({ mostProfitableCampaigns, topPlatform }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-bold text-white mb-4">Creator Deep Insights</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-400" /> Most Profitable Campaigns
            </h3>
            {mostProfitableCampaigns.length === 0 ? (
              <p className="text-gray-400">No profitable campaigns found yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Campaign</TableHead>
                      <TableHead className="text-gray-300">Total Earned</TableHead>
                      <TableHead className="text-gray-300">Clips</TableHead>
                      <TableHead className="text-gray-300">Avg. Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mostProfitableCampaigns.map((campaign, index) => (
                      <TableRow key={index} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                        <TableCell className="font-medium text-white">{campaign.campaign}</TableCell>
                        <TableCell className="text-green-400 font-semibold">${campaign.totalEarned.toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">{campaign.clips}</TableCell>
                        <TableCell className="text-gray-300">{campaign.avgViews}K</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-indigo-400" /> Top Performing Platform
            </h3>
            <Badge className="bg-indigo-600 text-white text-lg px-4 py-2 rounded-full flex items-center justify-center w-fit">
              <TrendingUp className="h-5 w-5 mr-2" /> {topPlatform}
            </Badge>
            <p className="text-gray-400 text-sm mt-2">
              Focus your efforts where your content thrives the most.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreatorDeepInsights;