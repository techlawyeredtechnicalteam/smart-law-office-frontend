// /store/calendarStore.ts
import { create, StateCreator } from "zustand";
import { toast } from "sonner";

export interface ScheduledEvent {
  id: string;
  type: "Consultation" | "Deadline" | "Meeting";
  title: string;
  clientName: string; // Only for Consultation
  status: "Scheduled" | "Completed" | "Cancelled";
  date: string; // e.g., "March 11, 2025"
  time: string; // e.g., "10:00 AM"
  duration?: string;
  notes?: string;
}

export interface ConsultationDraft {
  title: string;
  clientName: string;
  clientEmail: string;
  duration: string;
  date: string;
  time: string;
  notes: string;
}

export interface CalendarStore {
  // State
  currentMonth: string;
  events: ScheduledEvent[];
  isModalOpen: boolean;
  modalStep: 1 | 2 | 3; // 1: Form, 2: Share, 3: Success
  draftConsultation: ConsultationDraft | null;

  // Actions
  openScheduleModal: () => void;
  closeScheduleModal: () => void;
  setModalStep: (step: 1 | 2 | 3) => void;
  saveDraft: (data: Partial<ConsultationDraft>) => void;
  scheduleConsultation: () => void;

  // Navigation
  viewConsultationDetail: (id: string | null) => void;
  selectedEventId: string | null;
}

const mockEvents: ScheduledEvent[] = [
  {
    id: "e001",
    type: "Consultation",
    title: "Litigation",
    clientName: "Jane Francis",
    status: "Scheduled",
    date: "March 1, 2025",
    time: "10:00 AM"
  },
  {
    id: "e002",
    type: "Consultation",
    title: "Litigation",
    clientName: "Jane Francis",
    status: "Scheduled",
    date: "March 8, 2025",
    time: "10:00 AM"
  },
  {
    id: "e003",
    type: "Consultation",
    title: "Litigation",
    clientName: "Jane Francis",
    status: "Scheduled",
    date: "March 11, 2025",
    time: "10:00 AM",
    duration: "1 hour",
    notes: "Contract review inquiry, initial case discussion."
  },
  {
    id: "e004",
    type: "Consultation",
    title: "Litigation",
    clientName: "Jane Francis",
    status: "Scheduled",
    date: "March 15, 2025",
    time: "10:00 AM"
  },
  {
    id: "e005",
    type: "Deadline",
    title: "Document Filing Deadline",
    clientName: "",
    status: "Scheduled",
    date: "March 11, 2025",
    time: "11:20 AM"
  },
  {
    id: "e006",
    type: "Meeting",
    title: "Team Strategy Meeting",
    clientName: "",
    status: "Scheduled",
    date: "March 11, 2025",
    time: "4:00 PM"
  }
];

const store: StateCreator<CalendarStore> = (set, get) => ({
  currentMonth: "March 2025",
  events: mockEvents,
  isModalOpen: false,
  modalStep: 1,
  draftConsultation: null,
  selectedEventId: null,

  openScheduleModal: () =>
    set({
      isModalOpen: true,
      modalStep: 1,
      draftConsultation: {
        title: "",
        clientName: "",
        clientEmail: "",
        duration: "",
        date: "",
        time: "",
        notes: ""
      }
    }),
  closeScheduleModal: () =>
    set({ isModalOpen: false, modalStep: 1, draftConsultation: null }),
  setModalStep: (step) => set({ modalStep: step }),

  saveDraft: (data) =>
    set((state) => ({
      draftConsultation: {
        ...state.draftConsultation,
        ...data
      } as ConsultationDraft
    })),

  scheduleConsultation: () => {
    const draft = get().draftConsultation;
    if (!draft) return;

    // Simulate scheduling a new event
    const newEvent: ScheduledEvent = {
      id: `e${Date.now()}`,
      type: "Consultation",
      title: draft.title,
      clientName: draft.clientName,
      status: "Scheduled",
      date: draft.date,
      time: draft.time,
      duration: draft.duration,
      notes: draft.notes
    };

    set((state) => ({
      events: [...state.events, newEvent],
      draftConsultation: newEvent as any // Using newEvent for share step
    }));

    // Move to the share step
    get().setModalStep(2);
  },

  viewConsultationDetail: (id) => set({ selectedEventId: id })
});

export const useCalendarStore = create<CalendarStore>()(store);
