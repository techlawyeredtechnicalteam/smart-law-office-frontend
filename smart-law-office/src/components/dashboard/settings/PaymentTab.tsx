"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit, ChevronDown, Loader2 } from "lucide-react";
import { useFirmProfileStore } from "@/store/firmProfileStore"; // Adjust path as needed
import { toast } from "sonner";

export default function PaymentTab() {
  const {
    formData: storeData,
    fetchProfile,
    isSubmitting
  } = useFirmProfileStore();

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [firmName, setfirmName] = useState("");

  // 1. Fetch data on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 2. Sync local state when store data arrives or when user cancels edit
  useEffect(() => {
    if (storeData) {
      setBankName(storeData.bankName || "");
      setAccountName(storeData.bankAccountName || "");
      setAccountNumber(storeData.bankAccountNumber || "");
      // If firmName isn't in firmData, you might need to adjust based on your API
      setfirmName(storeData.firmName || "");
    }
  }, [storeData, isEditing]);

  const handleSave = async () => {
    try {
      // Logic to call your updateProfile API would go here
      console.log("Saving...", {
        bankName,
        accountName,
        accountNumber,
        firmName
      });
      toast.success("Payment details updated!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update payment details");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isSubmitting && !storeData.bankName) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="animate-spin text-[#7C5CFC]" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-gray-50">
      <h3 className="text-lg font-semibold mb-6 text-gray-700">
        Account Details
      </h3>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Bank Name */}
        <div className="space-y-2">
          <Label
            htmlFor="bankName"
            className="text-xs text-gray-500 uppercase font-bold tracking-wider"
          >
            Bank Name
          </Label>
          <Input
            id="bankName"
            value={bankName}
            readOnly={!isEditing}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="E.g. Zenith Bank"
            className={cn(
              "border-gray-300 focus-visible:ring-[#7C5CFC]",
              !isEditing && "bg-gray-50"
            )}
          />
        </div>

        {/* Account Name */}
        <div className="space-y-2">
          <Label
            htmlFor="accountName"
            className="text-xs text-gray-500 uppercase font-bold tracking-wider"
          >
            Account Name
          </Label>
          <Input
            id="accountName"
            value={accountName}
            readOnly={!isEditing}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="E.g. Smart Law Office"
            className={cn(
              "border-gray-300 focus-visible:ring-[#7C5CFC]",
              !isEditing && "bg-gray-50"
            )}
          />
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <Label
            htmlFor="accountNumber"
            className="text-xs text-gray-500 uppercase font-bold tracking-wider"
          >
            Account Number
          </Label>
          <div className="relative">
            <Input
              id="accountNumber"
              value={accountNumber}
              readOnly={!isEditing}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="E.g. 1022334455"
              className={cn(
                "pr-10 border-gray-300 focus-visible:ring-[#7C5CFC]",
                !isEditing && "bg-gray-50"
              )}
            />
            {isEditing ? (
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            ) : (
              <Edit
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        <h3 className="text-lg font-semibold mb-4 text-gray-700">Firm Name</h3>
        <div className="space-y-2">
          <Label
            htmlFor="firmName"
            className="text-xs text-gray-500 uppercase font-bold tracking-wider"
          >
            Firm Name
          </Label>
          <Input
            id="firmName"
            type="text"
            value={firmName}
            readOnly={!isEditing}
            onChange={(e) => setfirmName(e.target.value)}
            placeholder="smartlawoffice"
            className={cn(
              "border-gray-300 focus-visible:ring-[#7C5CFC]",
              !isEditing && "bg-gray-50"
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          {isEditing ? (
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSave}
                className="bg-[#7C5CFC] hover:bg-[#6B46C1] text-white"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-[#EAE4FE] text-[#7C5CFC] hover:bg-[#DED7FF] font-semibold"
            >
              Change Details
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

// Helper utility for class merging
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
