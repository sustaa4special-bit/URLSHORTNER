"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { UserProfile, VerificationStatus, submitKycVerification } from "@/utils/userData";
import { CheckCircle, AlertTriangle, Hourglass, XCircle, Upload, CalendarDays, MapPin, User } from "lucide-react";
import { motion } from "framer-motion";
import { showSuccess, showError } from "@/utils/toast";

interface IdentityVerificationProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onRefresh: () => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ userProfile, onUpdate, onRefresh }) => {
  const [fullName, setFullName] = useState(userProfile.kycDetails?.fullName || "");
  const [dob, setDob] = useState<Date | undefined>(userProfile.kycDetails?.dob);
  const [address, setAddress] = useState(userProfile.kycDetails?.address || "");
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFullName(userProfile.kycDetails?.fullName || "");
    setDob(userProfile.kycDetails?.dob);
    setAddress(userProfile.kycDetails?.address || "");
  }, [userProfile.kycDetails]);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge className="bg-green-500/20 text-green-400 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Approved
          </Badge>
        );
      case 'Pending Review':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
            <Hourglass className="h-4 w-4 animate-pulse" /> Pending Review
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-red-500/20 text-red-400 flex items-center gap-1">
            <XCircle className="h-4 w-4" /> Rejected
          </Badge>
        );
      case 'Not Submitted':
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" /> Not Submitted
          </Badge>
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!fullName || !dob || !address || !idFrontFile || !idBackFile) {
      showError("Please fill in all fields and upload both ID documents.");
      setIsSubmitting(false);
      return;
    }

    // Basic age check (e.g., must be 18+)
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    if (dob > eighteenYearsAgo) {
      showError("You must be at least 18 years old to verify your identity.");
      setIsSubmitting(false);
      return;
    }

    // Simulate file upload and API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      submitKycVerification({
        fullName,
        dob,
        address,
        idFrontUrl: `mock-id-front-${idFrontFile.name}`, // Mock URL
        idBackUrl: `mock-id-back-${idBackFile.name}`,   // Mock URL
      });
      showSuccess("Identity verification submitted for review!");
      onRefresh(); // Refresh parent state to update status
    } catch (error) {
      showError("Failed to submit identity verification.");
      console.error("KYC submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = userProfile.kycStatus === 'Pending Review' || userProfile.kycStatus === 'Approved';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardContent className="px-0 py-0 space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600">
          <CardDescription className="text-gray-300 flex items-center">
            Your current identity verification status:
          </CardDescription>
          {getStatusBadge(userProfile.kycStatus)}
        </div>

        {userProfile.kycStatus === 'Rejected' && userProfile.verificationReason && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-md text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Reason for rejection: {userProfile.verificationReason}
          </div>
        )}

        {userProfile.kycStatus === 'Approved' ? (
          <div className="text-center p-8 bg-green-500/10 border border-green-500 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Identity Verified!</h3>
            <p className="text-gray-300">Your identity has been successfully verified. You're all set!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="fullNameLegal" className="text-gray-300 flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-400" /> Full Legal Name
              </Label>
              <Input
                id="fullNameLegal"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dob" className="text-gray-300 flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-gray-400" /> Date of Birth
              </Label>
              <DatePicker
                date={dob}
                setDate={setDob}
                placeholder="Select your date of birth"
                disabled={isFormDisabled}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address" className="text-gray-300 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" /> Full Address
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="idFront" className="text-gray-300 flex items-center">
                  <Upload className="h-4 w-4 mr-2 text-gray-400" /> Upload ID Front
                </Label>
                <Input
                  id="idFront"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setIdFrontFile(e.target.files ? e.target.files[0] : null)}
                  className="bg-gray-800 border-gray-700 text-white file:text-indigo-400 file:bg-gray-700 file:border-0 file:rounded-md file:px-3 file:py-1 hover:file:bg-gray-600"
                  required
                  disabled={isFormDisabled}
                />
                {idFrontFile && <p className="text-sm text-gray-400">File: {idFrontFile.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="idBack" className="text-gray-300 flex items-center">
                  <Upload className="h-4 w-4 mr-2 text-gray-400" /> Upload ID Back
                </Label>
                <Input
                  id="idBack"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setIdBackFile(e.target.files ? e.target.files[0] : null)}
                  className="bg-gray-800 border-gray-700 text-white file:text-indigo-400 file:bg-gray-700 file:border-0 file:rounded-md file:px-3 file:py-1 hover:file:bg-gray-600"
                  required
                  disabled={isFormDisabled}
                />
                {idBackFile && <p className="text-sm text-gray-400">File: {idBackFile.name}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isFormDisabled}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </motion.div>
  );
};

export default IdentityVerification;