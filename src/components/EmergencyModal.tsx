import React from "react";
import { View, Text, Pressable, Modal, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUIStore } from "../state/uiStore";
import { useUserStore } from "../state/userStore";

export default function EmergencyModal() {
  const { showEmergencyModal, setShowEmergencyModal } = useUIStore();
  const { profile } = useUserStore();

  const handleCall911 = () => {
    Alert.alert(
      "Emergency Call",
      "This will call emergency services (911). Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call 911",
          style: "destructive",
          onPress: () => {
            Linking.openURL("tel:911");
            setShowEmergencyModal(false);
          },
        },
      ]
    );
  };

  const handleCallEmergencyContact = (contact: any) => {
    Linking.openURL(`tel:${contact.phoneNumber}`);
    setShowEmergencyModal(false);
  };

  const emergencyContacts = profile?.emergencyContacts || [];

  return (
    <Modal
      visible={showEmergencyModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEmergencyModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-ivory rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-navy text-xl font-bold">Emergency</Text>
            <Pressable
              onPress={() => setShowEmergencyModal(false)}
              className="bg-ash/20 rounded-full p-2"
            >
              <Ionicons name="close" size={20} color="#777777" />
            </Pressable>
          </View>

          {/* 911 Button */}
          <Pressable
            onPress={handleCall911}
            className="bg-danger rounded-xl p-4 mb-4 flex-row items-center"
          >
            <Ionicons name="call" size={24} color="white" />
            <View className="ml-4">
              <Text className="text-white text-lg font-bold">Call 911</Text>
              <Text className="text-white/80">Emergency Services</Text>
            </View>
          </Pressable>

          {/* Emergency Contacts */}
          {emergencyContacts.length > 0 && (
            <>
              <Text className="text-navy text-lg font-semibold mb-3">
                Emergency Contacts
              </Text>
              {emergencyContacts.map((contact) => (
                <Pressable
                  key={contact.id}
                  onPress={() => handleCallEmergencyContact(contact)}
                  className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-navy/10"
                >
                  <Ionicons name="person-circle" size={24} color="#1C1C2E" />
                  <View className="ml-4 flex-1">
                    <Text className="text-navy text-lg font-semibold">
                      {contact.name}
                    </Text>
                    <Text className="text-ash">
                      {contact.relationship} • {contact.phoneNumber}
                    </Text>
                  </View>
                  <Ionicons name="call" size={20} color="#1C1C2E" />
                </Pressable>
              ))}
            </>
          )}

          {emergencyContacts.length === 0 && (
            <View className="bg-warning/10 rounded-xl p-4 mb-4">
              <Text className="text-warning font-semibold mb-1">
                No Emergency Contacts
              </Text>
              <Text className="text-ash">
                Add emergency contacts in your profile for quick access.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}