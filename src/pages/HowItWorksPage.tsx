"use client";

import React from "react";
import Layout from "@/components/Layout";
import HowItWorks from "@/components/HowItWorks"; // Re-using the existing component

const HowItWorksPage = () => {
  return (
    <Layout>
      <HowItWorks /> {/* Displaying the existing HowItWorks component */}
    </Layout>
  );
};

export default HowItWorksPage;