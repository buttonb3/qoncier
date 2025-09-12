import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingCard from "../../components/onboarding/OnboardingCard";
import ConfettiAnimation from "../../components/ConfettiAnimation";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function OnboardingCompletionScreen() {
  const { completeOnboarding, profile } = useUserStore();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const overlayOpacity = useSharedValue(1);

  const handleScratch = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      setShowConfetti(true);
      overlayOpacity.value = withTiming(0, { duration: 800 });
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    // Navigation will be handled automatically by AppNavigator
  };

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const getName = () => {
    return profile?.name ? profile.name.split(" ")[0] : "there";
  };

  return (
    <OnboardingContainer currentStep={11} totalSteps={11} showProgress={!isRevealed}>
      <View className="flex-1 justify-center py-8">
        {!isRevealed ? (
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
                
                <Pressable onPress={handleScratch}>
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
        ) : (
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
              >
                <Text className="text-navy text-lg font-semibold text-center">
                  Enter Qoncier
                </Text>
              </Pressable>
            </View>
          </OnboardingCard>
        )}
      </View>
      
      <ConfettiAnimation 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </OnboardingContainer>
  );
}