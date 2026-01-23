"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useConsultationStore from "@/store/consultationStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Copy, Monitor } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { useFirmProfileStore } from "@/store/firmProfileStore";

export default function ConsultationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // Stores
  const { consultations, fetchConsultations } = useConsultationStore();
  const { user } = useAuthStore();
  const { fetchProfile, formData: paymentDetails } = useFirmProfileStore();
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    fetchProfile();
    if (consultations.length === 0) fetchConsultations();
  }, [fetchProfile, fetchConsultations, consultations.length]);

  // 1. Match exact consultation from booking
  const consult = consultations.find(
    (c) => c.id === id || (c as any)._id === id
  );

  if (!consult) {
    return (
      <div className="p-10 text-center text-gray-500">
        Consultation not found.
        <Button variant="link" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // 2. Exact Consultation ID from booking (using the #2026- prefix format)
  const displayId = `#2026-${consult.id?.slice(-4).toUpperCase() || "0012"}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    if (paymentDetails) {
      setBankName(paymentDetails.bankName);
      setAccountName(paymentDetails.bankAccountName);
      setAccountNumber(paymentDetails.bankAccountNumber);
    }
  }, [paymentDetails]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-[#f9fafb] min-h-screen">
      {/* Navigation & Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-bold text-gray-900 hover:opacity-70 transition-all"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Consultation Details
        </button>
        <Button
          variant="ghost"
          className="text-[#6f42c1] hover:text-[#5a369e] font-bold text-sm"
        >
          Convert to Case
        </Button>
      </div>

      <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white">
        {/* Top Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-6 border-b border-gray-50">
          <DetailItem label="Consultation ID" value={displayId} isBold />
          <DetailItem
            label="Client name"
            value={user?.firstName || user?.lastName || "Client"}
          />
          <DetailItem
            label="Status"
            value={
              <Badge className="bg-blue-50 text-blue-500 border-none shadow-none font-bold px-3 uppercase text-[10px]">
                {consult.status || "Scheduled"}
              </Badge>
            }
          />
          <DetailItem
            label="Date"
            value={
              consult.consultAt
                ? format(parseISO(consult.consultAt), "dd-MM-yyyy")
                : "TBD"
            }
            icon={<Calendar className="h-4 w-4 text-gray-400" />}
          />
          <DetailItem
            label="Time"
            value={
              consult.consultAt
                ? format(parseISO(consult.consultAt), "hh:mm a")
                : "TBD"
            }
            icon={<Clock className="h-4 w-4 text-gray-400" />}
          />
          <DetailItem
            label="Platform"
            value="Google Meet"
            icon={<Monitor className="h-4 w-4 text-gray-400" />}
          />
        </div>

        {/* 3. Notes Section: Matching exact notes from booking */}
        <div className="p-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Notes</h3>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="whitespace-pre-wrap">
              {consult.note ||
                "No specific notes were provided during the booking process."}
            </p>
          </div>
        </div>

        {/* 4. Payment Details: Fetching Firm data from Profile */}
        <div className="bg-[#fcfcfd] p-8 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Payment Details
          </h3>
          <div className="space-y-4 max-w-2xl">
            {/* Accessing firm details from the user/profile store */}
            <PaymentRow label="Bank Name" value={bankName} />
            <PaymentRow label="Account Name" value={accountName} />
            <PaymentRow
              label="Account Number"
              value={accountNumber}
              onCopy={() => handleCopy(accountNumber)}
              hasCopy
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

// Helper Components
function DetailItem({ label, value, icon, isBold }: any) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {icon}
        <div
          className={
            isBold
              ? "font-bold text-gray-900 text-sm"
              : "font-medium text-gray-700 text-sm"
          }
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function PaymentRow({ label, value, hasCopy, onCopy }: any) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-900">{value}</span>
        {hasCopy && (
          <button
            aria-label="copy"
            onClick={onCopy}
            className="text-gray-400 hover:text-[#6f42c1] transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
