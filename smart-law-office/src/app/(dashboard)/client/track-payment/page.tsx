"use client";

import React from "react";
import PaymentHistory from "@/components/dashboard/client/trackPayment/PaymentHistory";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download } from "lucide-react";

const TrackPaymentPage = () => {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Billing History
            </h1>
            <p className="text-sm text-gray-500">
              Track and manage your payment records
            </p>
          </div>
        </div>

        <Button className="bg-violet-600 hover:bg-violet-700 w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Main Content - The Component we built earlier */}
      <div className="mt-4">
        <PaymentHistory />
      </div>
    </div>
  );
};

export default TrackPaymentPage;
