import React, { useEffect } from "react";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface ProfileCompleteBadgeProps {
  show: boolean;
  delay?: number;
}

export default function ProfileCompleteBadge({ 
  show, 
  delay = 400 
}: ProfileCompleteBadgeProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);

  useEffect(() => {
    if (show) {
      // Badge entrance with bounce
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.2, {
            damping: 15,
            stiffness: 300,
          }),
          withSpring(1.0, {
            damping: 20,
            stiffness: 400,
          })
        )
      );

      // Subtle rotation during bounce
      rotation.value = withDelay(
        delay,
        withSequence(
          withSpring(8, { damping: 15, stiffness: 300 }),
          withSpring(-3, { damping: 20, stiffness: 400 }),
          withSpring(0, { damping: 25, stiffness: 500 })
        )
      );

      // Fade in
      opacity.value = withDelay(
        delay,
        withTiming(1, { duration: 300 })
      );

      // Checkmark appears after badge settles
      checkmarkScale.value = withDelay(
        delay + 600,
        withSpring(1, {
          damping: 18,
          stiffness: 350,
        })
      );

      checkmarkOpacity.value = withDelay(
        delay + 600,
        withTiming(1, { duration: 200 })
      );
    } else {
      // Reset all values
      scale.value = 0;
      rotation.value = 0;
      opacity.value = 0;
      checkmarkScale.value = 0;
      checkmarkOpacity.value = 0;
    }
  }, [show, delay]);

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value,
    transform: [{ scale: checkmarkScale.value }],
  }));

  if (!show) return null;

  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#D4AF37", // Gold background
          borderRadius: 12,
          paddingHorizontal: 20,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          // Professional shadow
          shadowColor: "#1C1C2E",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        },
        badgeStyle,
      ]}
    >
      <Animated.View style={[{ marginRight: 8 }, checkmarkStyle]}>
        <Ionicons name="checkmark-circle" size={20} color="#1C1C2E" />
      </Animated.View>
      
      <Text
        style={{
          color: "#1C1C2E", // Navy text
          fontSize: 16,
          fontWeight: "bold",
          letterSpacing: 0.5,
        }}
      >
        Profile Complete
      </Text>
    </Animated.View>
  );
}