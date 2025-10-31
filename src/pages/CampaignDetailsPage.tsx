"use client";

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Instagram, Youtube, Video, DollarSign, CalendarDays, Users, CheckCircle, ArrowRight,
  AlertTriangle, XCircle, Hourglass, Info, Loader2
} from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CampaignApplicationForm from "@/components/CampaignApplicationForm";
import SubmitClipForm from "@/components/SubmitClipForm";
import CampaignStatsCard from "@/components/CampaignStatsCard";
import CampaignVerificationSteps from "@/components/CampaignVerificationSteps";
import { addAppliedCampaign, getAppliedCampaignById, isCampaignApplied, updateAppliedCampaign } from "@/utils/appliedCampaigns";
import { allAvailableCampaigns } from "@/utils/campaignData";

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
      return <Video className="h-4 w-4 mr-1" />;
  }
};

const CampaignDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const campaign = allAvailableCampaigns.find((c) => c.id === id);

  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isSubmitClipDialogOpen, setIsSubmitClipDialogOpen] = useState(false);
  const [creatorCampaignStatus, setCreatorCampaignStatus] = useState<'Not Applied' | 'Pending Review' | 'Approved' | 'Submitted' | 'Under Manual Review' | 'Completed' | 'Rejected'>('Not Applied');
  const [verificationReason, setVerificationReason] = useState<string | undefined>(undefined);
  const [submittedClipUrl, setSubmittedClipUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (campaign?.id) {
      const appliedCampaign = getAppliedCampaignById(campaign.id);
      if (appliedCampaign) {
        setCreatorCampaignStatus(appliedCampaign.status);
        setVerificationReason(appliedCampaign.verificationReason);
        setSubmittedClipUrl(appliedCampaign.clipUrl);
      } else {
        setCreatorCampaignStatus('Not Applied');
        setVerificationReason(undefined);
        setSubmittedClipUrl(undefined);
      }
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

  const campaignStatusColor =
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
    setCreatorCampaignStatus('Pending Review');
    setIsApplyDialogOpen(false);
  };

  const handleSubmitClipSuccess = () => {
    // The simulateVerification function already updates the status in localStorage
    // We just need to re-fetch the status to update the UI
    const updatedCampaign = getAppliedCampaignById(campaign.id);
    if (updatedCampaign) {
      setCreatorCampaignStatus(updatedCampaign.status);
      setVerificationReason(updatedCampaign.verificationReason);
      setSubmittedClipUrl(updatedCampaign.clipUrl);
    }
    setIsSubmitClipDialogOpen(false);
  };

  const getCreatorStatusBadge = () => {
    let colorClass = '';
    let icon = null;
    let text = '';

    switch (creatorCampaignStatus) {
      case 'Not Applied':
        return null;
      case 'Pending Review':
        colorClass = 'bg-yellow-500/20 text-yellow-400';
        icon = <Hourglass className="h-4 w-4 mr-1" />;
        text = 'Application Pending Review';
        break;
      case 'Approved':
        colorClass = 'bg-green-500/20 text-green-400';
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        text = 'Approved! Submit Your Clip';
        break;
      case 'Submitted':
        colorClass = 'bg-indigo-500/20 text-indigo-400';
        icon = <Loader2 className="h-4 w-4 mr-1 animate-spin" />;
        text = 'Clip Submitted, Verification Pending';
        break;
      case 'Under Manual Review':
        colorClass = 'bg-orange-500/20 text-orange-400';
        icon = <AlertTriangle className="h-4 w-4 mr-1" />;
        text = 'Under Manual Review';
        break;
      case 'Rejected':
        colorClass = 'bg-red-500/20 text-red-400';
        icon = <XCircle className="h-4 w-4 mr-1" />;
        text = 'Rejected';
        break;
      case 'Completed':
        colorClass = 'bg-blue-500/20 text-blue-400';
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        text = 'Campaign Completed & Paid';
        break;
    }

    return (
      <Badge className={`${colorClass} text-sm px-3 py-1 flex items-center justify-center w-full`}>
        {icon} {text}
      </Badge>
    );
  };

  const isApplied = creatorCampaignStatus !== 'Not Applied';
  const canSubmitClip = creatorCampaignStatus === 'Approved';
  const isVerificationInProgress = ['Submitted', 'Under Manual Review'].includes(creatorCampaignStatus);
  const isRejected = creatorCampaignStatus === 'Rejected';
  const isCompleted = creatorCampaignStatus === 'Completed';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <Link to="/explore-campaigns">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Campaign Info & Brief */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8 animate-in fade-in-0 slide-in-from-top-8 duration-700">
                <CardHeader className="px-0 pt-0 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-3xl md:text-4xl font-extrabold text-white">
                      {campaign.brandName}
                    </CardTitle>
                    <Badge className={`${campaignStatusColor} text-sm px-3 py-1 rounded-full`}>
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
                    <h3 className="text-2xl font-bold text-white mb-3">Campaign Overview</h3>
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
                        <span className="font-semibold">Campaign Status:</span> {campaign.status}
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
                      <li className="flex items-start">
                        <span className="mr-2 text-orange-400">⚠️</span> Post must be public and stay live for at least 7 days
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Verification Logic</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      After you submit your post URL, our system performs automated checks:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span> Post is public and accessible.
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span> Contains all required hashtags (e.g., #GlowifyMorningGlow).
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span> Uploaded on the correct platform (TikTok, Instagram, YouTube Shorts).
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span> Achieves a minimum view threshold (e.g., ≥ 100 views).
                      </li>
                    </ul>
                    <p className="text-gray-300 leading-relaxed mt-4">
                      Verification runs every 24 hours via platform APIs (TikTok/Instagram public metrics).
                      If all checks pass, your post status will change to "Approved". If any fail, it will be "Rejected" with a reason.
                      Borderline cases may enter "Under Manual Review" by our team. Approved posts move payout to your wallet instantly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Stats + Apply/Submit Box */}
            <div className="lg:col-span-1 space-y-8">
              <CampaignStatsCard
                totalBudget={7500}
                clipsApproved={238}
                avgCreatorPayout={27.40}
                engagementRate={6.8}
              />

              <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 animate-in fade-in-0 slide-in-from-right-8 duration-700 delay-500">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-2xl font-bold text-white mb-4">Your Status</CardTitle>
                  {getCreatorStatusBadge()}
                </CardHeader>
                <CardContent className="px-0 py-0 space-y-4">
                  {isRejected && verificationReason && (
                    <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-md text-sm flex items-center mt-4">
                      <Info className="h-4 w-4 mr-2" />
                      Reason: {verificationReason}
                    </div>
                  )}
                  {creatorCampaignStatus === 'Under Manual Review' && verificationReason && (
                    <div className="bg-orange-500/10 border border-orange-500 text-orange-300 p-3 rounded-md text-sm flex items-center mt-4">
                      <Info className="h-4 w-4 mr-2" />
                      Note: {verificationReason}
                    </div>
                  )}
                  {isCompleted && submittedClipUrl && (
                    <div className="mt-4">
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                        <a href={submittedClipUrl} target="_blank" rel="noopener noreferrer">
                          View Submitted Clip <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                        </a>
                      </Button>
                    </div>
                  )}

                  {!isApplied && (
                    <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 mt-6">
                          Join Campaign
                        </Button>
                      </DialogTrigger>
                      <CampaignApplicationForm
                        campaignId={campaign.id}
                        campaignHeadline={campaign.headline}
                        onClose={() => setIsApplyDialogOpen(false)}
                        onApplicationSuccess={handleApplicationSuccess}
                      />
                    </Dialog>
                  )}

                  {isApplied && !canSubmitClip && !isVerificationInProgress && !isRejected && !isCompleted && (
                    <Button asChild className="w-full bg-gray-700 text-gray-300 cursor-not-allowed font-semibold py-3 px-8 rounded-full text-lg shadow-lg mt-6" disabled>
                      <span>Application Pending...</span>
                    </Button>
                  )}

                  {canSubmitClip && (
                    <Dialog open={isSubmitClipDialogOpen} onOpenChange={setIsSubmitClipDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 mt-6">
                          Submit Your Clip
                        </Button>
                      </DialogTrigger>
                      <SubmitClipForm
                        campaignId={campaign.id}
                        campaignHeadline={campaign.headline}
                        campaignPayoutValue={campaign.payoutValue}
                        campaignBrandName={campaign.brandName} {/* Pass brandName */}
                        onClose={() => setIsSubmitClipDialogOpen(false)}
                        onSubmitSuccess={handleSubmitClipSuccess}
                      />
                    </Dialog>
                  )}

                  {isVerificationInProgress && (
                    <Button asChild className="w-full bg-indigo-600 text-white cursor-not-allowed font-semibold py-3 px-8 rounded-full text-lg shadow-lg mt-6" disabled>
                      <span>Verification in Progress...</span>
                    </Button>
                  )}

                  {isRejected && (
                    <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 mt-6">
                      <Link to="/explore-campaigns">
                        Explore Other Campaigns <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {isApplied && <CampaignVerificationSteps currentStatus={creatorCampaignStatus} />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignDetailsPage;