"use client";

import React from "react";
import { CheckCircle, Upload, Hourglass, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignVerificationStepsProps {
  currentStatus: 'Not Applied' | 'Pending Review' | 'Approved' | 'Submitted' | 'Under Manual Review' | 'Completed' | 'Rejected';
}

const CampaignVerificationSteps: React.FC<CampaignVerificationStepsProps> = ({ currentStatus }) => {
  const steps = [
    { id: 'apply', name: 'Apply', icon: CheckCircle },
    { id: 'submit', name: 'Submit Clip', icon: Upload },
    { id: 'verify', name: 'Verify', icon: Hourglass },
    { id: 'paid', name: 'Paid', icon: DollarSign },
  ];

  const getStepStatus = (stepId: string) => {
    switch (stepId) {
      case 'apply':
        return currentStatus !== 'Not Applied' ? 'completed' : 'active';
      case 'submit':
        return ['Submitted', 'Under Manual Review', 'Approved', 'Completed', 'Rejected'].includes(currentStatus) ? 'completed' :
               currentStatus === 'Approved' ? 'active' : 'upcoming';
      case 'verify':
        return ['Approved', 'Completed'].includes(currentStatus) ? 'completed' :
               ['Submitted', 'Under Manual Review'].includes(currentStatus) ? 'active' : 'upcoming';
      case 'paid':
        return currentStatus === 'Completed' ? 'completed' : 'upcoming';
      default:
        return 'upcoming';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 shadow-xl animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-400">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Your Campaign Journey</h3>
      <div className="flex justify-between items-center relative">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-700 mx-auto w-[calc(100%-4rem)]"></div>

        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative flex flex-col items-center z-10 w-1/4">
              <div
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all duration-500 ease-in-out",
                  status === 'completed'
                    ? "bg-green-600 border-green-400 text-white"
                    : status === 'active'
                    ? "bg-indigo-600 border-indigo-400 text-white animate-pulse"
                    : "bg-gray-700 border-gray-600 text-gray-400"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p
                className={cn(
                  "mt-2 text-sm font-medium text-center transition-colors duration-500",
                  status === 'completed' ? "text-white" : status === 'active' ? "text-indigo-400" : "text-gray-400"
                )}
              >
                {step.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignVerificationSteps;