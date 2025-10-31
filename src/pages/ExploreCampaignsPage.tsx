"use client";

import React, { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Filter } from "lucide-react";
import { allAvailableCampaigns } from "@/utils/campaignData";
import { isCampaignApplied } from "@/utils/appliedCampaigns";
import CampaignCard from "@/components/CampaignCard";
import CampaignFilterControls from "@/components/CampaignFilterControls"; // Import the new component
import { useIsMobile } from "@/hooks/use-mobile"; // Import the useIsMobile hook
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

const CAMPAIGNS_PER_LOAD = 6;

const ExploreCampaignsPage = () => {
  const isMobile = useIsMobile();
  const [displayedCampaigns, setDisplayedCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedPayoutTypes, setSelectedPayoutTypes] = useState<string[]>([]);
  const [minPayout, setMinPayout] = useState<number[]>([5]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedCount, setLoadedCount] = useState(CAMPAIGNS_PER_LOAD);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); // For desktop collapsible

  const allPlatforms = ['TikTok', 'Instagram', 'YouTube Shorts'];
  const allPayoutTypes = ['Per View', 'Per Approved Clip', 'Fixed'];
  const allStatuses = ['Open', 'Closing Soon', 'Completed'];

  useEffect(() => {
    setDisplayedCampaigns(allAvailableCampaigns.slice(0, CAMPAIGNS_PER_LOAD));
  }, []);

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
    setLoadedCount(CAMPAIGNS_PER_LOAD); // Reset loaded count on filter reset
  };

  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = allAvailableCampaigns.filter((campaign) => {
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

    if (sortBy === "Newest") {
      filtered.sort((a, b) => b.deadlineDate.getTime() - a.deadlineDate.getTime());
    } else if (sortBy === "Highest Payout") {
      filtered.sort((a, b) => b.payoutValue - a.payoutValue);
    } else if (sortBy === "Trending") {
      filtered.sort((a, b) => b.spotsLeft - a.spotsLeft);
    }

    return filtered;
  }, [searchTerm, selectedPlatforms, selectedPayoutTypes, minPayout, selectedStatuses, sortBy]);

  useEffect(() => {
    setDisplayedCampaigns(filteredAndSortedCampaigns.slice(0, loadedCount));
  }, [filteredAndSortedCampaigns, loadedCount]);


  const loadMoreCampaigns = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setLoadedCount((prevCount) => prevCount + CAMPAIGNS_PER_LOAD);
      setIsLoadingMore(false);
    }, 1500);
  };

  const hasMoreCampaigns = loadedCount < filteredAndSortedCampaigns.length;

  const filterControlsProps = {
    searchTerm,
    onSearchTermChange: setSearchTerm,
    selectedPlatforms,
    onPlatformChange: handlePlatformChange,
    selectedPayoutTypes,
    onPayoutTypeChange: handlePayoutTypeChange,
    minPayout,
    onMinPayoutChange: setMinPayout,
    selectedStatuses,
    onStatusChange: handleStatusChange,
    sortBy,
    onSortByChange: setSortBy,
    onResetFilters: handleResetFilters,
    allPlatforms,
    allPayoutTypes,
    allStatuses,
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
          </div>

          {/* Filter Bar - Responsive */}
          {isMobile ? (
            <div className="mb-8 flex justify-end animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-200">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold py-2 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                    <Filter className="h-5 w-5 mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-900 text-white border-l border-gray-700 overflow-y-auto">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-2xl font-bold text-white text-left">Campaign Filters</SheetTitle>
                  </SheetHeader>
                  <CampaignFilterControls {...filterControlsProps} />
                  <SheetClose asChild>
                    <Button className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg">
                      Apply Filters
                    </Button>
                  </SheetClose>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <Collapsible open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen} className="mb-12 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-200">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold py-2 px-6 rounded-md text-lg transition-all duration-300 ease-in-out transform hover:scale-105 mb-4">
                  <Filter className="h-5 w-5 mr-2" /> {isFilterPanelOpen ? "Hide Filters" : "Show Filters"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CampaignFilterControls {...filterControlsProps} />
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Campaign Cards Grid */}
          {displayedCampaigns.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-10">
              No campaigns found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} isApplied={isCampaignApplied(campaign.id)} />
              ))}
            </div>
          )}

          {/* Load More Button with Skeleton Loader */}
          <div className="text-center">
            {isLoadingMore ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(CAMPAIGNS_PER_LOAD)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full bg-gray-800/50 rounded-xl" />
                ))}
              </div>
            ) : (
              hasMoreCampaigns && (
                <Button
                  onClick={loadMoreCampaigns}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Load More Campaigns <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExploreCampaignsPage;