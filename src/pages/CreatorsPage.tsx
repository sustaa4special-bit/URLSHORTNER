"use client";

import React from "react";
import Layout from "@/components/Layout";

const CreatorsPage = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-var(--navbar-height)-var(--footer-height))]">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Creators
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            This is where creators can find campaigns and showcase their portfolio.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CreatorsPage;