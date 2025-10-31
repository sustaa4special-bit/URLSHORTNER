"use client";

import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FeatureHighlights from "@/components/FeatureHighlights";
import HowItWorks from "@/components/HowItWorks";
import DualValueSection from "@/components/DualValueSection";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection"; // Import the new component
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeatureHighlights />
      <HowItWorks />
      <DualValueSection />
      <Testimonials />
      <FAQSection /> {/* Add the new FAQSection here */}
      <CallToAction />
    </Layout>
  );
};

export default Index;