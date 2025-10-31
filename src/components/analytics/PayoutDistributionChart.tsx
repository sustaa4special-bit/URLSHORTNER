"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import { motion } from "framer-motion";

interface PayoutDistributionDataPoint {
  name: string;
  value: number;
  color: string;
}

interface PayoutDistributionChartProps {
  data: PayoutDistributionDataPoint[];
}

const PayoutDistributionChart: React.FC<PayoutDistributionChartProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="h-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 h-full">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-xl font-bold text-white">Payout Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] px-0 py-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  value="By Platform"
                  position="center"
                  fill="hsl(var(--gray-300))"
                  className="font-semibold text-sm"
                />
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toFixed(1)}%`}
                contentStyle={{ backgroundColor: 'hsl(var(--gray-800))', border: '1px solid hsl(var(--gray-700))', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'hsl(var(--white))' }}
                labelStyle={{ color: 'hsl(var(--gray-300))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--gray-300))' }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PayoutDistributionChart;