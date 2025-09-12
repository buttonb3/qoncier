import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Achievement } from "../types/health";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "small" | "medium" | "large";
}

export default function AchievementBadge({ 
  achievement, 
  size = "medium" 
}: AchievementBadgeProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-12 h-12";
      case "large":
        return "w-20 h-20";
      default:
        return "w-16 h-16";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return 20;
      case "large":
        return 32;
      default:
        return 24;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return "text-xs";
      case "large":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <View className="items-center">
      <View 
        className={`${getSizeClasses()} rounded-full items-center justify-center ${
          achievement.isUnlocked 
            ? "bg-gold" 
            : "bg-ash/20 border-2 border-ash/30"
        }`}
      >
        <Ionicons 
          name={achievement.isUnlocked ? "trophy" : "lock-closed"} 
          size={getIconSize()} 
          color={achievement.isUnlocked ? "#1C1C2E" : "#777777"} 
        />
      </View>
      
      <Text 
        className={`${getTextSize()} font-medium text-center mt-2 ${
          achievement.isUnlocked ? "text-navy" : "text-ash"
        }`}
        numberOfLines={2}
      >
        {achievement.title}
      </Text>
      
      {!achievement.isUnlocked && (
        <View className="bg-ash/10 rounded-full px-2 py-1 mt-1">
          <Text className="text-xs text-ash">
            {achievement.progress}/{achievement.target}
          </Text>
        </View>
      )}
    </View>
  );
}