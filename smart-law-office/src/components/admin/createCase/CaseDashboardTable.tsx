// components/CaseDashboard.tsx
import { Case } from "@/store/createCase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/shared/ui/table";
import { Badge } from "@/components/shared/ui/badge";
import { User } from "lucide-react";

interface CaseDashboardProps {
  cases: Case[];
}

// Function to determine badge style based on status
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export function CaseDashboard({ cases }: CaseDashboardProps) {
  // const { cases } = useCaseStore();
  return (
    <div className="rounded-xl border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[100px] text-gray-600">Case ID</TableHead>
            <TableHead className="text-gray-600">Client Name</TableHead>
            <TableHead className="text-gray-600">Case Type</TableHead>
            <TableHead className="text-gray-600">Status</TableHead>
            <TableHead className="text-gray-600">Document</TableHead>
            <TableHead className="text-gray-600">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium text-gray-600">
                {c.id}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">{c.clientName}</span>
                </div>
              </TableCell>
              <TableCell>{c.caseType}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusBadgeVariant(c.status)}
                >
                  {c.status}
                </Badge>
              </TableCell>
              {/* Document Cell: Shows the first document's file name */}
              <TableCell className="text-sm text-purple-600 hover:underline cursor-pointer">
                {c.documents.length > 0 ? c.documents[0].name : "N/A"}
              </TableCell>
              {/* Notes Cell: Shows a summary of the first note */}
              <TableCell className="text-sm text-gray-700 max-w-xs truncate">
                {c.notes.length > 0 ? c.notes[0] : "No consultation notes"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
