import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Modal, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useHealthStore } from "../state/healthStore";
import { Medication, MedicationLog } from "../types/health";

export default function MedicationsScreen() {
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

  return (
    <SafeAreaView className="flex-1 bg-ivory">
      <ScrollView className="flex-1 px-4">
        <View className="pt-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-navy text-2xl font-bold">
                Medications
              </Text>
              <Text className="text-ash">
                Manage your medication schedule
              </Text>
            </View>
            <Pressable
              onPress={() => setShowAddModal(true)}
              className="bg-navy rounded-full p-3"
            >
              <Ionicons name="add" size={24} color="#F9F6F1" />
            </Pressable>
          </View>

          {/* Medications List */}
          {medications.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <Ionicons name="medical-outline" size={48} color="#777777" />
              <Text className="text-navy text-lg font-semibold mt-4 mb-2">
                No Medications Added
              </Text>
              <Text className="text-ash text-center mb-4">
                Add your medications to track dosages and set reminders.
              </Text>
              <Pressable
                onPress={() => setShowAddModal(true)}
                className="bg-navy rounded-xl px-6 py-3"
              >
                <Text className="text-ivory font-semibold">
                  Add First Medication
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="space-y-3">
              {medications
                .sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0))
                .map((medication) => {
                  const todayTaken = getTodayLogs(medication.id);
                  
                  return (
                    <View key={medication.id} className="bg-white rounded-xl p-4 shadow-sm">
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
                            onValueChange={(value) => toggleMedicationActive(medication.id, value)}
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
                              onPress={() => handleTakeMedication(medication.id)}
                              className="bg-success rounded-lg px-4 py-2"
                            >
                              <Text className="text-white font-semibold text-sm">
                                Mark Taken
                              </Text>
                            </Pressable>
                          )}
                          
                          <Pressable
                            onPress={() => deleteMedication(medication.id)}
                            className="bg-danger/10 rounded-lg p-2"
                          >
                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
            </View>
          )}

          {/* Today's Summary */}
          {medications.filter(m => m.isActive).length > 0 && (
            <View className="mt-6 bg-navy/5 rounded-xl p-4">
              <Text className="text-navy font-semibold mb-2">Today's Summary</Text>
              <Text className="text-ash">
                {medicationLogs.filter(log => 
                  new Date(log.timestamp).toDateString() === new Date().toDateString() && log.taken
                ).length} medications taken today
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Medication Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-ivory rounded-t-3xl p-6">
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
    </SafeAreaView>
  );
}