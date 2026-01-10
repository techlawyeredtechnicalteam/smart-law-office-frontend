"use client";
import React, { useState } from "react";
import { useCommsStore, ChatMessage } from "@/store/adminCommsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
  FileText,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

// Custom bubble component
const ChatBubble = ({ message }: { message: ChatMessage }) => {
  return (
    <div
      className={cn(
        "flex mb-4",
        message.isAuthor ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-3/4 p-3 rounded-xl shadow-md",
          message.isAuthor
            ? "bg-violet-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        )}
      >
        {message.attachments &&
          message.attachments.map((att) => (
            <div
              key={att.fileName}
              className="bg-white p-3 rounded-lg flex items-center mb-2 shadow-sm"
            >
              <FileText className="h-8 w-8 text-violet-500 mr-3" />
              <div>
                <p className="font-semibold text-sm text-violet-800">
                  {att.fileName}
                </p>
                <p className="text-xs text-gray-500">{att.size}</p>
              </div>
            </div>
          ))}

        <p className="text-sm">{message.text}</p>
        <span
          className={cn(
            "block mt-1 text-xs",
            message.isAuthor ? "text-violet-200" : "text-gray-500"
          )}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};

const CommsChatView = () => {
  const { getSelectedMessage, setView } = useCommsStore();
  const messageThread = getSelectedMessage();
  const [inputText, setInputText] = useState("");

  if (!messageThread) {
    return <div className="p-6">Message thread not found.</div>;
  }

  const handleBack = () => setView("dashboard");
  const handleSend = () => {
    // Logic to send message (omitted for this implementation)
    console.log("Sending:", inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={`/avatars/${messageThread.sender.replace(" ", "")}.png`}
              alt={messageThread.sender}
            />
            <AvatarFallback>
              {messageThread.sender
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{messageThread.sender}</h2>
            <p className="text-sm text-gray-500">
              {messageThread.senderType === "Client" ? "Client" : "Law Firm"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messageThread.messages?.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {/* Placeholder for the file icon in the chat (Case ID 2025-0012) */}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t flex items-center space-x-2">
        <Input
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 rounded-full p-6 bg-gray-50 border-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5 text-gray-600" />
        </Button>
        <Button
          onClick={handleSend}
          className="bg-violet-600 hover:bg-violet-700 rounded-full"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CommsChatView;
