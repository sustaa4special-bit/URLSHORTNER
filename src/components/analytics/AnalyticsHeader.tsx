"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, BarChart3 } from "lucide-react";
import { AnalyticsView, DateRange } from "@/utils/analyticsData";

interface AnalyticsHeaderProps {
  view: AnalyticsView;
  onViewChange: (view: AnalyticsView) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  view,
  onViewChange,
  dateRange,
  onDateRangeChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 animate-in fade-in-0 slide-in-from-top-8 duration-700">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
          Analytics & Insights
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Track your growth, performance, and ROI in real time.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-0">
        <Select value={view} onValueChange={(value: AnalyticsView) => onViewChange(value)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
            <BarChart3 className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Select View" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="Creator" className="hover:bg-gray-700 focus:bg-gray-700">Creator View</SelectItem>
            <SelectItem value="Brand" className="hover:bg-gray-700 focus:bg-gray-700">Brand View</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={(value: DateRange) => onDateRangeChange(value)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
            <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="7 Days" className="hover:bg-gray-700 focus:bg-gray-700">Last 7 Days</SelectItem>
            <SelectItem value="30 Days" className="hover:bg-gray-700 focus:bg-gray-700">Last 30 Days</SelectItem>
            <SelectItem value="All Time" className="hover:bg-gray-700 focus:bg-gray-700">All Time</SelectItem>
            {/* <SelectItem value="Custom">Custom Range</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AnalyticsHeader;