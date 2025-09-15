import React from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingCard from "../../components/onboarding/OnboardingCard";

export default function OnboardingWelcomeScreen() {
  const navigation = useNavigation();
  const { nextOnboardingStep, completeOnboardingStep } = useUserStore();

  const handleGetStarted = () => {
    completeOnboardingStep("welcome");
    nextOnboardingStep();
    navigation.navigate("PersonalInfo" as never);
  };

  return (
    <OnboardingContainer currentStep={1} totalSteps={11} showProgress={false}>
      <View className="flex-1 justify-center py-8">
        <OnboardingCard
          title="Welcome to Qoncier"
          phoneticSpelling="(KON-see-air)"
          description="Your AI-powered personal health assistant"
          icon="heart"
          variant="highlight"
        >
          <View className="mt-6 space-y-4">
            <View className="bg-navy/10 rounded-lg p-3">
              <Text className="text-navy font-semibold text-center">
                🤖 AI Health Assistant
              </Text>
              <Text className="text-black text-sm text-center mt-1">
                Get personalized health guidance 24/7
              </Text>
            </View>
            
            <View className="bg-navy/10 rounded-lg p-3">
              <Text className="text-navy font-semibold text-center">
                📊 Comprehensive Tracking
              </Text>
              <Text className="text-black text-sm text-center mt-1">
                Monitor symptoms, medications, and nutrition
              </Text>
            </View>
            
            <View className="bg-navy/10 rounded-lg p-3">
              <Text className="text-navy font-semibold text-center">
                🏆 Gamified Wellness
              </Text>
              <Text className="text-black text-sm text-center mt-1">
                Achieve health goals with rewards and insights
              </Text>
            </View>
          </View>
        </OnboardingCard>

        <View className="mt-8 mb-4">
          <Text className="text-black text-sm text-center italic">
            "People don't care how much you know until they know how much you care." — Author unknown
          </Text>
          <Text className="text-black text-sm text-center mt-2">
            At Qoncier, your story is the foundation, science is the support.
          </Text>
        </View>
      </View>

      <View className="pb-8">
        <Text className="text-black text-sm text-center mb-4">
          ⏱️ Setup takes about 5 minutes
        </Text>
        <OnboardingButton
          title="Get Started"
          onPress={handleGetStarted}
        />
      </View>
    </OnboardingContainer>
  );
}