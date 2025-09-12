import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OnboardingCardProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  children?: React.ReactNode;
  variant?: "default" | "highlight";
}

export default function OnboardingCard({
  title,
  description,
  icon,
  children,
  variant = "default",
}: OnboardingCardProps) {
  const getCardStyles = () => {
    switch (variant) {
      case "highlight":
        return "bg-gold/20 border-2 border-gold/30";
      default:
        return "bg-ivory/10 border border-ivory/20";
    }
  };

  return (
    <View className={`rounded-xl p-6 mb-4 ${getCardStyles()}`}>
      {icon && (
        <View className="items-center mb-4">
          <View className="bg-gold rounded-full p-3">
            <Ionicons name={icon} size={32} color="#1C1C2E" />
          </View>
        </View>
      )}
      
      <Text className="text-ivory text-xl font-bold text-center mb-2">
        {title}
      </Text>
      
      {description && (
        <Text className="text-ivory/80 text-base text-center mb-4">
          {description}
        </Text>
      )}
      
      {children}
    </View>
  );
}