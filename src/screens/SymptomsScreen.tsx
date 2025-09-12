import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useHealthStore } from "../state/healthStore";
import { Symptom } from "../types/health";

export default function SymptomsScreen() {
  const { symptoms, addSymptom, deleteSymptom } = useHealthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymptom, setNewSymptom] = useState({
    name: "",
    description: "",
    severity: 3 as 1 | 2 | 3 | 4 | 5,
    bodyPart: "",
    duration: "",
  });

  const handleAddSymptom = () => {
    if (!newSymptom.name.trim()) return;

    const symptom: Symptom = {
      id: Date.now().toString(),
      name: newSymptom.name.trim(),
      description: newSymptom.description.trim() || undefined,
      severity: newSymptom.severity,
      bodyPart: newSymptom.bodyPart.trim() || undefined,
      duration: newSymptom.duration.trim() || undefined,
      timestamp: new Date().toISOString(),
      tags: [],
    };

    addSymptom(symptom);
    setNewSymptom({
      name: "",
      description: "",
      severity: 3,
      bodyPart: "",
      duration: "",
    });
    setShowAddModal(false);
  };

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 1:
        return "bg-success/20 text-success";
      case 2:
        return "bg-success/30 text-success";
      case 3:
        return "bg-warning/20 text-warning";
      case 4:
        return "bg-danger/20 text-danger";
      case 5:
        return "bg-danger/30 text-danger";
      default:
        return "bg-ash/20 text-ash";
    }
  };

  const getSeverityText = (severity: number) => {
    const levels = ["", "Mild", "Light", "Moderate", "Severe", "Very Severe"];
    return levels[severity] || "Unknown";
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-ivory">
      <ScrollView className="flex-1 px-4">
        <View className="pt-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-navy text-2xl font-bold">
                Symptom Tracking
              </Text>
              <Text className="text-ash">
                Monitor and track your symptoms
              </Text>
            </View>
            <Pressable
              onPress={() => setShowAddModal(true)}
              className="bg-navy rounded-full p-3"
            >
              <Ionicons name="add" size={24} color="#F9F6F1" />
            </Pressable>
          </View>

          {/* Symptoms List */}
          {symptoms.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <Ionicons name="medical-outline" size={48} color="#777777" />
              <Text className="text-navy text-lg font-semibold mt-4 mb-2">
                No Symptoms Logged
              </Text>
              <Text className="text-ash text-center mb-4">
                Start tracking your symptoms to better understand your health patterns.
              </Text>
              <Pressable
                onPress={() => setShowAddModal(true)}
                className="bg-navy rounded-xl px-6 py-3"
              >
                <Text className="text-ivory font-semibold">
                  Log First Symptom
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="space-y-3">
              {symptoms
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((symptom) => (
                  <View key={symptom.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className="text-navy text-lg font-semibold">
                          {symptom.name}
                        </Text>
                        <Text className="text-ash text-sm">
                          {formatDate(symptom.timestamp)}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center space-x-2">
                        <View className={`px-2 py-1 rounded-full ${getSeverityColor(symptom.severity)}`}>
                          <Text className="text-xs font-medium">
                            {getSeverityText(symptom.severity)}
                          </Text>
                        </View>
                        
                        <Pressable
                          onPress={() => deleteSymptom(symptom.id)}
                          className="bg-danger/10 rounded-full p-1"
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </Pressable>
                      </View>
                    </View>

                    {symptom.description && (
                      <Text className="text-ash mb-2">
                        {symptom.description}
                      </Text>
                    )}

                    <View className="flex-row flex-wrap gap-2">
                      {symptom.bodyPart && (
                        <View className="bg-navy/10 rounded-full px-2 py-1">
                          <Text className="text-navy text-xs">
                            📍 {symptom.bodyPart}
                          </Text>
                        </View>
                      )}
                      {symptom.duration && (
                        <View className="bg-navy/10 rounded-full px-2 py-1">
                          <Text className="text-navy text-xs">
                            ⏱️ {symptom.duration}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Symptom Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-ivory rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-navy text-xl font-bold">Log Symptom</Text>
              <Pressable
                onPress={() => setShowAddModal(false)}
                className="bg-ash/20 rounded-full p-2"
              >
                <Ionicons name="close" size={20} color="#777777" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Symptom Name */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Symptom Name *</Text>
                <TextInput
                  value={newSymptom.name}
                  onChangeText={(text) => setNewSymptom({ ...newSymptom, name: text })}
                  placeholder="e.g., Headache, Nausea, Fatigue"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Severity */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Severity</Text>
                <View className="flex-row justify-between">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Pressable
                      key={level}
                      onPress={() => setNewSymptom({ ...newSymptom, severity: level as 1 | 2 | 3 | 4 | 5 })}
                      className={`flex-1 mx-1 py-3 rounded-xl items-center ${
                        newSymptom.severity === level
                          ? "bg-navy"
                          : "bg-white border border-ash/20"
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          newSymptom.severity === level ? "text-ivory" : "text-navy"
                        }`}
                      >
                        {level}
                      </Text>
                      <Text
                        className={`text-xs ${
                          newSymptom.severity === level ? "text-ivory/80" : "text-ash"
                        }`}
                      >
                        {getSeverityText(level)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Body Part */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Body Part</Text>
                <TextInput
                  value={newSymptom.bodyPart}
                  onChangeText={(text) => setNewSymptom({ ...newSymptom, bodyPart: text })}
                  placeholder="e.g., Head, Stomach, Back"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Duration */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Duration</Text>
                <TextInput
                  value={newSymptom.duration}
                  onChangeText={(text) => setNewSymptom({ ...newSymptom, duration: text })}
                  placeholder="e.g., 2 hours, All day, Since morning"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Description */}
              <View className="mb-6">
                <Text className="text-navy font-semibold mb-2">Description</Text>
                <TextInput
                  value={newSymptom.description}
                  onChangeText={(text) => setNewSymptom({ ...newSymptom, description: text })}
                  placeholder="Additional details about the symptom..."
                  multiline
                  numberOfLines={3}
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  className="flex-1 bg-ash/20 rounded-xl py-4"
                >
                  <Text className="text-ash font-semibold text-center">
                    Cancel
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={handleAddSymptom}
                  disabled={!newSymptom.name.trim()}
                  className={`flex-1 rounded-xl py-4 ${
                    newSymptom.name.trim()
                      ? "bg-navy"
                      : "bg-ash/30"
                  }`}
                >
                  <Text
                    className={`font-semibold text-center ${
                      newSymptom.name.trim() ? "text-ivory" : "text-ash"
                    }`}
                  >
                    Log Symptom
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}