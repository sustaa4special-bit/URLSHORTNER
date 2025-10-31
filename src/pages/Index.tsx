"use client";

import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FeatureHighlights from "@/components/FeatureHighlights";
import HowItWorks from "@/components/HowItWorks";
import DualValueSection from "@/components/DualValueSection"; // Import the new component
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeatureHighlights />
      <HowItWorks />
      <DualValueSection /> {/* Add the new DualValueSection here */}
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;