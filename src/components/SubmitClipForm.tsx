"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";
import { submitClipForCampaign } from "@/utils/appliedCampaigns";

interface SubmitClipFormProps {
  campaignId: string;
  campaignHeadline: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const SubmitClipForm: React.FC<SubmitClipFormProps> = ({
  campaignId,
  campaignHeadline,
  onClose,
  onSubmitSuccess,
}) => {
  const [clipUrl, setClipUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!clipUrl) {
      showError("Please provide your clip URL.");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    submitClipForCampaign(campaignId, clipUrl);

    showSuccess(`Clip for "${campaignHeadline}" submitted successfully!`);
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
          Please provide the URL to your live content.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="clipUrl" className="text-gray-300">
            Clip URL (TikTok, Instagram, YouTube Shorts)
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
        <DialogFooter className="mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isSubmitting ? "Submitting..." : "Submit Clip"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default SubmitClipForm;