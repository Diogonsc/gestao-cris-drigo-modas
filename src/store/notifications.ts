import { create } from "zustand";
import { Notification } from "@/services/notifications";
import { createPersistedStore, logger } from "./middleware";

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  logger(
    createPersistedStore(
      (set) => ({
        notifications: [],
        unreadCount: 0,

        addNotification: (notification) =>
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + (notification.read ? 0 : 1),
          })),

        markAsRead: (id) =>
          set((state) => {
            const updatedNotifications = state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            );
            const unreadCount = updatedNotifications.filter(
              (n) => !n.read
            ).length;
            return {
              notifications: updatedNotifications,
              unreadCount,
            };
          }),

        markAllAsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((n) => ({
              ...n,
              read: true,
            })),
            unreadCount: 0,
          })),

        removeNotification: (id) =>
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadCount: state.unreadCount - (notification?.read ? 0 : 1),
            };
          }),

        clearAll: () =>
          set({
            notifications: [],
            unreadCount: 0,
          }),
      }),
      {
        name: "notifications-store",
        version: 1,
        partialize: (state) => ({
          notifications: state.notifications,
          unreadCount: state.unreadCount,
        }),
      }
    ),
    "NotificationsStore"
  )
);
