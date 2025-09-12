import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "../../state/userStore";

export default function OnboardingWelcomeScreen() {
  const { completeOnboarding } = useUserStore();

  const handleSkipOnboarding = () => {
    completeOnboarding();
  };

  return (
    <LinearGradient
      colors={["#1C1C2E", "#F9F6F1"]} // Navy to Ivory gradient
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 px-6">
        <View className="flex-1 justify-center items-center">
          <Text className="text-ivory text-4xl font-bold text-center mb-4">
            Welcome to Qoncier
          </Text>
          <Text className="text-ivory/80 text-lg text-center mb-8">
            Your AI-powered personal health assistant
          </Text>
          
          <View className="w-full space-y-4">
            <Pressable
              onPress={handleSkipOnboarding}
              className="bg-gold rounded-xl py-4 px-8"
            >
              <Text className="text-navy text-lg font-semibold text-center">
                Get Started
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleSkipOnboarding}
              className="border border-ivory/30 rounded-xl py-4 px-8"
            >
              <Text className="text-ivory text-lg font-semibold text-center">
                Skip for Now
              </Text>
            </Pressable>
          </View>
        </View>
        
        <View className="pb-8">
          <Text className="text-ivory/60 text-sm text-center">
            Complete onboarding will be implemented in the next phase
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}