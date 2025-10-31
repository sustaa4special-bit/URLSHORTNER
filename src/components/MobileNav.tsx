"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-gray-900 text-white border-l border-gray-700">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold text-white text-left">Clipverse</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-6 text-lg">
          <SheetClose asChild>
            <Link to="/brands" className="hover:text-indigo-400 transition-colors text-left">
              Brands
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/creator-dashboard" className="hover:text-indigo-400 transition-colors text-left">
              Dashboard
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/explore-campaigns" className="hover:text-indigo-400 transition-colors text-left">
              Explore Campaigns
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/how-it-works" className="hover:text-indigo-400 transition-colors text-left">
              How It Works
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/wallet" className="hover:text-indigo-400 transition-colors text-left">
              My Wallet
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/analytics" className="hover:text-indigo-400 transition-colors text-left">
              Analytics
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/profile" className="hover:text-indigo-400 transition-colors text-left"> {/* New Profile Link */}
              Profile
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/login" className="hover:text-indigo-400 transition-colors text-left">
              Login
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/admin" className="hover:text-indigo-400 transition-colors text-left">
              Admin Panel
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;