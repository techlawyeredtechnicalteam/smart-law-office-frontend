import { Case } from "@/store/createCase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold border-b pb-2">
            Case Details: {selectedCase.caseCode}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 mt-2">
          {selectedCase.documents?.map((doc, i) => (
            <a
              key={i}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 bg-white border rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded text-violet-600">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {doc.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-violet-600 opacity-0 group-hover:opacity-100"
              >
                View File
              </Button>
            </a>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <label className="text-xs text-gray-500 uppercase font-bold">
            Internal Notes
          </label>
          <p className="text-sm mt-1 whitespace-pre-wrap">
            {selectedCase.notes}
          </p>
        </div>

        {selectedCase.documents?.length > 0 && (
          <div className="mt-4">
            <label className="text-xs text-gray-500 uppercase font-bold">
              Documents
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCase.documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  target="_blank"
                  className="text-xs bg-white border p-2 rounded hover:shadow-sm"
                >
                  📄 {doc.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
