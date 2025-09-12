import React, { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingSelector from "../../components/onboarding/OnboardingSelector";

export default function OnboardingActivityLevelScreen() {
  const navigation = useNavigation();
  const { updateProfile, nextOnboardingStep, completeOnboardingStep } = useUserStore();
  
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [error, setError] = useState("");

  const activityLevels = [
    {
      id: "sedentary",
      label: "Sedentary",
      description: "Little to no exercise, desk job",
      icon: "desktop" as const,
    },
    {
      id: "lightly-active",
      label: "Lightly Active",
      description: "Light exercise 1-3 days per week",
      icon: "walk" as const,
    },
    {
      id: "moderately-active",
      label: "Moderately Active",
      description: "Moderate exercise 3-5 days per week",
      icon: "bicycle" as const,
    },
    {
      id: "very-active",
      label: "Very Active",
      description: "Hard exercise 6-7 days per week",
      icon: "fitness" as const,
    },
    {
      id: "extremely-active",
      label: "Extremely Active",
      description: "Very hard exercise, physical job, or training",
      icon: "barbell" as const,
    },
  ];

  const handleNext = () => {
    if (selectedLevel.length === 0) {
      setError("Please select your activity level");
      return;
    }
    
    setError("");
    updateProfile({ activityLevel: selectedLevel[0] as any });
    completeOnboardingStep("activity-level");
    nextOnboardingStep();
    navigation.navigate("Notifications" as never);
  };

  return (
    <OnboardingContainer currentStep={6} totalSteps={11}>
      <View className="flex-1 py-8">
        <Text className="text-ivory text-3xl font-bold text-center mb-2">
          Activity Level
        </Text>
        <Text className="text-ivory/80 text-lg text-center mb-8">
          This helps us provide better health recommendations and set realistic goals
        </Text>

        <OnboardingSelector
          label="What's your current activity level?"
          options={activityLevels}
          selectedIds={selectedLevel}
          onSelectionChange={setSelectedLevel}
          multiSelect={false}
          error={error}
          required
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