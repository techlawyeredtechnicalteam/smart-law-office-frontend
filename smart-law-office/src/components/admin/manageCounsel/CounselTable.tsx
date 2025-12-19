// src/components/manage-counsel/CounselTable.tsx

import { UseCounselStore, Counsel } from "@/store/manageCounsel";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/shared/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";

const CounselTable = () => {
  const { counsel, openEditModal, openDeleteModal } = UseCounselStore();

  console.log("CounselTable - counsel data:", counsel);

  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th scope="col" className="px-6 py-3">
              Counsel Name
            </th>
            <th scope="col" className="px-6 py-3">
              SCN
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Assigned Cases
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {counsel.map((counsel) => (
            <tr
              key={counsel.scn}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-6 py-4 flex items-center font-medium text-gray-900 whitespace-nowrap">
                {/* Placeholder for Profile Picture */}
                <div className="w-6 h-6 rounded-full bg-violet-200 mr-3"></div>
                {counsel.fullName}
              </td>
              <td className="px-6 py-4">{counsel.scn}</td>
              <td className="px-6 py-4">{counsel.email}</td>
              <td className="px-6 py-4">{counsel.assignedCases}</td>
              <td className="px-6 py-4">
                <StatusBadge status={counsel.status} />
              </td>
              <td className="px-6 py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditModal(counsel)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteModal(counsel)}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CounselTable;
