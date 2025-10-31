"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Receipt, BarChart, ShieldCheck, Wallet, Rocket, CalendarDays, Activity, ArrowRight } from "lucide-react";

const DualValueSection = () => {
  const brandBenefits = [
    {
      icon: <Target className="h-6 w-6 text-purple-400" />,
      text: "Set measurable goals: Choose between per-view, per-like, or per-clip payouts.",
    },
    {
      icon: <Receipt className="h-6 w-6 text-indigo-400" />,
      text: "Transparent costs: You control budget caps — most brands start with $250–$1,000 test budgets.",
    },
    {
      icon: <BarChart className="h-6 w-6 text-pink-400" />,
      text: "Live analytics: Track real-time views, conversions, and ROI in one dashboard.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-400" />,
      text: "Fraud-protected system: Each post is verified through public platform metrics before payment.",
    },
  ];

  const creatorBenefits = [
    {
      icon: <Wallet className="h-6 w-6 text-purple-400" />,
      text: "Guaranteed payouts: Average creator earns $15–$45 per approved clip.",
    },
    {
      icon: <Rocket className="h-6 w-6 text-indigo-400" />,
      text: "No brand calls: You just pick a campaign, post, and submit your link.",
    },
    {
      icon: <CalendarDays className="h-6 w-6 text-pink-400" />,
      text: "Weekly payments: Verified clips are paid every Friday — directly to your wallet.",
    },
    {
      icon: <Activity className="h-6 w-6 text-green-400" />,
      text: "Performance tracking: Watch your clip stats (views, likes, approval) live inside your dashboard.",
    },
  ];

  return (
    <section className="bg-gray-950 py-20 px-6 md:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Title + Intro */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-in fade-in-0 slide-in-from-top-8 duration-700">
            Built for Everyone in the Creator Economy
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-100">
            Clipverse makes it simple for brands to launch viral campaigns — and for creators to turn content into income.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-20">
          {/* Column 1 — For Brands */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-xl flex flex-col justify-between transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl animate-in fade-in-0 slide-in-from-left-8 duration-700 delay-200">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">For Brands — Pay Only for Real Results</h3>
              <p className="text-gray-300 text-lg mb-8">
                No influencers, no guesswork — just measurable creator performance.
              </p>
              <ul className="space-y-6 mb-10">
                {brandBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {benefit.icon}
                    <p className="text-gray-200 text-base leading-relaxed">{benefit.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/login">
                Launch a Campaign
              </Link>
            </Button>
          </div>

          {/* Column 2 — For Creators */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-xl flex flex-col justify-between transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl animate-in fade-in-0 slide-in-from-right-8 duration-700 delay-300">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">For Creators — Earn Doing What You Love</h3>
              <p className="text-gray-300 text-lg mb-8">
                Get paid instantly for posting real clips on TikTok, Instagram, or YouTube Shorts.
              </p>
              <ul className="space-y-6 mb-10">
                {creatorBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {benefit.icon}
                    <p className="text-gray-200 text-base leading-relaxed">{benefit.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/creators">
                Join as Creator
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer CTA Bar */}
        <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-gray-800 shadow-lg animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-400">
          <p className="text-2xl md:text-3xl font-bold text-white mb-6">
            Start scaling your reach with performance-based campaigns.
          </p>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/login">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5 inline-block" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DualValueSection;