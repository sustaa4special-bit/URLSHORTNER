"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile, PayoutMethodType, updatePayoutMethod } from "@/utils/userData";
import { getWithdrawalTransactions, WithdrawalTransaction } from "@/utils/walletData"; // Re-using withdrawal transactions for log
import { DollarSign, CreditCard, Banknote, Bitcoin, History } from "lucide-react";
import { motion } from "framer-motion"; // <--- ADDED THIS IMPORT
import { showSuccess, showError } from "@/utils/toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PayoutBillingSettingsProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onRefresh: () => void; // To trigger full data refresh
}

const PayoutBillingSettings: React.FC<PayoutBillingSettingsProps> = ({ userProfile, onUpdate, onRefresh }) => {
  const [payoutMethodType, setPayoutMethodType] = useState<PayoutMethodType | "">(userProfile.payoutMethod?.type || "");
  const [payoutDetails, setPayoutDetails] = useState(userProfile.payoutMethod?.details || "");
  const [confirmPayoutDetails, setConfirmPayoutDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalTransaction[]>([]);

  useEffect(() => {
    setPayoutMethodType(userProfile.payoutMethod?.type || "");
    setPayoutDetails(userProfile.payoutMethod?.details || "");
    setConfirmPayoutDetails(userProfile.payoutMethod?.details || ""); // Pre-fill confirm for existing
    setWithdrawalHistory(getWithdrawalTransactions().sort((a, b) => b.date.getTime() - a.date.getTime()));
  }, [userProfile, onRefresh]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!payoutMethodType || !payoutDetails || !confirmPayoutDetails) {
      showError("Please fill in all payout method fields.");
      setIsSubmitting(false);
      return;
    }

    if (payoutDetails !== confirmPayoutDetails) {
      showError("Payout details do not match. Please confirm carefully.");
      setIsSubmitting(false);
      return;
    }

    // Basic validation based on method type
    if (payoutMethodType === 'PayPal' && !/\S+@\S+\.\S+/.test(payoutDetails)) {
      showError("Please enter a valid PayPal email address.");
      setIsSubmitting(false);
      return;
    }
    // Add more validation for Bank Transfer (e.g., regex for account numbers) or Crypto (wallet address format)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      updatePayoutMethod(payoutMethodType, payoutDetails);
      showSuccess("Payout method updated successfully!");
      onRefresh(); // Refresh parent state
    } catch (error) {
      showError("Failed to update payout method.");
      console.error("Payout method update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPayoutMethodIcon = (method: PayoutMethodType | "") => {
    switch (method) {
      case 'PayPal': return <Banknote className="h-5 w-5 mr-2 text-indigo-400" />;
      case 'Bank Transfer': return <CreditCard className="h-5 w-5 mr-2 text-purple-400" />;
      case 'Crypto (USDT)': return <Bitcoin className="h-5 w-5 mr-2 text-green-400" />;
      default: return <DollarSign className="h-5 w-5 mr-2 text-gray-400" />;
    }
  };

  const maskDetails = (details: string) => {
    if (!details) return "";
    if (details.length <= 4) return "****";
    return `**** **** **** ${details.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <DollarSign className="h-6 w-6 mr-3 text-indigo-400" /> Payout & Billing
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your payout methods and view your withdrawal history.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0 space-y-8">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="payoutMethodType" className="text-gray-300 flex items-center">
                {getPayoutMethodIcon(payoutMethodType)} Payout Method
              </Label>
              <Select value={payoutMethodType} onValueChange={(value: PayoutMethodType) => setPayoutMethodType(value)} required>
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                  <SelectValue placeholder="Select payout method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="PayPal" className="hover:bg-gray-700 focus:bg-gray-700 flex items-center">
                    <Banknote className="h-4 w-4 mr-2" /> PayPal
                  </SelectItem>
                  <SelectItem value="Bank Transfer" className="hover:bg-gray-700 focus:bg-gray-700 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" /> Bank Transfer
                  </SelectItem>
                  <SelectItem value="Crypto (USDT)" className="hover:bg-gray-700 focus:bg-gray-700 flex items-center">
                    <Bitcoin className="h-4 w-4 mr-2" /> Crypto (USDT)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payoutDetails" className="text-gray-300">
                {payoutMethodType === 'PayPal' && "PayPal Email"}
                {payoutMethodType === 'Bank Transfer' && "Bank Account Number"}
                {payoutMethodType === 'Crypto (USDT)' && "USDT Wallet Address"}
                {!payoutMethodType && "Payout Details"}
              </Label>
              <Input
                id="payoutDetails"
                type={payoutMethodType === 'PayPal' ? 'email' : 'text'}
                placeholder={
                  payoutMethodType === 'PayPal' ? 'your@paypal.com' :
                  payoutMethodType === 'Bank Transfer' ? 'Bank Account Number' :
                  payoutMethodType === 'Crypto (USDT)' ? 'USDT Wallet Address (ERC20/TRC20)' : ''
                }
                value={payoutDetails}
                onChange={(e) => setPayoutDetails(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPayoutDetails" className="text-gray-300">
                Confirm Payout Details
              </Label>
              <Input
                id="confirmPayoutDetails"
                type={payoutMethodType === 'PayPal' ? 'email' : 'text'}
                placeholder="Re-enter to confirm"
                value={confirmPayoutDetails}
                onChange={(e) => setConfirmPayoutDetails(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          {/* Withdrawal History */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <History className="h-6 w-6 mr-3 text-indigo-400" /> Withdrawal History
            </h3>
            {withdrawalHistory.length === 0 ? (
              <p className="text-gray-400">No withdrawal transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Method</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawalHistory.map((txn) => (
                      <TableRow key={txn.id} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                        <TableCell className="text-gray-400 text-sm">
                          {txn.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell className={`font-semibold ${txn.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                          -${txn.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-300">{txn.method}</TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs px-2 py-1 rounded-full ${
                              txn.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                              txn.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {txn.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PayoutBillingSettings;