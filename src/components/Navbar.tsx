"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="relative z-10 w-full py-4 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Clipverse
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/brands" className="text-gray-300 hover:text-white transition-colors">
          Brands
        </Link>
        <Link to="/creators" className="text-gray-300 hover:text-white transition-colors">
          Creators
        </Link>
        <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
          How It Works
        </Link>
        <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
          Login
        </Link>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          Start Campaign
        </Button>
      </div>
      {/* Mobile menu toggle would go here */}
    </nav>
  );
};

export default Navbar;