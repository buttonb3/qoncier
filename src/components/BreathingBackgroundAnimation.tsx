import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";

// Get screen dimensions for potential future use
Dimensions.get("window");

interface BreathingBackgroundAnimationProps {
  show: boolean;
  duration?: number;
}

export default function BreathingBackgroundAnimation({
  show,
  duration = 4000, // 4-second breathing cycle
}: BreathingBackgroundAnimationProps) {
  // Animation values
  const backgroundOpacity = useSharedValue(0);
  const breathingScale = useSharedValue(1);
  const gradientOpacity = useSharedValue(0.1);

  useEffect(() => {
    if (show) {
      // Fade in background
      backgroundOpacity.value = withTiming(1, { duration: 500 });

      // Start breathing animation - continuous gentle pulsing
      breathingScale.value = withRepeat(
        withSequence(
          withTiming(1.02, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(1, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1, // Infinite repeat
        false
      );

      // Gentle gradient opacity breathing
      gradientOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0.1, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1, // Infinite repeat
        false
      );
    } else {
      // Reset values
      backgroundOpacity.value = withTiming(0, { duration: 300 });
      breathingScale.value = 1;
      gradientOpacity.value = 0.1;
    }
  }, [show, duration]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
    transform: [{ scale: breathingScale.value }],
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: gradientOpacity.value,
  }));

  if (!show) return null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999, // Behind other animations
        },
        backgroundStyle,
      ]}
    >
      {/* Primary breathing gradient */}
      <Animated.View style={[{ flex: 1 }, gradientStyle]}>
        <LinearGradient
          colors={[
            "#1C1C2E20", // Navy with transparency
            "#D4AF3715", // Gold with transparency
            "#F9F6F110", // Ivory with transparency
            "#1C1C2E20", // Navy with transparency
          ]}
          locations={[0, 0.3, 0.7, 1]}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Secondary overlay for depth */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          gradientStyle,
        ]}
      >
        <LinearGradient
          colors={[
            "transparent",
            "#D4AF3708", // Very subtle gold center
            "transparent",
          ]}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </Animated.View>
  );
}