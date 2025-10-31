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
import { CheckCircle, XCircle, Loader2, Banknote, CreditCard, Bitcoin } from "lucide-react";
import { getWithdrawalRequests, approveWithdrawal, rejectWithdrawal, WithdrawalTransaction } from "@/utils/adminData";
import { showSuccess, showError } from "@/utils/toast";

interface WithdrawalRequestsTableProps {
  onRefresh: () => void;
}

const WithdrawalRequestsTable: React.FC<WithdrawalRequestsTableProps> = ({ onRefresh }) => {
  const [requests, setRequests] = useState<WithdrawalTransaction[]>([]);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalTransaction | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setRequests(getWithdrawalRequests());
  }, [onRefresh]);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'PayPal': return <Banknote className="h-4 w-4 mr-1" />;
      case 'Bank Transfer': return <CreditCard className="h-4 w-4 mr-1" />;
      case 'Crypto (USDT)': return <Bitcoin className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  const handleApprove = async (request: WithdrawalTransaction) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (approveWithdrawal(request.id)) {
      showSuccess(`Withdrawal for $${request.amount.toFixed(2)} approved!`);
      onRefresh();
    } else {
      showError("Failed to approve withdrawal.");
    }
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      showError("Please provide a rejection reason.");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (rejectWithdrawal(selectedRequest.id, rejectionReason)) {
      showSuccess(`Withdrawal for $${selectedRequest.amount.toFixed(2)} rejected.`);
      onRefresh();
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedRequest(null);
    } else {
      showError("Failed to reject withdrawal.");
    }
    setIsSubmitting(false);
  };

  const openRejectDialog = (request: WithdrawalTransaction) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-700 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Withdrawal Requests</h2>
      {requests.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No pending withdrawal requests.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Creator</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Method</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                  <TableCell className="font-medium text-white">@{request.id.replace('withdrawal-', 'creator-')}</TableCell> {/* Mock creator ID */}
                  <TableCell className="text-green-400 font-semibold">${request.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-300 flex items-center">
                    {getMethodIcon(request.method)} {request.method}
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {request.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApprove(request)}
                      disabled={isSubmitting}
                      className="text-green-400 hover:bg-green-500/20 hover:text-green-300"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRejectDialog(request)}
                      disabled={isSubmitting}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
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
            <DialogTitle className="text-white">Reject Withdrawal</DialogTitle>
            <DialogDescription className="text-gray-400">
              Provide a reason for rejecting the withdrawal request for ${selectedRequest?.amount.toFixed(2)}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-gray-300">
                Reason
              </Label>
              <Textarea
                id="reason"
                placeholder="e.g., Insufficient balance, suspicious activity, incorrect payment details."
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
    </div>
  );
};

export default WithdrawalRequestsTable;