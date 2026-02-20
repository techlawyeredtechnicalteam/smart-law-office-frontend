import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  type: "success" | "info" | "error" | "consultation";
  message: string;
  details: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

type NotificationInput = Omit<Notification, "id" | "read" | "createdAt">;

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: NotificationInput) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (n) =>
        set((state) => {
          const newNotification: Notification = {
            ...n,
            id: crypto.randomUUID(),
            read: false,
            createdAt: new Date().toISOString()
          };
          const updated = [newNotification, ...state.notifications].slice(
            0,
            50
          ); // ✅ cap at 50 for reference
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length
          };
        }),

      //  Only flips read flag — never removes notifications
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0
        })),

      //  User manually deletes one
      deleteNotification: (id) =>
        set((state) => {
          const updated = state.notifications.filter((n) => n.id !== id);
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length
          };
        }),

      // User manually clears all
      clearNotifications: () => set({ notifications: [], unreadCount: 0 })
    }),
    {
      name: "app-notifications"
    }
  )
);
