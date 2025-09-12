import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingWelcomeScreen from "../screens/onboarding/OnboardingWelcomeScreen";

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={OnboardingWelcomeScreen} />
    </Stack.Navigator>
  );
}