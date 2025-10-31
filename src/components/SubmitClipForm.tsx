"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { simulateVerification } from "@/utils/appliedCampaigns";

interface SubmitClipFormProps {
  campaignId: string;
  campaignHeadline: string;
  campaignPayoutValue: number; // New prop for payout value
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const SubmitClipForm: React.FC<SubmitClipFormProps> = ({
  campaignId,
  campaignHeadline,
  campaignPayoutValue,
  onClose,
  onSubmitSuccess,
}) => {
  const [clipUrl, setClipUrl] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<"TikTok" | "Instagram" | "YouTube Shorts" | "">("");
  const [agreedToRequirements, setAgreedToRequirements] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!clipUrl || !selectedPlatform || !agreedToRequirements) {
      showError("Please provide your clip URL, select a platform, and confirm you followed the requirements.");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call for submission and verification
    simulateVerification(campaignId, clipUrl, selectedPlatform, campaignPayoutValue);

    showSuccess(`Clip for "${campaignHeadline}" submitted for verification!`);
    setIsSubmitting(false);
    onClose();
    onSubmitSuccess();
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">Submit Your Clip</DialogTitle>
        <DialogDescription className="text-gray-400">
          You're submitting a clip for: <span className="font-semibold text-indigo-400">{campaignHeadline}</span>
          <br />
          Please provide the URL to your live content and select the platform.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="clipUrl" className="text-gray-300">
            Clip URL
          </Label>
          <Input
            id="clipUrl"
            placeholder="https://tiktok.com/@yourhandle/video/12345"
            value={clipUrl}
            onChange={(e) => setClipUrl(e.target.value)}
            className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="platform" className="text-gray-300">
            Platform
          </Label>
          <Select value={selectedPlatform} onValueChange={(value: "TikTok" | "Instagram" | "YouTube Shorts") => setSelectedPlatform(value)} required>
            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="TikTok" className="hover:bg-gray-700 focus:bg-gray-700">TikTok</SelectItem>
              <SelectItem value="Instagram" className="hover:bg-gray-700 focus:bg-gray-700">Instagram Reels</SelectItem>
              <SelectItem value="YouTube Shorts" className="hover:bg-gray-700 focus:bg-gray-700">YouTube Shorts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="requirements"
            checked={agreedToRequirements}
            onCheckedChange={(checked) => setAgreedToRequirements(checked as boolean)}
            className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
            required
          />
          <Label htmlFor="requirements" className="text-gray-300 cursor-pointer">
            I confirm I followed all campaign brief requirements.
          </Label>
        </div>
        <DialogFooter className="mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default SubmitClipForm;