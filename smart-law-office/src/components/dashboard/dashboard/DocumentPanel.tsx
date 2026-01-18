// components/dashboard/DocumentsPanel.tsx (Updated Snippet)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDocumentStore } from "@/store/documentStore"; // <-- NEW IMPORT
import { MoreHorizontal } from "lucide-react";

export function DocumentsPanel() {
  const { documents } = useDocumentStore();

  // Sort by date/time (assuming a logical structure, or just take the latest added)
  // Here we just take the latest 3 added, as they are prepended to the array.
  const documentsToShow = documents.slice(0, 3);

  return (
    <Card className="shadow-sm border border-gray-100 h-full">
      {/* ... Header remains the same ... */}
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {/* Header Row */}
          <div className="grid grid-cols-2 text-xs font-medium text-gray-500 p-4">
            <span className="truncate">Title</span>
            <span className="truncate">Case</span>
          </div>

          {/* Document Items */}
          {documentsToShow.map((doc, index) => (
            <div
              key={doc.caseDocumentId}
              className="grid grid-cols-2 items-center text-sm p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-700 truncate">
                {doc.name}
              </span>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 truncate">{doc.caseName}</span>
                <MoreHorizontal className="h-4 w-4 text-gray-400 cursor-pointer" />
              </div>
            </div>
          ))}
          {documentsToShow.length === 0 && (
            <div className="p-4 text-center text-gray-500 italic">
              No documents uploaded yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
