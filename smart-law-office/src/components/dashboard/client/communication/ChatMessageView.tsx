"use client";

import React, { useState } from "react";
import { useCommunicationStore } from "@/store/clientCommsStore";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  FileText,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function ChatMessageView() {
  const {
    activeConversationId,
    setActiveConversation,
    activeMessages,
    currentUser,
    sendMessage,
    conversations
  } = useCommunicationStore();
  const [inputContent, setInputContent] = useState("");

  const activeConvo = conversations.find((c) => c.id === activeConversationId);

  if (!activeConversationId || !activeConvo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>Select a conversation to start messaging.</p>
      </div>
    );
  }

  const recipient = activeConvo.user;

  const handleSend = () => {
    if (inputContent.trim()) {
      sendMessage(activeConversationId, inputContent.trim());
      setInputContent("");
    }
  };

  const handleFileUpload = (file: File) => {
    const mockAttachment = {
      fileName: file.name,
      sizeKB: Math.round(file.size / 1024)
    };
    sendMessage(
      activeConversationId,
      `Case ID: ${mockAttachment.fileName.split(":")[0]}`,
      mockAttachment
    );
  };

  // Chat Bubble Component
  const ChatBubble = ({ message }: { message: (typeof activeMessages)[0] }) => {
    const isSelf = message.senderId === currentUser.id;
    const sender = isSelf ? currentUser : recipient;

    if (message.attachment) {
      return (
        <div
          className={cn(
            "flex w-full mt-4",
            isSelf ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-xs p-3 rounded-xl",
              isSelf
                ? "bg-purple-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-bl-none"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span className="font-semibold">
                  {message.attachment.fileName}
                </span>
              </div>
            </div>
            <p className="text-sm mt-1">{message.attachment.sizeKB} KB</p>
            <div className="text-xs mt-1 flex justify-end items-center space-x-1">
              <span>{message.timestamp}</span>
              <Check className="h-3 w-3" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex w-full mt-4",
          isSelf ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-xs p-3 rounded-xl",
            isSelf
              ? "bg-purple-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          )}
        >
          <p>{message.content}</p>
          <div className="text-xs mt-1 flex justify-end items-center space-x-1">
            <span>{message.timestamp}</span>
            <Check className="h-3 w-3" />
          </div>
        </div>
        {isSelf && (
          <Avatar className="h-6 w-6 ml-2 mt-auto">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveConversation(null)}
            className="lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={recipient.avatar} alt={recipient.name} />
            <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{recipient.name}</p>
            <p className="text-xs text-gray-500">Yesterday, 09:45 AM</p>{" "}
            {/* Static last active time */}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeMessages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input Footer */}
      <div className="p-4 border-t flex items-center space-x-3">
        <Input
          placeholder="Type your message here..."
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 h-12"
        />

        {/* File Upload Button */}
        <input
          aria-label="file upload"
          type="file"
          id="file-upload"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="text-gray-500 hover:text-purple-600"
        >
          <label htmlFor="file-upload">
            <Paperclip className="h-6 w-6" />
          </label>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-purple-600"
        >
          <Smile className="h-6 w-6" />
        </Button>

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!inputContent.trim()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
