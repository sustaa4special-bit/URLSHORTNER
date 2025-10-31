"use client";

import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, DollarSign, Clock, Wallet, CheckCircle, TrendingUp, Percent, Banknote, CreditCard, Bitcoin, Info, CalendarDays } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import {
  getPayoutTransactions,
  getWithdrawalTransactions,
  getWalletSummary,
  getNextPayoutDate,
  getMockPayoutStats,
  addWithdrawalTransaction,
  PayoutTransaction,
  WithdrawalTransaction,
  WithdrawalMethod,
  PayoutStatus,
} from "@/utils/walletData";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; // Import Badge component

const MIN_WITHDRAWAL_AMOUNT = 50;
const PAYOUT_THRESHOLD = 50; // Example threshold for progress bar

const CreatorWalletPage = () => {
  const [walletSummary, setWalletSummary] = useState(getWalletSummary());
  const [payoutTransactions, setPayoutTransactions] = useState<PayoutTransaction[]>([]);
  const [withdrawalTransactions, setWithdrawalTransactions] = useState<WithdrawalTransaction[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawalMethod, setWithdrawalMethod] = useState<WithdrawalMethod | "">("");
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [isRequestingWithdrawal, setIsRequestingWithdrawal] = useState(false);

  const [filterStatus, setFilterStatus] = useState<PayoutStatus | 'All'>('All');
  const [filterDateRange, setFilterDateRange] = useState<string>('All Time');
  const [displayedTransactionsCount, setDisplayedTransactionsCount] = useState(10);

  useEffect(() => {
    const updateData = () => {
      setWalletSummary(getWalletSummary());
      setPayoutTransactions(getPayoutTransactions());
      setWithdrawalTransactions(getWithdrawalTransactions());
    };

    updateData(); // Initial load

    // Set up an interval to refresh data, simulating real-time updates
    const interval = setInterval(updateData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const nextPayoutDate = useMemo(() => getNextPayoutDate(), []);
  const mockPayoutStats = useMemo(() => getMockPayoutStats(), []);

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequestingWithdrawal(true);

    const amount = parseFloat(withdrawAmount);

    if (isNaN(amount) || amount < MIN_WITHDRAWAL_AMOUNT) {
      showError(`Withdrawal amount must be at least $${MIN_WITHDRAWAL_AMOUNT}.`);
      setIsRequestingWithdrawal(false);
      return;
    }

    if (amount > walletSummary.currentBalance) {
      showError("Insufficient balance for this withdrawal amount.");
      setIsRequestingWithdrawal(false);
      return;
    }

    if (!withdrawalMethod) {
      showError("Please select a withdrawal method.");
      setIsRequestingWithdrawal(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    addWithdrawalTransaction({
      amount,
      method: withdrawalMethod,
      status: 'Pending', // Initial status
    });

    showSuccess("Withdrawal request received! Expected arrival within 3–5 days.");
    setWithdrawAmount("");
    setWithdrawalMethod("");
    setIsWithdrawalDialogOpen(false);
    setIsRequestingWithdrawal(false);

    // Refresh data immediately after withdrawal request
    setWalletSummary(getWalletSummary());
    setWithdrawalTransactions(getWithdrawalTransactions());
  };

  const allTransactions = useMemo(() => {
    const payoutsAsTransactions = payoutTransactions.map(p => ({
      date: p.date,
      campaignName: p.campaignHeadline,
      status: p.status,
      amount: p.amount,
      platform: p.platform,
      type: 'payout' as TransactionType,
      id: p.id,
    }));

    const withdrawalsAsTransactions = withdrawalTransactions.map(w => ({
      date: w.date,
      campaignName: `Withdrawal (${w.method})`,
      status: w.status === 'Completed' ? 'Paid Out' : w.status === 'Pending' ? 'Pending' : 'Rejected', // Map withdrawal status to payout-like status
      amount: -w.amount, // Negative for withdrawals
      platform: 'N/A',
      type: 'withdrawal' as TransactionType,
      id: w.id,
    }));

    return [...payoutsAsTransactions, ...withdrawalsAsTransactions].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [payoutTransactions, withdrawalTransactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;

    if (filterStatus !== 'All') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    const now = new Date();
    if (filterDateRange === 'Last 7 Days') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(t => t.date >= sevenDaysAgo);
    } else if (filterDateRange === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      filtered = filtered.filter(t => t.date >= thirtyDaysAgo);
    }

    return filtered;
  }, [allTransactions, filterStatus, filterDateRange]);

  const displayedTransactions = useMemo(() => {
    return filteredTransactions.slice(0, displayedTransactionsCount);
  }, [filteredTransactions, displayedTransactionsCount]);

  const hasMoreTransactions = displayedTransactionsCount < filteredTransactions.length;

  const loadMoreTransactions = () => {
    setDisplayedTransactionsCount(prev => prev + 10);
  };

  const payoutProgress = Math.min(100, (walletSummary.currentBalance / PAYOUT_THRESHOLD) * 100);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-in fade-in-0 slide-in-from-top-8 duration-700">
              My Wallet
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-100">
              Track your approved earnings, pending payouts, and withdrawal history.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Balance Summary & Payout Stats & Transactions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Balance Summary Card */}
              <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8 animate-in fade-in-0 slide-in-from-top-8 duration-700">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-2xl font-bold text-white">Current Balance</CardTitle>
                  <CardDescription className="text-5xl font-extrabold text-indigo-400">${walletSummary.currentBalance.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent className="px-0 py-0 space-y-4">
                  <div className="flex items-center justify-between text-gray-300">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-purple-400" /> Pending Approval
                    </div>
                    <span className="font-semibold text-white">${walletSummary.pendingApproval.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 mr-2 text-green-400" /> Lifetime Earnings
                    </div>
                    <span className="font-semibold text-white">${walletSummary.lifetimeEarnings.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-gray-700 my-4" />
                  <div className="text-sm text-gray-400">
                    Next Payout: <span className="font-medium text-white">{nextPayoutDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="text-sm text-gray-400 flex justify-between items-center">
                    <span>Payout Threshold: ${PAYOUT_THRESHOLD.toFixed(2)}</span>
                    <span>{payoutProgress.toFixed(0)}% towards next payout</span>
                  </div>
                  <Progress value={payoutProgress} className="w-full h-2 bg-gray-700 [&>div]:bg-indigo-600" />
                </CardContent>
              </Card>

              {/* Payout Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-200">
                <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 flex flex-col justify-between">
                  <CardTitle className="text-xl font-bold text-white mb-2">Approved Clips</CardTitle>
                  <CardDescription className="text-4xl font-extrabold text-green-400">{mockPayoutStats.totalApprovedClips}</CardDescription>
                </Card>
                <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 flex flex-col justify-between">
                  <CardTitle className="text-xl font-bold text-white mb-2">Avg Payout per Clip</CardTitle>
                  <CardDescription className="text-4xl font-extrabold text-purple-400">${mockPayoutStats.avgPayoutPerClip.toFixed(2)}</CardDescription>
                </Card>
                <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 flex flex-col justify-between">
                  <CardTitle className="text-xl font-bold text-white mb-2">Fastest Approval</CardTitle>
                  <CardDescription className="text-4xl font-extrabold text-indigo-400">{mockPayoutStats.fastestApprovalTime}</CardDescription>
                </Card>
                <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 flex flex-col justify-between">
                  <CardTitle className="text-xl font-bold text-white mb-2">Rejection Rate</CardTitle>
                  <CardDescription className="text-4xl font-extrabold text-red-400">{mockPayoutStats.rejectionRate.toFixed(1)}%</CardDescription>
                </Card>
              </div>

              {/* Transactions Table */}
              <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-300">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-2xl font-bold text-white">Transaction History</CardTitle>
                  <CardDescription className="text-gray-400">
                    All your payouts and withdrawals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 py-0">
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Select value={filterStatus} onValueChange={(value: PayoutStatus | 'All') => setFilterStatus(value)}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="All" className="hover:bg-gray-700 focus:bg-gray-700">All Statuses</SelectItem>
                        <SelectItem value="Approved" className="hover:bg-gray-700 focus:bg-gray-700">Approved</SelectItem>
                        <SelectItem value="Pending" className="hover:bg-gray-700 focus:bg-gray-700">Pending</SelectItem>
                        <SelectItem value="Paid Out" className="hover:bg-gray-700 focus:bg-gray-700">Paid Out</SelectItem>
                        <SelectItem value="Rejected" className="hover:bg-gray-700 focus:bg-gray-700">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                        <SelectValue placeholder="Filter by Date" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="All Time" className="hover:bg-gray-700 focus:bg-gray-700">All Time</SelectItem>
                        <SelectItem value="Last 7 Days" className="hover:bg-gray-700 focus:bg-gray-700">Last 7 Days</SelectItem>
                        <SelectItem value="Last 30 Days" className="hover:bg-gray-700 focus:bg-gray-700">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {displayedTransactions.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No transactions found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead className="text-gray-300">Date</TableHead>
                            <TableHead className="text-gray-300">Campaign / Type</TableHead>
                            <TableHead className="text-gray-300">Status</TableHead>
                            <TableHead className="text-gray-300 text-right">Amount</TableHead>
                            <TableHead className="text-gray-300">Platform</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedTransactions.map((txn) => (
                            <TableRow key={txn.id} className="border-gray-800 hover:bg-gray-800/70 transition-colors">
                              <TableCell className="text-gray-400 text-sm">
                                {txn.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </TableCell>
                              <TableCell className="font-medium text-white">{txn.campaignName}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    txn.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                    txn.status === 'Paid Out' ? 'bg-blue-500/20 text-blue-400' :
                                    txn.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}
                                >
                                  {txn.status}
                                </Badge>
                              </TableCell>
                              <TableCell className={`text-right font-semibold ${txn.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {txn.amount >= 0 ? `+$${txn.amount.toFixed(2)}` : `-$${Math.abs(txn.amount).toFixed(2)}`}
                              </TableCell>
                              <TableCell className="text-gray-400">{txn.platform}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  {hasMoreTransactions && (
                    <div className="text-center mt-6">
                      <Button
                        variant="outline"
                        onClick={loadMoreTransactions}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold py-2 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Withdrawal Panel */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 animate-in fade-in-0 slide-in-from-right-8 duration-700 delay-400">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-2xl font-bold text-white">Request Withdrawal</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your current withdrawable balance is <span className="font-semibold text-indigo-400">${walletSummary.currentBalance.toFixed(2)}</span>.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 py-0">
                  <Dialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                        disabled={walletSummary.currentBalance < MIN_WITHDRAWAL_AMOUNT}
                      >
                        Request Withdrawal <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Confirm Withdrawal</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          You are withdrawing from your available balance of <span className="font-semibold text-indigo-400">${walletSummary.currentBalance.toFixed(2)}</span>.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleWithdrawalRequest} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="withdraw-amount" className="text-gray-300">
                            Withdraw Amount (Min ${MIN_WITHDRAWAL_AMOUNT})
                          </Label>
                          <Input
                            id="withdraw-amount"
                            type="number"
                            placeholder={`${MIN_WITHDRAWAL_AMOUNT}.00`}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                            min={MIN_WITHDRAWAL_AMOUNT}
                            step="0.01"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="withdrawal-method" className="text-gray-300">
                            Withdrawal Method
                          </Label>
                          <Select value={withdrawalMethod} onValueChange={(value: WithdrawalMethod) => setWithdrawalMethod(value)} required>
                            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                              <SelectValue placeholder="Select method" />
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
                        <DialogFooter className="mt-6">
                          <Button
                            type="submit"
                            disabled={isRequestingWithdrawal || parseFloat(withdrawAmount) > walletSummary.currentBalance || parseFloat(withdrawAmount) < MIN_WITHDRAWAL_AMOUNT}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                          >
                            {isRequestingWithdrawal ? "Processing..." : "Confirm Withdrawal"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  {walletSummary.currentBalance < MIN_WITHDRAWAL_AMOUNT && (
                    <p className="text-sm text-red-400 mt-4 flex items-center">
                      <Info className="h-4 w-4 mr-2" /> Minimum withdrawal amount is ${MIN_WITHDRAWAL_AMOUNT.toFixed(2)}.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Security & Support Info */}
              <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-500">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-xl font-bold text-white">Important Information</CardTitle>
                </CardHeader>
                <CardContent className="px-0 py-0 space-y-3 text-gray-300 text-sm">
                  <p className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-indigo-400" /> All payouts processed weekly on Fridays.
                  </p>
                  <p className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-400" /> Transactions monitored for fraud and view authenticity.
                  </p>
                  <p className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-purple-400" /> Need help?{" "}
                    <Link to="/support" className="text-indigo-400 hover:underline ml-1">
                      Open a support ticket
                    </Link>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatorWalletPage;