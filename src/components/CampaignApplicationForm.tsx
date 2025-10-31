"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
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
import { showSuccess, showError } from "@/utils/toast"; // Using existing toast utilities

interface CampaignApplicationFormProps {
  campaignId: string;
  campaignHeadline: string;
  onClose: () => void;
}

const CampaignApplicationForm: React.FC<CampaignApplicationFormProps> = ({
  campaignId,
  campaignHeadline,
  onClose,
}) => {
  const [socialHandle, setSocialHandle] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!socialHandle || !agreedToTerms) {
      showError("Please provide your social media handle and agree to the terms.");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Campaign Application Submitted:", {
      campaignId,
      campaignHeadline,
      socialHandle,
      portfolioLink,
      agreedToTerms,
    });

    showSuccess(`Application for "${campaignHeadline}" submitted successfully!`);
    setIsSubmitting(false);
    onClose(); // Close the dialog after submission
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">Apply for Campaign</DialogTitle>
        <DialogDescription className="text-gray-400">
          You're applying for: <span className="font-semibold text-indigo-400">{campaignHeadline}</span>
          <br />
          Fill in your details to submit your application.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="socialHandle" className="text-gray-300">
            Your Primary Social Media Handle (e.g., @yourtiktok)
          </Label>
          <Input
            id="socialHandle"
            placeholder="@yourhandle"
            value={socialHandle}
            onChange={(e) => setSocialHandle(e.target.value)}
            className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="portfolioLink" className="text-gray-300">
            Portfolio/Previous Work Link (Optional)
          </Label>
          <Input
            id="portfolioLink"
            placeholder="https://yourportfolio.com"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
            required
          />
          <Label htmlFor="terms" className="text-gray-300 cursor-pointer">
            I agree to the <Link to="/terms" className="text-indigo-400 hover:underline">terms and conditions</Link>.
          </Label>
        </div>
        <DialogFooter className="mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CampaignApplicationForm;