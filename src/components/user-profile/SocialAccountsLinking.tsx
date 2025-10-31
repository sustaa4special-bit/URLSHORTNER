"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserProfile, SocialPlatform, connectSocialAccount, disconnectSocialAccount } from "@/utils/userData";
import { Instagram, Youtube, Twitter, Twitch, Link as LinkIcon, CheckCircle, XCircle, Loader2, Video } from "lucide-react";
import { motion } from "framer-motion"; // Confirmed: This import is crucial and must be here
import { showSuccess, showError } from "@/utils/toast";

interface SocialAccountsLinkingProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onRefresh: () => void;
}

const SocialAccountsLinking: React.FC<SocialAccountsLinkingProps> = ({ userProfile, onUpdate, onRefresh }) => {
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [socialHandle, setSocialHandle] = useState("");
  const [followerCount, setFollowerCount] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  const socialPlatforms: { platform: SocialPlatform; name: string; icon: React.ElementType }[] = [
    { platform: 'TikTok', name: 'TikTok', icon: Video },
    { platform: 'Instagram', name: 'Instagram', icon: Instagram },
    { platform: 'YouTube Shorts', name: 'YouTube Shorts', icon: Youtube },
    { platform: 'Twitter', name: 'Twitter (X)', icon: Twitter },
    { platform: 'Twitch', name: 'Twitch', icon: Twitch },
  ];

  const handleConnectClick = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setSocialHandle("");
    setFollowerCount("");
    setIsConnectDialogOpen(true);
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform || !socialHandle || !followerCount) {
      showError("Please fill in all fields.");
      return;
    }

    const parsedFollowers = parseInt(followerCount, 10);
    if (isNaN(parsedFollowers) || parsedFollowers < 0) {
      showError("Please enter a valid follower count.");
      return;
    }

    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      connectSocialAccount(selectedPlatform, socialHandle, parsedFollowers);
      showSuccess(`${selectedPlatform} connected successfully!`);
      onRefresh();
      setIsConnectDialogOpen(false);
    } catch (error) {
      showError(`Failed to connect ${selectedPlatform}.`);
      console.error("Social connect error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (platform: SocialPlatform) => {
    if (window.confirm(`Are you sure you want to disconnect your ${platform} account?`)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        disconnectSocialAccount(platform);
        showSuccess(`${platform} disconnected.`);
        onRefresh();
      } catch (error) {
        showError(`Failed to disconnect ${platform}.`);
        console.error("Social disconnect error:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <LinkIcon className="h-6 w-6 mr-3 text-indigo-400" /> Social Accounts
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect your social media profiles to unlock campaigns and verify your reach.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0 grid gap-4">
          {socialPlatforms.map((social) => {
            const connectedAccount = userProfile.socialAccounts.find(
              (acc) => acc.platform === social.platform && acc.connected
            );
            const Icon = social.icon;

            return (
              <div
                key={social.platform}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600"
              >
                <div className="flex items-center">
                  <Icon className="h-6 w-6 mr-3 text-indigo-400" />
                  <div>
                    <p className="font-semibold text-white">{social.name}</p>
                    {connectedAccount ? (
                      <p className="text-sm text-gray-300 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-400" />
                        Connected: <span className="font-medium ml-1">{connectedAccount.handle}</span> (
                        {connectedAccount.followers.toLocaleString()} followers)
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 flex items-center">
                        <XCircle className="h-4 w-4 mr-1 text-red-400" /> Not Connected
                      </p>
                    )}
                  </div>
                </div>
                {connectedAccount ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(social.platform)}
                    className="border-red-600 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnectClick(social.platform)}
                    className="border-indigo-600 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
                  >
                    Connect
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>

      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Connect {selectedPlatform} Account</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your {selectedPlatform} handle and current follower count.
            </DialogDescription>
          </DialogDescription>
          <form onSubmit={handleConnectSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="socialHandle" className="text-gray-300">
                {selectedPlatform} Handle
              </Label>
              <Input
                id="socialHandle"
                placeholder={`@your${selectedPlatform?.toLowerCase()}`}
                value={socialHandle}
                onChange={(e) => setSocialHandle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="followerCount" className="text-gray-300">
                Current Follower Count
              </Label>
              <Input
                id="followerCount"
                type="number"
                placeholder="e.g., 125000"
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                min="0"
                required
              />
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="submit"
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                  </>
                ) : (
                  "Connect Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SocialAccountsLinking;