import React from "react";
import { TbInvoice } from "react-icons/tb";

const TrackBilling = () => {
  return (
    <div className="flex flex-col items-center justify-center p-20 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
      {/* Icon */}
      <TbInvoice className="h-16 w-16 text-purple-600 mb-4" />
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-3">Case</h2>
      {/* Descritption */}
      <p className="text-gray-800 mb-2 max-w-sm">
        Track invoices, payments and outstanding balances once you start adding
        billable items to your clients matters.
      </p>
      <span className="text-gray-400 mb-8 max-w-sm">
        We cannot access funds without your permission
      </span>
    </div>
  );
};

export default TrackBilling;
