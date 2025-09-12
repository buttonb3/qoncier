import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import screens (will create these next)
import DashboardScreen from "../screens/DashboardScreen";
import SymptomsScreen from "../screens/SymptomsScreen";
import MedicationsScreen from "../screens/MedicationsScreen";
import NutritionScreen from "../screens/NutritionScreen";
import AssistantScreen from "../screens/AssistantScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Symptoms":
              iconName = focused ? "medical" : "medical-outline";
              break;
            case "Medications":
              iconName = focused ? "medical" : "medical-outline";
              break;
            case "Nutrition":
              iconName = focused ? "restaurant" : "restaurant-outline";
              break;
            case "Assistant":
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "home-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1C1C2E", // navy
        tabBarInactiveTintColor: "#777777", // ash
        tabBarStyle: {
          backgroundColor: "#F9F6F1", // ivory
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: "#1C1C2E", // navy
        },
        headerTintColor: "#F9F6F1", // ivory
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          headerShown: false, // Dashboard will have custom header
        }}
      />
      <Tab.Screen 
        name="Symptoms" 
        component={SymptomsScreen}
        options={{
          title: "Symptoms",
        }}
      />
      <Tab.Screen 
        name="Medications" 
        component={MedicationsScreen}
        options={{
          title: "Medications",
        }}
      />
      <Tab.Screen 
        name="Nutrition" 
        component={NutritionScreen}
        options={{
          title: "Nutrition",
        }}
      />
      <Tab.Screen 
        name="Assistant" 
        component={AssistantScreen}
        options={{
          title: "AI Assistant",
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}