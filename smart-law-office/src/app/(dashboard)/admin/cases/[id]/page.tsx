"use client";

import React, { useEffect, use } from "react";
import { useCaseStore } from "@/store/createCase";
import { CaseDocuments } from "@/components/dashboard/admin/caseManagement/caseDocument";
import { PaymentDetails } from "@/components/dashboard/admin/caseManagement/PaymentDetails";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/shared/BreadCrumbs";
import { Loader2, Calendar, Clock } from "lucide-react";

export default function CaseDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { cases, fetchCases, isLoading } = useCaseStore();

  useEffect(() => {
    if (cases.length === 0) {
      fetchCases();
    }
  }, [cases.length, fetchCases]);

  const currentCase = cases.find((c) => c.id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-2" />
        <p className="text-sm text-gray-500">Loading case file...</p>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Case not found</h2>
        <button
          onClick={() => window.history.back()}
          className="text-violet-600 mt-2"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 3. Integrated Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Case Management", href: "/dashboard/admin/cases" },
          { label: currentCase.caseCode || "Case Details" }
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentCase.clientName} - {currentCase.caseType}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(currentCase.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(currentCase.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-violet-50/50 p-6 rounded-2xl border border-violet-100 mb-8 shadow-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            Case ID
          </p>
          <p className="font-mono text-sm text-violet-700 font-bold">
            {currentCase.caseCode}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            Client
          </p>
          <p className="font-semibold text-sm">{currentCase.clientName}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            Status
          </p>
          <Badge className="bg-green-100 text-green-700 border-none shadow-none capitalize">
            {currentCase.status}
          </Badge>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            Matter Type
          </p>
          <p className="font-semibold text-sm">{currentCase.caseType}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            Staff Assigned
          </p>
          <p className="font-semibold text-sm truncate">
            {currentCase.staffEmail || "Unassigned"}
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8">
        <CaseDocuments
          documents={currentCase.documents}
          onUpload={() => {
            // Since this is the CaseDetailsPage, you might want to
            // trigger the AddDocumentModal with this case already selected.
          }}
        />

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-gray-800">
            Legal Counsel Notes
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed italic">
            "
            {currentCase.notes ||
              "No internal notes have been recorded for this case yet."}
            "
          </p>
        </div>

        <PaymentDetails bankInfo={{}} />
      </div>
    </div>
  );
}
