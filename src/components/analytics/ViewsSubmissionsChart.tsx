"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface ViewsSubmissionsDataPoint {
  date: string;
  submissions: number;
  approvedPosts: number;
}

interface ViewsSubmissionsChartProps {
  data: ViewsSubmissionsDataPoint[];
}

const ViewsSubmissionsChart: React.FC<ViewsSubmissionsChartProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="h-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 h-full">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-xl font-bold text-white">Views & Submissions</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] px-0 py-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gray-700))" />
              <XAxis dataKey="date" stroke="hsl(var(--gray-400))" />
              <YAxis stroke="hsl(var(--gray-400))" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--gray-800))', border: '1px solid hsl(var(--gray-700))', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'hsl(var(--white))' }}
                labelStyle={{ color: 'hsl(var(--gray-300))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--gray-300))' }} />
              <Bar dataKey="submissions" fill="hsl(var(--purple-600))" name="Submissions" />
              <Bar dataKey="approvedPosts" fill="hsl(var(--indigo-600))" name="Approved Posts" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ViewsSubmissionsChart;