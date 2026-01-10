"use client";

import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft } from "lucide-react";

export default function DocumentView() {
  const { selectedDoc, setViewMode } = useDocumentStore();

  if (!selectedDoc) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header with Navigation and Actions */}
      <div className="flex justify-between items-center bg-white p6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-800">
            {selectedDoc.name}
          </h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="text-slate-500">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-slate-500">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Document Content Area */}
      <div className="bg-white border rounded-2xl p-10 shadow-sm min-h-[600px]">
        {/* Metadata Section */}
        <div className="mb-8 space-y-2">
          <div className="flex gap-2">
            <span className="text-slate-500 font-medium">Document type:</span>
            <span className="text-slate-800 font-bold">
              {selectedDoc.status}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 font-medium">Testator:</span>
            <span className="text-slate-800 font-bold">Mr. Adeyemi</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 font-medium">Date executed:</span>
            <span className="text-slate-800 font-bold">{selectedDoc.date}</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 italic">
            Uploaded by Jane Francis on {selectedDoc.date}
          </p>
        </div>

        <hr className="mb-8 border-slate-100" />

        {/* Mock Document Text (Matches the image content) */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm space-y-6">
          <p>
            1. Mr. Samuel Adeyemi declares this to be his Last Will and
            Testament, appointing his wife...
          </p>
          <p>
            2. In distributing his estate, Mr. Adeyemi bequeaths his residential
            property in Harmony Estate...
          </p>
          <p>
            3. The will grants the Executor full authority to settle debts,
            manage assets...
          </p>
        </div>
      </div>
    </div>
  );
}
