"use client";

import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      {/* Background gradient overlay for depth */}
      <div className="absolute inset-0 opacity-70"></div>

      <div className="relative z-10 max-w-4xl mx-auto pt-20 pb-32">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-in fade-in-0 slide-in-from-top-8 duration-700">
          Launch viral creator campaigns and pay only for performance.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-100">
          Clipverse bridges brands with top creators for authentic, trackable engagement that drives real results.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-200">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Start a Campaign
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Join as Creator
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-xl animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-300">
            <p className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">$2.5M+</p>
            <p className="text-gray-300 text-lg">Paid to Creators</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-xl animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-400">
            <p className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">12K+</p>
            <p className="text-gray-300 text-lg">Active Creators</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-xl animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-500">
            <p className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">1.8K+</p>
            <p className="text-gray-300 text-lg">Campaigns Launched</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;