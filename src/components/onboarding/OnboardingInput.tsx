import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface OnboardingInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export default function OnboardingInput({
  label,
  error,
  required = false,
  ...props
}: OnboardingInputProps) {
  return (
    <View className="mb-4">
      <Text className="text-ivory text-base font-semibold mb-2">
        {label}
        {required && <Text className="text-gold"> *</Text>}
      </Text>
      
      <TextInput
        className={`bg-ivory/90 rounded-xl p-4 text-navy text-base ${
          error ? "border-2 border-danger" : ""
        }`}
        placeholderTextColor="#777777"
        {...props}
      />
      
      {error && (
        <Text className="text-danger text-sm mt-1 ml-2">
          {error}
        </Text>
      )}
    </View>
  );
}