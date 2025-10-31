"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, MoreHorizontal, Play, Pause, Eye, Edit, CheckCircle } from "lucide-react";
import { CampaignStatus, BrandCampaign } from "@/utils/brandCampaignData";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BrandCampaignsTableProps {
  campaigns: BrandCampaign[];
  onEditCampaign: (campaign: BrandCampaign) => void;
  onToggleCampaignStatus: (campaignId: string, newStatus: CampaignStatus) => void;
  filterStatus: CampaignStatus | 'All';
  onFilterStatusChange: (status: CampaignStatus | 'All') => void;
}

const BrandCampaignsTable: React.FC<BrandCampaignsTableProps> = ({
  campaigns,
  onEditCampaign,
  onToggleCampaignStatus,
  filterStatus,
  onFilterStatusChange,
}) => {
  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'Live':
        return <Badge className="bg-green-500/20 text-green-400">Live</Badge>;
      case 'Paused':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Paused</Badge>;
      case 'Completed':
        return <Badge className="bg-gray-500/20 text-gray-400">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    filterStatus === 'All' ? true : campaign.status === filterStatus
  );

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-700 shadow-xl animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-400">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Live Campaigns</h2>
        <Select value={filterStatus} onValueChange={(value: CampaignStatus | 'All') => onFilterStatusChange(value)}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
            <Filter className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="All" className="hover:bg-gray-700 focus:bg-gray-700">All</SelectItem>
            <SelectItem value="Live" className="hover:bg-gray-700 focus:bg-gray-700">Live</SelectItem>
            <SelectItem value="Paused" className="hover:bg-gray-700 focus:bg-gray-700">Paused</SelectItem>
            <SelectItem value="Completed" className="hover:bg-gray-700 focus:bg-gray-700">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No campaigns found matching your criteria.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Campaign Name</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Budget</TableHead>
                <TableHead className="text-gray-300">Spent</TableHead>
                <TableHead className="text-gray-300">Approved Clips</TableHead>
                <TableHead className="text-gray-300">Engagement Rate</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                  <TableCell className="font-medium text-white">{campaign.headline}</TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="text-gray-300">${campaign.totalBudget.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">${campaign.spent.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{campaign.approvedClips.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{campaign.engagementRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                        <DropdownMenuItem asChild className="hover:bg-gray-700 focus:bg-gray-700">
                          <Link to={`/campaigns/${campaign.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditCampaign(campaign)} className="hover:bg-gray-700 focus:bg-gray-700 flex items-center">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {campaign.status === 'Live' && (
                          <DropdownMenuItem onClick={() => onToggleCampaignStatus(campaign.id, 'Paused')} className="hover:bg-gray-700 focus:bg-gray-700 flex items-center">
                            <Pause className="mr-2 h-4 w-4" /> Pause
                          </DropdownMenuItem>
                        )}
                        {campaign.status === 'Paused' && (
                          <DropdownMenuItem onClick={() => onToggleCampaignStatus(campaign.id, 'Live')} className="hover:bg-gray-700 focus:bg-gray-700 flex items-center">
                            <Play className="mr-2 h-4 w-4" /> Resume
                          </DropdownMenuItem>
                        )}
                        {campaign.status === 'Completed' && (
                          <DropdownMenuItem disabled className="flex items-center text-gray-500">
                            <CheckCircle className="mr-2 h-4 w-4" /> Completed
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BrandCampaignsTable;