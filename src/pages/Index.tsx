"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureHighlights from "@/components/FeatureHighlights";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <HeroSection />
      <FeatureHighlights />
      <MadeWithDyad />
    </div>
  );
};

export default Index;