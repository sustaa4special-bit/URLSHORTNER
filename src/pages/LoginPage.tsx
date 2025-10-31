"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MadeWithDyad } from "@/components/made-with-dyad";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Login
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Sign in to your Clipverse account.
          </p>
        </div>
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default LoginPage;