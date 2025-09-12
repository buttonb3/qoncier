import React, { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingInput from "../../components/onboarding/OnboardingInput";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingSelector from "../../components/onboarding/OnboardingSelector";

export default function OnboardingMedicalHistoryScreen() {
  const navigation = useNavigation();
  const { updateProfile, nextOnboardingStep, completeOnboardingStep } = useUserStore();
  
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");

  const commonConditions = [
    { id: "diabetes", label: "Diabetes", icon: "medical" as const },
    { id: "hypertension", label: "High Blood Pressure", icon: "heart" as const },
    { id: "asthma", label: "Asthma", icon: "fitness" as const },
    { id: "arthritis", label: "Arthritis", icon: "body" as const },
    { id: "depression", label: "Depression", icon: "sad" as const },
    { id: "anxiety", label: "Anxiety", icon: "alert-circle" as const },
    { id: "migraine", label: "Migraines", icon: "pulse" as const },
    { id: "none", label: "None of the above", icon: "checkmark-circle" as const },
  ];

  const commonAllergies = [
    { id: "peanuts", label: "Peanuts", icon: "nutrition" as const },
    { id: "shellfish", label: "Shellfish", icon: "fish" as const },
    { id: "dairy", label: "Dairy", icon: "cafe" as const },
    { id: "gluten", label: "Gluten", icon: "restaurant" as const },
    { id: "penicillin", label: "Penicillin", icon: "medical" as const },
    { id: "pollen", label: "Pollen", icon: "flower" as const },
    { id: "dust", label: "Dust Mites", icon: "home" as const },
    { id: "none", label: "No known allergies", icon: "checkmark-circle" as const },
  ];

  const handleNext = () => {
    const conditions = [...selectedConditions];
    const allergies = [...selectedAllergies];
    
    // Add custom entries if provided
    if (customCondition.trim()) {
      conditions.push(customCondition.trim());
    }
    if (customAllergy.trim()) {
      allergies.push(customAllergy.trim());
    }
    
    // Filter out "none" options if other items are selected
    const finalConditions = conditions.includes("none") && conditions.length > 1 
      ? conditions.filter(c => c !== "none") 
      : conditions;
    const finalAllergies = allergies.includes("none") && allergies.length > 1 
      ? allergies.filter(a => a !== "none") 
      : allergies;
    
    updateProfile({ 
      medicalConditions: finalConditions,
      allergies: finalAllergies,
    });
    
    completeOnboardingStep("medical-history");
    nextOnboardingStep();
    navigation.navigate("Medications" as never);
  };

  return (
    <OnboardingContainer currentStep={4} totalSteps={11}>
      <View className="flex-1 py-8">
        <Text className="text-ivory text-3xl font-bold text-center mb-2">
          Medical History
        </Text>
        <Text className="text-ivory/80 text-lg text-center mb-8">
          Help us understand your health background. This information is kept private and secure.
        </Text>

        <OnboardingSelector
          label="Do you have any of these conditions?"
          options={commonConditions}
          selectedIds={selectedConditions}
          onSelectionChange={setSelectedConditions}
          multiSelect={true}
        />

        <OnboardingInput
          label="Other Medical Conditions"
          value={customCondition}
          onChangeText={setCustomCondition}
          placeholder="Enter any other conditions..."
          multiline
        />

        <OnboardingSelector
          label="Do you have any allergies?"
          options={commonAllergies}
          selectedIds={selectedAllergies}
          onSelectionChange={setSelectedAllergies}
          multiSelect={true}
        />

        <OnboardingInput
          label="Other Allergies"
          value={customAllergy}
          onChangeText={setCustomAllergy}
          placeholder="Enter any other allergies..."
          multiline
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