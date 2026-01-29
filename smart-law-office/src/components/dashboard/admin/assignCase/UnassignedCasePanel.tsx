"use client";

import { useState, useEffect } from "react";
import { useAssignStore } from "@/store/assignCaseStore";
import { Search, Briefcase, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { Button } from "@/components/ui/button";

export function UnassignedCasesPanel() {
  const { unassignedCases, isLoading, fetchData } = useAssignStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-fetch on mount if empty
  useEffect(() => {
    if (unassignedCases.length === 0) fetchData();
  }, []);

  const filteredCases = unassignedCases.filter((c) => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) return true;

    return (
      (c.clientName?.toLowerCase() ?? "").includes(search) ||
      (c.caseType?.toLowerCase() ?? "").includes(search) ||
      (c.consultCode?.toLowerCase() ?? "").includes(search)
    );
  });

  const columns: TableColumn<any>[] = [
    {
      key: "case-client",
      header: "Code / Client",
      render: (item) => (
        <div className="pl-2 flex flex-col">
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-tight">
            #{item.consultCode || item.id?.slice(-6).toUpperCase()}
          </span>
          {/* <div className="font-semibold text-gray-900 text-sm">
            Fallback check in case transform fails
            {item.clientName || "Unknown Client"}
          </div> */}
        </div>
      )
    },
    {
      key: "caseType",
      header: "Category",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-gray-600 text-sm font-medium">
            {item.caseType}
          </span>
          <span
            className="text-[10px] text-gray-400 truncate max-w-[150px]"
            title={item.notes}
          >
            {item.notes}
          </span>
        </div>
      )
    },
    {
      key: "date",
      header: "Created Date",
      render: (item) => (
        <div className="text-gray-500 text-xs">
          <span className="font-medium text-gray-700">
            {item.date || "N/A"}
          </span>
          <span className="block text-[10px] text-gray-400">{item.time}</span>
        </div>
      )
    }
  ];

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4 flex flex-col h-[450px]">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="font-bold text-gray-800 text-lg">Unassigned Cases</h2>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="relative w-full max-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Search code or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-gray-50 border-gray-200 h-9 text-sm focus-visible:ring-violet-500"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData()}
            disabled={isLoading}
            className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw
              className={`h-4 w-4 text-gray-600 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden border rounded-lg">
        <TableModal
          data={filteredCases}
          columns={columns}
          emptyMessage={
            isLoading ? "Loading cases..." : "No unassigned cases available."
          }
          getRowKey={(item) => item.id}
          containerClassName="h-full"
        />
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useAssignStore } from "@/store/assignCaseStore";
// import { Search, Briefcase, RefreshCw } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { TableModal, TableColumn } from "@/components/shared/TableModal";
// import { Button } from "@/components/ui/button";

// export function UnassignedCasesPanel() {
//   const { unassignedCases, isLoading, fetchData } = useAssignStore();
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredCases = unassignedCases.filter((c) => {
//     const search = searchQuery.toLowerCase().trim();
//     if (!search) return true;

//     // Use optional chaining and default to empty string
//     const nameMatch = (c.clientName?.toLowerCase() ?? "").includes(search);
//     const typeMatch = (c.caseType?.toLowerCase() ?? "").includes(search);
//     const idMatch = (c.id?.toLowerCase() ?? "").includes(search);

//     return nameMatch || typeMatch || idMatch;
//   });
//   const columns: TableColumn<(typeof unassignedCases)[0]>[] = [
//     {
//       key: "case-client",
//       header: "Code / Client",
//       render: (item) => (
//         <div className="pl-2 flex flex-col">
//           <span className="text-[10px] font-bold text-violet-500 uppercase">
//             #{item.consultCode} {/* Show real XTW588 code here */}
//           </span>
//           <div className="font-semibold text-gray-900 text-sm">
//             {item.clientName}
//           </div>
//         </div>
//       )
//     },
//     {
//       key: "caseType",
//       header: "Category",
//       render: (item) => (
//         <div className="flex flex-col">
//           <span className="text-gray-600 text-sm font-medium">
//             {item.caseType}
//           </span>
//           <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
//             {item.notes}
//           </span>
//         </div>
//       )
//     },
//     {
//       key: "date",
//       header: "Created Date",
//       render: (item) => (
//         <div className="text-gray-500 text-xs">
//           {item.date || "N/A"}
//           <span className="block text-[10px] text-gray-400">{item.time}</span>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4 flex flex-col h-[450px]">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="font-semibold text-lg">Unassigned Cases</h2>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => fetchData()}
//           disabled={isLoading}
//           className="h-8 w-8 p-0"
//         >
//           <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
//         </Button>
//         <div className="relative w-48">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-8 bg-gray-50 border-none h-9 text-sm"
//           />
//         </div>
//       </div>

//       <div className="flex-1 overflow-auto">
//         {filteredCases.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-center">
//             <Briefcase className="h-10 w-10 text-gray-400 mb-2" />
//             <p className="text-gray-500">
//               {searchQuery
//                 ? "No cases match your search."
//                 : "No unassigned cases available."}
//             </p>
//           </div>
//         ) : (
//           <TableModal
//             data={filteredCases}
//             columns={columns}
//             emptyMessage="No unassigned cases available."
//             getRowKey={(item) => item.id}
//             containerClassName="h-full"
//           />
//         )}
//       </div>
//     </div>
//   );
// }
