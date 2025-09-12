import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: keyof typeof Ionicons.glyphMap;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: "success" | "warning" | "danger" | "neutral";
}

export default function HealthMetricCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  color = "neutral",
}: HealthMetricCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "bg-success/10 border-success/20";
      case "warning":
        return "bg-warning/10 border-warning/20";
      case "danger":
        return "bg-danger/10 border-danger/20";
      default:
        return "bg-white/90 border-white/20";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      default:
        return "remove";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return color === "danger" ? "#EF4444" : "#10B981";
      case "down":
        return color === "success" ? "#EF4444" : "#10B981";
      default:
        return "#777777";
    }
  };

  return (
    <View className={`rounded-xl p-4 border ${getColorClasses()}`}>
      <View className="flex-row items-center justify-between mb-2">
        <Ionicons name={icon} size={24} color="#1C1C2E" />
        {trend && trendValue && (
          <View className="flex-row items-center">
            <Ionicons 
              name={getTrendIcon()} 
              size={16} 
              color={getTrendColor()} 
            />
            <Text 
              className="text-sm font-medium ml-1"
              style={{ color: getTrendColor() }}
            >
              {trendValue}
            </Text>
          </View>
        )}
      </View>
      
      <Text className="text-navy text-2xl font-bold">
        {value}
        {unit && <Text className="text-lg text-ash"> {unit}</Text>}
      </Text>
      
      <Text className="text-ash text-sm mt-1">{title}</Text>
    </View>
  );
}