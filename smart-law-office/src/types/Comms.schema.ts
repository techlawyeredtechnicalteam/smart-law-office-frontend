import * as z from "zod";

export interface User {
  id: string;
  name: string;
  role: "Client" | "Counsel" | "You";
  avatar: string; // URL or path for the avatar image
}

export interface DocumentAttachment {
  fileName: string;
  sizeKB: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string; // Message text or System update text
  timestamp: string; // e.g., 'Yesterday, 09:45 AM'
  status: "sent" | "delivered" | "read";
  attachment?: DocumentAttachment;
}

export interface Conversation {
  id: string;
  user: User; // The other party in the chat (or the room topic)
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isStarred: boolean;
  type: "private" | "room"; // Room for case-related discussion
}

export type CommChannel = "inbox" | "starred" | "documents" | "drafts";
