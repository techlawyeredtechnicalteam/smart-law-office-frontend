"use client";

import { useCounselStore } from "@/store/manageCounsel";
import { Edit, Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const CounselTable = () => {
  const { counsel, isLoading, openEditModal, openDeleteModal } =
    useCounselStore();

  if (isLoading && counsel.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Counsel Name
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                SCN Number
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Email Address
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Assigned Cases
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {counsel.length > 0 ? (
              counsel.map((person) => (
                <tr
                  key={person.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                        {person.firstName[0]}
                        {person.lastName[0]}
                      </div>
                      <span className="font-medium text-gray-900">
                        {person.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {person.scn}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {person.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {person.assignedCases}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        person.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        aria-label="Edit Counsel"
                        onClick={() => openEditModal(person)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        aria-label="Delete Counsel"
                        onClick={() => openDeleteModal(person)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search size={40} className="text-gray-300" />
                    <p>No counsel members found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Internal Skeleton Helper
const TableSkeleton = () => (
  <div className="space-y-4 w-full">
    <div className="h-10 w-full bg-gray-100 animate-pulse rounded-t-xl" />
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex gap-4 px-6">
        <Skeleton className="h-12 w-full" />
      </div>
    ))}
  </div>
);
export default CounselTable;

// <div className="border rounded-xl overflow-hidden">
//   <table className="w-full text-left text-sm">
//     <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
//       <tr>
//         <th scope="col" className="px-6 py-3">
//           Counsel Name
//         </th>
//         <th scope="col" className="px-6 py-3">
//           SCN
//         </th>
//         <th scope="col" className="px-6 py-3">
//           Email
//         </th>
//         <th scope="col" className="px-6 py-3">
//           Assigned Cases
//         </th>
//         <th scope="col" className="px-6 py-3">
//           Status
//         </th>
//         <th scope="col" className="px-6 py-3"></th>
//       </tr>
//     </thead>
//     <tbody>
//       {counsel.map((counsel) => (
//         <tr
//           key={counsel.scn}
//           className="bg-white border-b hover:bg-gray-50"
//         >
//           <td className="px-6 py-4 flex items-center font-medium text-gray-900 whitespace-nowrap">
//             {/* Placeholder for Profile Picture */}
//             <div className="w-6 h-6 rounded-full bg-violet-200 mr-3"></div>
//             {counsel.fullName}
//           </td>
//           <td className="px-6 py-4">{counsel.scn}</td>
//           <td className="px-6 py-4">{counsel.email}</td>
//           <td className="px-6 py-4">{counsel.assignedCases}</td>
//           <td className="px-6 py-4">
//             <StatusBadge status={counsel.status} />
//           </td>
//           <td className="px-6 py-4">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                   <span className="sr-only">Open menu</span>
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => openEditModal(counsel)}>
//                   Edit
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={() => openDeleteModal(counsel)}
//                   className="text-red-500"
//                 >
//                   Delete
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>
