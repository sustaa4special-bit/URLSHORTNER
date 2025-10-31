"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { deleteUserAccount } from "@/utils/userData";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

interface DeleteAccountSectionProps {
  onAccountDeleted: () => void;
}

const DeleteAccountSection: React.FC<DeleteAccountSectionProps> = ({ onAccountDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

    try {
      const success = deleteUserAccount();
      if (success) {
        showSuccess("Your account has been permanently deleted.");
        onAccountDeleted();
        navigate("/login"); // Redirect to login page after deletion
      } else {
        showError("Failed to delete account.");
      }
    } catch (error) {
      showError("An error occurred during account deletion.");
      console.error("Account deletion error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-red-900/20 backdrop-blur-lg border border-red-700 text-white shadow-xl p-6 md:p-8">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-bold text-red-400 flex items-center">
            <Trash2 className="h-6 w-6 mr-3" /> Delete Account
          </CardTitle>
          <CardDescription className="text-red-300">
            Permanently delete your Clipverse account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0 mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? "Deleting..." : "Delete Account Permanently"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-400 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2" /> Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers, including campaign history, earnings, and connected social accounts.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeleteAccountSection;