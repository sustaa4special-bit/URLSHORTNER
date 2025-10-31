"use client";

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6 md:px-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="col-span-full lg:col-span-1 mb-8 lg:mb-0">
          <Link to="/" className="text-3xl font-bold text-white mb-4 block">
            Clipverse
          </Link>
          <p className="text-sm leading-relaxed">
            Connecting brands with top creators for authentic, trackable engagement that drives real results.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/brands" className="hover:text-white transition-colors">
                Brands
              </Link>
            </li>
            <li>
              <Link to="/creators" className="hover:text-white transition-colors">
                Creators
              </Link>
            </li>
            <li>
              <Link to="/explore-campaigns" className="hover:text-white transition-colors">
                Explore Campaigns
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-white transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources (Placeholder for future expansion) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Social (Placeholder for future expansion) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
        &copy; {currentYear} Clipverse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;