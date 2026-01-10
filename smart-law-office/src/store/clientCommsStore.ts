import { create } from "zustand";
import {
  CommChannel,
  Conversation,
  Message,
  User,
  DocumentAttachment
} from "@/types/Comms.schema";

// --- Mock Data Setup ---

const CURRENT_USER: User = {
  id: "user-c",
  name: "Christine Adeola",
  role: "You",
  avatar: "/avatars/christine.jpg"
};
const JANE_FRANCIS: User = {
  id: "user-j",
  name: "Jane Francis",
  role: "Counsel",
  avatar: "/avatars/jane.jpg"
};
const RUTH_ANANAH: User = {
  id: "user-r",
  name: "Ruth Ananah",
  role: "You",
  avatar: "/avatars/ruth.jpg"
}; // Assuming Ruth is another client/user who communicated

const MOCK_MESSAGES: Message[] = [
  // Jane Francis (Counsel)
  {
    id: "m1",
    senderId: JANE_FRANCIS.id,
    content: "Please update the status of case ID 2025-0012",
    timestamp: "Yesterday, 09:45 AM",
    status: "read"
  },
  // Christine Adeola (You) - commsclient2.png
  {
    id: "m2",
    senderId: CURRENT_USER.id,
    content: "Please update the status of case ID 2025-0012",
    timestamp: "Yesterday, 09:45 AM",
    status: "read"
  },
  // Jane Francis (Counsel) - commsclient.png
  {
    id: "m3",
    senderId: JANE_FRANCIS.id,
    content: "Please update the status of case ID 2025-0012",
    timestamp: "Yesterday, 09:45 AM",
    status: "sent"
  },
  // Ruth Ananah (You) - commsclient.png
  {
    id: "m4",
    senderId: RUTH_ANANAH.id,
    content: "Please update the status of case ID 2025-0012",
    timestamp: "Yesterday, 09:45 AM",
    status: "sent"
  },
  // Message with Document (commsclientmsg.png)
  {
    id: "m5",
    senderId: CURRENT_USER.id,
    content: "Case ID: 2025-0012",
    timestamp: "10:44 AM",
    status: "read",
    attachment: { fileName: "Case ID: 2025-0012", sizeKB: 304 }
  }
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "convo-1",
    user: JANE_FRANCIS,
    lastMessage: MOCK_MESSAGES[0].content,
    lastTimestamp: MOCK_MESSAGES[0].timestamp,
    unreadCount: 3,
    isStarred: true,
    type: "room"
  },
  {
    id: "convo-2",
    user: CURRENT_USER,
    lastMessage: MOCK_MESSAGES[1].content,
    lastTimestamp: MOCK_MESSAGES[1].timestamp,
    unreadCount: 0,
    isStarred: true,
    type: "private"
  },
  {
    id: "convo-3",
    user: RUTH_ANANAH,
    lastMessage: MOCK_MESSAGES[3].content,
    lastTimestamp: MOCK_MESSAGES[3].timestamp,
    unreadCount: 0,
    isStarred: false,
    type: "private"
  }
];

// --- Store Definition ---

interface CommunicationState {
  currentUser: User;
  currentChannel: CommChannel;
  conversations: Conversation[];
  activeConversationId: string | null;
  activeMessages: Message[];

  setChannel: (channel: CommChannel) => void;
  setActiveConversation: (convoId: string | null) => void;
  getMessagesForConversation: (convoId: string) => Message[];
  sendMessage: (
    convoId: string,
    content: string,
    attachment?: DocumentAttachment
  ) => void;
}

export const useCommunicationStore = create<CommunicationState>((set, get) => ({
  currentUser: CURRENT_USER,
  currentChannel: "inbox",
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: null,
  activeMessages: [],

  setChannel: (channel) => {
    // When changing channel, close the active chat view
    set({
      currentChannel: channel,
      activeConversationId: null,
      activeMessages: []
    });
  },

  setActiveConversation: (convoId) => {
    if (convoId) {
      // Simulate fetching messages for the active conversation
      const messages =
        convoId === "convo-1" ? MOCK_MESSAGES : MOCK_MESSAGES.slice(0, 3);
      set({ activeConversationId: convoId, activeMessages: messages });
    } else {
      set({ activeConversationId: null, activeMessages: [] });
    }
  },

  getMessagesForConversation: (convoId) => {
    // This function is for display outside the main active chat
    return MOCK_MESSAGES;
  },

  sendMessage: (convoId, content, attachment) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: get().currentUser.id,
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: "sent",
      attachment
    };

    set((state) => ({
      activeMessages: [...state.activeMessages, newMessage]
    }));
    // In a real scenario, this is where you'd call POST /api/v1/messages/room or /private
  }
}));
