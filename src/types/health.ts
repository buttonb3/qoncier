// Core health data type definitions for Qoncier app

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  height?: number; // in cm
  weight?: number; // in kg
  healthGoals: string[];
  activityLevel: "sedentary" | "lightly-active" | "moderately-active" | "very-active" | "extremely-active";
  allergies: string[];
  medicalConditions: string[];
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface HealthMetric {
  id: string;
  type: "steps" | "heart-rate" | "blood-pressure" | "weight" | "sleep" | "water-intake" | "calories";
  value: number;
  unit: string;
  timestamp: string;
  source: "manual" | "device" | "estimated";
  deviceId?: string;
}

export interface Symptom {
  id: string;
  name: string;
  description?: string;
  severity: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = severe
  bodyPart?: string;
  duration?: string;
  triggers?: string[];
  photos?: string[];
  timestamp: string;
  tags: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  prescribedBy?: string;
  startDate: string;
  endDate?: string;
  reminders: MedicationReminder[];
  sideEffects?: string[];
  isActive: boolean;
  photos?: string[];
}

export interface MedicationReminder {
  id: string;
  medicationId: string;
  time: string; // HH:MM format
  days: number[]; // 0-6, Sunday = 0
  isEnabled: boolean;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  timestamp: string;
  taken: boolean;
  notes?: string;
}

export interface NutritionEntry {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  quantity: number;
  unit: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  micros?: {
    [key: string]: number; // vitamin/mineral name -> amount
  };
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  timestamp: string;
  photos?: string[];
  source: "barcode" | "photo" | "manual" | "ai-analysis";
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  type: "text" | "image" | "action";
  metadata?: {
    actionType?: "log-symptom" | "log-medication" | "log-nutrition" | "emergency";
    actionData?: any;
    imageUri?: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "steps" | "medication" | "nutrition" | "symptoms" | "general";
  unlockedAt?: string;
  progress: number; // 0-100
  target: number;
  isUnlocked: boolean;
}

export interface HealthInsight {
  id: string;
  title: string;
  description: string;
  type: "positive" | "warning" | "neutral" | "achievement";
  category: "activity" | "nutrition" | "medication" | "symptoms" | "sleep";
  timestamp: string;
  actionable?: boolean;
  actionText?: string;
  actionType?: string;
}

export interface DeviceConnection {
  id: string;
  name: string;
  type: "apple-health" | "fitbit" | "oura" | "garmin" | "other";
  isConnected: boolean;
  lastSync?: string;
  permissions: string[];
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface AppSettings {
  notifications: {
    medications: boolean;
    symptoms: boolean;
    achievements: boolean;
    insights: boolean;
    reminders: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
  theme: "light" | "dark" | "system";
  language: string;
}

// Mock data interfaces for development
export interface MockHealthData {
  todaySteps: number;
  heartRate: number;
  sleepHours: number;
  waterIntake: number;
  caloriesConsumed: number;
  medicationAdherence: number;
}