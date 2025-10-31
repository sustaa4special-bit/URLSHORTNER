"use client";

import { allAvailableCampaigns } from "./campaignData"; // Re-using campaign data structure
import { addPayoutTransaction, PayoutTransaction } from "./walletData"; // To link brand payouts to creator wallets

export type CampaignStatus = 'Live' | 'Paused' | 'Completed';
export type Platform = 'TikTok' | 'Instagram' | 'YouTube Shorts';
export type PayoutUnit = 'clip' | 'view' | 'fixed';

export interface BrandCampaign {
  id: string;
  brandName: string;
  headline: string;
  description: string;
  platforms: Platform[];
  payoutPerClip: number; // Simplified to per clip for brand side
  totalBudget: number;
  startDate: Date;
  endDate: Date;
  hashtags: string[];
  mentions: string[];
  brandLogoUrl?: string;
  productImageUrl?: string;
  status: CampaignStatus;
  // Simulated real-time metrics
  spent: number;
  approvedClips: number;
  engagementRate: number; // Percentage
  totalReach: number; // Simulated views
  submissions: number; // Total creator submissions
}

const BRAND_CAMPAIGNS_KEY = "clipverse_brand_campaigns";

// Initial mock data for brand campaigns
const defaultBrandCampaigns: BrandCampaign[] = [
  {
    id: "brand-campaign-1",
    brandName: "Glowify Skincare",
    headline: "Create a skincare reel showing morning glow results",
    description: "Glowify Skincare is looking for creators to showcase their new 'Radiant Glow Serum'. Create an authentic short-form video (TikTok) demonstrating your morning skincare routine, highlighting the serum's benefits and how it makes your skin feel. Focus on natural lighting and genuine reactions.",
    platforms: ['TikTok'],
    payoutPerClip: 25,
    totalBudget: 7500,
    startDate: new Date("2025-10-01"),
    endDate: new Date("2025-11-30"),
    hashtags: ["GlowifyRadiant", "SkincareRoutine"],
    mentions: ["@glowifyskincare"],
    brandLogoUrl: "/placeholder.svg",
    productImageUrl: "/placeholder.svg",
    status: 'Live',
    spent: 5920,
    approvedClips: 238,
    engagementRate: 6.8,
    totalReach: 1240000,
    submissions: 280,
  },
  {
    id: "brand-campaign-2",
    brandName: "Blendr Energy",
    headline: "Showcase Blendr Energy drink in your workout routine",
    description: "Fuel your fitness with Blendr Energy! We're looking for energetic creators to integrate our new sugar-free energy drink into their workout or active lifestyle content. Show how Blendr gives you the boost you need to power through your day. Be creative and dynamic!",
    platforms: ['TikTok', 'YouTube Shorts'],
    payoutPerClip: 15,
    totalBudget: 5000,
    startDate: new Date("2025-09-15"),
    endDate: new Date("2025-12-05"),
    hashtags: ["BlendrEnergy", "WorkoutFuel"],
    mentions: ["@blendr_official"],
    brandLogoUrl: "/placeholder.svg",
    productImageUrl: "/placeholder.svg",
    status: 'Paused',
    spent: 4410,
    approvedClips: 184,
    engagementRate: 5.2,
    totalReach: 850000,
    submissions: 200,
  },
  {
    id: "brand-campaign-3",
    brandName: "Nova Tech",
    headline: "Review our new smart home device on Instagram",
    description: "Nova Tech is launching its innovative 'Smart Hub Pro' and needs tech-savvy creators to provide honest reviews. Create an Instagram Reel or Story demonstrating the device's features, ease of use, and how it integrates into your smart home setup. Emphasize user experience and key functionalities.",
    platforms: ['Instagram'],
    payoutPerClip: 30,
    totalBudget: 9200,
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-10-31"),
    hashtags: ["NovaSmartHub", "TechReview"],
    mentions: ["@novatech_official"],
    brandLogoUrl: "/placeholder.svg",
    productImageUrl: "/placeholder.svg",
    status: 'Completed',
    spent: 9200,
    approvedClips: 312,
    engagementRate: 7.1,
    totalReach: 1500000,
    submissions: 350,
  },
  {
    id: "brand-campaign-4",
    brandName: "Zen Drinks",
    headline: "Mindful moments with Zen Drinks",
    description: "Zen Drinks is looking for creators to share their mindful moments featuring our new calming beverages. Create content that promotes relaxation and well-being.",
    platforms: ['TikTok', 'Instagram'],
    payoutPerClip: 20,
    totalBudget: 4800,
    startDate: new Date("2025-11-01"),
    endDate: new Date("2026-01-15"),
    hashtags: ["ZenDrinks", "MindfulMoments"],
    mentions: ["@zendrinks"],
    brandLogoUrl: "/placeholder.svg",
    productImageUrl: "/placeholder.svg",
    status: 'Live',
    spent: 1200,
    approvedClips: 47,
    engagementRate: 8.3,
    totalReach: 320000,
    submissions: 60,
  },
];

// Helper to get data from localStorage or initialize with defaults
const getStoredData = <T>(key: string, defaultData: T[]): T[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored).map((item: any) => ({
        ...item,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
      }));
    }
  } catch (error) {
    console.error(`Failed to parse data from localStorage for key ${key}:`, error);
  }
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

