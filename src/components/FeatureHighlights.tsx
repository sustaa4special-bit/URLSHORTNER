"use client";

import React from "react";
import { Target, DollarSign, Zap } from "lucide-react";

const FeatureHighlights = () => {
  const features = [
    {
      icon: <Target className="h-8 w-8 text-purple-400" />,
      title: "For Brands: Results, not promises.",
      description: "Achieve measurable impact with performance-based campaigns.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-indigo-400" />,
      title: "For Creators: Earn for your creativity.",
      description: "Monetize your content and grow with exciting brand partnerships.",
    },
    {
      icon: <Zap className="h-8 w-8 text-pink-400" />,
      title: "For Everyone: Simple, fast, transparent.",
      description: "Experience a seamless platform designed for efficiency and clarity.",
    },
  ];

  return (
    <section className="bg-gray-900 py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-gray-700 shadow-xl text-center flex flex-col items-center animate-in fade-in-0 slide-in-from-bottom-8 duration-700"
            style={{ animationDelay: `${index * 100 + 600}ms` }} // Staggered animation
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-300 text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights;