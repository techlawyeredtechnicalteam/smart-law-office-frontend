"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CaseDashboard } from "../admin/createCase/CaseDashboardTable";
import { Case } from "@/store/createCase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CaseTablePanel({
  cases,
  viewAllLink
}: {
  cases: any[];
  viewAllLink: string;
}) {
  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-white">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Cases
          </CardTitle>
          {/* <p className="text-xs text-gray-500">
            Click on any row to view full case details and documents.
          </p> */}
        </div>
        <Link href={viewAllLink}>
          <Button variant="ghost" className="text-purple-600 text-sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0 border-t border-gray-50">
        <CaseDashboard cases={cases} />
      </CardContent>
    </Card>
  );
}
