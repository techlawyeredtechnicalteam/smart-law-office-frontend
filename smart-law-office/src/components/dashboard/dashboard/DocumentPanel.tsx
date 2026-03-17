import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { StatusBadge } from "../admin/manageCounsel/StatusBadge";

export function DocumentsPanel({
  documents,
  viewAllLink
}: {
  documents: any[];
  viewAllLink?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Recent Documents</h3>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc.caseDocumentId}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 rounded-lg">
                  <FileText className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">{doc.caseName}</p>
                </div>
              </div>
              {/* <StatusBadge status={doc.status} /> */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10 text-sm">
            No documents found.
          </p>
        )}
      </div>
    </div>
  );
}
