import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  delay: number;
}

interface ParticleGlowAnimationProps {
  show: boolean;
  onComplete?: () => void;
  centerX?: number;
  centerY?: number;
}

export default function ParticleGlowAnimation({ 
  show, 
  onComplete,
  centerX = screenWidth / 2,
  centerY = screenHeight / 2,
}: ParticleGlowAnimationProps) {
  const masterOpacity = useSharedValue(0);

  // Generate elegant light orbs
  const particles: Particle[] = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const radius = 80 + Math.random() * 120;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    return {
      id: i,
      x,
      y,
      size: 8 + Math.random() * 8, // 8-16px
      color: ["#D4AF37", "#F9F6F1", "#1C1C2E"][Math.floor(Math.random() * 3)],
      opacity: 0.3 + Math.random() * 0.5, // 0.3-0.8
      delay: i * 50, // Staggered timing
    };
  });

  useEffect(() => {
    if (show) {
      masterOpacity.value = withTiming(1, { duration: 300 });
      
      // Complete after animation sequence
      const timer = setTimeout(() => {
        if (onComplete) {
          runOnJS(onComplete)();
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      masterOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [show]);

  const masterStyle = useAnimatedStyle(() => ({
    opacity: masterOpacity.value,
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
        masterStyle,
      ]}
    >
      {particles.map((particle) => (
        <ParticleOrb key={particle.id} particle={particle} />
      ))}
    </Animated.View>
  );
}

interface ParticleOrbProps {
  particle: Particle;
}

function ParticleOrb({ particle }: ParticleOrbProps) {
  const scale = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance
    const entranceDelay = particle.delay;
    
    // Scale in with spring
    scale.value = withDelay(
      entranceDelay,
      withSpring(1, {
        damping: 20,
        stiffness: 300,
      })
    );
    
    // Fade in
    opacity.value = withDelay(
      entranceDelay,
      withTiming(particle.opacity, { duration: 400 })
    );
    
    // Gentle floating motion
    translateY.value = withDelay(
      entranceDelay + 200,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(20, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
    
    // Gentle horizontal sway
    translateX.value = withDelay(
      entranceDelay + 400,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
    
    // Fade out after 2.5 seconds
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 });
      scale.value = withTiming(0, { duration: 500 });
    }, 2500);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: particle.x - particle.size / 2,
    top: particle.y - particle.size / 2,
    width: particle.size,
    height: particle.size,
    backgroundColor: particle.color,
    borderRadius: particle.size / 2,
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
    // Glow effect
    shadowColor: particle.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: particle.size * 0.8,
    elevation: 8,
  }));

  return <Animated.View style={animatedStyle} />;
}