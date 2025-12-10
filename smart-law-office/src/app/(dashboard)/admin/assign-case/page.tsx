"use client";

import { useAssignStore } from "@/store/assignCaseStore";
import { AssignCaseModal } from "@/components/admin/assignCase/AssignCaseModal";
import { Search, MessageCircle, MoreVertical, Briefcase } from "lucide-react";
import { Input } from "@/components/shared/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/ui/avatar";
import { Button } from "@/components/shared/ui/button";
// import SmartLawOfficeDashboard from "@/components/layout/SmartLawOfficeDashboard";

export default function AssignCasePage() {
  const { unassignedCases, counsels, assignedCases } = useAssignStore();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Assign Case</h1>
          <AssignCaseModal />
        </div>

        {/* --- GRID SECTION (Unassigned Cases + Available Lawyers) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[450px]">
          {/* LEFT PANEL: Unassigned Cases */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Unassigned Cases</h2>
              <div className="relative w-48">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-8 bg-gray-50 border-none h-9 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 font-medium border-b">
                  <tr>
                    <th className="pb-2 pl-2">Case/Client</th>
                    <th className="pb-2">Case Type</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {unassignedCases.map((c) => (
                    <tr key={c.id} className="group hover:bg-gray-50">
                      <td className="py-3 pl-2">
                        <div className="font-semibold text-gray-900">
                          {c.id}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {c.clientName}
                        </div>
                      </td>
                      <td className="py-3 text-gray-600">{c.caseType}</td>
                      <td className="py-3 text-gray-600">{c.date}</td>
                      <td className="py-3 text-gray-600">{c.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT PANEL: Available Lawyers */}
          <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Available Lawyers</h2>
              <Search className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex-1 overflow-auto space-y-4">
              {counsels.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className="flex items-start justify-between p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lawyer.name}`}
                      />
                      <AvatarFallback>{lawyer.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{lawyer.name}</span>
                        <MessageCircle
                          size={14}
                          className="text-purple-500 cursor-pointer"
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {lawyer.specialty}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">
                      {lawyer.casesCount} Cases
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs text-green-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      {lawyer.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: Assigned Cases --- */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Assigned Cases</h2>
            <div className="relative w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-8 bg-gray-50 border-none h-9 text-sm"
              />
            </div>
          </div>

          {assignedCases.length === 0 ? (
            // Empty State Logic
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-purple-50 p-4 rounded-full mb-3">
                <Briefcase className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold">No assigned cases yet</h3>
              <p className="text-gray-500 text-sm">
                Assign a case above to see it listed here.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="p-3 rounded-l-lg">Case/Client</th>
                  <th className="p-3">Case Type</th>
                  <th className="p-3">Date/Time</th>
                  <th className="p-3">Lawyer</th>
                  <th className="p-3 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assignedCases.map((ac) => (
                  <tr key={ac.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-bold text-gray-900">{ac.caseId}</div>
                      <div className="text-gray-500 text-xs">
                        {ac.clientName}
                      </div>
                    </td>
                    <td className="p-3 text-gray-700">{ac.caseType}</td>
                    <td className="p-3 text-gray-700">{ac.dateTime}</td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">
                        {ac.counselName}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {ac.counselSpecialty}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                      >
                        View Case
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
