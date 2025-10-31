"use client";

import { getAppliedCampaigns } from "./appliedCampaigns";

export type PayoutStatus = 'Pending' | 'Approved' | 'Paid Out' | 'Rejected';
export type WithdrawalMethod = 'PayPal' | 'Bank Transfer' | 'Crypto (USDT)';
export type TransactionType = 'payout' | 'withdrawal';

export interface PayoutTransaction {
  id: string;
  campaignId: string;
  campaignHeadline: string;
  date: Date;
  amount: number;
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts';
  status: PayoutStatus;
  verificationReason?: string; // For rejected payouts
}

export interface WithdrawalTransaction {
  id: string;
  date: Date;
  amount: number;
  method: WithdrawalMethod;
  status: 'Pending' | 'Completed' | 'Failed';
}

const PAYOUT_TRANSACTIONS_KEY = "clipverse_payout_transactions";
const WITHDRAWAL_TRANSACTIONS_KEY = "clipverse_withdrawal_transactions";
const TOTAL_EARNINGS_KEY = "clipverse_total_earnings"; // From use-wallet.ts, but managed here for consistency
const TOTAL_WITHDRAWN_KEY = "clipverse_total_withdrawn";

// --- Initial Mock Data ---
const defaultPayoutTransactions: PayoutTransaction[] = [
  {
    id: "payout-1",
    campaignId: "campaign-1",
    campaignHeadline: "Create a skincare reel showing morning glow results",
    date: new Date("2025-10-25T10:00:00Z"),
    amount: 25.00,
    platform: 'TikTok',
    status: 'Approved',
  },
  {
    id: "payout-2",
    campaignId: "campaign-3",
    campaignHeadline: "Showcase Blendr Energy drink in your workout routine",
    date: new Date("2025-10-27T14:30:00Z"),
    amount: 15.00,
    platform: 'YouTube Shorts',
    status: 'Paid Out',
  },
  {
    id: "payout-3",
    campaignId: "campaign-2",
    campaignHeadline: "Review our new smart home device on Instagram",
    date: new Date("2025-10-29T09:00:00Z"),
    amount: 30.00,
    platform: 'Instagram',
    status: 'Pending', // This would be 'Submitted' in appliedCampaigns, but 'Pending' for payout
  },
  {
    id: "payout-4",
    campaignId: "campaign-4",
    campaignHeadline: "Sustainable fashion haul for your audience",
    date: new Date("2025-10-15T11:00:00Z"),
    amount: 50.00,
    platform: 'Instagram',
    status: 'Paid Out',
  },
  {
    id: "payout-5",
    campaignId: "campaign-6",
    campaignHeadline: "Show your pet enjoying our new healthy treats",
    date: new Date("2025-10-20T16:00:00Z"),
    amount: 20.00,
    platform: 'TikTok',
    status: 'Rejected',
    verificationReason: 'Post not public',
  },
  {
    id: "payout-6",
    campaignId: "campaign-7",
    campaignHeadline: "Streetwear lookbook featuring our new collection",
    date: new Date("2025-11-01T10:00:00Z"),
    amount: 60.00,
    platform: 'Instagram',
    status: 'Approved',
  },
  {
    id: "payout-7",
    campaignId: "campaign-8",
    campaignHeadline: "Share your mindfulness journey with our new app",
    date: new Date("2025-11-02T12:00:00Z"),
    amount: 0.02 * 5000, // Example: 5000 views
    platform: 'YouTube Shorts',
    status: 'Pending',
  },
];

const defaultWithdrawalTransactions: WithdrawalTransaction[] = [
  {
    id: "withdrawal-1",
    date: new Date("2025-10-28T18:00:00Z"),
    amount: 100.00,
    method: 'PayPal',
    status: 'Completed',
  },
  {
    id: "withdrawal-2",
    date: new Date("2025-10-18T12:00:00Z"),
    amount: 50.00,
    method: 'Bank Transfer',
    status: 'Completed',
  },
];

// --- Helper Functions ---
const getStoredData = <T>(key: string, defaultData: T[]): T[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored).map((item: any) => ({
        ...item,
        date: new Date(item.date),
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

let transactionCount = 0;
function genTransactionId() {
  transactionCount = (transactionCount + 1) % Number.MAX_SAFE_INTEGER;
  return `txn-${Date.now()}-${transactionCount}`;
}

// --- Payouts ---
export const getPayoutTransactions = (): PayoutTransaction[] => {
  return getStoredData(PAYOUT_TRANSACTIONS_KEY, defaultPayoutTransactions);
};

export const addPayoutTransaction = (payout: Omit<PayoutTransaction, 'id' | 'date'>) => {
  if (typeof window === "undefined") return;
  const currentPayouts = getPayoutTransactions();
  const newPayout: PayoutTransaction = {
    ...payout,
    id: genTransactionId(),
    date: new Date(),
  };
  setStoredData(PAYOUT_TRANSACTIONS_KEY, [...currentPayouts, newPayout]);
};

export const updatePayoutTransactionStatus = (payoutId: string, newStatus: PayoutStatus, verificationReason?: string) => {
  if (typeof window === "undefined") return;
  const currentPayouts = getPayoutTransactions();
  const updatedPayouts = currentPayouts.map(p =>
    p.id === payoutId ? { ...p, status: newStatus, verificationReason: verificationReason || p.verificationReason } : p
  );
  setStoredData(PAYOUT_TRANSACTIONS_KEY, updatedPayouts);
};

// --- Withdrawals ---
export const getWithdrawalTransactions = (): WithdrawalTransaction[] => {
  return getStoredData(WITHDRAWAL_TRANSACTIONS_KEY, defaultWithdrawalTransactions);
};

export const addWithdrawalTransaction = (withdrawal: Omit<WithdrawalTransaction, 'id' | 'date'>) => {
  if (typeof window === "undefined") return;
  const currentWithdrawals = getWithdrawalTransactions();
  const newWithdrawal: WithdrawalTransaction = {
    ...withdrawal,
    id: genTransactionId(),
    date: new Date(),
  };
  setStoredData(WITHDRAWAL_TRANSACTIONS_KEY, [...currentWithdrawals, newWithdrawal]);

  // Update total withdrawn
  const currentTotalWithdrawn = parseFloat(localStorage.getItem(TOTAL_WITHDRAWN_KEY) || '0');
  localStorage.setItem(TOTAL_WITHDRAWN_KEY, (currentTotalWithdrawn + newWithdrawal.amount).toFixed(2));
};

// --- Balance Calculations ---
export const getWalletSummary = () => {
  const payouts = getPayoutTransactions();
  const withdrawals = getWithdrawalTransactions();

  const totalApprovedPayouts = payouts
    .filter(p => p.status === 'Approved' || p.status === 'Paid Out')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPendingApproval = payouts
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaidOut = payouts
    .filter(p => p.status === 'Paid Out')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'Completed')
    .reduce((sum, w) => sum + w.amount, 0);

  // Lifetime earnings should be the sum of all approved/paid out payouts
  const lifetimeEarnings = totalApprovedPayouts;

  // Current balance is lifetime earnings minus completed withdrawals
  const currentBalance = lifetimeEarnings - totalWithdrawn;

  return {
    currentBalance: parseFloat(currentBalance.toFixed(2)),
    pendingApproval: parseFloat(totalPendingApproval.toFixed(2)),
    lifetimeEarnings: parseFloat(lifetimeEarnings.toFixed(2)),
    totalApprovedClips: payouts.filter(p => p.status === 'Approved' || p.status === 'Paid Out').length,
    totalRejectedClips: payouts.filter(p => p.status === 'Rejected').length,
  };
};

// --- Payout Schedule ---
export const getNextPayoutDate = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday

  let nextFriday = new Date(today);
  if (dayOfWeek <= 5) { // If today is Friday or before
    nextFriday.setDate(today.getDate() + (5 - dayOfWeek));
  } else { // If today is Saturday or Sunday
    nextFriday.setDate(today.getDate() + (5 + 7 - dayOfWeek));
  }
  nextFriday.setHours(17, 0, 0, 0); // Set to 5 PM local time
  return nextFriday;
};

// --- Mock Stats for Payout Stats Bar ---
export const getMockPayoutStats = () => {
  const payouts = getPayoutTransactions();
  const approvedOrPaid = payouts.filter(p => p.status === 'Approved' || p.status === 'Paid Out');
  const rejected = payouts.filter(p => p.status === 'Rejected');

  const totalApprovedClips = approvedOrPaid.length;
  const totalAppliedClips = payouts.length;

  const avgPayoutPerClip = totalApprovedClips > 0
    ? approvedOrPaid.reduce((sum, p) => sum + p.amount, 0) / totalApprovedClips
    : 0;

  const rejectionRate = totalAppliedClips > 0
    ? (rejected.length / totalAppliedClips) * 100
    : 0;

  // Mock values for fastest approval time and engagement rate
  const fastestApprovalTime = "6 hours"; // This would require more complex timestamp tracking
  const avgEngagementRate = 7.2; // This would come from actual campaign data

  return {
    totalApprovedClips,
    avgPayoutPerClip: parseFloat(avgPayoutPerClip.toFixed(2)),
    fastestApprovalTime,
    rejectionRate: parseFloat(rejectionRate.toFixed(1)),
    avgEngagementRate,
  };
};