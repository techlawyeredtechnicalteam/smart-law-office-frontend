// components/settings/PaymentTab.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit, ChevronDown } from "lucide-react";

export default function PaymentTab() {
  // State to simulate empty vs filled state
  const [isFilled, setIsFilled] = useState(true);

  const [bankName, setBankName] = useState(
    isFilled ? "United Bank for Africa" : ""
  );
  const [accountName, setAccountName] = useState(
    isFilled ? "Christine Adeola" : ""
  );
  const [accountNumber, setAccountNumber] = useState(
    isFilled ? "5000924120" : ""
  );
  const [contactEmail, setContactEmail] = useState(
    isFilled ? "christineadeola@gmail.com" : ""
  );

  const handleSave = () => {
    console.log("Saving payment details...", {
      bankName,
      accountName,
      accountNumber,
      contactEmail
    }); // Simulate save success
    setIsFilled(true);
  };

  const handleCancel = () => {
    // Reset to initial state or last saved state
    setBankName(isFilled ? "United Bank for Africa" : "");
    setAccountName(isFilled ? "Christine Adeola" : "");
    setAccountNumber(isFilled ? "5000924120" : "");
    setContactEmail(isFilled ? "christineadeola@gmail.com" : "");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      {" "}
      <h3 className="text-lg font-semibold mb-6 text-gray-700">
        Account Details
      </h3>{" "}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Bank Name */}{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="bankName" className="text-xs text-gray-500">
            Bank Name{" "}
          </Label>{" "}
          <Input
            id="bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder={isFilled ? undefined : "E.g Smart Law Office"}
            className="border-gray-300 focus-visible:ring-[#7C5CFC]"
          />{" "}
        </div>
        {/* Account Name */}{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="accountName" className="text-xs text-gray-500">
            Account Name{" "}
          </Label>{" "}
          <Input
            id="accountName"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder={isFilled ? undefined : "E.g Smart Law Office"}
            className="border-gray-300 focus-visible:ring-[#7C5CFC]"
          />{" "}
        </div>
        {/* Account Number */}{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="accountNumber" className="text-xs text-gray-500">
            Account Number{" "}
          </Label>{" "}
          <div className="relative">
            {" "}
            <Input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={isFilled ? undefined : "E.g. 5000-9241-2002-9421"}
              className="pr-10 border-gray-300 focus-visible:ring-[#7C5CFC]"
            />{" "}
            {isFilled ? (
              <Edit
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            ) : (
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            )}{" "}
          </div>{" "}
        </div>
        <hr className="border-gray-100" />{" "}
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {isFilled ? "Contact Email" : "Add Contact Email"}{" "}
        </h3>
        {/* Contact Email */}{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="contactEmail" className="text-xs text-gray-500">
            {isFilled ? "Existing email" : "Add email address"}{" "}
          </Label>{" "}
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder={isFilled ? undefined : "E.g. smartlawoffice@gmail.com"}
            className="border-gray-300 focus-visible:ring-[#7C5CFC]"
          />{" "}
        </div>
        {/* Buttons */}{" "}
        {!isFilled && (
          <div className="flex justify-end pt-4 space-x-4">
            {" "}
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel{" "}
            </Button>{" "}
            <Button
              type="submit"
              onClick={handleSave}
              className="bg-[#7C5CFC] hover:bg-[#6B46C1] text-white"
            >
              Save{" "}
            </Button>{" "}
          </div>
        )}{" "}
        {isFilled && (
          <div className="flex justify-end pt-4">
            {" "}
            <Button
              type="button"
              onClick={() => setIsFilled(false)}
              className="bg-[#EAE4FE] text-[#7C5CFC] hover:bg-[#DED7FF] font-semibold"
            >
              Change{" "}
            </Button>{" "}
          </div>
        )}{" "}
      </form>{" "}
    </div>
  );
}
