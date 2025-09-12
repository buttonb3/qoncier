import React from "react";
import { View, Text } from "react-native";

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingProgressBar({
  currentStep,
  totalSteps,
}: OnboardingProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="px-6 py-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-ivory/80 text-sm">
          Step {currentStep} of {totalSteps}
        </Text>
        <Text className="text-ivory/80 text-sm">
          {Math.round(progress)}%
        </Text>
      </View>
      
      <View className="bg-ivory/20 rounded-full h-2">
        <View 
          className="bg-gold rounded-full h-2"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}