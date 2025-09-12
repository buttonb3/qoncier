import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserStore } from "../state/userStore";
import OnboardingNavigator from "./OnboardingNavigator";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isFirstLaunch, onboardingProgress } = useUserStore();
  
  const shouldShowOnboarding = isFirstLaunch || !onboardingProgress.isCompleted;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {shouldShowOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}