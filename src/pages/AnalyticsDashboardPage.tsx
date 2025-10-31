"use client";

import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import KpiCards from "@/components/analytics/KpiCards";
import EngagementOverTimeChart from "@/components/analytics/EngagementOverTimeChart";
import ViewsSubmissionsChart from "@/components/analytics/ViewsSubmissionsChart";
import PayoutDistributionChart from "@/components/analytics/PayoutDistributionChart";
import AiInsightsSummary from "@/components/analytics/AiInsightsSummary";
import CreatorDeepInsights from "@/components/analytics/CreatorDeepInsights";
import BrandInsights from "@/components/analytics/BrandInsights";
import LiveInsightsFeed from "@/components/analytics/LiveInsightsFeed";
import ExportShareOptions from "@/components/analytics/ExportShareOptions";
import {
  getKpiData,
  getEngagementOverTimeData,
  getViewsSubmissionsData,
  getPayoutDistributionData,
  getAiInsightsSummary,
  getCreatorDeepInsights,
  getBrandInsights,
  simulateLiveInsights,
  getLiveInsightsFeed,
  AnalyticsView,
  DateRange,
} from "@/utils/analyticsData";
import { showSuccess } from "@/utils/toast";

const AnalyticsDashboardPage = () => {
  const [view, setView] = useState<AnalyticsView>('Creator');
  const [dateRange, setDateRange] = useState<DateRange>('30 Days');
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger data re-fetch

  // Function to trigger a refresh of all data
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    // Initial simulation and refresh
    simulateLiveInsights();
    triggerRefresh();

    // Set up interval for simulating real-time updates and refreshing data
    const interval = setInterval(() => {
      simulateLiveInsights();
      triggerRefresh();
    }, 15000); // Simulate activity and refresh every 15 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const kpiData = useMemo(() => getKpiData(view, dateRange), [view, dateRange, refreshKey]);
  const engagementData = useMemo(() => getEngagementOverTimeData(dateRange), [dateRange, refreshKey]);
  const viewsSubmissionsData = useMemo(() => getViewsSubmissionsData(dateRange), [dateRange, refreshKey]);
  const payoutDistributionData = useMemo(() => getPayoutDistributionData(view, dateRange), [view, dateRange, refreshKey]);
  const aiSummary = useMemo(() => getAiInsightsSummary(view, kpiData), [view, kpiData]);
  const creatorInsights = useMemo(() => getCreatorDeepInsights(dateRange), [dateRange, refreshKey]);
  const brandInsights = useMemo(() => getBrandInsights(dateRange), [dateRange, refreshKey]);
  const liveInsights = useMemo(() => getLiveInsightsFeed(), [refreshKey]);


  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <AnalyticsHeader
            view={view}
            onViewChange={setView}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              <KpiCards kpiData={kpiData} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EngagementOverTimeChart data={engagementData} />
                <ViewsSubmissionsChart data={viewsSubmissionsData} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PayoutDistributionChart data={payoutDistributionData} />
                <AiInsightsSummary summary={aiSummary} />
              </div>

              {view === 'Creator' ? (
                <CreatorDeepInsights
                  mostProfitableCampaigns={creatorInsights.mostProfitableCampaigns}
                  topPlatform={creatorInsights.topPlatform}
                />
              ) : (
                <BrandInsights
                  topCampaignRoi={brandInsights.topCampaignRoi}
                  spendBreakdown={brandInsights.spendBreakdown}
                />
              )}
            </div>

            {/* Right Sidebar / Details Pane */}
            <div className="lg:col-span-1 space-y-8">
              <LiveInsightsFeed insights={liveInsights} />
              <ExportShareOptions data={{ kpiData, engagementData, viewsSubmissionsData, payoutDistributionData, aiSummary, creatorInsights, brandInsights }} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsDashboardPage;