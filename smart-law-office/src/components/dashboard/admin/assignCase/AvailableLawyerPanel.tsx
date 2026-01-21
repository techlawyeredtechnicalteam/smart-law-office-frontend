"use client";

import { useState } from "react";
import { useAssignStore } from "@/store/assignCaseStore";
import { Search, MessageCircle, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Counsel } from "@/store/manageCounsel";
import { Lawyer } from "@/types/user";

export function AvailableLawyersPanel() {
  const { counsels } = useAssignStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLawyers = counsels.filter(
    (lawyer) =>
      lawyer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col h-[450px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Available Lawyers</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-50 border-none h-9 text-sm w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-2">
        {filteredLawyers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Briefcase className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500">
              {searchQuery
                ? "No lawyers match your search."
                : "No lawyers found."}
            </p>
          </div>
        ) : (
          filteredLawyers.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))
        )}
      </div>
    </div>
  );
}

function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  const currentCases = lawyer.casesCount || 0;

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
          <AvatarImage
            src={lawyer.firstName || ""}
            alt={lawyer.name}
            className="object-cover"
          />

          {/* 2. Fallback to Initials if image fails or doesn't exist */}
          <AvatarFallback className="bg-purple-100 text-[#6f42c1] text-xs font-bold border border-purple-200">
            {getInitials(lawyer.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{lawyer.name}</span>
            <MessageCircle
              size={14}
              className="text-purple-500 cursor-pointer hover:text-purple-700 transition"
            />
          </div>
          <div className="text-xs text-gray-500">{lawyer.specialty}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold">{currentCases} Cases</div>
        <div className="flex items-center justify-end gap-1 text-xs text-green-600">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Available
        </div>
      </div>
    </div>
  );
}
