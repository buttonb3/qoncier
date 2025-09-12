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
import FitnessRingsAnimation from "../../components/FitnessRingsAnimation";
import InspirationalTextAnimation from "../../components/InspirationalTextAnimation";
import AchievementUnlockAnimation from "../../components/AchievementUnlockAnimation";
import BreathingBackgroundAnimation from "../../components/BreathingBackgroundAnimation";
import { 
  celebrateSuccess, 
  celebrateAchievement, 
  celebrateRingCompletion, 
  celebrateJourneyBegin,
  celebrateExtendedSuccess 
} from "../../utils/feedbackUtils";
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
  const [showFitnessRings, setShowFitnessRings] = useState(false);
  const [showInspirationalText, setShowInspirationalText] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showBreathingBackground, setShowBreathingBackground] = useState(false);
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
      await celebrateExtendedSuccess();
      setAnimationPhase("complete");
      return;
    }
    
    // Extended animation sequence for normal motion (3 seconds total)
    // Phase 1: Breathing background and gradient burst (immediate)
    setShowBreathingBackground(true);
    setShowBurst(true);
    overlayOpacity.value = withTiming(0, { duration: 800 });
    
    // Phase 2: Particle emission (400ms delay - extended from 200ms)
    setTimeout(() => {
      setShowParticles(true);
    }, 400);
    
    // Phase 3: Inspirational text begins (500ms delay)
    setTimeout(() => {
      setShowInspirationalText(true);
    }, 500);
    
    // Phase 4: Badge appearance (800ms delay - extended from 400ms)
    setTimeout(() => {
      setShowBadge(true);
      setAnimationPhase("celebrating");
    }, 800);
    
    // Phase 5: Achievement unlock (1000ms delay - extended from 500ms)
    setTimeout(async () => {
      setShowAchievement(true);
      await celebrateAchievement();
      setShowConfetti(true);
    }, 1000);
    
    // Phase 6: Fitness rings animation (1200ms delay)
    setTimeout(async () => {
      setShowFitnessRings(true);
      await celebrateRingCompletion();
    }, 1200);
    
    // Phase 7: Dashboard reveal (1500ms delay - extended from 600ms)
    setTimeout(() => {
      setShowDashboard(true);
      setAnimationPhase("revealing");
    }, 1500);
    
    // Phase 8: Journey celebration (2500ms delay)
    setTimeout(async () => {
      await celebrateJourneyBegin();
    }, 2500);
    
    // Phase 9: Complete (3000ms total - extended from 2000ms)
    setTimeout(() => {
      setAnimationPhase("complete");
    }, 3000);
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
      
      {/* Breathing Background Animation */}
      <BreathingBackgroundAnimation 
        show={showBreathingBackground}
        duration={4000}
      />
      
      {/* Fitness Rings Animation */}
      <FitnessRingsAnimation 
        show={showFitnessRings}
        centerX={touchPosition.x}
        centerY={touchPosition.y - 100}
        onComplete={() => setShowFitnessRings(false)}
      />
      
      {/* Inspirational Text Animation */}
      <InspirationalTextAnimation 
        show={showInspirationalText}
        centerY={touchPosition.y + 150}
        onComplete={() => setShowInspirationalText(false)}
      />
      
      {/* Achievement Unlock Animation */}
      <AchievementUnlockAnimation 
        show={showAchievement}
        centerX={touchPosition.x}
        centerY={touchPosition.y - 50}
        onComplete={() => setShowAchievement(false)}
      />
      
      {/* Dashboard Reveal */}
      <DashboardRevealAnimation 
        show={showDashboard}
        delay={0}
        onComplete={() => {
          // Auto-complete after dashboard reveal (extended timing)
          setTimeout(() => {
            handleComplete();
          }, 2000); // Extended from 1000ms to 2000ms
        }}
      />
    </OnboardingContainer>
  );
}