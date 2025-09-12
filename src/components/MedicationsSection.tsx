import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHealthStore } from "../state/healthStore";
import { Medication, MedicationLog } from "../types/health";
import MedicationCard from "./MedicationCard";

export default function MedicationsSection() {
  const { medications, medicationLogs, addMedication, updateMedication, deleteMedication, logMedication } = useHealthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    instructions: "",
    prescribedBy: "",
  });

  const handleAddMedication = () => {
    if (!newMedication.name.trim() || !newMedication.dosage.trim()) return;

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name.trim(),
      dosage: newMedication.dosage.trim(),
      frequency: newMedication.frequency.trim(),
      instructions: newMedication.instructions.trim() || undefined,
      prescribedBy: newMedication.prescribedBy.trim() || undefined,
      startDate: new Date().toISOString(),
      reminders: [],
      isActive: true,
    };

    addMedication(medication);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      instructions: "",
      prescribedBy: "",
    });
    setShowAddModal(false);
  };

  const handleTakeMedication = (medicationId: string) => {
    const log: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      timestamp: new Date().toISOString(),
      taken: true,
    };
    logMedication(log);
  };

  const toggleMedicationActive = (medicationId: string, isActive: boolean) => {
    updateMedication(medicationId, { isActive });
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-navy/10 rounded-full p-2 mr-3">
            <Ionicons name="medical" size={20} color="#1C1C2E" />
          </View>
          <View>
            <Text className="text-navy text-lg font-semibold">
              Medications
            </Text>
            <Text className="text-ash text-sm">
              Manage your medication schedule
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => setShowAddModal(true)}
          className="bg-navy/10 rounded-full p-2"
        >
          <Ionicons name="add" size={20} color="#1C1C2E" />
        </Pressable>
      </View>

      {/* Medications List */}
      {medications.length === 0 ? (
        <View className="bg-navy/5 rounded-xl p-4 items-center">
          <Ionicons name="medical-outline" size={32} color="#777777" />
          <Text className="text-navy font-semibold mt-2 mb-1">
            No Medications Added
          </Text>
          <Text className="text-ash text-center text-sm mb-3">
            Add your medications to track dosages and set reminders.
          </Text>
          <Pressable
            onPress={() => setShowAddModal(true)}
            className="bg-navy rounded-lg px-4 py-2"
          >
            <Text className="text-ivory font-semibold text-sm">
              Add First Medication
            </Text>
          </Pressable>
        </View>
      ) : (
        <View>
          {medications
            .sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0))
            .map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                medicationLogs={medicationLogs}
                onToggleActive={toggleMedicationActive}
                onMarkTaken={handleTakeMedication}
                onDelete={deleteMedication}
              />
            ))}

          {/* Today's Summary */}
          {medications.filter(m => m.isActive).length > 0 && (
            <View className="bg-navy/5 rounded-xl p-3 mt-2">
              <Text className="text-navy font-semibold text-sm mb-1">Today's Summary</Text>
              <Text className="text-ash text-sm">
                {medicationLogs.filter(log => 
                  new Date(log.timestamp).toDateString() === new Date().toDateString() && log.taken
                ).length} medications taken today
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Add Medication Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-ivory rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-navy text-xl font-bold">Add Medication</Text>
              <Pressable
                onPress={() => setShowAddModal(false)}
                className="bg-ash/20 rounded-full p-2"
              >
                <Ionicons name="close" size={20} color="#777777" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Medication Name */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Medication Name *</Text>
                <TextInput
                  value={newMedication.name}
                  onChangeText={(text) => setNewMedication({ ...newMedication, name: text })}
                  placeholder="e.g., Aspirin, Metformin"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Dosage */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Dosage *</Text>
                <TextInput
                  value={newMedication.dosage}
                  onChangeText={(text) => setNewMedication({ ...newMedication, dosage: text })}
                  placeholder="e.g., 100mg, 1 tablet"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Frequency */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Frequency</Text>
                <TextInput
                  value={newMedication.frequency}
                  onChangeText={(text) => setNewMedication({ ...newMedication, frequency: text })}
                  placeholder="e.g., Once daily, Twice daily, As needed"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Prescribed By */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Prescribed By</Text>
                <TextInput
                  value={newMedication.prescribedBy}
                  onChangeText={(text) => setNewMedication({ ...newMedication, prescribedBy: text })}
                  placeholder="e.g., Dr. Smith, Family Doctor"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Instructions */}
              <View className="mb-6">
                <Text className="text-navy font-semibold mb-2">Instructions</Text>
                <TextInput
                  value={newMedication.instructions}
                  onChangeText={(text) => setNewMedication({ ...newMedication, instructions: text })}
                  placeholder="e.g., Take with food, Before bedtime"
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
                  onPress={handleAddMedication}
                  disabled={!newMedication.name.trim() || !newMedication.dosage.trim()}
                  className={`flex-1 rounded-xl py-4 ${
                    newMedication.name.trim() && newMedication.dosage.trim()
                      ? "bg-navy"
                      : "bg-ash/30"
                  }`}
                >
                  <Text
                    className={`font-semibold text-center ${
                      newMedication.name.trim() && newMedication.dosage.trim() 
                        ? "text-ivory" 
                        : "text-ash"
                    }`}
                  >
                    Add Medication
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}