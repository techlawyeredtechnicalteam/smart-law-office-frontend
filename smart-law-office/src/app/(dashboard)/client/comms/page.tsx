// src/app/communications/CommunicationLayout.tsx
"use client";

import React from "react";
import { useCommunicationStore } from "@/store/clientCommsStore";
import { CommunicationSidebar } from "@/components/dashboard/client/communication/CommunicationSidebar";
import { ConversationList } from "@/components/dashboard/client/communication/ConversationList";
import { ChatMessageView } from "@/components/dashboard/client/communication/ChatMessageView";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CommunicationLayout() {
  const { activeConversationId, setActiveConversation } =
    useCommunicationStore();

  const isChatActive = activeConversationId !== null;

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md h-[80vh] flex overflow-hidden">
        {/* Main Content Area (Conversation List or Active Chat) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation List (Visible on large screens, hidden when chat is active on small screens) */}
          <div
            className={`w-full sm:w-80 border-r ${
              isChatActive ? "hidden lg:block" : "block"
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="text-2xl font-bold">Communications</h1>
              <Button className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>New Message</span>
              </Button>
            </div>
            <ConversationList />
          </div>

          {/* Chat Message View (Visible on large screens, takes full width when active on small screens) */}
          <div
            className={`flex-1 ${isChatActive ? "block" : "hidden lg:block"}`}
          >
            <ChatMessageView />
          </div>

          {/* When not on a large screen and no chat is active, show the main list and "New Message" */}
          {!isChatActive && (
            <div className="flex-1 hidden sm:flex lg:hidden items-center justify-center text-gray-500">
              <p>Select a message to view content.</p>
            </div>
          )}
        </div>

        {/* Sidebar/Menu (Replicates commsclient.png right side) */}
        <CommunicationSidebar />
      </div>
    </div>
  );
}