const setStoredData = <T>(key: string, data: T[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

let campaignIdCounter = defaultBrandCampaigns.length;
function generateCampaignId() {
  campaignIdCounter++;
  return `brand-campaign-${campaignIdCounter}-${Date.now()}`;
}

// --- Public API for Brand Campaigns ---

export const getBrandCampaigns = (): BrandCampaign[] => {
  return getStoredData(BRAND_CAMPAIGNS_KEY, defaultBrandCampaigns);
};

export const getBrandCampaignById = (id: string): BrandCampaign | undefined => {
  return getBrandCampaigns().find(c => c.id === id);
};

export const addBrandCampaign = (newCampaign: Omit<BrandCampaign, 'id' | 'spent' | 'approvedClips' | 'engagementRate' | 'totalReach' | 'submissions' | 'status'>): BrandCampaign => {
  const currentCampaigns = getBrandCampaigns();
  const campaignWithDefaults: BrandCampaign = {
    ...newCampaign,
    id: generateCampaignId(),
    status: 'Live', // New campaigns start as Live
    spent: 0,
    approvedClips: 0,
    engagementRate: 0,
    totalReach: 0,
    submissions: 0,
  };
  setStoredData(BRAND_CAMPAIGNS_KEY, [...currentCampaigns, campaignWithDefaults]);
  return campaignWithDefaults;
};

export const updateBrandCampaign = (id: string, updates: Partial<BrandCampaign>): BrandCampaign | undefined => {
  const currentCampaigns = getBrandCampaigns();
  let updatedCampaign: BrandCampaign | undefined;
  const updatedList = currentCampaigns.map(campaign => {
    if (campaign.id === id) {
      updatedCampaign = { ...campaign, ...updates };
      // Ensure spent and approvedClips are recalculated if payoutPerClip changes
      if (updates.payoutPerClip !== undefined && updatedCampaign.approvedClips > 0) {
        updatedCampaign.spent = updatedCampaign.approvedClips * updatedCampaign.payoutPerClip;
      }
      // Auto-complete if budget is fully spent
      if (updatedCampaign.spent >= updatedCampaign.totalBudget && updatedCampaign.status === 'Live') {
        updatedCampaign.status = 'Completed';
      }
      return updatedCampaign;
    }
    return campaign;
  });
  setStoredData(BRAND_CAMPAIGNS_KEY, updatedList);
  return updatedCampaign;
};

export const deleteBrandCampaign = (id: string) => {
  const currentCampaigns = getBrandCampaigns();
  const updatedList = currentCampaigns.filter(campaign => campaign.id !== id);
  setStoredData(BRAND_CAMPAIGNS_KEY, updatedList);
};

export const getBrandDashboardMetrics = () => {
  const campaigns = getBrandCampaigns();
  const activeCampaigns = campaigns.filter(c => c.status === 'Live').length;
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalApprovedClips = campaigns.reduce((sum, c) => sum + c.approvedClips, 0);
  const avgCostPerClip = totalApprovedClips > 0 ? totalSpend / totalApprovedClips : 0;
  const totalReach = campaigns.reduce((sum, c) => sum + c.totalReach, 0);

  return {
    totalSpend: parseFloat(totalSpend.toFixed(2)),
    activeCampaigns,
    avgCostPerClip: parseFloat(avgCostPerClip.toFixed(2)),
    totalReach: parseFloat(totalReach.toFixed(0)),
  };
};

// --- Simulation Logic for Real-time Updates ---
export const simulateCampaignProgress = () => {
  const currentCampaigns = getBrandCampaigns();
  const updatedCampaigns = currentCampaigns.map(campaign => {
    if (campaign.status === 'Live') {
      const now = new Date();
      // Only simulate if campaign is active and not past its end date
      if (now >= campaign.startDate && now <= campaign.endDate) {
        // Simulate new submissions
        const newSubmissions = Math.floor(Math.random() * 3); // 0-2 new submissions
        campaign.submissions += newSubmissions;

        // Simulate new approved clips (a portion of new submissions)
        const newApprovedClips = Math.floor(Math.random() * (newSubmissions + 1)); // 0-X new approved clips
        campaign.approvedClips += newApprovedClips;

        // Update spent
        campaign.spent = campaign.approvedClips * campaign.payoutPerClip;

        // Simulate reach (e.g., 1000-5000 views per new approved clip)
        campaign.totalReach += newApprovedClips * (1000 + Math.floor(Math.random() * 4000));

        // Simulate engagement rate (slight fluctuations)
        campaign.engagementRate = Math.max(1, Math.min(10, campaign.engagementRate + (Math.random() * 0.5 - 0.25))); // +/- 0.25

        // Check if budget is exhausted
        if (campaign.spent >= campaign.totalBudget) {
          campaign.status = 'Completed';
          campaign.spent = campaign.totalBudget; // Cap spent at total budget
        }
      } else if (now > campaign.endDate && campaign.status === 'Live') {
        // If end date passed and still live, mark as completed
        campaign.status = 'Completed';
      }
    }
    return campaign;
  });
  setStoredData(BRAND_CAMPAIGNS_KEY, updatedCampaigns);
};

// This function is for the creator side to link a submission to a brand campaign
export const recordCreatorSubmission = (
  campaignId: string,
  creatorPayoutValue: number,
  creatorPlatform: Platform,
  campaignHeadline: string,
  brandName: string
) => {
  const currentCampaigns = getBrandCampaigns();
  const updatedCampaigns = currentCampaigns.map(campaign => {
    if (campaign.id === campaignId) {
      campaign.submissions += 1; // Increment total submissions
      // For simplicity, we'll assume a submission might lead to an approved clip here
      // In a real system, this would be more complex with verification
      // For now, we'll let simulateCampaignProgress handle approvedClips and spent
    }
    return campaign;
  });
  setStoredData(BRAND_CAMPAIGNS_KEY, updatedCampaigns);

  // Also add a pending payout transaction for the creator
  addPayoutTransaction({
    campaignId,
    campaignHeadline,
    amount: creatorPayoutValue,
    platform: creatorPlatform,
    status: 'Pending',
  });
};