// // components/dashboard/CaseTablePanel.tsx
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { CaseDashboard } from "../admin/createCase/CaseDashboardTable";
// import { Case } from "@/store/createCase"; // Import Case interface

// interface CaseTablePanelProps {
//   cases: Case[];
// }

// export function CaseTablePanel({ cases }: CaseTablePanelProps) {
//   return (
//     <Card className="shadow-sm border border-gray-100">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="text-xl font-semibold">Cases</CardTitle>
//         <span className="text-sm text-violet-600 font-medium cursor-pointer">
//           View All
//         </span>
//       </CardHeader>
//       <CardContent className="p-0">
//         {/* The CaseDashboard component you provided handles the table logic */}
//         <CaseDashboard cases={cases} />
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CaseDashboard } from "../admin/createCase/CaseDashboardTable";
import { Case } from "@/store/createCase";

interface CaseTablePanelProps {
  cases: Case[];
}

export function CaseTablePanel({ cases }: CaseTablePanelProps) {
  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-white">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Cases
          </CardTitle>
          <p className="text-xs text-gray-500">
            Click on any row to view full case details and documents.
          </p>
        </div>
        <button
          className="text-sm text-violet-600 font-medium hover:text-violet-800 transition-colors"
          onClick={() => {
            /* If you have a separate "All Cases" page, link it here */
          }}
        >
          View All
        </button>
      </CardHeader>
      <CardContent className="p-0 border-t border-gray-50">
        {/* This component now contains the TableModal + Detail Modal 
          selection logic we integrated in the previous step.
        */}
        <CaseDashboard cases={cases} />
      </CardContent>
    </Card>
  );
}
