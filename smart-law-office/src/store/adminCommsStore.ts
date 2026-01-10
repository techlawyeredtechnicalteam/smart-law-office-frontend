// /store/commsStore.ts
import { create, StateCreator } from "zustand";

export type CommsView = "empty" | "dashboard" | "chat";

export interface Message {
  id: string;
  sender: string;
  senderType: "Author" | "Client";
  caseId: string;
  snippet: string;
  date: string;
  isStarred: boolean;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  text: string;
  isAuthor: boolean;
  timestamp: string;
  attachments?: { fileName: string; size: string }[];
}

export interface CommsStore {
  // State
  currentView: CommsView;
  isMenuCollapsed: boolean;
  selectedMessageId: string | null;
  messages: Message[];

  // Actions
  setView: (view: CommsView) => void;
  toggleMenu: () => void;
  selectMessage: (id: string) => void;
  getSelectedMessage: () => Message | undefined;
}

const mockMessages: Message[] = [
  {
    id: "m001",
    sender: "Jane Francis",
    senderType: "Author",
    caseId: "2025-0012",
    snippet: "Please update the status of case ID 2025-0012",
    date: "Yesterday, 09:45 AM",
    isStarred: true,
    messages: [
      {
        id: "c1",
        text: "Please update the status of case ID 2025-0012",
        isAuthor: false,
        timestamp: "10:43 AM"
      },
      {
        id: "c2",
        text: "Please update the status of case ID 2025-0012",
        isAuthor: true,
        timestamp: "10:44 AM"
      },
      {
        id: "c3",
        text: "Please update the status of case ID 2025-0012",
        isAuthor: false,
        timestamp: "10:45 AM"
      },
      {
        id: "c4",
        text: "Please update the status of case ID 2025-0012",
        isAuthor: true,
        timestamp: "10:46 AM",
        attachments: [{ fileName: "Contract document.docx", size: "304 KB" }]
      },
      {
        id: "c5",
        text: "Please update the status of case ID 2025-0012",
        isAuthor: false,
        timestamp: "10:47 AM"
      }
    ]
  },
  {
    id: "m002",
    sender: "Ruth Ananah",
    senderType: "Client",
    caseId: "2025-0012",
    snippet: "Please update the status of case ID 2025-0012",
    date: "Yesterday, 09:45 AM",
    isStarred: false,
    messages: []
  },
  // ... rest of the messages from the mockup
  {
    id: "m003",
    sender: "Jane Francis",
    senderType: "Author",
    caseId: "2025-0012",
    snippet: "Please update the status of case ID 2025-0012",
    date: "Yesterday, 09:45 AM",
    isStarred: false,
    messages: []
  },
  {
    id: "m004",
    sender: "Ruth Ananah",
    senderType: "Client",
    caseId: "2025-0012",
    snippet: "Please update the status of case ID 2025-0012",
    date: "Yesterday, 09:45 AM",
    isStarred: false,
    messages: []
  },
  {
    id: "m005",
    sender: "Jane Francis",
    senderType: "Author",
    caseId: "2025-0012",
    snippet: "Please update the status of case ID 2025-0012",
    date: "Yesterday, 09:45 AM",
    isStarred: false,
    messages: []
  },
  {
    id: "m006",
    sender: "Ruth Ananah",
    senderType: "Author",
    caseId: "2025-0012",
    snippet: "Please update the status of case ID 2025-0012",
    date: "Yesterday, 09:45 AM",
    isStarred: false,
    messages: []
  }
];

const store: StateCreator<CommsStore> = (set, get) => ({
  currentView: "dashboard",
  isMenuCollapsed: false,
  selectedMessageId: null,
  messages: mockMessages,

  setView: (view) => set({ currentView: view }),
  toggleMenu: () =>
    set((state) => ({ isMenuCollapsed: !state.isMenuCollapsed })),
  selectMessage: (id) => set({ selectedMessageId: id, currentView: "chat" }),
  getSelectedMessage: () => {
    const id = get().selectedMessageId;
    return get().messages.find((m) => m.id === id);
  }
});

export const useCommsStore = create<CommsStore>()(store);
