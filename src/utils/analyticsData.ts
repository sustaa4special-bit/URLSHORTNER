"use client";

import { getAppliedCampaigns, AppliedCampaign } from "./appliedCampaigns";
import { getBrandCampaigns, BrandCampaign } from "./brandCampaignData";
import { getPayoutTransactions, getWithdrawalTransactions, PayoutTransaction, WithdrawalTransaction } from "./walletData";

export type AnalyticsView = 'Creator' | 'Brand';
export type DateRange = '7 Days' | '30 Days' | 'All Time' | 'Custom';

interface KpiMetric {
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
}

interface KpiData {
  engagementRate: KpiMetric;
  totalViews: KpiMetric;
  avgPayoutPerClip: KpiMetric;
  creatorRoi: KpiMetric;
}

interface EngagementDataPoint {
  date: string;
  engagement: number;
}

interface ViewsSubmissionsDataPoint {
  date: string;
  submissions: number;
  approvedPosts: number;
}

interface PayoutDistributionDataPoint {
  name: string;
  value: number;
  color: string;
}

interface MostProfitableCampaign {
  campaign: string;
  totalEarned: number;
  clips: number;
  avgViews: string;
}

interface TopCampaignRoi {
  campaign: string;
  roi: string;
  avgEngagement: string;
  budgetUsed: string;
}

interface SpendBreakdownDataPoint {
  name: string;
  tiktok: number;
  instagram: number;
  youtube: number;
}

export interface LiveInsight {
  id: string;
  timestamp: Date;
  message: string;
  type: 'positive' | 'neutral' | 'alert';
}

const LIVE_INSIGHTS_KEY = "clipverse_live_insights";

// --- Helper Functions ---
const getStoredData = <T>(key: string, defaultData: T[]): T[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored).map((item: any) => ({
        ...item,
        timestamp: item.timestamp ? new Date(item.timestamp) : undefined,
        date: item.date ? new Date(item.date) : undefined,
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

let insightIdCounter = 0;
function generateInsightId() {
  insightIdCounter = (insightIdCounter + 1) % Number.MAX_SAFE_INTEGER;
  return `live-insight-${Date.now()}-${insightIdCounter}`;
}

// --- Date Range Filtering Helper ---
const filterByDateRange = <T extends { date?: Date; timestamp?: Date }>(
  data: T[],
  dateRange: DateRange,
  dateField: keyof T = 'date' as keyof T
): T[] => {
  if (dateRange === 'All Time') {
    return data;
  }

  const now = new Date();
  let startDate = new Date();

  if (dateRange === '7 Days') {
    startDate.setDate(now.getDate() - 7);
  } else if (dateRange === '30 Days') {
    startDate.setDate(now.getDate() - 30);
  }
  // 'Custom' range would require start/end dates as parameters, omitted for simplicity

  return data.filter(item => {
    const itemDate = item[dateField];
    return itemDate instanceof Date && itemDate >= startDate && itemDate <= now;
  });
};

// --- KPI Data Generation ---
export const getKpiData = (view: AnalyticsView, dateRange: DateRange): KpiData => {
  const allBrandCampaigns = getBrandCampaigns();
  const allAppliedCampaigns = getAppliedCampaigns();
  const allPayoutTransactions = getPayoutTransactions();

  // Filter data based on dateRange (simplified for mock, real app would filter source data)
  const filteredBrandCampaigns = filterByDateRange(allBrandCampaigns, dateRange, 'startDate');
  const filteredPayoutTransactions = filterByDateRange(allPayoutTransactions, dateRange, 'date');

  // Mock previous period data for trend calculation
  const getTrend = (currentValue: number, baseValue: number, unit: string = '', isPercentage: boolean = false) => {
    const lastPeriodValue = baseValue * (1 + (Math.random() * 0.1 - 0.05)); // +/- 5%
    const diff = currentValue - lastPeriodValue;
    const percentageChange = (diff / lastPeriodValue) * 100;
    const direction = percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'neutral';
    const trendText = `${direction === 'up' ? '🔼' : direction === 'down' ? '🔽' : ''} ${Math.abs(percentageChange).toFixed(1)}% vs last period`;
    return {
      value: isPercentage ? `${currentValue.toFixed(1)}${unit}` : `${currentValue.toLocaleString()}${unit}`,
      trend: trendText,
      trendDirection: direction,
    };
  };

  if (view === 'Creator') {
    const totalApprovedPayouts = filteredPayoutTransactions
      .filter(p => p.status === 'Approved' || p.status === 'Paid Out')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalApprovedClips = filteredPayoutTransactions
      .filter(p => p.status === 'Approved' || p.status === 'Paid Out').length;

    const avgPayoutPerClip = totalApprovedClips > 0 ? totalApprovedPayouts / totalApprovedClips : 0;
    const totalCreatorViews = 150000 + Math.floor(Math.random() * 50000); // Mock creator views
    const engagementRate = 5.5 + Math.random() * 2; // Mock engagement rate
    const creatorRoi = 2.5 + Math.random() * 1.5; // Mock ROI

    return {
      engagementRate: getTrend(engagementRate, 6.5, '%', true),
      totalViews: getTrend(totalCreatorViews, 130000),
      avgPayoutPerClip: getTrend(avgPayoutPerClip, 25, '', false),
      creatorRoi: getTrend(creatorRoi, 3, 'x'),
    };
  } else { // Brand View
    const totalBrandSpend = filteredBrandCampaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalApprovedClips = filteredBrandCampaigns.reduce((sum, c) => sum + c.approvedClips, 0);
    const totalReach = filteredBrandCampaigns.reduce((sum, c) => sum + c.totalReach, 0);
    const avgEngagementRate = filteredBrandCampaigns.length > 0
      ? filteredBrandCampaigns.reduce((sum, c) => sum + c.engagementRate, 0) / filteredBrandCampaigns.length
      : 0;
    const avgCostPerClip = totalApprovedClips > 0 ? totalBrandSpend / totalApprovedClips : 0;
    const brandRoi = avgEngagementRate * 0.5 + (totalReach / 1000000) * 0.1; // Simplified mock ROI

    return {
      engagementRate: getTrend(avgEngagementRate, 7.0, '%', true),
      totalViews: getTrend(totalReach, 1200000),
      avgPayoutPerClip: getTrend(avgCostPerClip, 28, '', false),
      creatorRoi: getTrend(brandRoi, 3.5, 'x'),
    };
  }
};

// --- Graph Data Generation ---

export const getEngagementOverTimeData = (dateRange: DateRange): EngagementDataPoint[] => {
  const data: EngagementDataPoint[] = [];
  const today = new Date();
  let days = 30;
  if (dateRange === '7 Days') days = 7;
  // For 'All Time' or 'Custom', we'd need more sophisticated data generation or actual historical data.
  // For now, we'll cap at 30 days for mock.

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const engagement = 5 + Math.random() * 5; // Random engagement between 5% and 10%
    data.push({ date: dateString, engagement: parseFloat(engagement.toFixed(1)) });
  }
  return data;
};

export const getViewsSubmissionsData = (dateRange: DateRange): ViewsSubmissionsDataPoint[] => {
  const data: ViewsSubmissionsDataPoint[] = [];
  const allBrandCampaigns = getBrandCampaigns();
  const today = new Date();
  let days = 30;
  if (dateRange === '7 Days') days = 7;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Simulate daily submissions and approved posts
    const submissions = Math.floor(Math.random() * 20) + 5; // 5-25 submissions per day
    const approvedPosts = Math.floor(submissions * (0.7 + Math.random() * 0.2)); // 70-90% approval rate

    data.push({ date: dateString, submissions, approvedPosts });
  }
  return data;
};

export const getPayoutDistributionData = (view: AnalyticsView, dateRange: DateRange): PayoutDistributionDataPoint[] => {
  const allPayoutTransactions = getPayoutTransactions();
  const filteredPayouts = filterByDateRange(allPayoutTransactions, dateRange, 'date');

  const platformPayouts = filteredPayouts.reduce((acc, payout) => {
    acc[payout.platform] = (acc[payout.platform] || 0) + payout.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalPayout = Object.values(platformPayouts).reduce((sum, val) => sum + val, 0);

  if (totalPayout === 0) return [];

  const colors = {
    'TikTok': '#61DAFB', // Light Blue
    'Instagram': '#E1306C', // Pink
    'YouTube Shorts': '#FF0000', // Red
    'YouTube': '#FF0000', // Red
  };

  return Object.entries(platformPayouts).map(([platform, amount]) => ({
    name: platform,
    value: parseFloat(((amount / totalPayout) * 100).toFixed(1)),
    color: colors[platform as keyof typeof colors] || '#cccccc',
  }));
};

// --- AI-Style Insights Summary ---
export const getAiInsightsSummary = (view: AnalyticsView, kpiData: KpiData): string => {
  const { engagementRate, totalViews, avgPayoutPerClip, creatorRoi } = kpiData;

  let summary = "";

  if (view === 'Creator') {
    summary += `Your performance is strong! `;
    if (engagementRate.trendDirection === 'up') {
      summary += `You've seen a significant increase in engagement, up ${engagementRate.trend.split(' ')[1]} this period. `;
    } else if (engagementRate.trendDirection === 'down') {
      summary += `While engagement is down ${engagementRate.trend.split(' ')[1]}, there's an opportunity to optimize content strategy. `;
    }

    if (totalViews.trendDirection === 'up') {
      summary += `Your content reached ${totalViews.value} total views, a ${totalViews.trend.split(' ')[1]} increase. `;
    }

    if (avgPayoutPerClip.trendDirection === 'up') {
      summary += `Average earnings per clip are up, indicating higher value content. `;
    } else if (avgPayoutPerClip.trendDirection === 'down') {
      summary += `Consider reviewing campaign briefs to maximize your average payout per clip. `;
    }

    summary += `Overall, your creator ROI stands at ${creatorRoi.value}.`;

  } else { // Brand View
    summary += `Your campaigns are driving results. `;
    if (engagementRate.trendDirection === 'up') {
      summary += `Engagement across your campaigns is up ${engagementRate.trend.split(' ')[1]}, indicating strong creator alignment. `;
    } else if (engagementRate.trendDirection === 'down') {
      summary += `A slight dip in engagement (${engagementRate.trend.split(' ')[1]}) suggests reviewing recent campaign briefs. `;
    }

    if (totalViews.trendDirection === 'up') {
      summary += `Your brand achieved an impressive ${totalViews.value} total reach, a ${totalViews.trend.split(' ')[1]} increase. `;
    }

    if (avgPayoutPerClip.trendDirection === 'down') {
      summary += `Your average cost per approved clip is down, improving efficiency. `;
    } else if (avgPayoutPerClip.trendDirection === 'up') {
      summary += `Monitor your average cost per clip, which is up, to ensure budget efficiency. `;
    }

    summary += `Your overall campaign ROI is currently ${creatorRoi.value}.`;
  }

  return summary.trim();
};

// --- Creator Deep Insights ---
export const getCreatorDeepInsights = (dateRange: DateRange): { mostProfitableCampaigns: MostProfitableCampaign[], topPlatform: string } => {
  const allPayoutTransactions = getPayoutTransactions();
  const filteredPayouts = filterByDateRange(allPayoutTransactions, dateRange, 'date');

  const campaignSummary = filteredPayouts.reduce((acc, payout) => {
    if (!acc[payout.campaignId]) {
      acc[payout.campaignId] = {
        campaign: payout.campaignHeadline,
        totalEarned: 0,
        clips: 0,
        totalViews: 0, // Mock total views for creator
      };
    }
    acc[payout.campaignId].totalEarned += payout.amount;
    acc[payout.campaignId].clips += 1;
    acc[payout.campaignId].totalViews += (Math.random() * 50000) + 10000; // Mock views per clip
    return acc;
  }, {} as Record<string, Omit<MostProfitableCampaign, 'avgViews'> & { totalViews: number }>);

  const mostProfitableCampaigns = Object.values(campaignSummary)
    .map(c => ({
      ...c,
      avgViews: `${(c.totalViews / c.clips).toFixed(0)}`,
    }))
    .sort((a, b) => b.totalEarned - a.totalEarned)
    .slice(0, 5);

  const platformPayouts = filteredPayouts.reduce((acc, payout) => {
    acc[payout.platform] = (acc[payout.platform] || 0) + payout.amount;
    return acc;
  }, {} as Record<string, number>);

  const topPlatform = Object.entries(platformPayouts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

  return { mostProfitableCampaigns, topPlatform };
};

// --- Brand Insights ---
export const getBrandInsights = (dateRange: DateRange): { topCampaignRoi: TopCampaignRoi[], spendBreakdown: SpendBreakdownDataPoint[] } => {
  const allBrandCampaigns = getBrandCampaigns();
  const filteredBrandCampaigns = filterByDateRange(allBrandCampaigns, dateRange, 'startDate');

  const topCampaignRoi = filteredBrandCampaigns
    .map(c => ({
      campaign: c.headline,
      roi: `+${(c.engagementRate * 5).toFixed(0)}x`, // Simplified ROI
      avgEngagement: `${c.engagementRate.toFixed(1)}%`,
      budgetUsed: `${((c.spent / c.totalBudget) * 100).toFixed(0)}%`,
    }))
    .sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi))
    .slice(0, 5);

  const spendBreakdownMap = filteredBrandCampaigns.reduce((acc, campaign) => {
    campaign.platforms.forEach(platform => {
      acc[platform] = (acc[platform] || 0) + (campaign.spent / campaign.platforms.length); // Distribute spent across platforms
    });
    return acc;
  }, {} as Record<Platform, number>);

  const totalSpend = Object.values(spendBreakdownMap).reduce((sum, val) => sum + val, 0);

  const spendBreakdown: SpendBreakdownDataPoint[] = [{
    name: 'Total Spend',
    tiktok: totalSpend > 0 ? parseFloat(((spendBreakdownMap['TikTok'] || 0) / totalSpend * 100).toFixed(1)) : 0,
    instagram: totalSpend > 0 ? parseFloat(((spendBreakdownMap['Instagram'] || 0) / totalSpend * 100).toFixed(1)) : 0,
    youtube: totalSpend > 0 ? parseFloat(((spendBreakdownMap['YouTube Shorts'] || 0) / totalSpend * 100).toFixed(1)) : 0,
  }];

  return { topCampaignRoi, spendBreakdown };
};

// --- Live Insights Feed ---
export const getLiveInsightsFeed = (): LiveInsight[] => {
  return getStoredData(LIVE_INSIGHTS_KEY, []).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const addLiveInsight = (insight: Omit<LiveInsight, 'id' | 'timestamp'>) => {
  const currentInsights = getLiveInsightsFeed();
  const newInsight: LiveInsight = {
    ...insight,
    id: generateInsightId(),
    timestamp: new Date(),
  };
  setStoredData(LIVE_INSIGHTS_KEY, [newInsight, ...currentInsights].slice(0, 10)); // Keep last 10 insights
};

export const simulateLiveInsights = () => {
  const allBrandCampaigns = getBrandCampaigns();
  const allPayoutTransactions = getPayoutTransactions();

  if (Math.random() < 0.4) { // 40% chance for a new insight
    const insightTypes = ['engagement', 'approved', 'earnings', 'milestone'];
    const randomType = insightTypes[Math.floor(Math.random() * insightTypes.length)];

    let message = "";
    let type: LiveInsight['type'] = 'neutral';

    if (randomType === 'engagement' && allBrandCampaigns.length > 0) {
      const campaign = allBrandCampaigns[Math.floor(Math.random() * allBrandCampaigns.length)];
      message = `⚡ ${campaign.brandName} campaign engagement rate just crossed ${campaign.engagementRate.toFixed(1)}%!`;
      type = 'positive';
    } else if (randomType === 'approved' && allBrandCampaigns.length > 0) {
      const campaign = allBrandCampaigns[Math.floor(Math.random() * allBrandCampaigns.length)];
      const newClips = Math.floor(Math.random() * 5) + 1;
      message = `📈 ${campaign.headline} campaign has ${newClips} new approved clips!`;
      type = 'positive';
    } else if (randomType === 'earnings' && allPayoutTransactions.length > 0) {
      const payout = allPayoutTransactions[Math.floor(Math.random() * allPayoutTransactions.length)];
      message = `💰 Creator @${payout.campaignId.replace('campaign-', 'creator-')} just earned $${payout.amount.toFixed(2)} for ${payout.campaignHeadline.split(' ')[0]}!`;
      type = 'positive';
    } else if (randomType === 'milestone') {
      const milestones = [
        "🎉 Clipverse reached 1.5M total views today!",
        "🌟 New creator milestone: 1000th approved clip!",
        "🚀 Brand 'EcoWear Apparel' launched a new campaign!",
      ];
      message = milestones[Math.floor(Math.random() * milestones.length)];
      type = 'positive';
    }

    if (message) {
      addLiveInsight({ message, type });
    }
  }
};

// --- Export & Share Options (Mock) ---
export const downloadCsv = (data: any[], filename: string) => {
  console.log(`Simulating CSV download for ${filename}.csv with data:`, data);
  showSuccess(`Downloading ${filename}.csv... (simulated)`);
  // In a real app, you'd convert data to CSV string and trigger download
};

export const exportPdf = (data: any[], filename: string) => {
  console.log(`Simulating PDF export for ${filename}.pdf with data:`, data);
  showSuccess(`Exporting ${filename}.pdf... (simulated)`);
  // In a real app, you'd use a library like jsPDF or send to a backend service
};

export const sharePublicReport = (reportUrl: string) => {
  console.log(`Simulating sharing public report: ${reportUrl}`);
  showSuccess(`Public report link copied to clipboard! (simulated)`);
  // In a real app, this would generate a shareable link and copy to clipboard
};