"use client";

import { useCaseStore } from "@/store/createCase";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Download, Trash2, Upload } from "lucide-react";

export default function CaseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { cases } = useCaseStore();

  const currentCase = cases.find((c) => c.id === id);

  if (!currentCase) return <div className="p-10">Case not found...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-black"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Case Details
      </button>

      <Card className="border-2 border-dashed border-blue-400 p-6 space-y-8 bg-white">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">
            Sullivan V. Sullivan - Divorce Proceedings
          </h1>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>📅 20-11-2025</span>
            <span>🕒 09:00 AM</span>
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-4 gap-4 py-4 border-y border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Case ID</p>
            <p className="font-semibold">
              #{currentCase.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">
              Client Name
            </p>
            <p className="font-semibold">{currentCase.clientName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Status</p>
            <Badge className="bg-purple-100 text-purple-700 border-none">
              {currentCase.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">
              Case Type
            </p>
            <p className="font-semibold">{currentCase.caseTypeId}</p>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Associated Documents</h3>
            <Button size="sm" className="bg-purple-600">
              <Upload className="mr-2 h-4 w-4" /> Upload New
            </Button>
          </div>

          <div className="space-y-3">
            {currentCase.documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-400">
                      Sept 05, 2025, 02:30 PM
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <h3 className="font-bold">Notes</h3>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {currentCase.notes || "No notes available for this case."}
          </p>
        </div>
      </Card>
    </div>
  );
}
