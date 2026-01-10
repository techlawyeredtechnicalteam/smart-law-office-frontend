"use client";
import { Badge } from "@/components/ui/badge";
import { Counsel } from "@/store/manageCounsel";
import React from "react";

export const StatusBadge: React.FC<{ status: Counsel["status"] }> = ({
  status
}) => (
  <Badge
    className={`
      px-3 py-1 text-xs font-medium 
      ${
        status === "Active"
          ? "bg-green-300 text-green-400 border-green-300"
          : "bg-gray-300 text-gray-800 border-gray-200"
      }
    `}
    variant="outline"
  >
    {status === "Active" ? "Active" : "Inactive"}
  </Badge>
);
