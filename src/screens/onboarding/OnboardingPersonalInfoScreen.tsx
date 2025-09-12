import React, { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingInput from "../../components/onboarding/OnboardingInput";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingSelector from "../../components/onboarding/OnboardingSelector";

export default function OnboardingPersonalInfoScreen() {
  const navigation = useNavigation();
  const { updateProfile, nextOnboardingStep, completeOnboardingStep } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    gender: [] as string[],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genderOptions = [
    { id: "male", label: "Male", icon: "male" as const },
    { id: "female", label: "Female", icon: "female" as const },
    { id: "other", label: "Other", icon: "person" as const },
    { id: "prefer-not-to-say", label: "Prefer not to say", icon: "help-circle" as const },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    
    if (formData.gender.length === 0) {
      newErrors.gender = "Please select your gender";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Update user profile with collected data
      updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        gender: formData.gender[0] as any,
        id: Date.now().toString(),
        healthGoals: [],
        activityLevel: "moderately-active",
        allergies: [],
        medicalConditions: [],
        emergencyContacts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      completeOnboardingStep("personal-info");
      nextOnboardingStep();
      navigation.navigate("HealthGoals" as never);
    }
  };

  return (
    <OnboardingContainer currentStep={2} totalSteps={11}>
      <View className="flex-1 justify-center py-8">
        <Text className="text-ivory text-3xl font-bold text-center mb-2">
          Tell us about yourself
        </Text>
        <Text className="text-ivory/80 text-lg text-center mb-8">
          This helps us personalize your health experience
        </Text>

        <OnboardingInput
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter your full name"
          error={errors.name}
          required
        />

        <OnboardingInput
          label="Email Address"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="your.email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          required
        />

        <OnboardingInput
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
          placeholder="MM/DD/YYYY"
          error={errors.dateOfBirth}
          required
        />

        <OnboardingSelector
          label="Gender"
          options={genderOptions}
          selectedIds={formData.gender}
          onSelectionChange={(selected) => setFormData({ ...formData, gender: selected })}
          multiSelect={false}
          error={errors.gender}
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