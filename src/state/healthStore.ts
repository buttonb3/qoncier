import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HealthMetric, Symptom, Medication, MedicationLog, NutritionEntry, Achievement, HealthInsight, DeviceConnection, MockHealthData } from "../types/health";

interface HealthState {
  metrics: HealthMetric[];
  symptoms: Symptom[];
  medications: Medication[];
  medicationLogs: MedicationLog[];
  nutritionEntries: NutritionEntry[];
  achievements: Achievement[];
  insights: HealthInsight[];
  deviceConnections: DeviceConnection[];
  mockData: MockHealthData;

  // Actions
  addMetric: (metric: HealthMetric) => void;
  addSymptom: (symptom: Symptom) => void;
  updateSymptom: (id: string, updates: Partial<Symptom>) => void;
  deleteSymptom: (id: string) => void;
  addMedication: (medication: Medication) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  logMedication: (log: MedicationLog) => void;
  addNutritionEntry: (entry: NutritionEntry) => void;
  updateNutritionEntry: (id: string, updates: Partial<NutritionEntry>) => void;
  deleteNutritionEntry: (id: string) => void;
  unlockAchievement: (achievementId: string) => void;
  addInsight: (insight: HealthInsight) => void;
  updateDeviceConnection: (id: string, updates: Partial<DeviceConnection>) => void;
  updateMockData: (data: Partial<MockHealthData>) => void;
}

const defaultMockData: MockHealthData = {
  todaySteps: 7842,
  heartRate: 72,
  sleepHours: 7.5,
  waterIntake: 6,
  caloriesConsumed: 1850,
  medicationAdherence: 85,
};

const defaultAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Log your first symptom",
    icon: "medical",
    category: "symptoms",
    progress: 0,
    target: 1,
    isUnlocked: false,
  },
  {
    id: "2",
    title: "Medication Master",
    description: "Take medications for 7 days straight",
    icon: "medical",
    category: "medication",
    progress: 0,
    target: 7,
    isUnlocked: false,
  },
  {
    id: "3",
    title: "Nutrition Tracker",
    description: "Log 10 meals",
    icon: "nutrition",
    category: "nutrition",
    progress: 0,
    target: 10,
    isUnlocked: false,
  },
  {
    id: "4",
    title: "Step Counter",
    description: "Walk 10,000 steps in a day",
    icon: "walk",
    category: "steps",
    progress: 0,
    target: 10000,
    isUnlocked: false,
  },
];

const defaultDeviceConnections: DeviceConnection[] = [
  {
    id: "1",
    name: "Apple Health",
    type: "apple-health",
    isConnected: false,
    permissions: ["steps", "heart-rate", "sleep"],
  },
  {
    id: "2",
    name: "Fitbit",
    type: "fitbit",
    isConnected: false,
    permissions: ["steps", "heart-rate", "sleep", "weight"],
  },
  {
    id: "3",
    name: "Oura Ring",
    type: "oura",
    isConnected: false,
    permissions: ["sleep", "heart-rate", "activity"],
  },
  {
    id: "4",
    name: "Garmin",
    type: "garmin",
    isConnected: false,
    permissions: ["steps", "heart-rate", "sleep", "activity"],
  },
];

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      metrics: [],
      symptoms: [],
      medications: [],
      medicationLogs: [],
      nutritionEntries: [],
      achievements: defaultAchievements,
      insights: [],
      deviceConnections: defaultDeviceConnections,
      mockData: defaultMockData,

      addMetric: (metric) => {
        set({ metrics: [...get().metrics, metric] });
      },

      addSymptom: (symptom) => {
        set({ symptoms: [...get().symptoms, symptom] });
        // Check for achievement unlock
        const symptoms = get().symptoms;
        if (symptoms.length === 0) {
          get().unlockAchievement("1");
        }
      },

      updateSymptom: (id, updates) => {
        set({
          symptoms: get().symptoms.map((symptom) =>
            symptom.id === id ? { ...symptom, ...updates } : symptom
          ),
        });
      },

      deleteSymptom: (id) => {
        set({
          symptoms: get().symptoms.filter((symptom) => symptom.id !== id),
        });
      },

      addMedication: (medication) => {
        set({ medications: [...get().medications, medication] });
      },

      updateMedication: (id, updates) => {
        set({
          medications: get().medications.map((med) =>
            med.id === id ? { ...med, ...updates } : med
          ),
        });
      },

      deleteMedication: (id) => {
        set({
          medications: get().medications.filter((med) => med.id !== id),
        });
      },

      logMedication: (log) => {
        set({ medicationLogs: [...get().medicationLogs, log] });
      },

      addNutritionEntry: (entry) => {
        set({ nutritionEntries: [...get().nutritionEntries, entry] });
        // Check for achievement unlock
        const entries = get().nutritionEntries;
        if (entries.length + 1 >= 10) {
          get().unlockAchievement("3");
        }
      },

      updateNutritionEntry: (id, updates) => {
        set({
          nutritionEntries: get().nutritionEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        });
      },

      deleteNutritionEntry: (id) => {
        set({
          nutritionEntries: get().nutritionEntries.filter((entry) => entry.id !== id),
        });
      },

      unlockAchievement: (achievementId) => {
        set({
          achievements: get().achievements.map((achievement) =>
            achievement.id === achievementId
              ? { ...achievement, isUnlocked: true, unlockedAt: new Date().toISOString(), progress: achievement.target }
              : achievement
          ),
        });
      },

      addInsight: (insight) => {
        set({ insights: [...get().insights, insight] });
      },

      updateDeviceConnection: (id, updates) => {
        set({
          deviceConnections: get().deviceConnections.map((device) =>
            device.id === id ? { ...device, ...updates } : device
          ),
        });
      },

      updateMockData: (data) => {
        set({
          mockData: { ...get().mockData, ...data },
        });
      },
    }),
    {
      name: "health-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);