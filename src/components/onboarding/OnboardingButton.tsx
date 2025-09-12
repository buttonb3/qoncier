import React from "react";
import { Pressable, Text } from "react-native";

interface OnboardingButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function OnboardingButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  fullWidth = true,
}: OnboardingButtonProps) {
  const getButtonStyles = () => {
    const baseStyles = `rounded-xl py-4 px-8 ${fullWidth ? "w-full" : ""}`;
    
    if (disabled) {
      return `${baseStyles} bg-ash/30`;
    }
    
    switch (variant) {
      case "secondary":
        return `${baseStyles} bg-ivory`;
      case "outline":
        return `${baseStyles} border-2 border-ivory/30`;
      default:
        return `${baseStyles} bg-gold`;
    }
  };

  const getTextStyles = () => {
    if (disabled) {
      return "text-ash";
    }
    
    switch (variant) {
      case "secondary":
        return "text-navy";
      case "outline":
        return "text-ivory";
      default:
        return "text-navy";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={getButtonStyles()}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text className={`${getTextStyles()} text-lg font-semibold text-center`}>
        {title}
      </Text>
    </Pressable>
  );
}