"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      stepNum: 1,
      title: "Create a Campaign",
      summary: "Define your goals, budget, and creative brief.",
      description:
        "Brands set campaign goals (views, clicks, or engagement), upload a detailed brief, and choose a payout model (per-view or per-approved-clip). Set budget limits, required hashtags, and campaign dates. Most brands start with $200–$500 test campaigns.",
    },
    {
      stepNum: 2,
      title: "Creators Join and Post",
      summary: "Creators find campaigns, create content, and submit for verification.",
      description:
        "Creators browse live campaigns, accept briefs that align with their audience, and post authentic content on TikTok or Instagram Reels. Our system verifies required hashtags, post links, and view counts through platform APIs. Verification runs every 24 hours using TikTok/IG metrics.",
    },
    {
      stepNum: 3,
      title: "Track & Earn",
      summary: "Monitor performance, receive payouts, and scale your success.",
      description:
        "An intuitive analytics dashboard provides live views, approval rates, and payout statuses. Payouts are released every Friday once clips pass verification. Average approval rate ≈ 92%, median payout $15 per clip.",
    },
  ];

  return (
    <section className="bg-gray-950 py-20 px-6 md:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-in fade-in-0 slide-in-from-top-8 duration-700">
            How Clipverse Works
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-100">
            We connect brands and creators through verified, performance-based campaigns.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gray-700 mx-auto w-[calc(100%-10rem)]"></div>

          {steps.map((step, index) => (
            <div
              key={step.stepNum}
              className="relative bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-gray-700 shadow-xl flex flex-col items-center text-center animate-in fade-in-0 slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 150 + 200}ms` }}
            >
              <div className="absolute -top-6 md:top-auto md:-left-6 md:relative md:mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600 text-white font-bold text-xl border-2 border-indigo-400 shadow-lg">
                {step.stepNum}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 mt-6 md:mt-0">{step.title}</h3>
              <p className="text-indigo-400 text-lg mb-4">{step.summary}</p>
              <p className="text-gray-300 text-base">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Footer CTA Bar */}
        <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-gray-800 shadow-lg animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-700">
          <p className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to launch your first campaign?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/login">
                Start Now <ArrowRight className="ml-2 h-5 w-5 inline-block" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/brands">
                Browse Live Campaigns
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;