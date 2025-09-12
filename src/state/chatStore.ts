import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatMessage } from "../types/health";

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: "welcome",
          content: "Hello! I'm your AI health assistant. I'm here to help you track your symptoms, medications, nutrition, and answer any health-related questions you might have. How can I assist you today?",
          role: "assistant",
          timestamp: new Date().toISOString(),
          type: "text",
        },
      ],
      isLoading: false,

      addMessage: (message) => {
        set({ messages: [...get().messages, message] });
      },

      updateMessage: (id, updates) => {
        set({
          messages: get().messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        });
      },

      deleteMessage: (id) => {
        set({
          messages: get().messages.filter((msg) => msg.id !== id),
        });
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);