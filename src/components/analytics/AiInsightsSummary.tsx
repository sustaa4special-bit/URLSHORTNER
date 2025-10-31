"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

interface AiInsightsSummaryProps {
  summary: string;
}

const AiInsightsSummary: React.FC<AiInsightsSummaryProps> = ({ summary }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="h-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 h-full flex flex-col">
        <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center">
          <Brain className="h-6 w-6 mr-3 text-indigo-400" />
          <CardTitle className="text-xl font-bold text-white">AI Insights Summary</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0 flex-grow">
          <p className="text-gray-300 leading-relaxed text-base">
            {summary || "No insights available for the selected period. Try adjusting your filters."}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AiInsightsSummary;