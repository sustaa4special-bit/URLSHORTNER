"use client";

import { getAppliedCampaigns } from "./appliedCampaigns";
import { getPayoutTransactions, getWithdrawalTransactions } from "./walletData";
import { showSuccess, showError } from "./toast";

export type UserRole = 'Creator' | 'Brand';
export type VerificationStatus = 'Not Submitted' | 'Pending Review' | 'Approved' | 'Rejected';
export type SocialPlatform = 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'Twitter' | 'Twitch';
export type PayoutMethodType = 'PayPal' | 'Bank Transfer' | 'Crypto (USDT)';

export interface SocialAccount {
  platform: SocialPlatform;
  handle: string;
  followers: number;
  connected: boolean;
}

export interface KycDetails {
  fullName: string;
  dob: Date;
  address: string;
  idFrontUrl?: string;
  idBackUrl?: string;
}

export interface PayoutMethod {
  type: PayoutMethodType;
  details: string; // e.g., email for PayPal, account number for bank, wallet address for crypto
}

export interface SecurityPreferences {
  twoFactorAuth: boolean;
  emailNotifications: boolean;
  campaignInviteAlerts: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  email: string;
  emailVerified: boolean;
  joinedDate: Date;
  profilePictureUrl: string;
  fullName: string;
  country: string;
  bio: string;
  timezone: string;
  language: string;
  kycStatus: VerificationStatus;
  kycDetails?: KycDetails;
  socialAccounts: SocialAccount[];
  payoutMethod?: PayoutMethod;
  securityPreferences: SecurityPreferences;
  passwordHash: string; // Mock password hash
  verificationReason?: string; // For rejected KYC
}

const USER_PROFILE_KEY = "clipverse_user_profile";
const MIN_FOLLOWERS_FOR_PAYOUT = 1000;

// --- Initial Mock Data ---
const defaultUserProfile: UserProfile = {
  id: "user-123",
  username: "beautyjen",
  role: "Creator",
  email: "jenna.smith@example.com",
  emailVerified: true,
  joinedDate: new Date("2024-03-15"),
  profilePictureUrl: "/placeholder.svg",
  fullName: "Jenna Smith",
  country: "United States",
  bio: "Beauty & lifestyle creator passionate about authentic content and connecting with my audience!",
  timezone: "America/New_York",
  language: "English",
  kycStatus: "Pending Review", // Initial status
  socialAccounts: [
    { platform: 'TikTok', handle: '@beautyjen', followers: 124600, connected: true },
    { platform: 'Instagram', handle: '@beautyjen_official', followers: 85200, connected: true },
    { platform: 'YouTube Shorts', handle: '@beautyjen_clips', followers: 31000, connected: true },
    { platform: 'Twitter', handle: '@beautyjen_x', followers: 15000, connected: true },
    { platform: 'Twitch', handle: '@beautyjen_live', followers: 0, connected: false }, // Not connected
  ],
  payoutMethod: {
    type: 'PayPal',
    details: 'jenna.smith@example.com',
  },
  securityPreferences: {
    twoFactorAuth: false,
    emailNotifications: true,
    campaignInviteAlerts: true,
  },
  passwordHash: "hashedpassword123", // Mock hash
};

// --- Helper to get/set data from localStorage ---
const getStoredUserProfile = (): UserProfile => {
  if (typeof window === "undefined") return defaultUserProfile;
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    if (stored) {
      const parsed: UserProfile = JSON.parse(stored);
      // Ensure dates are re-hydrated
      parsed.joinedDate = new Date(parsed.joinedDate);
      if (parsed.kycDetails?.dob) parsed.kycDetails.dob = new Date(parsed.kycDetails.dob);
      return parsed;
    }
  } catch (error) {
    console.error("Failed to parse user profile from localStorage:", error);
  }
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(defaultUserProfile));
  return defaultUserProfile;
};

const setStoredUserProfile = (profile: UserProfile) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  }
};

// --- Public API for User Data ---

export const getUserProfile = (): UserProfile => {
  return getStoredUserProfile();
};

export const updateUserProfile = (updates: Partial<UserProfile>): UserProfile => {
  const currentProfile = getStoredUserProfile();
  const updatedProfile = { ...currentProfile, ...updates };
  setStoredUserProfile(updatedProfile);
  return updatedProfile;
};

export const connectSocialAccount = (platform: SocialPlatform, handle: string, followers: number): UserProfile => {
  const currentProfile = getStoredUserProfile();
  const existingIndex = currentProfile.socialAccounts.findIndex(s => s.platform === platform);
  const newAccount: SocialAccount = { platform, handle, followers, connected: true };

  let updatedSocialAccounts;
  if (existingIndex !== -1) {
    updatedSocialAccounts = currentProfile.socialAccounts.map((s, i) =>
      i === existingIndex ? newAccount : s
    );
  } else {
    updatedSocialAccounts = [...currentProfile.socialAccounts, newAccount];
  }

  const updatedProfile = { ...currentProfile, socialAccounts: updatedSocialAccounts };
  setStoredUserProfile(updatedProfile);
  return updatedProfile;
};

