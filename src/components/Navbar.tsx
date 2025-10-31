"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  return (
    <nav className="relative z-10 w-full py-4 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Clipverse
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-8"> {/* Desktop navigation */}
        <Link to="/brands" className="text-gray-300 hover:text-white transition-colors">
          Brands
        </Link>
        <Link to="/creator-dashboard" className="text-gray-300 hover:text-white transition-colors">
          Dashboard
        </Link>
        <Link to="/explore-campaigns" className="text-gray-300 hover:text-white transition-colors">
          Explore Campaigns
        </Link>
        <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
          How It Works
        </Link>
        <Link to="/wallet" className="text-gray-300 hover:text-white transition-colors"> {/* New Wallet Link */}
          My Wallet
        </Link>
        <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
          Login
        </Link>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <Link to="/brands"> {/* Link to Brand Dashboard */}
            Start Campaign
          </Link>
        </Button>
        <ThemeToggle />
      </div>
      <div className="md:hidden flex items-center gap-2"> {/* Mobile menu toggle and ThemeToggle */}
        <ThemeToggle />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;