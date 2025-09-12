import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingCard from "../../components/onboarding/OnboardingCard";

export default function OnboardingPrivacyScreen() {
  const navigation = useNavigation();
  const { updateSettings, nextOnboardingStep, completeOnboardingStep } = useUserStore();
  
  const [privacy, setPrivacy] = useState({
    shareData: false,
    analytics: false,
  });
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleToggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    if (!agreedToTerms) return;
    
    updateSettings({ privacy });
    completeOnboardingStep("privacy");
    nextOnboardingStep();
    navigation.navigate("HealthPermissions" as never);
  };

  return (
    <OnboardingContainer currentStep={8} totalSteps={11}>
      <View className="flex-1 py-8">
        <Text className="text-ivory text-3xl font-bold text-center mb-2">
          Privacy & Terms
        </Text>
        <Text className="text-ivory/80 text-lg text-center mb-8">
          Your health data is private and secure. Choose your privacy preferences.
        </Text>

        <OnboardingCard
          title="Data Privacy Options"
          icon="shield-checkmark"
        >
          <View className="space-y-6">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-navy font-semibold text-base">
                  Share Anonymized Data
                </Text>
                <Text className="text-ash text-sm mt-1">
                  Help improve health research by sharing anonymized, non-identifiable data
                </Text>
              </View>
              
              <Switch
                value={privacy.shareData}
                onValueChange={() => handleToggle("shareData")}
                trackColor={{ false: "#777777", true: "#1C1C2E" }}
                thumbColor={privacy.shareData ? "#D4AF37" : "#F9F6F1"}
              />
            </View>

            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-navy font-semibold text-base">
                  Usage Analytics
                </Text>
                <Text className="text-ash text-sm mt-1">
                  Help us improve the app by sharing usage analytics
                </Text>
              </View>
              
              <Switch
                value={privacy.analytics}
                onValueChange={() => handleToggle("analytics")}
                trackColor={{ false: "#777777", true: "#1C1C2E" }}
                thumbColor={privacy.analytics ? "#D4AF37" : "#F9F6F1"}
              />
            </View>
          </View>
        </OnboardingCard>

        <View className="bg-ivory/10 rounded-xl p-4 mt-6">
          <Text className="text-ivory text-sm mb-4">
            🔒 <Text className="font-semibold">Your data is always secure:</Text>
          </Text>
          <Text className="text-ivory/80 text-sm mb-2">
            • All health data is encrypted and stored locally on your device
          </Text>
          <Text className="text-ivory/80 text-sm mb-2">
            • We never sell your personal information
          </Text>
          <Text className="text-ivory/80 text-sm">
            • You can delete your data anytime
          </Text>
        </View>

        <View className="flex-row items-start mt-6">
          <Switch
            value={agreedToTerms}
            onValueChange={setAgreedToTerms}
            trackColor={{ false: "#777777", true: "#1C1C2E" }}
            thumbColor={agreedToTerms ? "#D4AF37" : "#F9F6F1"}
          />
          <Text className="text-ivory text-sm ml-3 flex-1">
            I agree to the <Text className="text-gold font-semibold">Terms of Service</Text> and{" "}
            <Text className="text-gold font-semibold">Privacy Policy</Text>
          </Text>
        </View>
      </View>

      <View className="pb-8">
        <OnboardingButton
          title="Continue"
          onPress={handleNext}
          disabled={!agreedToTerms}
        />
      </View>
    </OnboardingContainer>
  );
}