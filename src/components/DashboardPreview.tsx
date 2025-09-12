import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../state/userStore";
import { useHealthStore } from "../state/healthStore";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface DashboardPreviewProps {
  show: boolean;
  animationDelay?: number;
}

export default function DashboardPreview({ 
  show, 
  animationDelay = 0 
}: DashboardPreviewProps) {
  const { profile } = useUserStore();
  const { achievements } = useHealthStore();

  // Animation values
  const containerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const metricsTranslateY = useSharedValue(40);
  const achievementsTranslateY = useSharedValue(50);

  React.useEffect(() => {
    if (show) {
      // Staggered entrance animations
      containerOpacity.value = withDelay(
        animationDelay,
        withTiming(1, { duration: 400 })
      );
      
      headerTranslateY.value = withDelay(
        animationDelay + 100,
        withSpring(0, { damping: 20, stiffness: 300 })
      );
      
      metricsTranslateY.value = withDelay(
        animationDelay + 200,
        withSpring(0, { damping: 20, stiffness: 300 })
      );
      
      achievementsTranslateY.value = withDelay(
        animationDelay + 300,
        withSpring(0, { damping: 20, stiffness: 300 })
      );
    } else {
      // Reset animations
      containerOpacity.value = 0;
      headerTranslateY.value = 30;
      metricsTranslateY.value = 40;
      achievementsTranslateY.value = 50;
    }
  }, [show, animationDelay]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const metricsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: metricsTranslateY.value }],
  }));

  const achievementsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: achievementsTranslateY.value }],
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getName = () => {
    return profile?.name ? profile.name.split(" ")[0] : "there";
  };

  const recentAchievements = achievements.filter(a => a.isUnlocked).slice(0, 2);

  if (!show) return null;

  return (
    <Animated.View style={[{ flex: 1 }, containerStyle]}>
      <LinearGradient
        colors={["#1C1C2E", "#F9F6F1"]} // Navy to Ivory gradient
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}
      >
        {/* Header */}
        <Animated.View style={[{ marginBottom: 24 }, headerStyle]}>
          <Text className="text-ivory text-2xl font-bold mb-1">
            {getGreeting()}! 👋
          </Text>
          <Text className="text-ivory/80 text-base">
            {getName()}, welcome to your health dashboard
          </Text>
        </Animated.View>

        {/* Health Metrics Preview */}
        <Animated.View style={[{ marginBottom: 24 }, metricsStyle]}>
          <Text className="text-ivory text-lg font-semibold mb-3">
            Today's Overview
          </Text>
          <View className="flex-row space-x-3">
            {/* Steps Card */}
            <View className="flex-1 bg-ivory/10 rounded-xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="walk" size={20} color="#F9F6F1" />
                <Text className="text-ivory/60 text-xs">STEPS</Text>
              </View>
              <Text className="text-ivory text-xl font-bold">8,247</Text>
              <Text className="text-gold text-sm">+12% from yesterday</Text>
            </View>

            {/* Heart Rate Card */}
            <View className="flex-1 bg-ivory/10 rounded-xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="heart" size={20} color="#D4AF37" />
                <Text className="text-ivory/60 text-xs">BPM</Text>
              </View>
              <Text className="text-ivory text-xl font-bold">72</Text>
              <Text className="text-green-400 text-sm">Resting</Text>
            </View>
          </View>
        </Animated.View>

        {/* Achievements Preview */}
        <Animated.View style={achievementsStyle}>
          <Text className="text-ivory text-lg font-semibold mb-3">
            Recent Achievements
          </Text>
          <View className="space-y-2">
            {recentAchievements.length > 0 ? (
              recentAchievements.map((achievement) => (
                <View
                  key={achievement.id}
                  className="bg-gold/20 rounded-lg p-3 flex-row items-center"
                >
                  <View className="bg-gold rounded-full p-2 mr-3">
                    <Ionicons name="trophy" size={16} color="#1C1C2E" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-ivory font-semibold text-sm">
                      {achievement.title}
                    </Text>
                    <Text className="text-ivory/70 text-xs">
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="bg-ivory/10 rounded-lg p-4 items-center">
                <Ionicons name="star-outline" size={24} color="#F9F6F1" />
                <Text className="text-ivory/80 text-sm mt-2 text-center">
                  Your achievements will appear here as you progress
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Quick Actions Preview */}
        <View className="mt-6 flex-row justify-center space-x-4">
          <View className="bg-navy/20 rounded-full px-4 py-2">
            <Text className="text-ivory/80 text-sm">Log Symptoms</Text>
          </View>
          <View className="bg-navy/20 rounded-full px-4 py-2">
            <Text className="text-ivory/80 text-sm">Track Medication</Text>
          </View>
          <View className="bg-navy/20 rounded-full px-4 py-2">
            <Text className="text-ivory/80 text-sm">Ask AI</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}