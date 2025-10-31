"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-black py-24 px-6 md:px-12 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 animate-in fade-in-0 slide-in-from-top-8 duration-700">
          Ready to elevate your brand or monetize your content?
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-100">
          Join Clipverse today and connect with a vibrant community of brands and creators driving real performance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-200">
          <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/login">
              Start a Campaign <ArrowRight className="ml-2 h-5 w-5 inline-block" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/creators">
              Join as Creator
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;