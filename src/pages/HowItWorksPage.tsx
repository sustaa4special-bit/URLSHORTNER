"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MadeWithDyad } from "@/components/made-with-dyad";
import HowItWorks from "@/components/HowItWorks"; // Re-using the existing component

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HowItWorks /> {/* Displaying the existing HowItWorks component */}
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default HowItWorksPage;