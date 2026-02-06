"use client";

import React from "react";
import { useCommunicationStore } from "@/store/clientCommsStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConversationList() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    currentUser
  } = useCommunicationStore();

  const renderRoleTag = (user: { role: string; name: string }) => {
    if (user.role === "You" && user.name === currentUser.name) {
      return (
        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
          You
        </span>
      );
    }
    if (user.role === "Counsel") {
      return (
        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
          Counsel
        </span>
      );
    }    
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 p-4">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            className={cn(
              "flex justify-between items-center p-4 border rounded-xl cursor-pointer transition-colors",
              activeConversationId === convo.id
                ? "border-purple-600 bg-purple-50"
                : "hover:bg-gray-50"
            )}
            onClick={() => setActiveConversation(convo.id)}
          >
            <div className="flex items-center space-x-4 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={convo.user.avatar} alt={convo.user.name} />
                <AvatarFallback>{convo.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold truncate">{convo.user.name}</p>
                  {renderRoleTag(convo.user)}
                </div>
                <p className="text-sm text-gray-700 truncate mt-0.5">
                  {convo.lastMessage}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                  <span>{convo.lastTimestamp}</span>
                  {convo.unreadCount === 0 && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </p>
              </div>
            </div>

            {/* Action buttons (Reply) */}
            <Button
              variant="ghost"
              className="text-purple-600 hover:bg-purple-100 flex items-center space-x-1"
            >
              <Reply className="h-4 w-4" />
              <span className="hidden sm:inline">Reply</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
