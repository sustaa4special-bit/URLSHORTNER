"use client";

import React, { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog components
import SubmitClipForm from "@/components/SubmitClipForm"; // Import new component
import { ArrowRight, Filter, Search, XCircle, DollarSign, CheckCircle, Clock } from "lucide-react"; // Added icons
import { getAppliedCampaigns } from "@/utils/appliedCampaigns";

interface AppliedCampaign {
  id: string;
  brandName: string;
  headline: string;
  payout: string;
  payoutValue: number;
  applicationDate: Date;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Completed' | 'Submitted';
  clipUrl?: string;
}

const CreatorDashboardPage = () => {
  const [appliedCampaigns, setAppliedCampaigns] = useState<AppliedCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest Application");
  const [isSubmitClipDialogOpen, setIsSubmitClipDialogOpen] = useState(false);
  const [selectedCampaignForSubmission, setSelectedCampaignForSubmission] = useState<AppliedCampaign | null>(null);


  const allStatuses = ['Pending Review', 'Approved', 'Rejected', 'Completed', 'Submitted'];

  useEffect(() => {
    setAppliedCampaigns(getAppliedCampaigns());
  }, []);

  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatuses([]);
    setSortBy("Newest Application");
    setAppliedCampaigns(getAppliedCampaigns());
  };

  const handleClipSubmissionSuccess = () => {
    setAppliedCampaigns(getAppliedCampaigns()); // Refresh campaigns after submission
    setIsSubmitClipDialogOpen(false);
    setSelectedCampaignForSubmission(null);
  };

  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = appliedCampaigns.filter((campaign) => {
      const matchesSearch = searchTerm
        ? campaign.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.payout.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesStatus =
        selectedStatuses.length > 0
          ? selectedStatuses.includes(campaign.status)
          : true;

      return matchesSearch && matchesStatus;
    });

    if (sortBy === "Newest Application") {
      filtered.sort((a, b) => b.applicationDate.getTime() - a.applicationDate.getTime());
    } else if (sortBy === "Oldest Application") {
      filtered.sort((a, b) => a.applicationDate.getTime() - b.applicationDate.getTime());
    } else if (sortBy === "Highest Payout") {
      filtered.sort((a, b) => b.payoutValue - a.payoutValue);
    }

    return filtered;
  }, [appliedCampaigns, searchTerm, selectedStatuses, sortBy]);

  // Dashboard Summary Calculations
  const totalEarnings = appliedCampaigns
    .filter(c => c.status === 'Completed')
    .reduce((sum, c) => sum + c.payoutValue, 0);

  const pendingPayouts = appliedCampaigns
    .filter(c => c.status === 'Approved' || c.status === 'Submitted')
    .reduce((sum, c) => sum + c.payoutValue, 0);

  const activeCampaigns = appliedCampaigns.filter(c => c.status === 'Approved' || c.status === 'Submitted').length;


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
            <div className="relative max-w-xl mx-auto mb-8">
              <Input
                type="text"
                placeholder="Search your applied campaigns..."
                className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 py-3 pl-10 pr-4 rounded-full shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 animate-in fade-in-0 zoom-in-95 duration-700 delay-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-200">
            <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Total Earnings</CardTitle>
                <CardDescription className="text-4xl font-extrabold text-indigo-400">${totalEarnings.toFixed(2)}</CardDescription>
              </div>
              <DollarSign className="h-10 w-10 text-indigo-500 opacity-70" />
            </Card>
            <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Pending Payouts</CardTitle>
                <CardDescription className="text-4xl font-extrabold text-purple-400">${pendingPayouts.toFixed(2)}</CardDescription>
              </div>
              <Clock className="h-10 w-10 text-purple-500 opacity-70" />
            </Card>
            <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Active Campaigns</CardTitle>
                <CardDescription className="text-4xl font-extrabold text-green-400">{activeCampaigns}</CardDescription>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500 opacity-70" />
            </Card>
          </div>

          {/* Filter and Sort Bar */}
          <div className="bg-gray-900/70 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-800 shadow-lg mb-12 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Filter className="h-6 w-6 mr-3 text-indigo-400" /> Filters & Sort
              </h2>
              <Button variant="ghost" onClick={handleResetFilters} className="text-gray-400 hover:text-white hover:bg-gray-700">
                <XCircle className="h-4 w-4 mr-2" /> Reset Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div>
                <Label className="text-gray-300 mb-2 block">Status</Label>
                <div className="space-y-2">
                  {allStatuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
                      />
                      <Label htmlFor={`status-${status}`} className="text-gray-200 cursor-pointer">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <Label className="text-gray-300 mb-2 block">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="Newest Application" className="hover:bg-gray-700 focus:bg-gray-700">Newest Application</SelectItem>
                    <SelectItem value="Oldest Application" className="hover:bg-gray-700 focus:bg-gray-700">Oldest Application</SelectItem>
                    <SelectItem value="Highest Payout" className="hover:bg-gray-700 focus:bg-gray-700">Highest Payout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-400">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-2xl font-bold text-white">Your Applied Campaigns</CardTitle>
              <CardDescription className="text-gray-400">
                Here's a summary of the campaigns you've applied for.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              {filteredAndSortedCampaigns.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No campaigns found matching your criteria.{" "}
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
                      {filteredAndSortedCampaigns.map((campaign) => {
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
                          case 'Submitted':
                            statusColor = 'bg-indigo-500/20 text-indigo-400';
                            break;
                          default:
                            statusColor = 'bg-gray-500/20 text-gray-400';
                        }

                        return (
                          <TableRow key={campaign.id} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                            <TableCell className="font-medium text-white">{campaign.brandName}</TableCell>
                            <TableCell className="text-gray-300">{campaign.headline}</TableCell>
                            <TableCell className="text-indigo-400">{campaign.payout}</TableCell>
                            <TableCell className="text-gray-400">{campaign.applicationDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={`${statusColor} text-xs px-2 py-1 rounded-full`}>
                                {campaign.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {campaign.status === 'Approved' ? (
                                <Dialog open={isSubmitClipDialogOpen && selectedCampaignForSubmission?.id === campaign.id} onOpenChange={setIsSubmitClipDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-400 hover:bg-gray-700 hover:text-white"
                                      onClick={() => setSelectedCampaignForSubmission(campaign)}
                                    >
                                      Submit Clip
                                    </Button>
                                  </DialogTrigger>
                                  {selectedCampaignForSubmission && (
                                    <SubmitClipForm
                                      campaignId={selectedCampaignForSubmission.id}
                                      campaignHeadline={selectedCampaignForSubmission.headline}
                                      onClose={() => setIsSubmitClipDialogOpen(false)}
                                      onSubmitSuccess={handleClipSubmissionSuccess}
                                    />
                                  )}
                                </Dialog>
                              ) : campaign.status === 'Submitted' || campaign.status === 'Completed' ? (
                                <Button asChild variant="ghost" size="sm" className="text-blue-400 hover:bg-gray-700 hover:text-white">
                                  <a href={campaign.clipUrl} target="_blank" rel="noopener noreferrer">
                                    View Clip <ArrowRight className="ml-1 h-4 w-4" />
                                  </a>
                                </Button>
                              ) : (
                                <Button asChild variant="ghost" size="sm" className="text-indigo-400 hover:bg-gray-700 hover:text-white">
                                  <Link to={`/campaigns/${campaign.id}`}>
                                    View <ArrowRight className="ml-1 h-4 w-4" />
                                  </Link>
                                </Button>
                              )}
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