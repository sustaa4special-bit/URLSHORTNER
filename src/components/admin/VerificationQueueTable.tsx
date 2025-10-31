"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { getVerificationQueue, approveVerification, rejectVerification } from "@/utils/adminData";
import { AppliedCampaign } from "@/utils/appliedCampaigns";
import { showSuccess, showError } from "@/utils/toast";
import ViewPostModal from "@/components/admin/ViewPostModal";

interface VerificationQueueTableProps {
  onRefresh: () => void;
}

const VerificationQueueTable: React.FC<VerificationQueueTableProps> = ({ onRefresh }) => {
  const [queue, setQueue] = useState<AppliedCampaign[]>([]);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<AppliedCampaign | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewPostModalOpen, setIsViewPostModalOpen] = useState(false);

  useEffect(() => {
    setQueue(getVerificationQueue());
  }, [onRefresh]); // Re-fetch when parent signals refresh

  const handleApprove = async (campaign: AppliedCampaign) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (approveVerification(campaign.id, campaign.id)) { // Using campaign.id as creatorId for simplicity
      showSuccess(`Campaign "${campaign.headline}" approved!`);
      onRefresh();
    } else {
      showError("Failed to approve campaign.");
    }
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!selectedCampaign || !rejectionReason.trim()) {
      showError("Please provide a rejection reason.");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (rejectVerification(selectedCampaign.id, selectedCampaign.id, rejectionReason)) {
      showSuccess(`Campaign "${selectedCampaign.headline}" rejected.`);
      onRefresh();
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedCampaign(null);
    } else {
      showError("Failed to reject campaign.");
    }
    setIsSubmitting(false);
  };

  const openRejectDialog = (campaign: AppliedCampaign) => {
    setSelectedCampaign(campaign);
    setIsRejectDialogOpen(true);
  };

  const openViewPostModal = (campaign: AppliedCampaign) => {
    setSelectedCampaign(campaign);
    setIsViewPostModalOpen(true);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-700 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Verification Queue</h2>
      {queue.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No pending verifications.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Creator</TableHead>
                <TableHead className="text-gray-300">Campaign</TableHead>
                <TableHead className="text-gray-300">Platform</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((campaign) => (
                <TableRow key={campaign.id} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                  <TableCell className="text-gray-400 text-sm">
                    {campaign.applicationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="font-medium text-white">@{campaign.brandName.replace(/\s/g, '').toLowerCase()}Creator</TableCell> {/* Mock creator name */}
                  <TableCell className="text-gray-300">{campaign.headline}</TableCell>
                  <TableCell className="text-gray-300">{campaign.submittedPlatform || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs px-2 py-1 rounded-full ${
                        campaign.status === 'Submitted' ? 'bg-yellow-500/20 text-yellow-400' :
                        campaign.status === 'Under Manual Review' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {campaign.status === 'Submitted' ? 'Pending' : campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApprove(campaign)}
                      disabled={isSubmitting}
                      className="text-green-400 hover:bg-green-500/20 hover:text-green-300"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRejectDialog(campaign)}
                      disabled={isSubmitting}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    {campaign.clipUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewPostModal(campaign)}
                        className="text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Submission</DialogTitle>
            <DialogDescription className="text-gray-400">
              Provide a reason for rejecting the clip for "{selectedCampaign?.headline}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-gray-300">
                Reason
              </Label>
              <Textarea
                id="reason"
                placeholder="e.g., Missing required hashtag, post not public, low quality content."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isSubmitting || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Rejecting..." : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Post Modal */}
      <Dialog open={isViewPostModalOpen} onOpenChange={setIsViewPostModalOpen}>
        {selectedCampaign && selectedCampaign.clipUrl && (
          <ViewPostModal
            clipUrl={selectedCampaign.clipUrl}
            platform={selectedCampaign.submittedPlatform || 'TikTok'}
            campaignHeadline={selectedCampaign.headline}
            onClose={() => setIsViewPostModalOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default VerificationQueueTable;