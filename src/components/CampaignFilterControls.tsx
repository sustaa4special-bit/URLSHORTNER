"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, XCircle } from "lucide-react";

interface CampaignFilterControlsProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedPlatforms: string[];
  onPlatformChange: (platform: string, checked: boolean) => void;
  selectedPayoutTypes: string[];
  onPayoutTypeChange: (type: string, checked: boolean) => void;
  minPayout: number[];
  onMinPayoutChange: (value: number[]) => void;
  selectedStatuses: string[];
  onStatusChange: (status: string, checked: boolean) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  onResetFilters: () => void;
  allPlatforms: string[];
  allPayoutTypes: string[];
  allStatuses: string[];
}

const CampaignFilterControls: React.FC<CampaignFilterControlsProps> = ({
  searchTerm,
  onSearchTermChange,
  selectedPlatforms,
  onPlatformChange,
  selectedPayoutTypes,
  onPayoutTypeChange,
  minPayout,
  onMinPayoutChange,
  selectedStatuses,
  onStatusChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  allPlatforms,
  allPayoutTypes,
  allStatuses,
}) => {
  return (
    <div className="bg-gray-900/70 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Filter className="h-6 w-6 mr-3 text-indigo-400" /> Filters
        </h2>
        <Button variant="ghost" onClick={onResetFilters} className="text-gray-400 hover:text-white hover:bg-gray-700">
          <XCircle className="h-4 w-4 mr-2" /> Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Search Input */}
        <div className="col-span-full xl:col-span-1 relative">
          <Label htmlFor="search-campaigns" className="text-gray-300 mb-2 block">Search Campaigns</Label>
          <Input
            id="search-campaigns"
            type="text"
            placeholder="Search by brand, payout, or platform..."
            className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 py-2 pl-10 pr-4 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 mt-2 h-5 w-5 text-gray-400" />
        </div>

        {/* Platform Filter */}
        <div>
          <Label className="text-gray-300 mb-2 block">Platform</Label>
          <div className="space-y-2">
            {allPlatforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={selectedPlatforms.includes(platform)}
                  onCheckedChange={(checked) => onPlatformChange(platform, checked as boolean)}
                  className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
                />
                <Label htmlFor={`platform-${platform}`} className="text-gray-200 cursor-pointer">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Type Filter */}
        <div>
          <Label className="text-gray-300 mb-2 block">Payout Type</Label>
          <div className="space-y-2">
            {allPayoutTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`payout-type-${type}`}
                  checked={selectedPayoutTypes.includes(type)}
                  onCheckedChange={(checked) => onPayoutTypeChange(type, checked as boolean)}
                  className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
                />
                <Label htmlFor={`payout-type-${type}`} className="text-gray-200 cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Minimum Payout Slider */}
        <div>
          <Label className="text-gray-300 mb-4 block">Minimum Payout: ${minPayout[0]}</Label>
          <Slider
            min={5}
            max={100}
            step={5}
            value={minPayout}
            onValueChange={onMinPayoutChange}
            className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-gray-700 [&>span:first-child>span]:bg-indigo-600 [&>span:first-child>span]:ring-offset-indigo-600"
            thumbClassName="h-5 w-5 bg-indigo-600 border-2 border-indigo-400"
          />
        </div>

        {/* Campaign Status Filter */}
        <div>
          <Label className="text-gray-300 mb-2 block">Status</Label>
          <div className="space-y-2">
            {allStatuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => onStatusChange(status, checked as boolean)}
                  className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
                />
                <Label htmlFor={`status-${status}`} className="text-gray-200 cursor-pointer">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <Label className="text-gray-300 mb-2 block">Sort By</Label>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="Newest" className="hover:bg-gray-700 focus:bg-gray-700">Newest</SelectItem>
              <SelectItem value="Highest Payout" className="hover:bg-gray-700 focus:bg-gray-700">Highest Payout</SelectItem>
              <SelectItem value="Trending" className="hover:bg-gray-700 focus:bg-gray-700">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CampaignFilterControls;