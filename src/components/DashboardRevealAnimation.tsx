import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import DashboardPreview from "./DashboardPreview";

const { height: screenHeight } = Dimensions.get("window");

interface DashboardRevealAnimationProps {
  show: boolean;
  onComplete?: () => void;
  delay?: number;
}

export default function DashboardRevealAnimation({
  show,
  onComplete,
  delay = 0,
}: DashboardRevealAnimationProps) {
  // Animation values
  const containerTranslateY = useSharedValue(screenHeight);
  const containerOpacity = useSharedValue(0);
  const blurIntensity = useSharedValue(20);
  const scaleValue = useSharedValue(0.9);

  useEffect(() => {
    if (show) {
      // Phase 1: Initial setup
      containerOpacity.value = withDelay(
        delay,
        withTiming(1, { duration: 200 })
      );

      // Phase 2: Slide up animation with spring physics
      containerTranslateY.value = withDelay(
        delay + 100,
        withSpring(0, {
          damping: 25,
          stiffness: 200,
          mass: 1,
        })
      );

      // Phase 3: Scale animation for depth effect
      scaleValue.value = withDelay(
        delay + 150,
        withSpring(1, {
          damping: 20,
          stiffness: 300,
        })
      );

      // Phase 4: Blur to clear transition
      blurIntensity.value = withDelay(
        delay + 300,
        withTiming(0, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );

      // Complete callback
      if (onComplete) {
        const timer = setTimeout(() => {
          runOnJS(onComplete)();
        }, delay + 1200);
        
        return () => clearTimeout(timer);
      }
    } else {
      // Reset all values
      containerTranslateY.value = screenHeight;
      containerOpacity.value = 0;
      blurIntensity.value = 20;
      scaleValue.value = 0.9;
    }
  }, [show, delay, onComplete]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: containerTranslateY.value },
      { scale: scaleValue.value },
    ],
    opacity: containerOpacity.value,
  }));

  const blurStyle = useAnimatedStyle(() => ({
    opacity: blurIntensity.value > 0 ? 1 : 0,
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
          zIndex: 1000,
        },
        containerStyle,
      ]}
    >
      {/* Blur overlay that fades out */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          },
          blurStyle,
        ]}
      >
        <BlurView
          intensity={20}
          style={{ flex: 1 }}
          tint="dark"
        />
      </Animated.View>

      {/* Dashboard content */}
      <DashboardPreview 
        show={show} 
        animationDelay={delay + 400} 
      />
    </Animated.View>
  );
}