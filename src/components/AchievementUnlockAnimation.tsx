import React, { useEffect } from "react";
import { Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface AchievementUnlockAnimationProps {
  show: boolean;
  onComplete?: () => void;
  centerX?: number;
  centerY?: number;
}

export default function AchievementUnlockAnimation({
  show,
  onComplete,
  centerX = screenWidth / 2,
  centerY = screenHeight / 2 - 50,
}: AchievementUnlockAnimationProps) {
  // Animation values
  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.5);
  const trophyScale = useSharedValue(0);
  const trophyRotation = useSharedValue(-180);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);
  const glowIntensity = useSharedValue(0);
  const badgeScale = useSharedValue(0);

  useEffect(() => {
    if (show) {
      // Container entrance
      containerOpacity.value = withTiming(1, { duration: 200 });
      containerScale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });

      // Trophy dramatic entrance with rotation
      trophyScale.value = withDelay(
        100,
        withSequence(
          withSpring(1.3, { damping: 10, stiffness: 200 }),
          withSpring(1, { damping: 15, stiffness: 300 })
        )
      );
      trophyRotation.value = withDelay(
        100,
        withSpring(0, { damping: 20, stiffness: 200 })
      );

      // Badge background scale in
      badgeScale.value = withDelay(
        50,
        withSpring(1, { damping: 18, stiffness: 250 })
      );

      // Glow effect for trophy
      glowIntensity.value = withDelay(
        300,
        withSequence(
          withSpring(1, { damping: 8, stiffness: 150 }),
          withTiming(0.6, { duration: 800 })
        )
      );

      // Achievement text entrance
      textOpacity.value = withDelay(
        400,
        withTiming(1, { duration: 400 })
      );
      textTranslateY.value = withDelay(
        400,
        withSpring(0, { damping: 20, stiffness: 300 })
      );

      // Complete callback
      if (onComplete) {
        const timer = setTimeout(() => {
          runOnJS(onComplete)();
        }, 2000); // Display for 2 seconds

        return () => clearTimeout(timer);
      }
    } else {
      // Reset all values
      containerOpacity.value = 0;
      containerScale.value = 0.5;
      trophyScale.value = 0;
      trophyRotation.value = -180;
      textOpacity.value = 0;
      textTranslateY.value = 30;
      glowIntensity.value = 0;
      badgeScale.value = 0;
    }
  }, [show, onComplete]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: trophyScale.value },
      { rotate: `${trophyRotation.value}deg` },
    ],
    shadowOpacity: glowIntensity.value * 0.9,
    shadowRadius: glowIntensity.value * 25,
    shadowOffset: { width: 0, height: 0 },
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  if (!show) return null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: centerY - 80,
          left: centerX - 120,
          width: 240,
          height: 160,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1003,
        },
        containerStyle,
      ]}
    >
      {/* Achievement Badge Background */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#D4AF37",
            shadowColor: "#D4AF37",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          },
          badgeStyle,
        ]}
      />

      {/* Trophy Icon */}
      <Animated.View style={[{ marginBottom: 10 }, trophyStyle]}>
        <Ionicons 
          name="trophy" 
          size={48} 
          color="#1C1C2E"
          style={{
            shadowColor: "#D4AF37",
          }}
        />
      </Animated.View>

      {/* Achievement Text */}
      <Animated.View style={textStyle}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#D4AF37",
            textAlign: "center",
            letterSpacing: 0.5,
            shadowColor: "#D4AF37",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}
        >
          Achievement Unlocked!
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#1C1C2E",
            textAlign: "center",
            marginTop: 4,
            opacity: 0.8,
          }}
        >
          Health Journey Initiated
        </Text>
      </Animated.View>
    </Animated.View>
  );
}