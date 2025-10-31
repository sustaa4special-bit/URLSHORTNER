"use client";

import React, { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CampaignCard from "@/components/CampaignCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Filter, XCircle } from "lucide-react";

interface Campaign {
  id: string;
  brandName: string;
  headline: string;
  platforms: ('TikTok' | 'Instagram' | 'YouTube Shorts')[];
  payout: string;
  payoutValue: number;
  payoutUnit: 'clip' | 'view' | 'fixed';
  deadline: string;
  deadlineDate: Date;
  spotsLeft: number;
  status: 'Open' | 'Closing Soon' | 'Completed';
  brandLogo?: string;
}

const initialCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    brandName: "Glowify Skincare",
    headline: "Create a skincare reel showing morning glow results",
    platforms: ['TikTok'],
    payout: "$25 per approved clip",
    payoutValue: 25,
    payoutUnit: 'clip',
    deadline: "Nov 30, 2025",
    deadlineDate: new Date("2025-11-30"),
    spotsLeft: 12,
    status: 'Open',
  },
  {
    id: "campaign-2",
    brandName: "Nova Tech",
    headline: "Review our new smart home device on Instagram",
    platforms: ['Instagram'],
    payout: "$0.03 per view",
    payoutValue: 0.03,
    payoutUnit: 'view',
    deadline: "Dec 12, 2025",
    deadlineDate: new Date("2025-12-12"),
    spotsLeft: 5,
    status: 'Closing Soon',
  },
  {
    id: "campaign-3",
    brandName: "Blendr Energy",
    headline: "Showcase Blendr Energy drink in your workout routine",
    platforms: ['TikTok', 'YouTube Shorts'],
    payout: "$15 per approved clip",
    payoutValue: 15,
    payoutUnit: 'clip',
    deadline: "Dec 5, 2025",
    deadlineDate: new Date("2025-12-05"),
    spotsLeft: 20,
    status: 'Open',
  },
  {
    id: "campaign-4",
    brandName: "EcoWear Apparel",
    headline: "Sustainable fashion haul for your audience",
    platforms: ['Instagram', 'TikTok'],
    payout: "$50 fixed fee",
    payoutValue: 50,
    payoutUnit: 'fixed',
    deadline: "Jan 15, 2026",
    deadlineDate: new Date("2026-01-15"),
    spotsLeft: 8,
    status: 'Open',
  },
  {
    id: "campaign-5",
    brandName: "GameSphere Studios",
    headline: "First look at our new indie game on YouTube Shorts",
    platforms: ['YouTube Shorts'],
    payout: "$0.05 per view",
    payoutValue: 0.05,
    payoutUnit: 'view',
    deadline: "Dec 20, 2025",
    deadlineDate: new Date("2025-12-20"),
    spotsLeft: 15,
    status: 'Open',
  },
  {
    id: "campaign-6",
    brandName: "PetPal Treats",
    headline: "Show your pet enjoying our new healthy treats",
    platforms: ['TikTok', 'Instagram'],
    payout: "$20 per approved clip",
    payoutValue: 20,
    payoutUnit: 'clip',
    deadline: "Nov 28, 2025",
    deadlineDate: new Date("2025-11-28"),
    spotsLeft: 3,
    status: 'Closing Soon',
  },
];

const ExploreCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedPayoutTypes, setSelectedPayoutTypes] = useState<string[]>([]);
  const [minPayout, setMinPayout] = useState<number[]>([5]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const allPlatforms = ['TikTok', 'Instagram', 'YouTube Shorts'];
  const allPayoutTypes = ['Per View', 'Per Approved Clip', 'Fixed'];
  const allStatuses = ['Open', 'Closing Soon', 'Completed'];

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setSelectedPlatforms((prev) =>
      checked ? [...prev, platform] : prev.filter((p) => p !== platform)
    );
  };

  const handlePayoutTypeChange = (type: string, checked: boolean) => {
    setSelectedPayoutTypes((prev) =>
      checked ? [...prev, type] : prev.filter((t) => t !== type)
    );
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedPlatforms([]);
    setSelectedPayoutTypes([]);
    setMinPayout([5]);
    setSelectedStatuses([]);
    setSortBy("Newest");
    setCampaigns(initialCampaigns); // Reset to initial set
  };

  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = campaigns.filter((campaign) => {
      const matchesSearch = searchTerm
        ? campaign.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.payout.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.platforms.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;

      const matchesPlatforms =
        selectedPlatforms.length > 0
          ? campaign.platforms.some((p) => selectedPlatforms.includes(p))
          : true;

      const matchesPayoutType =
        selectedPayoutTypes.length > 0
          ? selectedPayoutTypes.some((type) => {
              if (type === 'Per View' && campaign.payoutUnit === 'view') return true;
              if (type === 'Per Approved Clip' && campaign.payoutUnit === 'clip') return true;
              if (type === 'Fixed' && campaign.payoutUnit === 'fixed') return true;
              return false;
            })
          : true;

      const matchesMinPayout = campaign.payoutValue >= minPayout[0];

      const matchesStatus =
        selectedStatuses.length > 0
          ? selectedStatuses.includes(campaign.status)
          : true;

      return matchesSearch && matchesPlatforms && matchesPayoutType && matchesMinPayout && matchesStatus;
    });

    // Sorting logic
    if (sortBy === "Newest") {
      filtered.sort((a, b) => b.deadlineDate.getTime() - a.deadlineDate.getTime());
    } else if (sortBy === "Highest Payout") {
      filtered.sort((a, b) => b.payoutValue - a.payoutValue);
    } else if (sortBy === "Trending") {
      // For trending, we can simulate by prioritizing campaigns with more spots left or specific IDs
      filtered.sort((a, b) => b.spotsLeft - a.spotsLeft);
    }

    return filtered;
  }, [campaigns, searchTerm, selectedPlatforms, selectedPayoutTypes, minPayout, selectedStatuses, sortBy]);

  const loadMoreCampaigns = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const newCampaigns: Campaign[] = [
        {
          id: `campaign-${campaigns.length + 1}`,
          brandName: "TechGadget Co.",
          headline: "Unbox and review our latest smart gadget",
          platforms: ['YouTube Shorts'],
          payout: "$30 per approved clip",
          payoutValue: 30,
          payoutUnit: 'clip',
          deadline: "Feb 10, 2026",
          deadlineDate: new Date("2026-02-10"),
          spotsLeft: 18,
          status: 'Open',
        },
        {
          id: `campaign-${campaigns.length + 2}`,
          brandName: "FitFuel Nutrition",
          headline: "Show your fitness journey with FitFuel supplements",
          platforms: ['Instagram'],
          payout: "$0.04 per view",
          payoutValue: 0.04,
          payoutUnit: 'view',
          deadline: "Jan 25, 2026",
          deadlineDate: new Date("2026-01-25"),
          spotsLeft: 7,
          status: 'Closing Soon',
        },
        {
          id: `campaign-${campaigns.length + 3}`,
          brandName: "Artisan Coffee",
          headline: "Morning routine featuring Artisan Coffee",
          platforms: ['TikTok'],
          payout: "$20 fixed fee",
          payoutValue: 20,
          payoutUnit: 'fixed',
          deadline: "Mar 01, 2026",
          deadlineDate: new Date("2026-03-01"),
          spotsLeft: 10,
          status: 'Open',
        },
      ];
      setCampaigns((prev) => [...prev, ...newCampaigns]);
      setIsLoadingMore(false);
    }, 1500); // Simulate network delay
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-in fade-in-0 slide-in-from-top-8 duration-700">
              Explore Campaigns
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-100">
              Discover verified brand campaigns. Create authentic clips. Get paid every Friday.
            </p>
            <Input
              type="text"
              placeholder="Search by brand, payout, or platform..."
              className="max-w-xl mx-auto bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 py-3 px-4 rounded-full shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 animate-in fade-in-0 zoom-in-95 duration-700 delay-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Bar */}
          <div className="bg-gray-900/70 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-800 shadow-lg mb-12 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Filter className="h-6 w-6 mr-3 text-indigo-400" /> Filters
              </h2>
              <Button variant="ghost" onClick={handleResetFilters} className="text-gray-400 hover:text-white hover:bg-gray-700">
                <XCircle className="h-4 w-4 mr-2" /> Reset Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {/* Platform Filter */}
              <div>
                <Label className="text-gray-300 mb-2 block">Platform</Label>
                <div className="space-y-2">
                  {allPlatforms.map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={`platform-${platform}`}
                        checked={selectedPlatforms.includes(platform)}
                        onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
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
                        onCheckedChange={(checked) => handlePayoutTypeChange(type, checked as boolean)}
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
                  onValueChange={setMinPayout}
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
                        onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
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
                <Select value={sortBy} onValueChange={setSortBy}>
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

          {/* Campaign Cards Grid */}
          {filteredAndSortedCampaigns.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-10">
              No campaigns found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredAndSortedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}

          {/* Load More Button with Skeleton Loader */}
          <div className="text-center">
            {isLoadingMore ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full bg-gray-800/50 rounded-xl" />
                ))}
              </div>
            ) : (
              <Button
                onClick={loadMoreCampaigns}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Load More Campaigns <ArrowRight className="ml-2 h-5 w-5 inline-block" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExploreCampaignsPage;