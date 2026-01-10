"use client";

import React from "react";
import { useCommunicationStore } from "@/store/clientCommsStore";
import { MessageSquare, Star, FileText, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    key: "inbox",
    label: "All Inbox",
    icon: MessageSquare,
    description: "Unified Inbox",
    count: 3
  },
  {
    key: "starred",
    label: "Starred",
    icon: Star,
    description: "Selected messages",
    count: 3
  },
  {
    key: "documents",
    label: "Documents",
    icon: FileText,
    description: "Client's shared files",
    count: 0
  },
  {
    key: "drafts",
    label: "Drafts",
    icon: FileEdit,
    description: "Unsent messages",
    count: 0
  }
];

export function CommunicationSidebar() {
  const { currentChannel, setChannel } = useCommunicationStore();

  return (
    <div className="w-64 border-l p-4 bg-white hidden lg:block">
      <h2 className="text-lg font-bold mb-6">Menu</h2>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
              currentChannel === item.key
                ? "bg-purple-50 text-purple-600"
                : "hover:bg-gray-50 text-gray-700"
            )}
            onClick={() =>
              setChannel(
                item.key as "inbox" | "starred" | "documents" | "drafts"
              )
            }
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5" />
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
            {item.count > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                {item.count}
              </span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
