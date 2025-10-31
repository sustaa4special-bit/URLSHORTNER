"use client";

import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface AppliedCampaign {
  id: string;
  brandName: string;
  headline: string;
  payout: string;
  applicationDate: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Completed';
}

// Mock data for applied campaigns
const mockAppliedCampaigns: AppliedCampaign[] = [
  {
    id: "campaign-1",
    brandName: "Glowify Skincare",
    headline: "Create a skincare reel showing morning glow results",
    payout: "$25 per approved clip",
    applicationDate: "Oct 28, 2025",
    status: 'Pending Review',
  },
  {
    id: "campaign-3",
    brandName: "Blendr Energy",
    headline: "Showcase Blendr Energy drink in your workout routine",
    payout: "$15 per approved clip",
    applicationDate: "Oct 25, 2025",
    status: 'Approved',
  },
  {
    id: "campaign-6",
    brandName: "PetPal Treats",
    headline: "Show your pet enjoying our new healthy treats",
    payout: "$20 per approved clip",
    applicationDate: "Oct 20, 2025",
    status: 'Rejected',
  },
  {
    id: "campaign-4",
    brandName: "EcoWear Apparel",
    headline: "Sustainable fashion haul for your audience",
    payout: "$50 fixed fee",
    applicationDate: "Oct 15, 2025",
    status: 'Completed',
  },
];

const CreatorDashboardPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-in fade-in-0 slide-in-from-top-8 duration-700">
              Creator Dashboard
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-100">
              Manage your campaign applications and track your earnings.
            </p>
          </div>

          <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-200">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-2xl font-bold text-white">Your Applied Campaigns</CardTitle>
              <CardDescription className="text-gray-400">
                Here's a summary of the campaigns you've applied for.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              {mockAppliedCampaigns.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  You haven't applied to any campaigns yet.{" "}
                  <Link to="/explore-campaigns" className="text-indigo-400 hover:underline">
                    Explore campaigns
                  </Link> to get started!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Brand</TableHead>
                        <TableHead className="text-gray-300">Campaign</TableHead>
                        <TableHead className="text-gray-300">Payout</TableHead>
                        <TableHead className="text-gray-300">Applied On</TableHead>
                        <TableHead className="text-gray-300 text-center">Status</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAppliedCampaigns.map((campaign) => {
                        let statusColor = '';
                        switch (campaign.status) {
                          case 'Approved':
                            statusColor = 'bg-green-500/20 text-green-400';
                            break;
                          case 'Pending Review':
                            statusColor = 'bg-yellow-500/20 text-yellow-400';
                            break;
                          case 'Rejected':
                            statusColor = 'bg-red-500/20 text-red-400';
                            break;
                          case 'Completed':
                            statusColor = 'bg-blue-500/20 text-blue-400';
                            break;
                          default:
                            statusColor = 'bg-gray-500/20 text-gray-400';
                        }

                        return (
                          <TableRow key={campaign.id} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                            <TableCell className="font-medium text-white">{campaign.brandName}</TableCell>
                            <TableCell className="text-gray-300">{campaign.headline}</TableCell>
                            <TableCell className="text-indigo-400">{campaign.payout}</TableCell>
                            <TableCell className="text-gray-400">{campaign.applicationDate}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={`${statusColor} text-xs px-2 py-1 rounded-full`}>
                                {campaign.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button asChild variant="ghost" size="sm" className="text-indigo-400 hover:bg-gray-700 hover:text-white">
                                <Link to={`/campaigns/${campaign.id}`}>
                                  View <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/explore-campaigns">
                Explore More Campaigns <ArrowRight className="ml-2 h-5 w-5 inline-block" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatorDashboardPage;