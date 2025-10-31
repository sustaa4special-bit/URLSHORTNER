"use client";

import { getBrandCampaigns, updateBrandCampaign, BrandCampaign, Platform } from "./brandCampaignData";
import { getAppliedCampaigns, updateAppliedCampaign, AppliedCampaign } from "./appliedCampaigns";
import { getPayoutTransactions, getWithdrawalTransactions, updatePayoutTransactionStatus, addPayoutTransaction, addWithdrawalTransaction, PayoutTransaction, WithdrawalTransaction, PayoutStatus } from "./walletData";

export type AdminLogType = 'Verification' | 'Withdrawal' | 'System' | 'Fraud Alert';
export type FraudReason = 'Duplicate Clip Hash' | 'Unusual Engagement Spike' | 'Non-Public Account' | 'Multiple Campaigns Same Clip';

export interface AdminLog {
  id: string;
  timestamp: Date;
  type: AdminLogType;
  message: string;
  details?: any;
}

export interface FraudAlert {
  id: string;
  timestamp: Date;
  reason: FraudReason;
  creatorId?: string; // Link to creator if applicable
  campaignId?: string; // Link to campaign if applicable
  clipUrl?: string;
  status: 'Pending Review' | 'Reviewed' | 'Dismissed';
}

// --- Local Storage Keys ---
const ADMIN_LOGS_KEY = "clipverse_admin_logs";
const FRAUD_ALERTS_KEY = "clipverse_fraud_alerts";
const ADMIN_METRICS_KEY = "clipverse_admin_metrics"; // For quick stats

// --- Initial Mock Data ---
const defaultAdminLogs: AdminLog[] = [
  { id: "log-1", timestamp: new Date("2025-10-29T10:41:12Z"), type: 'Verification', message: "✅ Verified post by @makeupbylana for Glowify Serum" },
  { id: "log-2", timestamp: new Date("2025-10-29T10:43:55Z"), type: 'Verification', message: "⚠️ Rejected post by @alex (missing hashtag)", details: { reason: "Missing required hashtag" } },
  { id: "log-3", timestamp: new Date("2025-10-28T10:48:22Z"), type: 'Withdrawal', message: "💰 Withdrawal approved: $120 to @shortsmax", details: { creator: "@shortsmax", amount: 120 } },
  { id: "log-4", timestamp: new Date("2025-10-27T10:50:10Z"), type: 'System', message: "🧠 Auto-check triggered for fraudulent metrics on campaign-2" },
];

const defaultFraudAlerts: FraudAlert[] = [
  { id: "fraud-1", timestamp: new Date("2025-10-29T09:00:00Z"), reason: 'Multiple Campaigns Same Clip', creatorId: 'creator-lana', campaignId: 'campaign-1', clipUrl: 'https://tiktok.com/lana/clip1', status: 'Pending Review' },
  { id: "fraud-2", timestamp: new Date("2025-10-28T14:00:00Z"), reason: 'Unusual Engagement Spike', campaignId: 'campaign-3', status: 'Pending Review' },
];

// --- Helper Functions for Local Storage ---
const getStoredData = <T>(key: string, defaultData: T[]): T[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
        date: item.date ? new Date(item.date) : undefined, // Handle date for transactions
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

let logIdCounter = defaultAdminLogs.length;
function generateLogId() {
  logIdCounter = (logIdCounter + 1) % Number.MAX_SAFE_INTEGER;
  return `log-${Date.now()}-${logIdCounter}`;
}

let fraudIdCounter = defaultFraudAlerts.length;
function generateFraudId() {
  fraudIdCounter = (fraudIdCounter + 1) % Number.MAX_SAFE_INTEGER;
  return `fraud-${Date.now()}-${fraudIdCounter}`;
}

// --- Admin Metrics (Quick Stats) ---
export const getAdminMetrics = () => {
  const campaigns = getBrandCampaigns();
  const appliedCampaigns = getAppliedCampaigns();
  const payouts = getPayoutTransactions();

  const activeCampaigns = campaigns.filter(c => c.status === 'Live').length;
  const totalCreators = new Set(appliedCampaigns.map(ac => ac.id)).size + 12000; // Mock base + applied
  const totalBrands = campaigns.length + 1300; // Mock base + created
  const totalPayouts = payouts.filter(p => p.status === 'Paid Out').reduce((sum, p) => sum + p.amount, 0);

  return {
    activeCampaigns,
    totalCreators,
    totalBrands,
    totalPayouts: parseFloat(totalPayouts.toFixed(2)),
  };
};

// --- Verification Queue ---
export const getVerificationQueue = (): AppliedCampaign[] => {
  const appliedCampaigns = getAppliedCampaigns();
  // Filter for submissions that are 'Submitted' or 'Under Manual Review'
  return appliedCampaigns.filter(ac => ['Submitted', 'Under Manual Review'].includes(ac.status));
};

export const approveVerification = (campaignId: string, creatorId: string) => {
  const appliedCampaign = getAppliedCampaigns().find(ac => ac.id === campaignId && ac.status === 'Submitted'); // Assuming creatorId is campaignId for simplicity
  if (appliedCampaign) {
    // Update applied campaign status for creator
    updateAppliedCampaign(campaignId, { status: 'Approved' });

    // Update the corresponding pending payout transaction to 'Approved'
    const payouts = getPayoutTransactions();
    const pendingPayout = payouts.find(p => p.campaignId === campaignId && p.status === 'Pending');
    if (pendingPayout) {
      updatePayoutTransactionStatus(pendingPayout.id, 'Approved');
    } else {
      // Fallback: if no pending payout, create one (shouldn't happen if recordCreatorSubmission works)
      addPayoutTransaction({
        campaignId: appliedCampaign.id,
        campaignHeadline: appliedCampaign.headline,
        amount: appliedCampaign.payoutValue,
        platform: appliedCampaign.submittedPlatform || 'TikTok', // Default if not set
        status: 'Approved',
      });
    }

    // Add to system logs
    addAdminLog({
      type: 'Verification',
      message: `✅ Approved post for campaign "${appliedCampaign.headline}" by creator (ID: ${creatorId})`,
      details: { campaignId, creatorId, status: 'Approved' },
    });
    return true;
  }
  return false;
};

export const rejectVerification = (campaignId: string, creatorId: string, reason: string) => {
  const appliedCampaign = getAppliedCampaigns().find(ac => ac.id === campaignId && ac.status === 'Submitted'); // Assuming creatorId is campaignId for simplicity
  if (appliedCampaign) {
    // Update applied campaign status for creator
    updateAppliedCampaign(campaignId, { status: 'Rejected', verificationReason: reason });

    // Update the corresponding pending payout transaction to 'Rejected'
    const payouts = getPayoutTransactions();
    const pendingPayout = payouts.find(p => p.campaignId === campaignId && p.status === 'Pending');
    if (pendingPayout) {
      updatePayoutTransactionStatus(pendingPayout.id, 'Rejected', reason);
    } else {
      // Fallback: if no pending payout, create one as rejected
      addPayoutTransaction({
        campaignId: appliedCampaign.id,
        campaignHeadline: appliedCampaign.headline,
        amount: appliedCampaign.payoutValue,
        platform: appliedCampaign.submittedPlatform || 'TikTok',
        status: 'Rejected',
        verificationReason: reason,
      });
    }

    // Add to system logs
    addAdminLog({
      type: 'Verification',
      message: `❌ Rejected post for campaign "${appliedCampaign.headline}" by creator (ID: ${creatorId}). Reason: ${reason}`,
      details: { campaignId, creatorId, status: 'Rejected', reason },
    });
    return true;
  }
  return false;
};

// --- Withdrawal Requests ---
export const getWithdrawalRequests = (): WithdrawalTransaction[] => {
  const withdrawals = getWithdrawalTransactions();
  return withdrawals.filter(w => w.status === 'Pending');
};

export const approveWithdrawal = (withdrawalId: string) => {
  const withdrawals = getWithdrawalTransactions();
  const withdrawal = withdrawals.find(w => w.id === withdrawalId && w.status === 'Pending');
  if (withdrawal) {
    const updatedWithdrawals = withdrawals.map(w =>
      w.id === withdrawalId ? { ...w, status: 'Completed' } : w
    );
    setStoredData(ADMIN_LOGS_KEY.replace('_logs', '_withdrawal_transactions'), updatedWithdrawals); // Update actual withdrawal data

    addAdminLog({
      type: 'Withdrawal',
      message: `💰 Withdrawal approved: $${withdrawal.amount.toFixed(2)} via ${withdrawal.method} (ID: ${withdrawalId})`,
      details: { withdrawalId, amount: withdrawal.amount, method: withdrawal.method, status: 'Completed' },
    });
    return true;
  }
  return false;
};

export const rejectWithdrawal = (withdrawalId: string, reason: string) => {
  const withdrawals = getWithdrawalTransactions();
  const withdrawal = withdrawals.find(w => w.id === withdrawalId && w.status === 'Pending');
  if (withdrawal) {
    const updatedWithdrawals = withdrawals.map(w =>
      w.id === withdrawalId ? { ...w, status: 'Failed', reason: reason } : w
    );
    setStoredData(ADMIN_LOGS_KEY.replace('_logs', '_withdrawal_transactions'), updatedWithdrawals); // Update actual withdrawal data

    addAdminLog({
      type: 'Withdrawal',
      message: `🚫 Withdrawal rejected: $${withdrawal.amount.toFixed(2)} via ${withdrawal.method} (ID: ${withdrawalId}). Reason: ${reason}`,
      details: { withdrawalId, amount: withdrawal.amount, method: withdrawal.method, status: 'Failed', reason },
    });
    return true;
  }
  return false;
};

// --- Campaign Overview ---
export const getAdminCampaignsSummary = () => {
  const campaigns = getBrandCampaigns();
  return campaigns.map(c => ({
    id: c.id,
    campaignName: c.headline,
    brandName: c.brandName,
    status: c.status,
    spent: c.spent,
    totalBudget: c.totalBudget,
    roi: c.engagementRate * 5, // Simplified ROI calculation for mock data
    platforms: c.platforms,
  }));
};

// --- System Logs ---
export const getSystemLogs = (): AdminLog[] => {
  return getStoredData(ADMIN_LOGS_KEY, defaultAdminLogs).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const addAdminLog = (log: Omit<AdminLog, 'id' | 'timestamp'>) => {
  const currentLogs = getSystemLogs();
  const newLog: AdminLog = {
    ...log,
    id: generateLogId(),
    timestamp: new Date(),
  };
  setStoredData(ADMIN_LOGS_KEY, [newLog, ...currentLogs].slice(0, 50)); // Keep last 50 logs
};

// --- Fraud Alerts ---
export const getFraudAlerts = (): FraudAlert[] => {
  return getStoredData(FRAUD_ALERTS_KEY, defaultFraudAlerts).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const addFraudAlert = (alert: Omit<FraudAlert, 'id' | 'timestamp' | 'status'>) => {
  const currentAlerts = getFraudAlerts();
  const newAlert: FraudAlert = {
    ...alert,
    id: generateFraudId(),
    timestamp: new Date(),
    status: 'Pending Review',
  };
  setStoredData(FRAUD_ALERTS_KEY, [newAlert, ...currentAlerts].slice(0, 20)); // Keep last 20 alerts
  addAdminLog({ type: 'Fraud Alert', message: `🚨 New Fraud Alert: ${alert.reason}`, details: alert });
};

export const updateFraudAlertStatus = (alertId: string, newStatus: FraudAlert['status']) => {
  const currentAlerts = getFraudAlerts();
  const updatedAlerts = currentAlerts.map(alert =>
    alert.id === alertId ? { ...alert, status: newStatus } : alert
  );
  setStoredData(FRAUD_ALERTS_KEY, updatedAlerts);
  addAdminLog({ type: 'Fraud Alert', message: `Fraud Alert (ID: ${alertId}) status updated to ${newStatus}`, details: { alertId, newStatus } });
};

// --- Simulation Logic for Admin Panel ---
export const simulateAdminActivity = () => {
  // Simulate new pending verifications
  const appliedCampaigns = getAppliedCampaigns();
  const pendingVerifications = appliedCampaigns.filter(ac => ac.status === 'Approved' && !ac.clipUrl); // Approved but not yet submitted
  if (pendingVerifications.length > 0 && Math.random() < 0.3) { // 30% chance to simulate a new submission
    const campaignToSubmit = pendingVerifications[Math.floor(Math.random() * pendingVerifications.length)];
    updateAppliedCampaign(campaignToSubmit.id, {
      status: 'Submitted',
      clipUrl: `https://tiktok.com/mockclip/${Math.random().toString(36).substring(7)}`,
      submittedPlatform: campaignToSubmit.platforms[0] || 'TikTok',
    });
    addAdminLog({ type: 'Verification', message: `🆕 New clip submitted for verification: "${campaignToSubmit.headline}"` });
  }

  // Simulate new pending withdrawals
  const payouts = getPayoutTransactions();
  const approvedPayouts = payouts.filter(p => p.status === 'Approved');
  if (approvedPayouts.length > 0 && Math.random() < 0.2) { // 20% chance to simulate a new withdrawal request
    const randomPayout = approvedPayouts[Math.floor(Math.random() * approvedPayouts.length)];
    addWithdrawalTransaction({
      amount: randomPayout.amount,
      method: Math.random() < 0.5 ? 'PayPal' : 'Bank Transfer',
      status: 'Pending',
    });
    addAdminLog({ type: 'Withdrawal', message: `💸 New withdrawal request for $${randomPayout.amount.toFixed(2)}` });
  }

  // Simulate fraud alerts
  if (Math.random() < 0.1) { // 10% chance for a new fraud alert
    const reasons: FraudReason[] = ['Duplicate Clip Hash', 'Unusual Engagement Spike', 'Non-Public Account', 'Multiple Campaigns Same Clip'];
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    addFraudAlert({
      reason: randomReason,
      creatorId: `creator-${Math.floor(Math.random() * 1000)}`,
      campaignId: `campaign-${Math.floor(Math.random() * 10)}`,
      clipUrl: `https://tiktok.com/fraudclip/${Math.random().toString(36).substring(7)}`,
    });
  }

  // Simulate general system logs
  if (Math.random() < 0.4) { // 40% chance for a general system log
    const messages = [
      "System health check passed.",
      "Database backup initiated.",
      "User login attempt from new IP.",
      "Campaign budget alert: 'Glowify Skincare' at 80% spent.",
    ];
    addAdminLog({ type: 'System', message: messages[Math.floor(Math.random() * messages.length)] });
  }
};