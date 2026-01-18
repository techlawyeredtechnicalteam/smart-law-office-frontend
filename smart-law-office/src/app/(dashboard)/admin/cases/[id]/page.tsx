"use client";
import { useCaseStore } from "@/store/createCase";
import { CaseDocuments } from "@/components/dashboard/admin/caseManagement/caseDocument";
import { PaymentDetails } from "@/components/dashboard/admin/caseManagement/PaymentDetails";
import { Badge } from "@/components/ui/badge";

export default function CaseDetailsPage({
  params
}: {
  params: { id: string };
}) {
  const { cases } = useCaseStore();
  const currentCase = cases.find((c) => c.id === params.id);

  if (!currentCase) return <div>Case not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-4"
        >
          ← Case Details
        </button>
        <h1 className="text-2xl font-bold">
          {currentCase.title || "Sullivan V. Sullivan - Divorce Proceedings"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          📅 20-11-2025 | 🕙 09:00 AM
        </p>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-5 gap-4 bg-purple-50/50 p-6 rounded-xl border border-purple-100 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Case ID</p>
          <p className="font-semibold text-sm">#{currentCase.id}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Client name</p>
          <p className="font-semibold text-sm">{currentCase.clientName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <Badge className="bg-purple-100 text-purple-700 border-none hover:bg-purple-100">
            In Progress
          </Badge>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Case Type</p>
          <p className="font-semibold text-sm">Family Law</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Assigned Lawyer</p>
          <p className="font-semibold text-sm">Jane Francis</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        <CaseDocuments
          documents={currentCase.documents}
          onUpload={() => {
            /* Open modal */
          }}
        />

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-bold text-lg mb-4">Notes</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {currentCase.notes}
          </p>
        </div>

        <PaymentDetails bankInfo={{}} />
      </div>
    </div>
  );
}
