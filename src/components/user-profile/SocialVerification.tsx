"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserProfile, VerificationStatus, getSocialVerificationStatus } from "@/utils/userData";
import { CheckCircle, AlertTriangle, Hourglass, XCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

interface SocialVerificationProps {
  userProfile: UserProfile;
}

const SocialVerification: React.FC<SocialVerificationProps> = ({ userProfile }) => {
  const { status, message } = useMemo(() => getSocialVerificationStatus(), [userProfile.socialAccounts]);

  const totalFollowers = userProfile.socialAccounts
    .filter(s => s.connected)
    .reduce((sum, s) => sum + s.followers, 0);

  const MIN_FOLLOWERS_FOR_PAYOUT = 1000; // Defined in userData.ts, duplicated for display clarity
  const progressValue = Math.min(100, (totalFollowers / MIN_FOLLOWERS_FOR_PAYOUT) * 100);

  const getStatusBadge = (s: VerificationStatus) => {
    switch (s) {
      case 'Approved':
        return (
          <Badge className="bg-green-500/20 text-green-400 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Approved
          </Badge>
        );
      case 'Pending Review':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
            <Hourglass className="h-4 w-4 animate-pulse" /> Pending
          </Badge>
        );
      case 'Not Submitted':
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" /> Not Started
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <CardContent className="px-0 py-0 space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600">
          <CardDescription className="text-gray-300 flex items-center">
            Your current social verification status:
          </CardDescription>
          {getStatusBadge(status)}
        </div>

        <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Users className="h-6 w-6 mr-3 text-indigo-400" /> Follower Requirement
          </h3>
          <p className="text-gray-300">
            To unlock payouts and premium campaigns, you need a combined total of at least{" "}
            <span className="font-semibold text-indigo-400">{MIN_FOLLOWERS_FOR_PAYOUT.toLocaleString()} followers</span> across your connected social accounts.
          </p>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{totalFollowers.toLocaleString()} / {MIN_FOLLOWERS_FOR_PAYOUT.toLocaleString()} followers</span>
            <span>{progressValue.toFixed(0)}%</span>
          </div>
          <Progress value={progressValue} className="w-full h-2 bg-gray-600 [&>div]:bg-indigo-600" />
          <p className="text-sm text-gray-400 mt-2">{message}</p>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <CheckCircle className="h-6 w-6 mr-3 text-green-400" /> Connected Accounts
          </h3>
          {userProfile.socialAccounts.filter(s => s.connected).length === 0 ? (
            <p className="text-gray-400">No social accounts connected. Please connect them in the "Profile Info" tab.</p>
          ) : (
            <ul className="space-y-2">
              {userProfile.socialAccounts.filter(s => s.connected).map((account) => (
                <li key={account.platform} className="flex items-center text-gray-300">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                  <span className="font-medium">{account.platform}:</span> {account.handle} ({account.followers.toLocaleString()} followers)
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </motion.div>
  );
};

export default SocialVerification;