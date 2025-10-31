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

// Mock data - In a real app, this would come from an API call
const allCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    brandName: "Glowify Skincare",
    headline: "Create a skincare reel showing morning glow results",
    description: "Glowify Skincare is looking for creators to showcase their new 'Radiant Glow Serum'. Create an authentic short-form video (TikTok) demonstrating your morning skincare routine, highlighting the serum's benefits and how it makes your skin feel. Focus on natural lighting and genuine reactions.",
    requirements: [
      "Minimum 15-second video",
      "Include #GlowifyRadiant and #SkincareRoutine",
      "Show product clearly in the video",
      "Positive and authentic tone",
      "Post within 7 days of campaign acceptance",
    ],
    platforms: ['TikTok'],
    payout: "$25 per approved clip",
    payoutValue: 25,
    payoutUnit: 'clip',
    deadline: "Nov 30, 2025",
    deadlineDate: new Date("2025-11-30"),
    spotsLeft: 12,
    status: 'Open',
  },
  {
    id: "campaign-2",
    brandName: "Nova Tech",
    headline: "Review our new smart home device on Instagram",
    description: "Nova Tech is launching its innovative 'Smart Hub Pro' and needs tech-savvy creators to provide honest reviews. Create an Instagram Reel or Story demonstrating the device's features, ease of use, and how it integrates into your smart home setup. Emphasize user experience and key functionalities.",
    requirements: [
      "Minimum 30-second video (Reel) or 3-5 stories",
      "Include #NovaSmartHub and #TechReview",
      "Demonstrate at least 3 key features",
      "Provide genuine feedback",
      "Post within 10 days of receiving product",
    ],
    platforms: ['Instagram'],
    payout: "$0.03 per view",
    payoutValue: 0.03,
    payoutUnit: 'view',
    deadline: "Dec 12, 2025",
    deadlineDate: new Date("2025-12-12"),
    spotsLeft: 5,
    status: 'Closing Soon',
  },
  {
    id: "campaign-3",
    brandName: "Blendr Energy",
    headline: "Showcase Blendr Energy drink in your workout routine",
    description: "Fuel your fitness with Blendr Energy! We're looking for energetic creators to integrate our new sugar-free energy drink into their workout or active lifestyle content. Show how Blendr gives you the boost you need to power through your day. Be creative and dynamic!",
    requirements: [
      "Minimum 20-second video",
      "Include #BlendrEnergy and #WorkoutFuel",
      "Visibly feature the Blendr Energy drink",
      "High-energy and motivating content",
      "Post within 5 days of campaign acceptance",
    ],
    platforms: ['TikTok', 'YouTube Shorts'],
    payout: "$15 per approved clip",
    payoutValue: 15,
    payoutUnit: 'clip',
    deadline: "Dec 5, 2025",
    deadlineDate: new Date("2025-12-05"),
    spotsLeft: 20,
    status: 'Open',
  },
  {
    id: "campaign-4",
    brandName: "EcoWear Apparel",
    headline: "Sustainable fashion haul for your audience",
    description: "EcoWear Apparel is committed to sustainable fashion. We want creators to highlight our latest eco-friendly collection in a fashion haul or 'get ready with me' style video. Showcase the comfort, style, and ethical production of our clothing. Inspire your audience to make conscious fashion choices.",
    requirements: [
      "Minimum 60-second video",
      "Include #EcoWearFashion and #SustainableStyle",
      "Feature at least 3 EcoWear items",
      "Discuss sustainability aspects",
      "Post within 14 days of receiving products",
    ],
    platforms: ['Instagram', 'TikTok'],
    payout: "$50 fixed fee",
    payoutValue: 50,
    payoutUnit: 'fixed',
    deadline: "Jan 15, 2026",
    deadlineDate: new Date("2026-01-15"),
    spotsLeft: 8,
    status: 'Open',
  },
  {
    id: "campaign-5",
    brandName: "GameSphere Studios",
    headline: "First look at our new indie game on YouTube Shorts",
    description: "GameSphere Studios is launching 'Pixel Quest', a retro-inspired adventure game. We're seeking gaming creators to provide a 'first look' or short gameplay highlight on YouTube Shorts. Showcase exciting moments, unique mechanics, and your initial impressions.",
    requirements: [
      "Minimum 30-second gameplay clip",
      "Include #PixelQuest and #IndieGame",
      "Showcase key gameplay features",
      "Enthusiastic and engaging commentary",
      "Post within 7 days of receiving early access code",
    ],
    platforms: ['YouTube Shorts'],
    payout: "$0.05 per view",
    payoutValue: 0.05,
    payoutUnit: 'view',
    deadline: "Dec 20, 2025",
    deadlineDate: new Date("2025-12-20"),
    spotsLeft: 15,
    status: 'Open',
  },
  {
    id: "campaign-6",
    brandName: "PetPal Treats",
    headline: "Show your pet enjoying our new healthy treats",
    description: "PetPal Treats introduces a new line of organic, healthy pet treats! We need adorable pet creators to capture their furry friends enjoying our treats. Focus on the pet's reaction, the natural ingredients, and the joy it brings. Cute and heartwarming content is key!",
    requirements: [
      "Minimum 15-second video",
      "Include #PetPalTreats and #HealthyPets",
      "Clearly show the pet enjoying the treat",
      "Highlight natural ingredients (optional voiceover)",
      "Post within 7 days of receiving treats",
    ],
    platforms: ['TikTok', 'Instagram'],
    payout: "$20 per approved clip",
    payoutValue: 20,
    payoutUnit: 'clip',
    deadline: "Nov 28, 2025",
    deadlineDate: new Date("2025-11-28"),
    spotsLeft: 3,
    status: 'Closing Soon',
  },
];

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
  const campaign = allCampaigns.find((c) => c.id === id);
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