"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { downloadCsv, exportPdf, sharePublicReport } from "@/utils/analyticsData";

interface ExportShareOptionsProps {
  data: any; // This would be a more specific type in a real app
}

const ExportShareOptions: React.FC<ExportShareOptionsProps> = ({ data }) => {
  const handleDownloadCsv = () => {
    downloadCsv(data, "clipverse_analytics_report");
  };

  const handleExportPdf = () => {
    exportPdf(data, "clipverse_analytics_report");
  };

  const handleShareReport = () => {
    sharePublicReport("https://clipverse.com/reports/public-analytics-123"); // Mock URL
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="h-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 h-full flex flex-col">
        <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center">
          <FileText className="h-6 w-6 mr-3 text-purple-400" />
          <CardTitle className="text-xl font-bold text-white">Export & Share</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0 flex-grow space-y-4 mt-4">
          <Button
            onClick={handleDownloadCsv}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" /> Download CSV
          </Button>
          <Button
            onClick={handleExportPdf}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <FileText className="h-5 w-5 mr-2" /> Export PDF
          </Button>
          <Button
            onClick={handleShareReport}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <Share2 className="h-5 w-5 mr-2" /> Share Public Report
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExportShareOptions;