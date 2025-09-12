import React from "react";
import { View, Text, Pressable, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Medication, MedicationLog } from "../types/health";

interface MedicationCardProps {
  medication: Medication;
  medicationLogs: MedicationLog[];
  onToggleActive: (medicationId: string, isActive: boolean) => void;
  onMarkTaken: (medicationId: string) => void;
  onDelete: (medicationId: string) => void;
}

export default function MedicationCard({
  medication,
  medicationLogs,
  onToggleActive,
  onMarkTaken,
  onDelete,
}: MedicationCardProps) {
  const getTodayLogs = (medicationId: string) => {
    const today = new Date().toDateString();
    return medicationLogs.filter(
      log => log.medicationId === medicationId && 
      new Date(log.timestamp).toDateString() === today &&
      log.taken
    ).length;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const todayTaken = getTodayLogs(medication.id);

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-navy text-lg font-semibold">
            {medication.name}
          </Text>
          <Text className="text-ash">
            {medication.dosage} • {medication.frequency}
          </Text>
          <Text className="text-ash text-sm">
            Started: {formatDate(medication.startDate)}
          </Text>
        </View>
        
        <View className="items-end">
          <Switch
            value={medication.isActive}
            onValueChange={(value) => onToggleActive(medication.id, value)}
            trackColor={{ false: "#777777", true: "#1C1C2E" }}
            thumbColor={medication.isActive ? "#D4AF37" : "#F9F6F1"}
          />
          <Text className="text-xs text-ash mt-1">
            {medication.isActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {medication.instructions && (
        <View className="bg-navy/5 rounded-lg p-3 mb-3">
          <Text className="text-navy text-sm">
            📝 {medication.instructions}
          </Text>
        </View>
      )}

      {medication.prescribedBy && (
        <Text className="text-ash text-sm mb-3">
          👨‍⚕️ Prescribed by: {medication.prescribedBy}
        </Text>
      )}

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-ash text-sm">
            Today: {todayTaken} taken
          </Text>
          {todayTaken > 0 && (
            <Ionicons name="checkmark-circle" size={16} color="#10B981" className="ml-2" />
          )}
        </View>
        
        <View className="flex-row space-x-2">
          {medication.isActive && (
            <Pressable
              onPress={() => onMarkTaken(medication.id)}
              className="bg-success rounded-lg px-4 py-2"
            >
              <Text className="text-white font-semibold text-sm">
                Mark Taken
              </Text>
            </Pressable>
          )}
          
          <Pressable
            onPress={() => onDelete(medication.id)}
            className="bg-danger/10 rounded-lg p-2"
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}