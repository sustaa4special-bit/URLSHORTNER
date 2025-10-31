"use client";

import React, { useState, useEffect } from "react"; // Import useEffect
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Instagram, Youtube, Video, DollarSign, CalendarDays, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CampaignApplicationForm from "@/components/CampaignApplicationForm";
import { addAppliedCampaign, isCampaignApplied } from "@/utils/appliedCampaigns"; // Import utility functions
import { allAvailableCampaigns } from "@/utils/campaignData"; // Import the centralized campaign data

interface Campaign {
  id: string;
  brandName: string;
  headline: string;
  description: string;
  requirements: string[];
  platforms: ('TikTok' | 'Instagram' | 'YouTube Shorts')[];
  payout: string;
  payoutValue: number;
  payoutUnit: 'clip' | 'view' | 'fixed';
  deadline: string;
  deadlineDate: Date;
  spotsLeft: number;
  status: 'Open' | 'Closing Soon' | 'Completed';
  brandLogo?: string;
}

const getPlatformIcon = (platform: 'TikTok' | 'Instagram' | 'YouTube Shorts') => {
  switch (platform) {
    case 'Instagram':
      return <Instagram className="h-4 w-4 mr-1" />;
    case 'YouTube Shorts':
      return <Youtube className="h-4 w-4 mr-1" />;
    case 'TikTok':
    default:
      return <Video className="h-4 w-4 mr-1" />; // Generic video icon for TikTok
  }
};

const CampaignDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const campaign = allAvailableCampaigns.find((c) => c.id === id); // Use centralized data
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (campaign?.id) {
      setHasApplied(isCampaignApplied(campaign.id));
    }
  }, [campaign?.id]);

  if (!campaign) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6">
          <h1 className="text-4xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-lg text-gray-400 mb-8">
            The campaign you are looking for does not exist or has been removed.
          </p>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/explore-campaigns">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Campaigns
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const statusColor =
    campaign.status === 'Open'
      ? 'bg-green-500/20 text-green-400'
      : campaign.status === 'Closing Soon'
      ? 'bg-yellow-500/20 text-yellow-400'
      : 'bg-gray-500/20 text-gray-400';

  const handleApplicationSuccess = () => {
    addAppliedCampaign({
      id: campaign.id,
      brandName: campaign.brandName,
      headline: campaign.headline,
      payout: campaign.payout,
      payoutValue: campaign.payoutValue,
    });
    setHasApplied(true);
    setIsDialogOpen(false); // Close dialog after successful application
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <Link to="/explore-campaigns">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
              </Link>
            </Button>
          </div>

          <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8">
            <CardHeader className="px-0 pt-0 pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-3xl md:text-4xl font-extrabold text-white">
                  {campaign.brandName}
                </CardTitle>
                <Badge className={`${statusColor} text-sm px-3 py-1 rounded-full`}>
                  {campaign.status}
                </Badge>
              </div>
              <CardDescription className="text-xl text-gray-300">
                {campaign.headline}
              </CardDescription>
            </CardHeader>

            <Separator className="bg-gray-700 my-6" />

            <CardContent className="px-0 py-0 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Campaign Brief</h3>
                <p className="text-gray-300 leading-relaxed">{campaign.description}</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Key Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-indigo-400" />
                    <span className="font-semibold">Payout:</span> {campaign.payout}
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-purple-400" />
                    <span className="font-semibold">Deadline:</span> {campaign.deadline}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-pink-400" />
                    <span className="font-semibold">Spots Left:</span> {campaign.spotsLeft} creators
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    <span className="font-semibold">Status:</span> {campaign.status}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Platforms</h3>
                <div className="flex flex-wrap gap-3">
                  {campaign.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary" className="bg-gray-700 text-gray-200 text-base px-3 py-1 flex items-center">
                      {getPlatformIcon(platform)}
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {campaign.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-indigo-400">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                {hasApplied ? (
                  <Button asChild className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                    <Link to="/creator-dashboard">
                      View Application Status <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                    </Link>
                  </Button>
                ) : (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <CampaignApplicationForm
                      campaignId={campaign.id}
                      campaignHeadline={campaign.headline}
                      onClose={() => setIsDialogOpen(false)}
                      onApplicationSuccess={handleApplicationSuccess}
                    />
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignDetailsPage;