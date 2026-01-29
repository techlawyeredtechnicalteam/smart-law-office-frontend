"use client";

import React, { useEffect, useState } from "react";
import { useCaseStore } from "@/store/createCase";
import { useBillingStore } from "@/store/setRateBill";
import { CaseTablePanel } from "@/components/dashboard/dashboard/CaseTablePanel";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AllCasesPage() {
  const { cases, fetchCases, isLoading } = useCaseStore();
  const { fetchBillingInitialData } = useBillingStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const init = async () => {
      // 1. Load billing first so the case types map correctly
      await fetchBillingInitialData();
      // 2. Load the cases
      await fetchCases();
    };
    init();
  }, []);

  // Filter cases based on search query (Client Name or Case Code)
  const filteredCases = cases.filter((c) =>
    c.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.caseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.caseType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
          <p className="text-sm text-gray-500">View and manage all legal matters and filings.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search code, client, or type..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-2" />
          <p className="text-gray-500 text-sm">Synchronizing case records...</p>
        </div>
      ) : (
        <CaseTablePanel cases={filteredCases} />
      )}
    </div>
  );
}