"use client";

interface AppliedCampaign {
  id: string;
  brandName: string;
  headline: string;
  payout: string;
  payoutValue: number;
  applicationDate: Date;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Completed';
}

const LOCAL_STORAGE_KEY = "clipverse_applied_campaigns";

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
  },
  {
    id: "campaign-4",
    brandName: "EcoWear Apparel",
    headline: "Sustainable fashion haul for your audience",
    payout: "$50 fixed fee",
    payoutValue: 50,
    applicationDate: new Date("2025-10-15"),
    status: 'Completed',
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

export const addAppliedCampaign = (campaign: Omit<AppliedCampaign, 'applicationDate' | 'status'>) => {
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

export const updateAppliedCampaignStatus = (campaignId: string, newStatus: AppliedCampaign['status']) => {
  if (typeof window === "undefined") {
    return;
  }
  const currentCampaigns = getAppliedCampaigns();
  const updatedCampaigns = currentCampaigns.map(campaign =>
    campaign.id === campaignId ? { ...campaign, status: newStatus } : campaign
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCampaigns));
};