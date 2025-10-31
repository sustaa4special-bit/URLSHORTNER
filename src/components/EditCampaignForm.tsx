"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { showSuccess, showError } from "@/utils/toast";
import { updateBrandCampaign, BrandCampaign, Platform } from "@/utils/brandCampaignData";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox import

interface EditCampaignFormProps {
  campaign: BrandCampaign;
  onClose: () => void;
  onCampaignUpdated: () => void;
}

const EditCampaignForm: React.FC<EditCampaignFormProps> = ({ campaign, onClose, onCampaignUpdated }) => {
  const [headline, setHeadline] = useState(campaign.headline);
  const [description, setDescription] = useState(campaign.description);
  const [platforms, setPlatforms] = useState<Platform[]>(campaign.platforms);
  const [payoutPerClip, setPayoutPerClip] = useState<string>(campaign.payoutPerClip.toString());
  const [totalBudget, setTotalBudget] = useState<string>(campaign.totalBudget.toString());
  const [startDate, setStartDate] = useState<Date | undefined>(campaign.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(campaign.endDate);
  const [hashtags, setHashtags] = useState(campaign.hashtags.join(', '));
  const [mentions, setMentions] = useState(campaign.mentions.join(', '));
  const [brandLogoUrl, setBrandLogoUrl] = useState(campaign.brandLogoUrl || "");
  const [productImageUrl, setProductImageUrl] = useState(campaign.productImageUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlatformChange = (value: string[]) => {
    setPlatforms(value as Platform[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedPayout = parseFloat(payoutPerClip);
    const parsedBudget = parseFloat(totalBudget);

    if (
      !headline ||
      !description ||
      platforms.length === 0 ||
      isNaN(parsedPayout) ||
      isNaN(parsedBudget) ||
      !startDate ||
      !endDate ||
      !hashtags
    ) {
      showError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    if (startDate.getTime() >= endDate.getTime()) {
      showError("End date must be after start date.");
      setIsSubmitting(false);
      return;
    }

    if (parsedPayout > parsedBudget) {
      showError("Payout per clip cannot be greater than the total budget.");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedCampaign = updateBrandCampaign(campaign.id, {
      headline,
      description,
      platforms,
      payoutPerClip: parsedPayout,
      totalBudget: parsedBudget,
      startDate,
      endDate,
      hashtags: hashtags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      mentions: mentions.split(',').map(mention => mention.trim()).filter(mention => mention !== ''),
      brandLogoUrl: brandLogoUrl || "/placeholder.svg",
      productImageUrl: productImageUrl || "/placeholder.svg",
    });

    if (updatedCampaign) {
      showSuccess(`Campaign "${updatedCampaign.headline}" updated successfully!`);
      onClose();
      onCampaignUpdated(); // Notify parent to refresh data
    } else {
      showError("Failed to update campaign.");
    }
    setIsSubmitting(false);
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">Edit Campaign: {campaign.headline}</DialogTitle>
        <DialogDescription className="text-gray-400">
          Modify the details of your existing campaign.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="headline" className="text-gray-300">
            Campaign Name
          </Label>
          <Input
            id="headline"
            placeholder="e.g., 'Summer Glow Serum Launch'"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description" className="text-gray-300">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Provide a detailed brief for creators..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 min-h-[100px]"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="platforms" className="text-gray-300">
              Platforms
            </Label>
            <Select
              onValueChange={(value: Platform) => setPlatforms(prev => prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value])}
              value={platforms[0] || ""} // Display first selected platform, or empty
            >
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                <SelectValue placeholder="Select platforms" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {['TikTok', 'Instagram', 'YouTube Shorts'].map(platform => (
                  <SelectItem key={platform} value={platform} className="hover:bg-gray-700 focus:bg-gray-700">
                    <div className="flex items-center">
                      <Checkbox
                        id={`platform-${platform}`}
                        checked={platforms.includes(platform as Platform)}
                        onCheckedChange={(checked) => handlePlatformChange(checked ? [...platforms, platform] : platforms.filter(p => p !== platform))}
                        className="mr-2 border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
                      />
                      <Label htmlFor={`platform-${platform}`} className="cursor-pointer">{platform}</Label>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Selected: {platforms.join(', ') || 'None'}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payoutPerClip" className="text-gray-300">
              Payout Per Clip ($)
            </Label>
            <Input
              id="payoutPerClip"
              type="number"
              placeholder="e.g., 25"
              value={payoutPerClip}
              onChange={(e) => setPayoutPerClip(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
              min="1"
              step="0.01"
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="totalBudget" className="text-gray-300">
            Total Budget ($)
          </Label>
          <Input
            id="totalBudget"
            type="number"
            placeholder="e.g., 5000"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
            min="100"
            step="0.01"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="startDate" className="text-gray-300">
              Start Date
            </Label>
            <DatePicker date={startDate} setDate={setStartDate} placeholder="Campaign start date" disabled={campaign.status === 'Completed'} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate" className="text-gray-300">
              End Date
            </Label>
            <DatePicker date={endDate} setDate={setEndDate} placeholder="Campaign end date" disabled={campaign.status === 'Completed'} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hashtags" className="text-gray-300">
            Required Hashtags (comma-separated)
          </Label>
          <Input
            id="hashtags"
            placeholder="e.g., #MyBrand, #NewProduct"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mentions" className="text-gray-300">
            Required Mentions (comma-separated, optional)
          </Label>
          <Input
            id="mentions"
            placeholder="e.g., @mybrand_official"
            value={mentions}
            onChange={(e) => setMentions(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="brandLogoUrl" className="text-gray-300">
            Brand Logo URL (Optional)
          </Label>
          <Input
            id="brandLogoUrl"
            placeholder="https://example.com/logo.png"
            value={brandLogoUrl}
            onChange={(e) => setBrandLogoUrl(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="productImageUrl" className="text-gray-300">
            Product Image URL (Optional)
          </Label>
          <Input
            id="productImageUrl"
            placeholder="https://example.com/product.jpg"
            value={productImageUrl}
            onChange={(e) => setProductImageUrl(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
          />
        </div>
        <DialogFooter className="mt-6">
          <Button
            type="submit"
            disabled={isSubmitting || campaign.status === 'Completed'}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default EditCampaignForm;