"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, CheckCircle, XCircle, DollarSign, Info, AlertTriangle } from "lucide-react";
import { getSystemLogs, AdminLog, AdminLogType } from "@/utils/adminData";
import { Badge } from "@/components/ui/badge";

interface SystemLogsDisplayProps {
  onRefresh: () => void;
}

const SystemLogsDisplay: React.FC<SystemLogsDisplayProps> = ({ onRefresh }) => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [filterType, setFilterType] = useState<AdminLogType | 'All'>('All');

  useEffect(() => {
    setLogs(getSystemLogs());
  }, [onRefresh]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => filterType === 'All' ? true : log.type === filterType);
  }, [logs, filterType]);

  const getLogIcon = (type: AdminLogType) => {
    switch (type) {
      case 'Verification': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'Withdrawal': return <DollarSign className="h-4 w-4 text-indigo-400" />;
      case 'System': return <Info className="h-4 w-4 text-gray-400" />;
      case 'Fraud Alert': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  const getLogBadgeColor = (type: AdminLogType) => {
    switch (type) {
      case 'Verification': return 'bg-green-500/20 text-green-400';
      case 'Withdrawal': return 'bg-indigo-500/20 text-indigo-400';
      case 'System': return 'bg-gray-500/20 text-gray-400';
      case 'Fraud Alert': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-700 shadow-xl">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-2xl font-bold text-white mb-4">System Logs</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filterType} onValueChange={(value: AdminLogType | 'All') => setFilterType(value)}>
            <SelectTrigger className="w-full sm:w-[200px] bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
              <Filter className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="All" className="hover:bg-gray-700 focus:bg-gray-700">All Types</SelectItem>
              <SelectItem value="Verification" className="hover:bg-gray-700 focus:bg-gray-700">Verifications</SelectItem>
              <SelectItem value="Withdrawal" className="hover:bg-gray-700 focus:bg-gray-700">Withdrawals</SelectItem>
              <SelectItem value="System" className="hover:bg-gray-700 focus:bg-gray-700">System Events</SelectItem>
              <SelectItem value="Fraud Alert" className="hover:bg-gray-700 focus:bg-gray-700">Fraud Alerts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      {filteredLogs.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No logs found matching your criteria.</div>
      ) : (
        <div className="overflow-x-auto max-h-[400px] lg:max-h-[600px] custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-800/90 z-10">
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300 w-[150px]">Timestamp</TableHead>
                <TableHead className="text-gray-300 w-[120px]">Type</TableHead>
                <TableHead className="text-gray-300">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                  <TableCell className="text-gray-400 text-sm">
                    {log.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getLogBadgeColor(log.type)} text-xs px-2 py-1 rounded-full flex items-center justify-center`}>
                      {getLogIcon(log.type)} {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default SystemLogsDisplay;