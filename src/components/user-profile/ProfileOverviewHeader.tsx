"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserProfile, VerificationStatus } from "@/utils/userData";
import { CheckCircle, AlertTriangle, Hourglass, XCircle, Edit, Settings } from "lucide-react";
import { motion } from "framer-motion"; // <--- ADDED THIS IMPORT

interface CreatorStats {
  campaignsJoined: number;
  approvedPosts: number;
  totalEarned: number;
}

interface ProfileOverviewHeaderProps {
  userProfile: UserProfile;
  creatorStats: CreatorStats;
}

const ProfileOverviewHeader: React.FC<ProfileOverviewHeaderProps> = ({ userProfile, creatorStats }) => {
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge className="bg-green-500/20 text-green-400 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Verified
          </Badge>
        );
      case 'Pending Review':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
            <Hourglass className="h-3 w-3 animate-pulse" /> Verification Pending
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-red-500/20 text-red-400 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      case 'Not Submitted':
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Not Verified
          </Badge>
        );
    }
  };

  const joinedMonthYear = userProfile.joinedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-700 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6"
    >
      <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-indigo-600 shadow-lg">
        <AvatarImage src={userProfile.profilePictureUrl} alt={userProfile.username} />
        <AvatarFallback className="bg-indigo-700 text-white text-3xl font-bold">
          {userProfile.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            @{userProfile.username}
          </h1>
          {getStatusBadge(userProfile.kycStatus)}
        </div>
        <p className="text-lg text-gray-300 mb-2">
          {userProfile.role} Account
          {userProfile.emailVerified && (
            <span className="ml-2 text-green-400 text-sm flex items-center justify-center md:justify-start">
              <CheckCircle className="h-4 w-4 mr-1" /> Email Verified
            </span>
          )}
        </p>
        <p className="text-sm text-gray-400 mb-4">Joined: {joinedMonthYear}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center md:text-left mb-6">
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
            <p className="text-xl font-bold text-indigo-400">{creatorStats.campaignsJoined}</p>
            <p className="text-sm text-gray-300">Campaigns Joined</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
            <p className="text-xl font-bold text-purple-400">{creatorStats.approvedPosts}</p>
            <p className="text-sm text-gray-300">Approved Posts</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
            <p className="text-xl font-bold text-green-400">${creatorStats.totalEarned.toFixed(2)}</p>
            <p className="text-sm text-gray-300">Total Earned</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105">
            <Settings className="mr-2 h-4 w-4" /> Manage Account
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileOverviewHeader;