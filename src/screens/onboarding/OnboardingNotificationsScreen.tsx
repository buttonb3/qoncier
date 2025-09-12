import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingCard from "../../components/onboarding/OnboardingCard";

export default function OnboardingNotificationsScreen() {
  const navigation = useNavigation();
  const { updateSettings, nextOnboardingStep, completeOnboardingStep } = useUserStore();
  
  const [notifications, setNotifications] = useState({
    medications: true,
    symptoms: true,
    achievements: true,
    insights: true,
    reminders: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    updateSettings({ notifications });
    completeOnboardingStep("notifications");
    nextOnboardingStep();
    navigation.navigate("Privacy" as never);
  };

  const notificationOptions = [
    {
      key: "medications" as const,
      title: "Medication Reminders",
      description: "Get notified when it's time to take your medications",
    },
    {
      key: "symptoms" as const,
      title: "Symptom Check-ins",
      description: "Gentle reminders to log how you're feeling",
    },
    {
      key: "achievements" as const,
      title: "Achievement Celebrations",
      description: "Celebrate your health milestones and progress",
    },
    {
      key: "insights" as const,
      title: "Health Insights",
      description: "Personalized tips and health recommendations",
    },
    {
      key: "reminders" as const,
      title: "General Reminders",
      description: "Helpful reminders for appointments and health tasks",
    },
  ];

  return (
    <OnboardingContainer currentStep={7} totalSteps={11}>
      <View className="flex-1 py-8">
        <Text className="text-ivory text-3xl font-bold text-center mb-2">
          Stay Connected
        </Text>
        <Text className="text-ivory/80 text-lg text-center mb-8">
          Choose which notifications you'd like to receive. You can change these anytime.
        </Text>

        <OnboardingCard
          title="Notification Preferences"
          icon="notifications"
        >
          <View className="space-y-4">
            {notificationOptions.map((option) => (
              <View key={option.key} className="flex-row items-start justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-navy font-semibold text-base">
                    {option.title}
                  </Text>
                  <Text className="text-ash text-sm mt-1">
                    {option.description}
                  </Text>
                </View>
                
                <Switch
                  value={notifications[option.key]}
                  onValueChange={() => handleToggle(option.key)}
                  trackColor={{ false: "#777777", true: "#1C1C2E" }}
                  thumbColor={notifications[option.key] ? "#D4AF37" : "#F9F6F1"}
                />
              </View>
            ))}
          </View>
        </OnboardingCard>

        <View className="bg-ivory/10 rounded-xl p-4 mt-6">
          <Text className="text-ivory/80 text-sm text-center">
            💡 You can customize these settings anytime in your profile
          </Text>
        </View>
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