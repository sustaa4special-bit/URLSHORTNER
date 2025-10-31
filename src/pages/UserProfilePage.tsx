"use client";

import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileOverviewHeader from "@/components/user-profile/ProfileOverviewHeader";
import PersonalInfoForm from "@/components/user-profile/PersonalInfoForm";
import SocialAccountsLinking from "@/components/user-profile/SocialAccountsLinking";
import VerificationCenter from "@/components/user-profile/VerificationCenter";
import PayoutBillingSettings from "@/components/user-profile/PayoutBillingSettings";
import SecurityPreferences from "@/components/user-profile/SecurityPreferences";
import DeleteAccountSection from "@/components/user-profile/DeleteAccountSection";
import {
  getUserProfile,
  updateUserProfile,
  getCreatorStats,
  simulateKycReview,
  UserProfile,
} from "@/utils/userData";
import { showSuccess, showError } from "@/utils/toast";
import { motion } from "framer-motion"; // <--- ADDED THIS IMPORT

const UserProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [creatorStats, setCreatorStats] = useState(getCreatorStats());
  const [activeTab, setActiveTab] = useState("profile");

  const refreshUserData = () => {
    const profile = getUserProfile();
    setUserProfile(profile);
    setCreatorStats(getCreatorStats());
  };

  useEffect(() => {
    refreshUserData(); // Initial load

    // Simulate KYC review process
    simulateKycReview();

    // Set up interval to refresh data, simulating real-time updates for stats/status
    const interval = setInterval(() => {
      refreshUserData();
      simulateKycReview(); // Keep simulating KYC review
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
    try {
      const updated = updateUserProfile(updates);
      setUserProfile(updated);
      showSuccess("Profile updated successfully!");
    } catch (error) {
      showError("Failed to update profile.");
      console.error("Profile update error:", error);
    }
  };

  if (!userProfile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
          <h1 className="text-2xl font-bold">Loading profile...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <ProfileOverviewHeader userProfile={userProfile} creatorStats={creatorStats} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-12">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-gray-800 border border-gray-700">
              <TabsTrigger value="profile" className="text-gray-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                Profile Info
              </TabsTrigger>
              <TabsTrigger value="verification" className="text-gray-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                Verification Center
              </TabsTrigger>
              <TabsTrigger value="payouts-security" className="text-gray-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                Payouts & Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-8 space-y-8">
              <PersonalInfoForm userProfile={userProfile} onUpdate={handleProfileUpdate} />
              <SocialAccountsLinking userProfile={userProfile} onUpdate={handleProfileUpdate} onRefresh={refreshUserData} />
            </TabsContent>

            <TabsContent value="verification" className="mt-8 space-y-8">
              <VerificationCenter userProfile={userProfile} onUpdate={handleProfileUpdate} onRefresh={refreshUserData} />
            </TabsContent>

            <TabsContent value="payouts-security" className="mt-8 space-y-8">
              <PayoutBillingSettings userProfile={userProfile} onUpdate={handleProfileUpdate} onRefresh={refreshUserData} />
              <SecurityPreferences userProfile={userProfile} onUpdate={handleProfileUpdate} />
              <DeleteAccountSection onAccountDeleted={() => { /* Redirect to login or home */ }} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;