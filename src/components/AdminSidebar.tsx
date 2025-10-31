"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle,
  Wallet,
  Megaphone,
  Users,
  Building2,
  ScrollText,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Verification Queue", href: "/admin/verifications", icon: CheckCircle },
  { name: "Withdrawals", href: "/admin/withdrawals", icon: Wallet },
  { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { name: "Creators", href: "/admin/creators", icon: Users },
  { name: "Brands", href: "/admin/brands", icon: Building2 },
  { name: "System Logs", href: "/admin/logs", icon: ScrollText },
  { name: "Fraud Alerts", href: "/admin/fraud-alerts", icon: AlertTriangle },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-800 p-6 flex flex-col sticky top-0 h-screen shadow-lg">
      <div className="mb-8">
        <Link to="/admin" className="text-3xl font-bold text-white">
          Clipverse
        </Link>
        <p className="text-sm text-gray-500 mt-1">Admin Console</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center p-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                isActive && "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-800 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Clipverse</p>
        <p>Version 1.0.0</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;