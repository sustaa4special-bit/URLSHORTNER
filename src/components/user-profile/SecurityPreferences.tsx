"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserProfile, changeUserPassword, updateSecurityPreferences } from "@/utils/userData";
import { Lock, Bell, Mail, Shield, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { showSuccess, showError } from "@/utils/toast";

interface SecurityPreferencesProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const SecurityPreferences: React.FC<SecurityPreferencesProps> = ({ userProfile, onUpdate }) => {
  const [twoFactorAuth, setTwoFactorAuth] = useState(userProfile.securityPreferences.twoFactorAuth);
  const [emailNotifications, setEmailNotifications] = useState(userProfile.securityPreferences.emailNotifications);
  const [campaignInviteAlerts, setCampaignInviteAlerts] = useState(userProfile.securityPreferences.campaignInviteAlerts);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setTwoFactorAuth(userProfile.securityPreferences.twoFactorAuth);
    setEmailNotifications(userProfile.securityPreferences.emailNotifications);
    setCampaignInviteAlerts(userProfile.securityPreferences.campaignInviteAlerts);
  }, [userProfile.securityPreferences]);

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    try {
      updateSecurityPreferences({
        twoFactorAuth,
        emailNotifications,
        campaignInviteAlerts,
      });
      showSuccess("Preferences updated successfully!");
      onUpdate({ securityPreferences: { twoFactorAuth, emailNotifications, campaignInviteAlerts } });
    } catch (error) {
      showError("Failed to update preferences.");
      console.error("Preferences update error:", error);
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showError("Please fill in all password fields.");
      setIsChangingPassword(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showError("New password and confirmation do not match.");
      setIsChangingPassword(false);
      return;
    }

    // Password validation: min 8 chars, 1 symbol, 1 uppercase
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(newPassword)) {
      showError("New password must be at least 8 characters long, include one uppercase letter, and one symbol.");
      setIsChangingPassword(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

    try {
      const success = changeUserPassword(currentPassword, newPassword);
      if (success) {
        showSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        showError("Current password incorrect.");
      }
    } catch (error) {
      showError("Failed to change password.");
      console.error("Password change error:", error);
    } finally {
      setIsChangingPassword(false);
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
            <Lock className="h-6 w-6 mr-3 text-indigo-400" /> Security & Preferences
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your account security and notification settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0 space-y-8">
          {/* Notification Preferences */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-purple-400" /> Notification Preferences
            </h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <Label htmlFor="emailNotifications" className="text-gray-300 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" /> Email Notifications
                </Label>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-600"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <Label htmlFor="campaignInviteAlerts" className="text-gray-300 flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-gray-400" /> Campaign Invite Alerts
                </Label>
                <Switch
                  id="campaignInviteAlerts"
                  checked={campaignInviteAlerts}
                  onCheckedChange={setCampaignInviteAlerts}
                  className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-600"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSavePreferences}
                disabled={isSavingPreferences}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isSavingPreferences ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>

          {/* Password Reset */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <KeyRound className="h-5 w-5 mr-2 text-green-400" /> Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Min 8 characters, 1 uppercase, 1 symbol.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmNewPassword" className="text-gray-300">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SecurityPreferences;