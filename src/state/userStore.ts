import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, OnboardingProgress, AppSettings } from "../types/health";

interface UserState {
  profile: UserProfile | null;
  onboardingProgress: OnboardingProgress;
  settings: AppSettings;
  isFirstLaunch: boolean;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setOnboardingProgress: (progress: OnboardingProgress) => void;
  completeOnboarding: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setFirstLaunch: (isFirst: boolean) => void;
}

const defaultSettings: AppSettings = {
  notifications: {
    medications: true,
    symptoms: true,
    achievements: true,
    insights: true,
    reminders: true,
  },
  privacy: {
    shareData: false,
    analytics: false,
  },
  theme: "system",
  language: "en",
};

const defaultOnboardingProgress: OnboardingProgress = {
  currentStep: 0,
  totalSteps: 11,
  completedSteps: [],
  isCompleted: false,
  startedAt: new Date().toISOString(),
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      onboardingProgress: defaultOnboardingProgress,
      settings: defaultSettings,
      isFirstLaunch: true,

      setProfile: (profile) => set({ profile }),
      
      updateProfile: (updates) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              ...updates,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },

      setOnboardingProgress: (progress) => set({ onboardingProgress: progress }),
      
      completeOnboarding: () => {
        set({
          onboardingProgress: {
            ...get().onboardingProgress,
            isCompleted: true,
            completedAt: new Date().toISOString(),
          },
          isFirstLaunch: false,
        });
      },

      updateSettings: (newSettings) => {
        set({
          settings: {
            ...get().settings,
            ...newSettings,
          },
        });
      },

      setFirstLaunch: (isFirst) => set({ isFirstLaunch: isFirst }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);