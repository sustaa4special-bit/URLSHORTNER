"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, CheckCircle, XCircle } from "lucide-react";
import { getFraudAlerts, updateFraudAlertStatus, FraudAlert, FraudReason } from "@/utils/adminData";
import { showSuccess, showError } from "@/utils/toast";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ViewPostModal from "@/components/admin/ViewPostModal";
import { getAppliedCampaignById } from "@/utils/appliedCampaigns";

interface FraudAlertsDisplayProps {
  onRefresh: () => void;
}

const FraudAlertsDisplay: React.FC<FraudAlertsDisplayProps> = ({ onRefresh }) => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [isViewPostModalOpen, setIsViewPostModalOpen] = useState(false);
  const [selectedAlertForView, setSelectedAlertForView] = useState<FraudAlert | null>(null);

  useEffect(() => {
    setAlerts(getFraudAlerts());
  }, [onRefresh]);

  const handleUpdateStatus = async (alertId: string, newStatus: FraudAlert['status']) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 700));
    updateFraudAlertStatus(alertId, newStatus);
    showSuccess(`Fraud alert status updated to "${newStatus}".`);
    onRefresh();
  };

  const openViewPostModal = (alert: FraudAlert) => {
    setSelectedAlertForView(alert);
    setIsViewPostModalOpen(true);
  };

  const getAlertBadgeColor = (status: FraudAlert['status']) => {
    switch (status) {
      case 'Pending Review': return 'bg-red-500/20 text-red-400';
      case 'Reviewed': return 'bg-green-500/20 text-green-400';
      case 'Dismissed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-gray-700 shadow-xl">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-2xl font-bold text-white mb-4 flex items-center">
          <AlertTriangle className="h-6 w-6 mr-3 text-red-400" /> Fraud Alerts
        </CardTitle>
      </CardHeader>
      {alerts.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No active fraud alerts.</div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const appliedCampaign = alert.campaignId ? getAppliedCampaignById(alert.campaignId) : null;
            const creatorName = alert.creatorId ? `@${alert.creatorId.replace('creator-', '')}` : 'N/A';
            const campaignHeadline = appliedCampaign?.headline || 'N/A';
            const submittedPlatform = appliedCampaign?.submittedPlatform || 'TikTok'; // Default for modal

            return (
              <div
                key={alert.id}
                className="bg-red-900/20 border border-red-700 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                    <p className="font-semibold text-red-300 text-lg">{alert.reason}</p>
                    <Badge className={`${getAlertBadgeColor(alert.status)} ml-3 text-xs`}>{alert.status}</Badge>
                  </div>
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium">Creator:</span> {creatorName} |
                    <span className="font-medium ml-1">Campaign:</span> {campaignHeadline}
                  </p>
                  {alert.clipUrl && (
                    <p className="text-gray-400 text-xs mt-1 break-all">
                      <span className="font-medium">Clip URL:</span> {alert.clipUrl}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {alert.clipUrl && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewPostModal(alert)}
                          className="border-indigo-600 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
                        >
                          <Eye className="h-4 w-4 mr-2" /> Review Post
                        </Button>
                      </DialogTrigger>
                      {selectedAlertForView && selectedAlertForView.id === alert.id && (
                        <ViewPostModal
                          clipUrl={selectedAlertForView.clipUrl || ''}
                          platform={submittedPlatform} // Use derived platform
                          campaignHeadline={campaignHeadline}
                          onClose={() => setIsViewPostModalOpen(false)}
                        />
                      )}
                    </Dialog>
                  )}
                  {alert.status === 'Pending Review' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(alert.id, 'Reviewed')}
                        className="border-green-600 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Mark Reviewed
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(alert.id, 'Dismissed')}
                        className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Dismiss
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default FraudAlertsDisplay;