import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface GradientBurstAnimationProps {
  show: boolean;
  centerX?: number;
  centerY?: number;
}

export default function GradientBurstAnimation({ 
  show, 
  centerX = screenWidth / 2,
  centerY = screenHeight / 2,
}: GradientBurstAnimationProps) {
  // Create 4 concentric ripple waves
  const wave1Scale = useSharedValue(0);
  const wave1Opacity = useSharedValue(0);
  const wave2Scale = useSharedValue(0);
  const wave2Opacity = useSharedValue(0);
  const wave3Scale = useSharedValue(0);
  const wave3Opacity = useSharedValue(0);
  const wave4Scale = useSharedValue(0);
  const wave4Opacity = useSharedValue(0);

  useEffect(() => {
    if (show) {
      // Wave 1 - Immediate burst
      wave1Scale.value = withSpring(3, {
        damping: 15,
        stiffness: 200,
      });
      wave1Opacity.value = withSequence(
        withSpring(0.8, { damping: 20, stiffness: 300 }),
        withDelay(400, withSpring(0, { damping: 15, stiffness: 200 }))
      );

      // Wave 2 - 200ms delay
      wave2Scale.value = withDelay(
        200,
        withSpring(4, {
          damping: 18,
          stiffness: 180,
        })
      );
      wave2Opacity.value = withDelay(
        200,
        withSequence(
          withSpring(0.6, { damping: 20, stiffness: 300 }),
          withDelay(400, withSpring(0, { damping: 15, stiffness: 200 }))
        )
      );

      // Wave 3 - 400ms delay
      wave3Scale.value = withDelay(
        400,
        withSpring(5, {
          damping: 20,
          stiffness: 160,
        })
      );
      wave3Opacity.value = withDelay(
        400,
        withSequence(
          withSpring(0.4, { damping: 20, stiffness: 300 }),
          withDelay(400, withSpring(0, { damping: 15, stiffness: 200 }))
        )
      );

      // Wave 4 - 600ms delay (final wave)
      wave4Scale.value = withDelay(
        600,
        withSpring(6, {
          damping: 25,
          stiffness: 140,
        })
      );
      wave4Opacity.value = withDelay(
        600,
        withSequence(
          withSpring(0.2, { damping: 20, stiffness: 300 }),
          withDelay(400, withSpring(0, { damping: 15, stiffness: 200 }))
        )
      );
    } else {
      // Reset all values
      wave1Scale.value = 0;
      wave1Opacity.value = 0;
      wave2Scale.value = 0;
      wave2Opacity.value = 0;
      wave3Scale.value = 0;
      wave3Opacity.value = 0;
      wave4Scale.value = 0;
      wave4Opacity.value = 0;
    }
  }, [show]);

  const createWaveStyle = (scale: any, opacity: any) =>
    useAnimatedStyle(() => ({
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 50,
      left: centerX - 50,
      top: centerY - 50,
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    }));

  const wave1Style = createWaveStyle(wave1Scale, wave1Opacity);
  const wave2Style = createWaveStyle(wave2Scale, wave2Opacity);
  const wave3Style = createWaveStyle(wave3Scale, wave3Opacity);
  const wave4Style = createWaveStyle(wave4Scale, wave4Opacity);

  if (!show) return null;

  return (
    <>
      {/* Wave 1 - Navy center */}
      <Animated.View style={wave1Style}>
        <LinearGradient
          colors={["#1C1C2E", "#1C1C2E80", "#1C1C2E00"]}
          style={{ flex: 1, borderRadius: 50 }}
        />
      </Animated.View>

      {/* Wave 2 - Gold middle */}
      <Animated.View style={wave2Style}>
        <LinearGradient
          colors={["#D4AF37", "#D4AF3780", "#D4AF3700"]}
          style={{ flex: 1, borderRadius: 50 }}
        />
      </Animated.View>

      {/* Wave 3 - Ivory outer */}
      <Animated.View style={wave3Style}>
        <LinearGradient
          colors={["#F9F6F1", "#F9F6F180", "#F9F6F100"]}
          style={{ flex: 1, borderRadius: 50 }}
        />
      </Animated.View>

      {/* Wave 4 - Final subtle wave */}
      <Animated.View style={wave4Style}>
        <LinearGradient
          colors={["#D4AF37", "#D4AF3740", "#D4AF3700"]}
          style={{ flex: 1, borderRadius: 50 }}
        />
      </Animated.View>
    </>
  );
}