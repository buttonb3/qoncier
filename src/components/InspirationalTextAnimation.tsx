import React, { useEffect, useState } from "react";
import { Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
} from "react-native-reanimated";

const { height: screenHeight } = Dimensions.get("window");

interface InspirationalTextAnimationProps {
  show: boolean;
  onComplete?: () => void;
  centerX?: number;
  centerY?: number;
}

interface TextPhase {
  text: string;
  delay: number;
  duration: number;
  fontSize: number;
  color: string;
}

export default function InspirationalTextAnimation({
  show,
  onComplete,
  centerY = screenHeight / 2 + 100, // Position below rings
}: InspirationalTextAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

  // Inspirational message sequence
  const textPhases: TextPhase[] = [
    {
      text: "Profile Complete! ✨",
      delay: 0,
      duration: 1000,
      fontSize: 20,
      color: "#D4AF37", // Gold
    },
    {
      text: "Your Journey Begins! 🚀",
      delay: 500,
      duration: 1000,
      fontSize: 18,
      color: "#1C1C2E", // Navy
    },
    {
      text: "Welcome to Wellness! 💚",
      delay: 1000,
      duration: 1200,
      fontSize: 22,
      color: "#D4AF37", // Gold
    },
  ];

  // Animation values
  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.8);
  const textTranslateY = useSharedValue(20);
  const glowIntensity = useSharedValue(0);

  useEffect(() => {
    if (show) {
      // Start the text sequence
      textPhases.forEach((phase, index) => {
        setTimeout(() => {
          // Update current phase for text content
          runOnJS(setCurrentPhase)(index);

          // Animate text entrance
          textOpacity.value = withTiming(1, { duration: 300 });
          textScale.value = withSpring(1, {
            damping: 15,
            stiffness: 300,
          });
          textTranslateY.value = withSpring(0, {
            damping: 20,
            stiffness: 400,
          });

          // Add glow effect for emphasis
          glowIntensity.value = withSequence(
            withDelay(200, withSpring(1, { damping: 10, stiffness: 200 })),
            withDelay(300, withTiming(0.3, { duration: 400 }))
          );

          // Animate text exit (except for the last phase)
          if (index < textPhases.length - 1) {
            setTimeout(() => {
              textOpacity.value = withTiming(0, { duration: 300 });
              textScale.value = withTiming(0.9, { duration: 300 });
              textTranslateY.value = withTiming(-10, { duration: 300 });
              glowIntensity.value = withTiming(0, { duration: 300 });
            }, phase.duration - 300);
          }
        }, phase.delay);
      });

      // Complete callback
      if (onComplete) {
        const totalDuration = Math.max(
          ...textPhases.map((phase, index) => 
            phase.delay + (index === textPhases.length - 1 ? phase.duration : phase.duration - 300)
          )
        );
        
        const timer = setTimeout(() => {
          runOnJS(onComplete)();
        }, totalDuration);

        return () => clearTimeout(timer);
      }
    } else {
      // Reset all values
      textOpacity.value = 0;
      textScale.value = 0.8;
      textTranslateY.value = 20;
      glowIntensity.value = 0;
      setCurrentPhase(0);
    }
  }, [show, onComplete]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { scale: textScale.value },
      { translateY: textTranslateY.value },
    ],
    shadowOpacity: glowIntensity.value * 0.8,
    shadowRadius: glowIntensity.value * 15,
    shadowOffset: { width: 0, height: 0 },
  }));

  if (!show) return null;

  const currentText = textPhases[currentPhase];

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: centerY - 20,
          left: 20,
          right: 20,
          alignItems: "center",
          zIndex: 1002,
        },
        textStyle,
      ]}
    >
      <Text
        style={{
          fontSize: currentText.fontSize,
          fontWeight: "bold",
          color: currentText.color,
          textAlign: "center",
          letterSpacing: 0.5,
          shadowColor: currentText.color,
        }}
      >
        {currentText.text}
      </Text>
    </Animated.View>
  );
}