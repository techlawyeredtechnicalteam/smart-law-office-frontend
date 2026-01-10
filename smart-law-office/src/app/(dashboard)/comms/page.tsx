// /app/(dashboard)/communications/page.tsx
"use client";
import React from "react";
import { useCommsStore } from "@/store/adminCommsStore";
import CommsEmptyState from "@/components/dashboard/admin/communication/EmptyState";
import CommsDashboard from "@/components/dashboard/admin/communication/CommsDashboard";
import CommsChatView from "@/components/dashboard/admin/communication/CommsChatView";

const CommsPage = () => {
  const { currentView, messages } = useCommsStore();

  const getActiveView = () => {
    // If no messages, always show empty state initially, unless manually set to chat
    if (messages.length === 0 && currentView !== "chat") {
      return <CommsEmptyState />;
    }

    switch (currentView) {
      case "chat":
        return <CommsChatView />;
      case "dashboard":
      case "empty":
      default:
        return <CommsDashboard />;
    }
  };

  return <div className="p-6">{getActiveView()}</div>;
};

export default CommsPage;
