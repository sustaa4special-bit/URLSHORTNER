"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureHighlights from "@/components/FeatureHighlights";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction"; // Import the new component

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <HeroSection />
      <FeatureHighlights />
      <HowItWorks />
      <Testimonials />
      <CallToAction /> {/* Add the CallToAction component here */}
      <MadeWithDyad />
    </div>
  );
};

export default Index;