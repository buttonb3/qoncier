import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import { useHealthStore } from "../../state/healthStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingCard from "../../components/onboarding/OnboardingCard";

export default function OnboardingHealthPermissionsScreen() {
  const navigation = useNavigation();
  const { nextOnboardingStep, completeOnboardingStep } = useUserStore();
  const { deviceConnections, updateDeviceConnection } = useHealthStore();
  
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const handleToggle = (deviceId: string, value: boolean) => {
    setPermissions(prev => ({ ...prev, [deviceId]: value }));
    updateDeviceConnection(deviceId, { isConnected: value });
  };

  const handleNext = () => {
    completeOnboardingStep("health-permissions");
    nextOnboardingStep();
    navigation.navigate("EmergencyContacts" as never);
  };

  return (
    <OnboardingContainer currentStep={9} totalSteps={11}>
      <View className="flex-1 py-8">
        <Text className="text-ivory text-3xl font-bold text-center mb-2">
          Connect Health Data
        </Text>
        <Text className="text-ivory/80 text-lg text-center mb-8">
          Connect your health devices and apps for a complete picture of your wellness
        </Text>

        <OnboardingCard
          title="Available Connections"
          icon="fitness"
        >
          <View className="space-y-4">
            {deviceConnections.map((device) => (
              <View key={device.id} className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-navy font-semibold text-base">
                    {device.name}
                  </Text>
                  <Text className="text-ash text-sm">
                    {device.permissions.join(", ")}
                  </Text>
                </View>
                
                <Switch
                  value={permissions[device.id] || false}
                  onValueChange={(value) => handleToggle(device.id, value)}
                  trackColor={{ false: "#777777", true: "#1C1C2E" }}
                  thumbColor={permissions[device.id] ? "#D4AF37" : "#F9F6F1"}
                />
              </View>
            ))}
          </View>
        </OnboardingCard>

        <View className="bg-ivory/10 rounded-xl p-4 mt-6">
          <Text className="text-ivory/80 text-sm text-center">
            💡 You can connect these devices anytime in your profile settings
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