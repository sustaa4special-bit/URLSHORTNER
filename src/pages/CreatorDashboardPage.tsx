"use client";

import React from "react";
import Layout from "@/components/Layout";

const CreatorDashboardPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Creator Dashboard (Simplified)
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Loading content...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CreatorDashboardPage;