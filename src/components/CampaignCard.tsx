"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Instagram, Youtube, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Campaign {
  id: string;
  brandName: string;
  headline: string;
  platforms: ('TikTok' | 'Instagram' | 'YouTube Shorts')[];
  payout: string;
  payoutValue: number; // For sorting/filtering
  payoutUnit: 'clip' | 'view' | 'fixed'; // For filtering
  deadline: string;
  deadlineDate: Date; // For sorting
  spotsLeft: number;
  status: 'Open' | 'Closing Soon' | 'Completed';
  brandLogo?: string; // Optional, using placeholder for now
}

interface CampaignCardProps {
  campaign: Campaign;
  isApplied: boolean; // New prop to indicate if the user has applied
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

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, isApplied }) => {
  const statusColor =
    campaign.status === 'Open'
      ? 'bg-green-500/20 text-green-400'
      : campaign.status === 'Closing Soon'
      ? 'bg-yellow-500/20 text-yellow-400'
      : 'bg-gray-500/20 text-gray-400';

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-bold text-white">{campaign.brandName}</CardTitle>
          <Badge className={`${statusColor} text-xs px-2 py-1 rounded-full`}>
            {campaign.status}
          </Badge>
        </div>
        <CardDescription className="text-gray-300 text-base">{campaign.headline}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {campaign.platforms.map((platform) => (
            <Badge key={platform} variant="secondary" className="bg-gray-700 text-gray-200 flex items-center">
              {getPlatformIcon(platform)}
              {platform}
            </Badge>
          ))}
        </div>
        <p className="text-lg font-semibold text-indigo-400 mb-2">{campaign.payout}</p>
        <p className="text-sm text-gray-400">
          Closes: <span className="font-medium text-gray-300">{campaign.deadline}</span>
        </p>
        {campaign.spotsLeft > 0 && (
          <p className="text-sm text-gray-400">
            Spots left: <span className="font-medium text-purple-400">{campaign.spotsLeft} creators</span>
          </p>
        )}
      </CardContent>
      <CardFooter>
        {isApplied ? (
          <Button asChild className="w-full bg-green-600/80 text-white font-semibold py-2 px-6 rounded-full shadow-lg cursor-not-allowed opacity-90" disabled>
            <span>Applied <CheckCircle className="ml-2 h-4 w-4 inline-block" /></span>
          </Button>
        ) : (
          <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to={`/campaigns/${campaign.id}`}>
              View Details <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;