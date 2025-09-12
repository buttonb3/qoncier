import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all onboarding screens
import OnboardingWelcomeScreen from "../screens/onboarding/OnboardingWelcomeScreen";
import OnboardingPersonalInfoScreen from "../screens/onboarding/OnboardingPersonalInfoScreen";
import OnboardingHealthGoalsScreen from "../screens/onboarding/OnboardingHealthGoalsScreen";
import OnboardingMedicalHistoryScreen from "../screens/onboarding/OnboardingMedicalHistoryScreen";
import OnboardingMedicationsScreen from "../screens/onboarding/OnboardingMedicationsScreen";
import OnboardingActivityLevelScreen from "../screens/onboarding/OnboardingActivityLevelScreen";
import OnboardingNotificationsScreen from "../screens/onboarding/OnboardingNotificationsScreen";
import OnboardingPrivacyScreen from "../screens/onboarding/OnboardingPrivacyScreen";
import OnboardingHealthPermissionsScreen from "../screens/onboarding/OnboardingHealthPermissionsScreen";
import OnboardingEmergencyContactsScreen from "../screens/onboarding/OnboardingEmergencyContactsScreen";
import OnboardingCompletionScreen from "../screens/onboarding/OnboardingCompletionScreen";

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false, // Prevent back swipe during onboarding
      }}
    >
      <Stack.Screen name="Welcome" component={OnboardingWelcomeScreen} />
      <Stack.Screen name="PersonalInfo" component={OnboardingPersonalInfoScreen} />
      <Stack.Screen name="HealthGoals" component={OnboardingHealthGoalsScreen} />
      <Stack.Screen name="MedicalHistory" component={OnboardingMedicalHistoryScreen} />
      <Stack.Screen name="Medications" component={OnboardingMedicationsScreen} />
      <Stack.Screen name="ActivityLevel" component={OnboardingActivityLevelScreen} />
      <Stack.Screen name="Notifications" component={OnboardingNotificationsScreen} />
      <Stack.Screen name="Privacy" component={OnboardingPrivacyScreen} />
      <Stack.Screen name="HealthPermissions" component={OnboardingHealthPermissionsScreen} />
      <Stack.Screen name="EmergencyContacts" component={OnboardingEmergencyContactsScreen} />
      <Stack.Screen name="Completion" component={OnboardingCompletionScreen} />
    </Stack.Navigator>
  );
}