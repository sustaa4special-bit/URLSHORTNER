"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/utils/userData";
import { CheckCircle, User, Mail, Globe, MessageSquare, Clock, Languages } from "lucide-react";
import { motion } from "framer-motion"; // <--- ADDED THIS IMPORT
import { showSuccess, showError } from "@/utils/toast";

interface PersonalInfoFormProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ userProfile, onUpdate }) => {
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [email, setEmail] = useState(userProfile.email);
  const [country, setCountry] = useState(userProfile.country);
  const [bio, setBio] = useState(userProfile.bio);
  const [timezone, setTimezone] = useState(userProfile.timezone);
  const [language, setLanguage] = useState(userProfile.language);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFullName(userProfile.fullName);
    setEmail(userProfile.email);
    setCountry(userProfile.country);
    setBio(userProfile.bio);
    setTimezone(userProfile.timezone);
    setLanguage(userProfile.language);
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!fullName || !email || !country || !timezone || !language) {
      showError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      showError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onUpdate({
      fullName,
      email,
      country,
      bio,
      timezone,
      language,
      // If email changes, set emailVerified to false to trigger re-verification
      emailVerified: email === userProfile.email ? userProfile.emailVerified : false,
    });

    setIsSubmitting(false);
  };

  const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "India", "Brazil"];
  const timezones = ["America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Tokyo", "Australia/Sydney"];
  const languages = ["English", "Spanish", "French", "German"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white shadow-xl p-6 md:p-8">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <User className="h-6 w-6 mr-3 text-indigo-400" /> Personal Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            Update your personal details and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-300 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" /> Email
                  {userProfile.emailVerified && <CheckCircle className="h-4 w-4 ml-2 text-green-400" />}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500"
                  required
                />
                {!userProfile.emailVerified && (
                  <p className="text-sm text-yellow-400 flex items-center mt-1">
                    <AlertTriangle className="h-4 w-4 mr-1" /> Email not verified. Check your inbox.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio" className="text-gray-300 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-400" /> Bio (max 160 characters)
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 min-h-[80px]"
              />
              <p className="text-xs text-gray-500 text-right">{bio.length}/160</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="country" className="text-gray-300 flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-gray-400" /> Country
                </Label>
                <Select value={country} onValueChange={setCountry} required>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {countries.map((c) => (
                      <SelectItem key={c} value={c} className="hover:bg-gray-700 focus:bg-gray-700">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone" className="text-gray-300 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" /> Timezone
                </Label>
                <Select value={timezone} onValueChange={setTimezone} required>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz} className="hover:bg-gray-700 focus:bg-gray-700">{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language" className="text-gray-300 flex items-center">
                  <Languages className="h-4 w-4 mr-2 text-gray-400" /> Language
                </Label>
                <Select value={language} onValueChange={setLanguage} required>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:border-indigo-500 transition-colors">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang} className="hover:bg-gray-700 focus:bg-gray-700">{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonalInfoForm;