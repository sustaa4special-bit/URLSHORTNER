"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IdentityVerification from "@/components/user-profile/IdentityVerification";
import SocialVerification from "@/components/user-profile/SocialVerification";
import { UserProfile } from "@/utils/userData";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion"; // <--- ADDED THIS IMPORT

interface VerificationCenterProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onRefresh: () => void;
}

const VerificationCenter: React.FC<VerificationCenterProps> = ({ userProfile, onUpdate, onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <ShieldCheck className="h-6 w-6 mr-3 text-indigo-400" /> Verification Center
          </CardTitle>
          <CardDescription className="text-gray-400">
            Complete your identity and social verification to unlock full platform features and payouts.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Tabs defaultValue="identity" className="mt-4">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700 border border-gray-600">
              <TabsTrigger value="identity" className="text-gray-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                Identity Verification (KYC)
              </TabsTrigger>
              <TabsTrigger value="social" className="text-gray-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                Social Verification
              </TabsTrigger>
            </TabsList>
            <TabsContent value="identity" className="mt-6">
              <IdentityVerification userProfile={userProfile} onUpdate={onUpdate} onRefresh={onRefresh} />
            </TabsContent>
            <TabsContent value="social" className="mt-6">
              <SocialVerification userProfile={userProfile} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VerificationCenter;