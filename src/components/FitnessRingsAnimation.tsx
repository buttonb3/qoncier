import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface FitnessRingsAnimationProps {
  show: boolean;
  onComplete?: () => void;
  centerX?: number;
  centerY?: number;
}

interface RingConfig {
  radius: number;
  strokeWidth: number;
  color: string;
  delay: number;
  label: string;
}

export default function FitnessRingsAnimation({
  show,
  onComplete,
  centerX = screenWidth / 2,
  centerY = screenHeight / 2,
}: FitnessRingsAnimationProps) {
  // Ring configurations - representing health journey milestones
  const rings: RingConfig[] = [
    {
      radius: 60,
      strokeWidth: 8,
      color: "#D4AF37", // Gold - Wellness Goals
      delay: 0,
      label: "Wellness",
    },
    {
      radius: 45,
      strokeWidth: 8,
      color: "#1C1C2E", // Navy - Health Tracking
      delay: 200,
      label: "Tracking",
    },
    {
      radius: 30,
      strokeWidth: 8,
      color: "#F9F6F1", // Ivory - AI Assistance
      delay: 400,
      label: "AI Support",
    },
  ];

  // Animation values for each ring
  const ring1Progress = useSharedValue(0);
  const ring1Scale = useSharedValue(0.8);
  const ring1Glow = useSharedValue(0);

  const ring2Progress = useSharedValue(0);
  const ring2Scale = useSharedValue(0.8);
  const ring2Glow = useSharedValue(0);

  const ring3Progress = useSharedValue(0);
  const ring3Scale = useSharedValue(0.8);
  const ring3Glow = useSharedValue(0);

  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.9);

  useEffect(() => {
    if (show) {
      // Container entrance
      containerOpacity.value = withTiming(1, { duration: 300 });
      containerScale.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
      });

      // Ring 1 - Wellness Goals (Gold)
      ring1Scale.value = withDelay(
        rings[0].delay,
        withSpring(1, { damping: 15, stiffness: 200 })
      );
      ring1Progress.value = withDelay(
        rings[0].delay + 100,
        withTiming(1, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );
      ring1Glow.value = withDelay(
        rings[0].delay + 900,
        withSequence(
          withSpring(1, { damping: 10, stiffness: 300 }),
          withTiming(0.3, { duration: 500 })
        )
      );

      // Ring 2 - Health Tracking (Navy)
      ring2Scale.value = withDelay(
        rings[1].delay,
        withSpring(1, { damping: 15, stiffness: 200 })
      );
      ring2Progress.value = withDelay(
        rings[1].delay + 100,
        withTiming(1, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );
      ring2Glow.value = withDelay(
        rings[1].delay + 900,
        withSequence(
          withSpring(1, { damping: 10, stiffness: 300 }),
          withTiming(0.3, { duration: 500 })
        )
      );

      // Ring 3 - AI Support (Ivory)
      ring3Scale.value = withDelay(
        rings[2].delay,
        withSpring(1, { damping: 15, stiffness: 200 })
      );
      ring3Progress.value = withDelay(
        rings[2].delay + 100,
        withTiming(1, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );
      ring3Glow.value = withDelay(
        rings[2].delay + 900,
        withSequence(
          withSpring(1, { damping: 10, stiffness: 300 }),
          withTiming(0.3, { duration: 500 })
        )
      );

      // Complete callback after all rings finish
      if (onComplete) {
        const timer = setTimeout(() => {
          runOnJS(onComplete)();
        }, 1500); // Total duration: 1500ms

        return () => clearTimeout(timer);
      }
    } else {
      // Reset all values
      containerOpacity.value = 0;
      containerScale.value = 0.9;
      ring1Progress.value = 0;
      ring1Scale.value = 0.8;
      ring1Glow.value = 0;
      ring2Progress.value = 0;
      ring2Scale.value = 0.8;
      ring2Glow.value = 0;
      ring3Progress.value = 0;
      ring3Scale.value = 0.8;
      ring3Glow.value = 0;
    }
  }, [show, onComplete]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  // Ring animation styles
  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    shadowOpacity: ring1Glow.value * 0.8,
    shadowRadius: ring1Glow.value * 20,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    shadowOpacity: ring2Glow.value * 0.8,
    shadowRadius: ring2Glow.value * 20,
  }));

  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring3Scale.value }],
    shadowOpacity: ring3Glow.value * 0.8,
    shadowRadius: ring3Glow.value * 20,
  }));

  // Animated props for ring progress
  const ring1AnimatedProps = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * rings[0].radius;
    return {
      strokeDasharray: circumference,
      strokeDashoffset: circumference * (1 - ring1Progress.value),
    };
  });

  const ring2AnimatedProps = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * rings[1].radius;
    return {
      strokeDasharray: circumference,
      strokeDashoffset: circumference * (1 - ring2Progress.value),
    };
  });

  const ring3AnimatedProps = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * rings[2].radius;
    return {
      strokeDasharray: circumference,
      strokeDashoffset: circumference * (1 - ring3Progress.value),
    };
  });

  if (!show) return null;

  const svgSize = Math.max(rings[0].radius * 2 + rings[0].strokeWidth * 2 + 40, 160);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: centerY - svgSize / 2,
          left: centerX - svgSize / 2,
          width: svgSize,
          height: svgSize,
          zIndex: 1001,
          alignItems: "center",
          justifyContent: "center",
        },
        containerStyle,
      ]}
    >
      <Svg width={svgSize} height={svgSize}>
        {/* Background rings */}
        {rings.map((ring, index) => (
          <Circle
            key={`bg-${index}`}
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={ring.radius}
            stroke={ring.color}
            strokeWidth={ring.strokeWidth}
            strokeOpacity={0.2}
            fill="none"
          />
        ))}

        {/* Animated progress rings */}
        <Animated.View style={ring1Style}>
          <AnimatedCircle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={rings[0].radius}
            stroke={rings[0].color}
            strokeWidth={rings[0].strokeWidth}
            strokeLinecap="round"
            fill="none"
            animatedProps={ring1AnimatedProps}
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
          />
        </Animated.View>

        <Animated.View style={ring2Style}>
          <AnimatedCircle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={rings[1].radius}
            stroke={rings[1].color}
            strokeWidth={rings[1].strokeWidth}
            strokeLinecap="round"
            fill="none"
            animatedProps={ring2AnimatedProps}
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
          />
        </Animated.View>

        <Animated.View style={ring3Style}>
          <AnimatedCircle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={rings[2].radius}
            stroke={rings[2].color}
            strokeWidth={rings[2].strokeWidth}
            strokeLinecap="round"
            fill="none"
            animatedProps={ring3AnimatedProps}
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
          />
        </Animated.View>
      </Svg>
    </Animated.View>
  );
}