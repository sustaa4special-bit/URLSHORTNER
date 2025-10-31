"use client";

import { addPayoutTransaction } from "./walletData"; // Import the new function

interface AppliedCampaign {
  id: string;
  brandName: string;
  headline: string;
  payout: string;
  payoutValue: number;
  applicationDate: Date;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Completed' | 'Submitted' | 'Under Manual Review'; // Added 'Under Manual Review'
  clipUrl?: string;
  submittedPlatform?: 'TikTok' | 'Instagram' | 'YouTube Shorts'; // New field
  verificationReason?: string; // New field for rejected status
}

const LOCAL_STORAGE_KEY = "clipverse_applied_campaigns";
const LOCAL_STORAGE_EARNINGS_KEY = "clipverse_total_earnings"; // Key for total earnings

// Mock data to initialize if localStorage is empty
const defaultAppliedCampaigns: AppliedCampaign[] = [
  {
    id: "campaign-1",
    brandName: "Glowify Skincare",
    headline: "Create a skincare reel showing morning glow results",
    payout: "$25 per approved clip",
    payoutValue: 25,
    applicationDate: new Date("2025-10-28"),
    status: 'Pending Review',
  },
  {
    id: "campaign-3",
    brandName: "Blendr Energy",
    headline: "Showcase Blendr Energy drink in your workout routine",
    payout: "$15 per approved clip",
    payoutValue: 15,
    applicationDate: new Date("2025-10-25"),
    status: 'Approved',
  },
  {
    id: "campaign-6",
    brandName: "PetPal Treats",
    headline: "Show your pet enjoying our new healthy treats",
    payout: "$20 per approved clip",
    payoutValue: 20,
    applicationDate: new Date("2025-10-20"),
    status: 'Rejected',
    verificationReason: 'Post is not public',
  },
  {
    id: "campaign-4",
    brandName: "EcoWear Apparel",
    headline: "Sustainable fashion haul for your audience",
    payout: "$50 fixed fee",
    payoutValue: 50,
    applicationDate: new Date("2025-10-15"),
    status: 'Completed',
    clipUrl: 'https://instagram.com/p/example_ecowear',
    submittedPlatform: 'Instagram',
  },
];

export const getAppliedCampaigns = (): AppliedCampaign[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const storedCampaigns = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCampaigns) {
      const parsedCampaigns: AppliedCampaign[] = JSON.parse(storedCampaigns).map((campaign: any) => ({
        ...campaign,
        applicationDate: new Date(campaign.applicationDate),
      }));
      return parsedCampaigns;
    }
  } catch (error) {
    console.error("Failed to parse applied campaigns from localStorage:", error);
  }
  // Initialize with default data if localStorage is empty or invalid
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultAppliedCampaigns));
  return defaultAppliedCampaigns;
};

export const addAppliedCampaign = (campaign: Omit<AppliedCampaign, 'applicationDate' | 'status' | 'clipUrl' | 'submittedPlatform' | 'verificationReason'>) => {
  if (typeof window === "undefined") {
    return;
  }
  const currentCampaigns = getAppliedCampaigns();
  const newApplication: AppliedCampaign = {
    ...campaign,
    applicationDate: new Date(),
    status: 'Pending Review', // Default status for new applications
  };
  const updatedCampaigns = [...currentCampaigns, newApplication];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCampaigns));
};

export const isCampaignApplied = (campaignId: string): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  const campaigns = getAppliedCampaigns();
  return campaigns.some(c => c.id === campaignId);
};

export const getAppliedCampaignById = (campaignId: string): AppliedCampaign | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }
  const campaigns = getAppliedCampaigns();
  return campaigns.find(c => c.id === campaignId);
};


export const updateAppliedCampaign = (
  campaignId: string,
  updates: Partial<Omit<AppliedCampaign, 'id' | 'brandName' | 'headline' | 'payout' | 'payoutValue' | 'applicationDate'>>
) => {
  if (typeof window === "undefined") {
    return;
  }
  const currentCampaigns = getAppliedCampaigns();
  const updatedCampaigns = currentCampaigns.map(campaign =>
    campaign.id === campaignId ? { ...campaign, ...updates } : campaign
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCampaigns));
};

export const simulateVerification = (campaignId: string, clipUrl: string, platform: AppliedCampaign['submittedPlatform'], payoutValue: number, campaignHeadline: string, brandName: string) => {
  if (typeof window === "undefined") {
    return;
  }

  // First, update the campaign to 'Submitted' with clip details
  updateAppliedCampaign(campaignId, {
    status: 'Submitted',
    clipUrl: clipUrl,
    submittedPlatform: platform,
    verificationReason: undefined, // Clear any previous reason
  });

  // Simulate API call delay
  setTimeout(() => {
    const random = Math.random();
    let newStatus: AppliedCampaign['status'];
    let payoutStatus: PayoutStatus;
    let reason: string | undefined;

    if (random < 0.6) { // 60% chance of approval
      newStatus = 'Approved';
      payoutStatus = 'Approved';
      // Add payout transaction
      addPayoutTransaction({
        campaignId,
        campaignHeadline,
        amount: payoutValue,
        platform: platform!,
        status: 'Approved',
      });
      // Simulate adding to wallet (this is now handled by addPayoutTransaction implicitly via getWalletSummary)
      // For useWallet hook, we still update total earnings directly for consistency with its current implementation
      const currentEarnings = parseFloat(localStorage.getItem(LOCAL_STORAGE_EARNINGS_KEY) || '0');
      localStorage.setItem(LOCAL_STORAGE_EARNINGS_KEY, (currentEarnings + payoutValue).toFixed(2));

    } else if (random < 0.8) { // 20% chance of manual review
      newStatus = 'Under Manual Review';
      payoutStatus = 'Pending';
      reason = 'Content requires manual review for authenticity.';
      // Add pending payout transaction
      addPayoutTransaction({
        campaignId,
        campaignHeadline,
        amount: payoutValue,
        platform: platform!,
        status: 'Pending',
      });
    } else { // 20% chance of rejection
      newStatus = 'Rejected';
      payoutStatus = 'Rejected';
      const reasons = [
        'Missing required hashtag #GlowifyMorningGlow',
        'Post is not public',
        'Views did not meet minimum threshold (expected >100)',
        'Content not aligned with campaign brief',
        'Product not clearly visible',
      ];
      reason = reasons[Math.floor(Math.random() * reasons.length)];
      // Add rejected payout transaction
      addPayoutTransaction({
        campaignId,
        campaignHeadline,
        amount: payoutValue,
        platform: platform!,
        status: 'Rejected',
        verificationReason: reason,
      });
    }

    updateAppliedCampaign(campaignId, {
      status: newStatus,
      verificationReason: reason,
    });

    // For demonstration, if approved, immediately set to completed after a short delay
    if (newStatus === 'Approved') {
      setTimeout(() => {
        updateAppliedCampaign(campaignId, { status: 'Completed' });
        // Also update the payout transaction to 'Paid Out' after completion
        const payouts = getPayoutTransactions();
        const payoutToUpdate = payouts.find(p => p.campaignId === campaignId && p.status === 'Approved');
        if (payoutToUpdate) {
          updatePayoutTransactionStatus(payoutToUpdate.id, 'Paid Out');
        }
      }, 3000); // Mark as completed after 3 seconds
    }

  }, 3000); // Simulate 3-second verification process
};