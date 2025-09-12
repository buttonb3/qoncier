import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OnboardingSelectorOption {
  id: string;
  label: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface OnboardingSelectorProps {
  label: string;
  options: OnboardingSelectorOption[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  required?: boolean;
  error?: string;
}

export default function OnboardingSelector({
  label,
  options,
  selectedIds,
  onSelectionChange,
  multiSelect = true,
  required = false,
  error,
}: OnboardingSelectorProps) {
  const handleOptionPress = (optionId: string) => {
    if (multiSelect) {
      if (selectedIds.includes(optionId)) {
        onSelectionChange(selectedIds.filter(id => id !== optionId));
      } else {
        onSelectionChange([...selectedIds, optionId]);
      }
    } else {
      onSelectionChange([optionId]);
    }
  };

  return (
    <View className="mb-6">
      <Text className="text-ivory text-base font-semibold mb-4">
        {label}
        {required && <Text className="text-gold"> *</Text>}
      </Text>
      
      <View className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
          
          return (
            <Pressable
              key={option.id}
              onPress={() => handleOptionPress(option.id)}
              className={`bg-ivory/90 rounded-xl p-4 border-2 ${
                isSelected ? "border-gold bg-gold/10" : "border-transparent"
              }`}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View className="flex-row items-center">
                {option.icon && (
                  <Ionicons 
                    name={option.icon} 
                    size={24} 
                    color={isSelected ? "#D4AF37" : "#1C1C2E"} 
                    className="mr-3"
                  />
                )}
                
                <View className="flex-1">
                  <Text className={`text-base font-semibold ${
                    isSelected ? "text-gold" : "text-navy"
                  }`}>
                    {option.label}
                  </Text>
                  
                  {option.description && (
                    <Text className="text-ash text-sm mt-1">
                      {option.description}
                    </Text>
                  )}
                </View>
                
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  isSelected 
                    ? "border-gold bg-gold" 
                    : "border-ash"
                }`}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="#1C1C2E" />
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
      
      {error && (
        <Text className="text-danger text-sm mt-2 ml-2">
          {error}
        </Text>
      )}
      
      {multiSelect && (
        <Text className="text-ivory/60 text-sm mt-2 ml-2">
          Select all that apply
        </Text>
      )}
    </View>
  );
}