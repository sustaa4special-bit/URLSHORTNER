"use client";

import React from "react";
import Layout from "@/components/Layout";

const LoginPage = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-var(--navbar-height)-var(--footer-height))]">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Login
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Sign in to your Clipverse account.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;