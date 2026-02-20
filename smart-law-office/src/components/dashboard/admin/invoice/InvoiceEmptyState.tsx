import React from "react";
import { TbUserScreen } from "react-icons/tb";
import { Button } from "@/components/ui/button";

interface InvoiceEmptyStateProps {
  GenerateInvoice: () => void;
}

export function InvoiceEmptyState({ GenerateInvoice }: InvoiceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
      {/* Icon */}
      <TbUserScreen className="h-16 w-16 text-purple-700 mb-4" />

      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">Invoice</h2>

      {/* Description */}
      <p className="text-gray-600 mb-8 max-w-sm">
        Track Invoices, payments, and outstanding balances once you start adding
        billable items to your client matters
      </p>
      <span className="text-gray-3 mb-8 max-w-sm">
        We cannot access funds without your permission.
      </span>

      {/* Generate Invoice Button */}
      <Button
        onClick={GenerateInvoice}
        className="bg-[#6f42c1] hover:bg-[#5a369e] text-white px-6 py-3"
      >
        Generate Invoice
      </Button>
    </div>
  );
}
