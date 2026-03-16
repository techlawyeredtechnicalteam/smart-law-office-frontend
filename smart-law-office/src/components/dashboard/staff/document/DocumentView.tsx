"use client";

import React from "react";
import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";
import {
  Download,
  Printer,
  ArrowLeft,
  FileText,
  Gavel,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { handleDownload } from "@/components/shared/HandleDownload";

export default function DocumentView() {
  const { selectedDoc, setViewMode } = useDocumentStore();

  if (!selectedDoc) return null;

  // Format ID to match your #2026- standard
  const displayId = `#2026-${selectedDoc.caseDocumentId?.slice(-4).toUpperCase() || "DOC"}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* Header with Navigation and Actions */}
      <div className="flex justify-between items-center bg-white p-4 px-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-violet-600 font-bold"
            onClick={() => setViewMode("list")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="h-6 w-px bg-gray-100" />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900 leading-none">
              {selectedDoc.caseName}
            </h1>
            {/* <span className="text-[10px] font-mono text-violet-600 font-bold mt-1 uppercase">
              {selectedDoc.caseName}
            </span> */}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 font-bold gap-2"
            onClick={() =>
              handleDownload(
                selectedDoc.fileData || selectedDoc.caseDocumentId,
                selectedDoc.name
              )
            }
          >
            <Download className="w-4 h-4" /> Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 font-bold"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Metadata & Case Details */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Document Info
            </h3>

            <div className="space-y-4">
              <InfoItem
                label="Status"
                value={
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-600 border-none uppercase text-[10px] font-bold"
                  >
                    {selectedDoc.status}
                  </Badge>
                }
              />
              <InfoItem
                icon={<Calendar className="w-4 h-4 text-gray-400" />}
                label="Date Uploaded"
                value={selectedDoc.date || "N/A"}
              />
              <InfoItem
                icon={<User className="w-4 h-4 text-gray-400" />}
                label="Client"
                value={selectedDoc.caseName || "General Client"}
              />
            </div>

            <hr className="border-gray-50" />

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Linked Case
            </h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-violet-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:text-violet-600">
                  <Gavel className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    {selectedDoc.caseName}
                  </p>
                  <p className="text-[10px] text-gray-500">Active Matter</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-violet-400" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Document Content Area */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm min-h-175 overflow-hidden">
          {/* Content Header */}
          {/* <div className="px-10 py-6 border-b border-gray-50 bg-[#fcfcfd] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              <span className="text-sm font-bold text-gray-700">
                Digital Preview
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium italic">
              Verified Secure Storage
            </span>
          </div> */}

          <div className="p-12">
            {/* The Document Body */}
            <div className="max-w-2xl mx-auto prose prose-slate">
              <div className="text-center mb-10 space-y-1">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                  {selectedDoc.name}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Matter Reference: {selectedDoc.caseName}
                </p>
              </div>

              <div className="text-sm text-gray-700 leading-[1.8] space-y-6">
                <p>
                  1. This document serves as a formal record regarding the
                  matter of <strong>{selectedDoc.caseName}</strong>. All parties
                  involved are expected to adhere to the stipulations provided
                  herein.
                </p>
                <p>
                  2. Detailed investigations under the{" "}
                  <strong>{selectedDoc.status}</strong> phase have concluded
                  that all relevant evidence has been filed electronically and
                  is now subject to judicial review.
                </p>
                <p>
                  3. Access to this file is restricted to authorized legal
                  personnel. Any redistribution of this material without express
                  written consent from the Lead Counsel is strictly prohibited.
                </p>
                <div className="pt-20 border-t border-dashed border-gray-200 mt-10">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="w-32 h-10 border-b border-gray-400" />
                      <p className="text-[10px] font-bold text-gray-500 uppercase">
                        Authorized Signature
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Timestamp: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for the Sidebar
function InfoItem({
  icon,
  label,
  value
}: {
  icon?: React.ReactNode;
  label: string;
  value: any;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm font-bold text-gray-700">{value}</div>
      </div>
    </div>
  );
}
