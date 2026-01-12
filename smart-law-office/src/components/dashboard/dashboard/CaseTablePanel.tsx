// components/dashboard/CaseTablePanel.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CaseDashboard } from "../admin/createCase/CaseDashboardTable";
import { Case } from "@/store/createCase"; // Import Case interface

interface CaseTablePanelProps {
  cases: Case[];
}

export function CaseTablePanel({ cases }: CaseTablePanelProps) {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Cases</CardTitle>
        <span className="text-sm text-violet-600 font-medium cursor-pointer">
          View All
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {/* The CaseDashboard component you provided handles the table logic */}
        <CaseDashboard cases={cases} />
      </CardContent>
    </Card>
  );
}
