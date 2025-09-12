import React, { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingSelector from "../../components/onboarding/OnboardingSelector";

export default function OnboardingHealthGoalsScreen() {
  const navigation = useNavigation();
  const { updateProfile, nextOnboardingStep, completeOnboardingStep } = useUserStore();
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [error, setError] = useState("");

  const healthGoalOptions = [
    {
      id: "weight-management",
      label: "Weight Management",
      description: "Track and manage your weight goals",
      icon: "fitness" as const,
    },
    {
      id: "medication-adherence",
      label: "Medication Adherence",
      description: "Never miss your medications",
      icon: "medical" as const,
    },
    {
      id: "symptom-tracking",
      label: "Symptom Tracking",
      description: "Monitor and understand your symptoms",
      icon: "pulse" as const,
    },
    {
      id: "nutrition-monitoring",
      label: "Nutrition Monitoring",
      description: "Track your daily nutrition intake",
      icon: "restaurant" as const,
    },
    {
      id: "activity-tracking",
      label: "Activity Tracking",
      description: "Monitor your daily physical activity",
      icon: "walk" as const,
    },
    {
      id: "sleep-improvement",
      label: "Sleep Improvement",
      description: "Better understand your sleep patterns",
      icon: "moon" as const,
    },
    {
      id: "stress-management",
      label: "Stress Management",
      description: "Track and manage stress levels",
      icon: "heart" as const,
    },
    {
      id: "chronic-condition",
      label: "Chronic Condition Management",
      description: "Manage ongoing health conditions",
      icon: "medical-outline" as const,
    },
  ];

  const handleNext = () => {
    if (selectedGoals.length === 0) {
      setError("Please select at least one health goal");
      return;
    }
    
    setError("");
    updateProfile({ healthGoals: selectedGoals });
    completeOnboardingStep("health-goals");
    nextOnboardingStep();
    navigation.navigate("MedicalHistory" as never);
  };

  return (
    <OnboardingContainer currentStep={3} totalSteps={11}>
      <View className="flex-1 py-8">
        <Text className="text-ivory text-3xl font-bold text-center mb-2">
          What are your health goals?
        </Text>
        <Text className="text-ivory/80 text-lg text-center mb-8">
          Select the areas you'd like to focus on. We'll customize your experience accordingly.
        </Text>

        <OnboardingSelector
          label="Health Goals"
          options={healthGoalOptions}
          selectedIds={selectedGoals}
          onSelectionChange={setSelectedGoals}
          multiSelect={true}
          error={error}
        />
      </View>

      <View className="pb-8">
        <OnboardingButton
          title="Continue"
          onPress={handleNext}
        />
      </View>
    </OnboardingContainer>
  );
}