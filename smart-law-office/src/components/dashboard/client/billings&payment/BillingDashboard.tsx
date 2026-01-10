// src/components/billing/BillingDashboard.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useInvoiceStore } from "@/store/invoiceStore";
import { BillingHistoryTable } from "./BillingHistoryTable";

export function BillingDashboard() {
  const { setStep } = useInvoiceStore();
  const [viewMode, setViewMode] = useState<"table" | "grouped">("table"); // Toggles between billingDash.png and billinghistory.png style

  const handleGenerateInvoice = () => {
    setStep("form");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Billing</h1>
        <Button
          onClick={handleGenerateInvoice}
          className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Generate Invoice</span>
        </Button>
      </div>

      <div className="flex justify-end items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select
            onValueChange={(value) => setViewMode(value as "table" | "grouped")}
            defaultValue={viewMode}
          >
            <SelectTrigger className="w-[120px] bg-white border">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">All History</SelectItem>
              <SelectItem value="grouped">Grouped</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          className="bg-purple-50 text-purple-600 hover:bg-purple-100"
        >
          Download Billing History
        </Button>
      </div>

      {/* Billing History Table */}
      <BillingHistoryTable isGroupedView={viewMode === "grouped"} />
    </div>
  );
}
