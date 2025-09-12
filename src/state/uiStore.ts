import { create } from "zustand";

interface UIState {
  // Modal states
  showEmergencyModal: boolean;
  showAchievementModal: boolean;
  currentAchievement: string | null;
  
  // Loading states
  isScanning: boolean;
  isAnalyzing: boolean;
  
  // Navigation states
  activeTab: string;
  
  // Dashboard states
  showScratchReveal: boolean;
  dashboardRevealed: boolean;
  
  // Actions
  setShowEmergencyModal: (show: boolean) => void;
  setShowAchievementModal: (show: boolean, achievementId?: string) => void;
  setIsScanning: (scanning: boolean) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setActiveTab: (tab: string) => void;
  setShowScratchReveal: (show: boolean) => void;
  setDashboardRevealed: (revealed: boolean) => void;
}

// UI state is not persisted as it's temporary
export const useUIStore = create<UIState>((set) => ({
  showEmergencyModal: false,
  showAchievementModal: false,
  currentAchievement: null,
  isScanning: false,
  isAnalyzing: false,
  activeTab: "Dashboard",
  showScratchReveal: false,
  dashboardRevealed: false,

  setShowEmergencyModal: (show) => set({ showEmergencyModal: show }),
  
  setShowAchievementModal: (show, achievementId) => 
    set({ 
      showAchievementModal: show, 
      currentAchievement: achievementId || null 
    }),
  
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setShowScratchReveal: (show) => set({ showScratchReveal: show }),
  
  setDashboardRevealed: (revealed) => set({ dashboardRevealed: revealed }),
}));