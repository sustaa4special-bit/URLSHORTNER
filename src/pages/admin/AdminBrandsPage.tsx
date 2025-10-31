"use client";

import React from "react";
import AdminLayout from "@/components/AdminLayout";

const AdminBrandsPage = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-var(--navbar-height)-var(--footer-height))]">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Brands Management
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            This section will allow admins to manage brand accounts. (Coming Soon)
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBrandsPage;