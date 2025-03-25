import { create } from "zustand";
import { Message } from "@/types/message";
import { useAuthStore } from "./useAuthStore";

interface MessagesState {
  messages: Record<number, Message[]>; // Indexed by contactId
  lastSync: Record<number, string>; // Last sync timestamp per contact
  addMessage: (contactId: number, message: Message) => void;
  addMessages: (messages: Message[]) => void;
  setLastSync: (contactId: number, timestamp: string) => void;
  getMessages: (contactId: number) => Message[];
  clear: () => void;
}

export const useMessagesStore = create<MessagesState>()((set, get) => ({
  messages: {},
  lastSync: {},

  addMessage: (contactId: number, message: Message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [contactId]: [...(state.messages[contactId] || []), message],
      },
    })),

  addMessages: (messages: Message[]) =>
    set((state) => {
      const newMessages = { ...state.messages };
      messages.forEach((message) => {
        const contactId =
          message.senderId === useAuthStore.getState().authUser?.id
            ? message.receiverId
            : message.senderId;
        newMessages[contactId] = [...(newMessages[contactId] || []), message];
      });
      return { messages: newMessages };
    }),

  setLastSync: (contactId: number, timestamp: string) =>
    set((state) => ({
      lastSync: {
        ...state.lastSync,
        [contactId]: timestamp,
      },
    })),

  getMessages: (contactId: number) => get().messages[contactId] || [],

  clear: () => set({ messages: {}, lastSync: {} }),
}));
