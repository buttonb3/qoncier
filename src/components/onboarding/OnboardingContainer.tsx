import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import OnboardingProgressBar from "./OnboardingProgressBar";

interface OnboardingContainerProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showProgress?: boolean;
}

export default function OnboardingContainer({
  children,
  currentStep,
  totalSteps,
  showProgress = true,
}: OnboardingContainerProps) {
  return (
    <LinearGradient
      colors={["#1C1C2E", "#F9F6F1"]} // Navy to Ivory gradient
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {showProgress && (
            <OnboardingProgressBar 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
            />
          )}
          
          <ScrollView 
            className="flex-1 px-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}