export const disconnectSocialAccount = (platform: SocialPlatform): UserProfile => {
  const currentProfile = getStoredUserProfile();
  const updatedSocialAccounts = currentProfile.socialAccounts.map(s =>
    s.platform === platform ? { ...s, connected: false, handle: '', followers: 0 } : s
  );
  const updatedProfile = { ...currentProfile, socialAccounts: updatedSocialAccounts };
  setStoredUserProfile(updatedProfile);
  return updatedProfile;
};

export const submitKycVerification = (kycDetails: KycDetails): UserProfile => {
  const currentProfile = getStoredUserProfile();
  const updatedProfile = {
    ...currentProfile,
    kycStatus: 'Pending Review' as VerificationStatus,
    kycDetails: kycDetails,
    verificationReason: undefined,
  };
  setStoredUserProfile(updatedProfile);
  return updatedProfile;
};

export const updatePayoutMethod = (method: PayoutMethodType, details: string): UserProfile => {
  const currentProfile = getStoredUserProfile();
  const updatedProfile = {
    ...currentProfile,
    payoutMethod: { type: method, details },
  };
  setStoredUserProfile(updatedProfile);
  return updatedProfile;
};

export const updateSecurityPreferences = (preferences: SecurityPreferences): UserProfile => {
  const currentProfile = getStoredUserProfile();
  const updatedProfile = {
    ...currentProfile,
    securityPreferences: preferences,
  };
  setStoredUserProfile(updatedProfile);
  return updatedProfile;
};

export const changeUserPassword = (currentPassword: string, newPassword: string): boolean => {
  // In a real app, this would involve hashing and comparing with backend
  // For mock, we'll just simulate success
  if (currentPassword === "password123") { // Mock current password
    const currentProfile = getStoredUserProfile();
    const updatedProfile = { ...currentProfile, passwordHash: `hashed_${newPassword}` }; // Simulate new hash
    setStoredUserProfile(updatedProfile);
    return true;
  }
  return false;
};

export const deleteUserAccount = (): boolean => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_PROFILE_KEY);
    // Optionally clear other related data
    localStorage.removeItem("clipverse_applied_campaigns");
    localStorage.removeItem("clipverse_payout_transactions");
    localStorage.removeItem("clipverse_withdrawal_transactions");
    localStorage.removeItem("clipverse_total_earnings");
    localStorage.removeItem("clipverse_total_withdrawn");
    return true;
  }
  return false;
};

export const getCreatorStats = () => {
  const appliedCampaigns = getAppliedCampaigns();
  const payoutTransactions = getPayoutTransactions();

  const campaignsJoined = appliedCampaigns.length;
  const approvedPosts = appliedCampaigns.filter(c => c.status === 'Approved' || c.status === 'Completed').length;
  const totalEarned = payoutTransactions
    .filter(p => p.status === 'Approved' || p.status === 'Paid Out')
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    campaignsJoined,
    approvedPosts,
    totalEarned: parseFloat(totalEarned.toFixed(2)),
  };
};

export const getSocialVerificationStatus = (): { status: VerificationStatus, message: string } => {
  const profile = getStoredUserProfile();
  const connectedAccounts = profile.socialAccounts.filter(s => s.connected);
  const totalFollowers = connectedAccounts.reduce((sum, s) => sum + s.followers, 0);

  if (connectedAccounts.length === 0) {
    return { status: 'Not Submitted', message: 'Connect at least one social account to begin social verification.' };
  }

  if (totalFollowers >= MIN_FOLLOWERS_FOR_PAYOUT) {
    return { status: 'Approved', message: `You have ${totalFollowers.toLocaleString()} total followers. Payouts unlocked!` };
  } else {
    return { status: 'Pending Review', message: `You need at least ${MIN_FOLLOWERS_FOR_PAYOUT.toLocaleString()} total followers to unlock payouts. Current: ${totalFollowers.toLocaleString()}.` };
  }
};

export const simulateKycReview = () => {
  const profile = getStoredUserProfile();
  if (profile.kycStatus === 'Pending Review') {
    // Simulate a delay for review
    setTimeout(() => {
      const random = Math.random();
      let newStatus: VerificationStatus;
      let reason: string | undefined;

      if (random < 0.7) { // 70% chance of approval
        newStatus = 'Approved';
        showSuccess("Identity verification approved!");
      } else if (random < 0.9) { // 20% chance of rejection
        newStatus = 'Rejected';
        reason = 'ID document blurry or expired.';
        showError(`Identity verification rejected: ${reason}`);
      } else { // 10% chance to remain pending (manual review)
        newStatus = 'Pending Review';
        reason = 'Requires manual review by admin.';
        showError("Identity verification requires manual review.");
      }

      updateUserProfile({ kycStatus: newStatus, verificationReason: reason });
    }, 5000); // Simulate 5-second review time
  }
};