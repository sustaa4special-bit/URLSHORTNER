"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface EngagementDataPoint {
  date: string;
  engagement: number;
}

interface EngagementOverTimeChartProps {
  data: EngagementDataPoint[];
}

const EngagementOverTimeChart: React.FC<EngagementOverTimeChartProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="h-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 h-full">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-xl font-bold text-white">Engagement Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] px-0 py-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gray-700))" />
              <XAxis dataKey="date" stroke="hsl(var(--gray-400))" />
              <YAxis stroke="hsl(var(--gray-400))" unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--gray-800))', border: '1px solid hsl(var(--gray-700))', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'hsl(var(--white))' }}
                labelStyle={{ color: 'hsl(var(--gray-300))' }}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="url(#engagementGradient)"
                strokeWidth={2}
                dot={false}
              />
              <defs>
                <linearGradient id="engagementGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8884d8" /> {/* Purple */}
                  <stop offset="100%" stopColor="#82ca9d" /> {/* Green */}
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EngagementOverTimeChart;