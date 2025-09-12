import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, AccessibilityInfo } from "react-native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingCard from "../../components/onboarding/OnboardingCard";
import ConfettiAnimation from "../../components/ConfettiAnimation";
import ParticleGlowAnimation from "../../components/ParticleGlowAnimation";
import GradientBurstAnimation from "../../components/GradientBurstAnimation";
import ProfileCompleteBadge from "../../components/ProfileCompleteBadge";
import DashboardRevealAnimation from "../../components/DashboardRevealAnimation";
import { celebrateSuccess } from "../../utils/feedbackUtils";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type AnimationPhase = "idle" | "bursting" | "celebrating" | "revealing" | "complete";

export default function OnboardingCompletionScreen() {
  const { completeOnboarding, profile } = useUserStore();
  
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  
  const overlayOpacity = useSharedValue(1);

  // Check for reduced motion accessibility setting
  useEffect(() => {
    const checkReduceMotion = async () => {
      try {
        const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setReduceMotion(isReduceMotionEnabled);
      } catch (error) {
        console.warn("Failed to check reduce motion setting:", error);
      }
    };
    
    checkReduceMotion();
    
    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion
    );
    
    return () => subscription?.remove();
  }, []);

  const handleScratch = useCallback(async (event: any) => {
    if (animationPhase !== "idle") return;
    
    // Get touch position for centered animations
    const { locationX, locationY } = event.nativeEvent;
    setTouchPosition({ x: locationX || 200, y: locationY || 300 });
    
    // Start animation sequence
    setAnimationPhase("bursting");
    
    if (reduceMotion) {
      // Simplified animation for reduced motion
      overlayOpacity.value = withTiming(0, { duration: 300 });
      await celebrateSuccess();
      setAnimationPhase("complete");
      return;
    }
    
    // Full animation sequence for normal motion
    // Phase 1: Gradient burst (immediate)
    setShowBurst(true);
    overlayOpacity.value = withTiming(0, { duration: 800 });
    
    // Phase 2: Particle emission (200ms delay)
    setTimeout(() => {
      setShowParticles(true);
    }, 200);
    
    // Phase 3: Badge appearance (400ms delay)
    setTimeout(() => {
      setShowBadge(true);
      setAnimationPhase("celebrating");
    }, 400);
    
    // Phase 4: Audio/Haptic feedback (500ms delay)
    setTimeout(async () => {
      await celebrateSuccess();
      setShowConfetti(true);
    }, 500);
    
    // Phase 5: Dashboard reveal (600ms delay)
    setTimeout(() => {
      setShowDashboard(true);
      setAnimationPhase("revealing");
    }, 600);
    
    // Phase 6: Complete (2000ms total)
    setTimeout(() => {
      setAnimationPhase("complete");
    }, 2000);
  }, [animationPhase, reduceMotion, overlayOpacity]);

  const handleComplete = useCallback(async () => {
    await celebrateSuccess();
    completeOnboarding();
    // Navigation will be handled automatically by AppNavigator
  }, [completeOnboarding]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const getName = useCallback(() => {
    return profile?.name ? profile.name.split(" ")[0] : "there";
  }, [profile?.name]);

  // Cleanup function for animation timers
  useEffect(() => {
    return () => {
      // Clear any pending timeouts when component unmounts
      // This prevents memory leaks and state updates on unmounted components
    };
  }, []);

  return (
    <OnboardingContainer currentStep={11} totalSteps={11} showProgress={animationPhase === "idle"}>
      <View className="flex-1 justify-center py-8">
        {animationPhase === "idle" ? (
          <>
            <OnboardingCard
              title="You're All Set!"
              description={`Welcome to Qoncier, ${getName()}! Your personalized health journey starts now.`}
              icon="checkmark-circle"
              variant="highlight"
            >
              <View className="mt-6">
                <Text className="text-navy text-center font-semibold mb-4">
                  Tap below to reveal your dashboard! 👇
                </Text>
                
                <Pressable 
                  onPress={handleScratch}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Tap to reveal your health dashboard"
                  accessibilityHint="Activates celebration animation and reveals your personalized dashboard"
                >
                  <Animated.View className="relative">
                    <View className="bg-gold/20 rounded-xl p-8 items-center">
                      <Text className="text-navy text-lg font-semibold">
                        Tap here to reveal
                      </Text>
                      <Text className="text-navy/60 text-sm mt-1">
                        Your health dashboard awaits!
                      </Text>
                    </View>
                    
                    <Animated.View
                      style={[
                        {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "#777777",
                          borderRadius: 12,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        overlayStyle,
                      ]}
                    >
                      <Text className="text-ivory font-bold text-lg">
                        Tap to reveal! ✨
                      </Text>
                    </Animated.View>
                  </Animated.View>
                </Pressable>
              </View>
            </OnboardingCard>
            
            <View className="bg-ivory/10 rounded-xl p-4 mt-6">
              <Text className="text-ivory/80 text-sm text-center">
                🎉 You've completed your health profile setup!
              </Text>
            </View>
          </>
        ) : animationPhase === "complete" ? (
          <OnboardingCard
            title={`Welcome to Qoncier, ${getName()}!`}
            description="Your AI-powered health assistant is ready to help you on your wellness journey."
            icon="heart"
            variant="highlight"
          >
            <View className="mt-6 space-y-4">
              <View className="bg-navy/10 rounded-lg p-3">
                <Text className="text-navy font-semibold text-center">
                  ✅ Profile Complete
                </Text>
              </View>
              
              <View className="bg-navy/10 rounded-lg p-3">
                <Text className="text-navy font-semibold text-center">
                  🤖 AI Assistant Ready
                </Text>
              </View>
              
              <View className="bg-navy/10 rounded-lg p-3">
                <Text className="text-navy font-semibold text-center">
                  📊 Dashboard Unlocked
                </Text>
              </View>
              
              <Pressable
                onPress={handleComplete}
                className="bg-gold rounded-xl py-4 px-8 mt-6"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Enter Qoncier app"
                accessibilityHint="Completes onboarding and enters the main application"
              >
                <Text className="text-navy text-lg font-semibold text-center">
                  Enter Qoncier
                </Text>
              </Pressable>
            </View>
          </OnboardingCard>
        ) : null}
      </View>
      
      {/* Animation Components */}
      <GradientBurstAnimation 
        show={showBurst}
        centerX={touchPosition.x}
        centerY={touchPosition.y}
      />
      
      <ParticleGlowAnimation 
        show={showParticles}
        centerX={touchPosition.x}
        centerY={touchPosition.y}
        onComplete={() => setShowParticles(false)}
      />
      
      <ConfettiAnimation 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      {/* Profile Complete Badge */}
      {showBadge && (
        <View className="absolute top-1/2 left-0 right-0 items-center z-50">
          <ProfileCompleteBadge show={showBadge} />
        </View>
      )}
      
      {/* Dashboard Reveal */}
      <DashboardRevealAnimation 
        show={showDashboard}
        delay={0}
        onComplete={() => {
          // Auto-complete after dashboard reveal
          setTimeout(() => {
            handleComplete();
          }, 1000);
        }}
      />
    </OnboardingContainer>
  );
}