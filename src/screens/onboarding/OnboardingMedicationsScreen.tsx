import React, { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingInput from "../../components/onboarding/OnboardingInput";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingCard from "../../components/onboarding/OnboardingCard";

export default function OnboardingMedicationsScreen() {
  const navigation = useNavigation();
  const { nextOnboardingStep, completeOnboardingStep } = useUserStore();
  
  const [takingMedications, setTakingMedications] = useState<boolean | null>(null);
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "" }
  ]);

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "" }]);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = medications.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleNext = () => {
    // We'll handle medication creation in the main app
    // For now, just store the basic info
    completeOnboardingStep("medications");
    nextOnboardingStep();
    navigation.navigate("ActivityLevel" as never);
  };

  return (
    <OnboardingContainer currentStep={5} totalSteps={11}>
      <View className="flex-1 py-8">
        <Text className="text-ivory text-3xl font-bold text-center mb-2">
          Current Medications
        </Text>
        <Text className="text-ivory/80 text-lg text-center mb-8">
          Let us know about any medications you're currently taking
        </Text>

        <OnboardingCard
          title="Do you take any medications regularly?"
          icon="medical"
        >
          <View className="flex-row space-x-4">
            <OnboardingButton
              title="Yes"
              onPress={() => setTakingMedications(true)}
              variant={takingMedications === true ? "primary" : "outline"}
              fullWidth={false}
            />
            <OnboardingButton
              title="No"
              onPress={() => setTakingMedications(false)}
              variant={takingMedications === false ? "primary" : "outline"}
              fullWidth={false}
            />
          </View>
        </OnboardingCard>

        {takingMedications === true && (
          <View className="mt-6">
            <Text className="text-ivory text-lg font-semibold mb-4">
              Medication Details
            </Text>
            <Text className="text-ivory/60 text-sm mb-4">
              You can add more details and set up reminders later in the app
            </Text>
            
            {medications.map((med, index) => (
              <View key={index} className="bg-ivory/10 rounded-xl p-4 mb-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-ivory font-semibold">
                    Medication {index + 1}
                  </Text>
                  {medications.length > 1 && (
                    <OnboardingButton
                      title="Remove"
                      onPress={() => removeMedication(index)}
                      variant="outline"
                      fullWidth={false}
                    />
                  )}
                </View>
                
                <OnboardingInput
                  label="Medication Name"
                  value={med.name}
                  onChangeText={(text) => updateMedication(index, "name", text)}
                  placeholder="e.g., Aspirin, Metformin"
                />
                
                <OnboardingInput
                  label="Dosage"
                  value={med.dosage}
                  onChangeText={(text) => updateMedication(index, "dosage", text)}
                  placeholder="e.g., 100mg, 1 tablet"
                />
                
                <OnboardingInput
                  label="Frequency"
                  value={med.frequency}
                  onChangeText={(text) => updateMedication(index, "frequency", text)}
                  placeholder="e.g., Once daily, Twice daily"
                />
              </View>
            ))}
            
            <OnboardingButton
              title="Add Another Medication"
              onPress={addMedication}
              variant="outline"
            />
          </View>
        )}

        {takingMedications === false && (
          <OnboardingCard
            title="Great!"
            description="You can always add medications later if needed."
            variant="highlight"
          />
        )}
      </View>

      <View className="pb-8">
        <OnboardingButton
          title="Continue"
          onPress={handleNext}
          disabled={takingMedications === null}
        />
      </View>
    </OnboardingContainer>
  );
}