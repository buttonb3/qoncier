import React from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuickActionButtonProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: "primary" | "secondary" | "accent";
}

export default function QuickActionButton({
  title,
  icon,
  onPress,
  color = "primary",
}: QuickActionButtonProps) {
  const getColorClasses = () => {
    switch (color) {
      case "secondary":
        return "bg-ivory border border-navy/20";
      case "accent":
        return "bg-gold";
      default:
        return "bg-navy";
    }
  };

  const getTextColor = () => {
    switch (color) {
      case "secondary":
        return "#1C1C2E";
      case "accent":
        return "#1C1C2E";
      default:
        return "#F9F6F1";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className={`${getColorClasses()} rounded-xl p-4 items-center justify-center min-h-[80px] flex-1`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Ionicons name={icon} size={24} color={getTextColor()} />
      <Text 
        className="text-sm font-semibold mt-2 text-center"
        style={{ color: getTextColor() }}
      >
        {title}
      </Text>
    </Pressable>
  );
}