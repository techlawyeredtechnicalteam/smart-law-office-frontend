"use client";

import React from "react";
import { Case } from "@/store/createCase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  Copy,
  ArrowRight,
  User as UserIcon,
  Gavel
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

interface CaseDetailsModalProps {
  selectedCase: Case | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CaseDetailsModal = ({
  selectedCase,
  isOpen,
  onClose
}: CaseDetailsModalProps) => {
  if (!selectedCase) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Format ID similar to the #2026- format
  const displayId = `#2026-${selectedCase.id?.slice(-4).toUpperCase() || "0000"}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl bg-[#f9fafb]">
        {/* Header Section */}
        <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
              <Gavel className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {selectedCase.clientName} Details
            </DialogTitle>
          </div>
        </div>

        {/* Top Info Bar (The Grid Layout) */}
        <div className="bg-white grid grid-cols-2 md:grid-cols-4 gap-6 p-6 border-b border-gray-50">
          <DetailItem label="Case ID" value={selectedCase.caseCode} isBold />
          <DetailItem
            label="Client Name"
            value={selectedCase.clientName || "Unknown"}
            // icon={<UserIcon className="h-4 w-4 text-gray-400" />}
          />
          <DetailItem
            label="Status"
            value={
              <Badge className="bg-blue-50 text-blue-500 border-none shadow-none font-bold px-3 uppercase text-[10px]">
                {selectedCase.status || "PENDING"}
              </Badge>
            }
          />
          <DetailItem
            label="Next Adjourned"
            value={
              selectedCase.nextAdjournedAt
                ? format(parseISO(selectedCase.nextAdjournedAt), "dd-MM-yyyy")
                : "TBD"
            }
            icon={<Calendar className="h-4 w-4 text-gray-400" />}
          />
          {/* <DetailItem
              label="Category"
              value={selectedCase.caseType || "Legal Case"}
              icon={<Clock className="h-4 w-4 text-gray-400" />}
            /> */}
        </div>

        {/* Notes & Content Section */}
        <div className="p-8 space-y-8 bg-white">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
              Case Notes
            </h3>
            <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="whitespace-pre-wrap">
                {selectedCase.notes && selectedCase.notes !== "No notes added"
                  ? selectedCase.notes
                  : "No internal notes have been recorded for this case."}
              </p>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
              Attached Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedCase.documents?.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded text-gray-500 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                      {doc.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    VIEW FILE
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / Payment Context Section */}
        <div className="bg-[#fcfcfd] p-8 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-tight">
            Financial Reference
          </h3>
          <div className="space-y-4 max-w-md">
            <PaymentRow label="Case Category" value={selectedCase.caseType} />
            <PaymentRow
              label="Reference Code"
              value={selectedCase.caseCode}
              hasCopy
              onCopy={() => handleCopy(selectedCase.caseCode)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Reusable Helper Components (Keep these outside the main export)
function DetailItem({ label, value, icon, isBold }: any) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
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
      <span className="text-xs text-gray-500 font-semibold">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-900">
          {value || "N/A"}
        </span>
        {hasCopy && (
          <button
            aria-label="Copy text"
            onClick={onCopy}
            className="text-gray-400 hover:text-violet-600 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
