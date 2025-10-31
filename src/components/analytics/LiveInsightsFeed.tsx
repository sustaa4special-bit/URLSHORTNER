"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, DollarSign, Info } from "lucide-react";
import { motion } from "framer-motion";
import { LiveInsight } from "@/utils/analyticsData";

interface LiveInsightsFeedProps {
  insights: LiveInsight[];
}

const LiveInsightsFeed: React.FC<LiveInsightsFeedProps> = ({ insights }) => {
  const getInsightIcon = (type: LiveInsight['type']) => {
    switch (type) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'alert': return <Info className="h-4 w-4 text-red-400" />;
      case 'neutral':
      default: return <Zap className="h-4 w-4 text-indigo-400" />;
    }
  };

  const getInsightColor = (type: LiveInsight['type']) => {
    switch (type) {
      case 'positive': return 'text-green-300';
      case 'alert': return 'text-red-300';
      case 'neutral':
      default: return 'text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="h-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 h-full flex flex-col">
        <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center">
          <Zap className="h-6 w-6 mr-3 text-indigo-400" />
          <CardTitle className="text-xl font-bold text-white">Live Insights Feed</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0 flex-grow overflow-y-auto custom-scrollbar">
          {insights.length === 0 ? (
            <p className="text-gray-400 text-sm">No live insights yet. Stay tuned!</p>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="flex items-start gap-3">
                  <div className="pt-1">{getInsightIcon(insight.type)}</div>
                  <div>
                    <p className={`text-sm ${getInsightColor(insight.type)}`}>{insight.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {insight.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LiveInsightsFeed;