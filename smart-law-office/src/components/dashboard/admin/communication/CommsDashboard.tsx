"use client";
import React from "react";
import { useCommsStore, Message } from "@/store/adminCommsStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  Star,
  FileText,
  Mail,
  Trash,
  MessageSquare,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging

// Sidebar component
const SidebarMenu = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const menuItems = [
    { label: "All Inbox", icon: Mail, count: 3, section: "Menu" },
    { label: "Starred", icon: Star, count: 3, section: "Menu" },
    { label: "Documents", icon: FileText, section: "Menu" },
    { label: "Drafts", icon: Trash, section: "Drafts" } // Using Trash icon placeholder for Drafts
  ];

  return (
    <div
      className={cn(
        "h-full transition-all duration-300 bg-white border-l p-4",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {!isCollapsed && <h2 className="text-xl font-bold mb-6">Menu</h2>}

      {menuItems.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 mb-1",
            isCollapsed && "justify-center"
          )}
        >
          <item.icon className="h-5 w-5 text-gray-600" />
          {!isCollapsed && (
            <div className="flex justify-between items-center w-full ml-3">
              <span className="text-sm font-medium">{item.label}</span>
              {item.count && (
                <span className="text-xs text-gray-500">{item.count}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Message Card component
const MessageCard = ({ message }: { message: Message }) => {
  const selectMessage = useCommsStore((state) => state.selectMessage);

  // Simple avatar rendering based on sender name initial
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <div
      onClick={() => selectMessage(message.id)}
      className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 border-transparent hover:border-violet-600 mb-4"
    >
      <Avatar className="h-10 w-10 mr-4">
        <AvatarImage
          src={`/avatars/${message.sender.replace(" ", "")}.png`}
          alt={message.sender}
        />
        <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-md font-semibold truncate">
            {message.sender}
            <span
              className={cn(
                "ml-2 px-2 py-0.5 text-xs font-medium rounded-full",
                message.senderType === "Client"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              )}
            >
              {message.senderType}
            </span>
          </p>
          <span className="text-xs text-gray-500">{message.date}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-600 truncate">{message.snippet}</p>
          {message.senderType === "Author" && (
            <Button
              variant="outline"
              size="sm"
              className="ml-4 py-1 h-auto text-violet-600 border-violet-600 hover:bg-violet-50"
            >
              Reply
            </Button>
          )}
          {message.senderType === "Client" && (
            <ChevronLeft className="h-4 w-4 rotate-180 text-green-500" /> // Checkmark for client in mockup
          )}
        </div>
      </div>
    </div>
  );
};

const CommsDashboard = () => {
  const { messages, isMenuCollapsed, toggleMenu } = useCommsStore();

  return (
    <div className="flex h-[calc(100vh-140px)] bg-gray-50 rounded-xl overflow-hidden shadow-lg">
      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col min-w-0">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Communications</h1>
          <div className="flex space-x-4">
            <Button className="bg-violet-600 hover:bg-violet-700">
              New Message
            </Button>
            <Button variant="outline" size="icon" onClick={toggleMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Sidebar Menu */}
      <SidebarMenu isCollapsed={isMenuCollapsed} />
    </div>
  );
};

export default CommsDashboard;
