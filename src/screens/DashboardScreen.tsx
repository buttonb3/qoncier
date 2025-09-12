import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useHealthStore } from "../state/healthStore";
import { useUserStore } from "../state/userStore";
import HealthMetricCard from "../components/HealthMetricCard";
import AchievementBadge from "../components/AchievementBadge";
import QuickActionButton from "../components/QuickActionButton";
import ConfettiAnimation from "../components/ConfettiAnimation";

export default function DashboardScreen() {
  const { mockData, achievements } = useHealthStore();
  const { profile, resetOnboarding } = useUserStore();
  const [showConfetti, setShowConfetti] = useState(false);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getName = () => {
    return profile?.name ? profile.name.split(" ")[0] : "there";
  };

  const recentAchievements = achievements.filter(a => a.isUnlocked).slice(0, 3);
  const nextAchievements = achievements.filter(a => !a.isUnlocked).slice(0, 2);

  return (
    <LinearGradient
      colors={["#1C1C2E", "#F9F6F1"]} // Navy to Ivory gradient
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="pt-4 pb-6">
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-ivory text-2xl font-bold">
                  {getGreeting()}! 👋
                </Text>
                <Text className="text-ivory/80 text-base">
                  {getName()}, here's your health overview
                </Text>
              </View>
              <View className="flex-row space-x-2">
                <Pressable 
                  onPress={resetOnboarding}
                  className="bg-gold/20 rounded-full p-2"
                >
                  <Ionicons name="refresh-outline" size={20} color="#D4AF37" />
                </Pressable>
                <Pressable className="bg-ivory/20 rounded-full p-2">
                  <Ionicons name="notifications-outline" size={24} color="#F9F6F1" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Health Metrics Grid */}
          <View className="mb-6">
            <Text className="text-ivory text-lg font-semibold mb-4">
              Today's Metrics
            </Text>
            <View className="flex-row flex-wrap gap-3">
              <View className="flex-1 min-w-[45%]">
                <HealthMetricCard
                  title="Steps"
                  value={mockData.todaySteps.toLocaleString()}
                  icon="walk"
                  trend="up"
                  trendValue="+12%"
                  color="success"
                />
              </View>
              <View className="flex-1 min-w-[45%]">
                <HealthMetricCard
                  title="Heart Rate"
                  value={mockData.heartRate}
                  unit="bpm"
                  icon="heart"
                  trend="stable"
                  color="neutral"
                />
              </View>
              <View className="flex-1 min-w-[45%]">
                <HealthMetricCard
                  title="Sleep"
                  value={mockData.sleepHours}
                  unit="hrs"
                  icon="moon"
                  trend="up"
                  trendValue="+0.5h"
                  color="success"
                />
              </View>
              <View className="flex-1 min-w-[45%]">
                <HealthMetricCard
                  title="Water"
                  value={mockData.waterIntake}
                  unit="glasses"
                  icon="water"
                  trend="down"
                  trendValue="-2"
                  color="warning"
                />
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-ivory text-lg font-semibold mb-4">
              Quick Actions
            </Text>
            <View className="flex-row gap-3 mb-3">
              <QuickActionButton
                title="Log Symptom"
                icon="medical"
                onPress={() => {}}
                color="secondary"
              />
              <QuickActionButton
                title="Take Medication"
                icon="medical"
                onPress={() => {}}
                color="secondary"
              />
            </View>
            <View className="flex-row gap-3">
              <QuickActionButton
                title="Scan Food"
                icon="camera"
                onPress={() => {}}
                color="accent"
              />
              <QuickActionButton
                title="Ask Assistant"
                icon="chatbubbles"
                onPress={() => {}}
                color="primary"
              />
            </View>
          </View>

          {/* Health Insights */}
          <View className="mb-6">
            <Text className="text-ivory text-lg font-semibold mb-4">
              Health Insights
            </Text>
            <View className="bg-ivory/10 rounded-xl p-4 mb-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="trending-up" size={20} color="#10B981" />
                <Text className="text-ivory font-semibold ml-2">Great Progress!</Text>
              </View>
              <Text className="text-ivory/80">
                You've been consistently hitting your step goals this week. Keep it up!
              </Text>
            </View>
            
            <View className="bg-ivory/10 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="water" size={20} color="#F59E0B" />
                <Text className="text-ivory font-semibold ml-2">Hydration Reminder</Text>
              </View>
              <Text className="text-ivory/80">
                You're 2 glasses behind your daily water goal. Stay hydrated!
              </Text>
            </View>
          </View>

          {/* Achievements */}
          {recentAchievements.length > 0 && (
            <View className="mb-6">
              <Text className="text-ivory text-lg font-semibold mb-4">
                Recent Achievements 🏆
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 px-1">
                  {recentAchievements.map((achievement) => (
                    <Pressable
                      key={achievement.id}
                      onPress={() => setShowConfetti(true)}
                    >
                      <AchievementBadge
                        achievement={achievement}
                        size="medium"
                      />
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Progress Towards Goals */}
          {nextAchievements.length > 0 && (
            <View className="mb-8">
              <Text className="text-ivory text-lg font-semibold mb-4">
                Progress Towards Goals
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 px-1">
                  {nextAchievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      size="medium"
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Development Reset Button */}
          <View className="mb-8 bg-ivory/10 rounded-xl p-4">
            <Text className="text-ivory text-lg font-semibold mb-2 text-center">
              🔧 Development Tools
            </Text>
            <Text className="text-ivory/60 text-sm text-center mb-4">
              Reset onboarding to test the complete flow
            </Text>
            <Pressable
              onPress={resetOnboarding}
              className="bg-gold rounded-xl py-3 px-6"
            >
              <Text className="text-navy font-semibold text-center">
                Reset Onboarding Flow
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        
        <ConfettiAnimation 
          show={showConfetti} 
          onComplete={() => setShowConfetti(false)} 
        />
      </SafeAreaView>
    </LinearGradient>
  );
}