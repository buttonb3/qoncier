import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,

  withSequence,
  runOnJS,
} from "react-native-reanimated";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface ConfettiAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export default function ConfettiAnimation({ show, onComplete }: ConfettiAnimationProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const confettiPieces: ConfettiPiece[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 200,
    color: ["#D4AF37", "#1C1C2E", "#F9F6F1", "#10B981"][Math.floor(Math.random() * 4)],
    size: Math.random() * 8 + 4,
  }));

  useEffect(() => {
    if (show) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 1000 }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        })
      );
    } else {
      opacity.value = 0;
      scale.value = 0;
    }
  }, [show]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
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
          pointerEvents: "none",
        },
        animatedStyle,
      ]}
    >
      {confettiPieces.map((piece) => (
        <View
          key={piece.id}
          style={{
            position: "absolute",
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.size / 2,
          }}
        />
      ))}
    </Animated.View>
  );
}