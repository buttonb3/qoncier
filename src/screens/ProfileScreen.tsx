import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Modal, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../state/userStore";
import { useHealthStore } from "../state/healthStore";
import { UserProfile, EmergencyContact } from "../types/health";

export default function ProfileScreen() {
  const { profile, settings, updateProfile, updateSettings } = useUserStore();
  const { deviceConnections, updateDeviceConnection } = useHealthStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Partial<UserProfile>>({});
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phoneNumber: "",
    isPrimary: false,
  });

  const handleEditProfile = () => {
    setEditingProfile({
      name: profile?.name || "",
      email: profile?.email || "",
      dateOfBirth: profile?.dateOfBirth || "",
      gender: profile?.gender || "prefer-not-to-say",
      height: profile?.height || undefined,
      weight: profile?.weight || undefined,
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    if (editingProfile.name?.trim()) {
      updateProfile(editingProfile);
      setShowEditModal(false);
    }
  };

  const handleAddEmergencyContact = () => {
    if (!newContact.name.trim() || !newContact.phoneNumber.trim()) return;

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name.trim(),
      relationship: newContact.relationship.trim(),
      phoneNumber: newContact.phoneNumber.trim(),
      isPrimary: newContact.isPrimary,
    };

    const updatedContacts = [...(profile?.emergencyContacts || []), contact];
    updateProfile({ emergencyContacts: updatedContacts });
    
    setNewContact({
      name: "",
      relationship: "",
      phoneNumber: "",
      isPrimary: false,
    });
    setShowEmergencyModal(false);
  };

  const handleRemoveEmergencyContact = (contactId: string) => {
    Alert.alert(
      "Remove Contact",
      "Are you sure you want to remove this emergency contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updatedContacts = profile?.emergencyContacts?.filter(c => c.id !== contactId) || [];
            updateProfile({ emergencyContacts: updatedContacts });
          },
        },
      ]
    );
  };

  const toggleDeviceConnection = (deviceId: string, isConnected: boolean) => {
    updateDeviceConnection(deviceId, { 
      isConnected,
      lastSync: isConnected ? new Date().toISOString() : undefined,
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <SafeAreaView className="flex-1 bg-ivory">
      <ScrollView className="flex-1 px-4">
        <View className="pt-4">
          {/* Profile Header */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="bg-navy rounded-full w-16 h-16 items-center justify-center mr-4">
                <Text className="text-ivory text-xl font-bold">
                  {getInitials(profile?.name)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-navy text-xl font-bold">
                  {profile?.name || "Your Name"}
                </Text>
                <Text className="text-ash">
                  {profile?.email || "Add email address"}
                </Text>
              </View>
              <Pressable
                onPress={handleEditProfile}
                className="bg-navy/10 rounded-full p-2"
              >
                <Ionicons name="pencil" size={20} color="#1C1C2E" />
              </Pressable>
            </View>
            
            {profile?.dateOfBirth && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={16} color="#777777" />
                <Text className="text-ash ml-2">
                  Born: {new Date(profile.dateOfBirth).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            {profile?.height && profile?.weight && (
              <View className="flex-row items-center">
                <Ionicons name="fitness-outline" size={16} color="#777777" />
                <Text className="text-ash ml-2">
                  {profile.height}cm • {profile.weight}kg
                </Text>
              </View>
            )}
          </View>

          {/* Emergency Contacts */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-navy text-lg font-semibold">
                Emergency Contacts
              </Text>
              <Pressable
                onPress={() => setShowEmergencyModal(true)}
                className="bg-navy/10 rounded-full p-2"
              >
                <Ionicons name="add" size={20} color="#1C1C2E" />
              </Pressable>
            </View>
            
            {profile?.emergencyContacts?.length === 0 || !profile?.emergencyContacts ? (
              <Text className="text-ash text-center py-4">
                No emergency contacts added
              </Text>
            ) : (
              <View className="space-y-3">
                {profile.emergencyContacts.map((contact) => (
                  <View key={contact.id} className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-navy font-semibold">
                        {contact.name}
                        {contact.isPrimary && (
                          <Text className="text-gold text-sm"> (Primary)</Text>
                        )}
                      </Text>
                      <Text className="text-ash text-sm">
                        {contact.relationship} • {contact.phoneNumber}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleRemoveEmergencyContact(contact.id)}
                      className="bg-danger/10 rounded-full p-2"
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Device Connections */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-navy text-lg font-semibold mb-4">
              Device Connections
            </Text>
            
            <View className="space-y-4">
              {deviceConnections.map((device) => (
                <View key={device.id} className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-navy/10 rounded-full p-2 mr-3">
                      <Ionicons 
                        name={
                          device.type === "apple-health" ? "phone-portrait" :
                          device.type === "fitbit" ? "fitness" :
                          device.type === "oura" ? "ellipse" :
                          "watch"
                        } 
                        size={20} 
                        color="#1C1C2E" 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-navy font-semibold">
                        {device.name}
                      </Text>
                      <Text className="text-ash text-sm">
                        {device.isConnected 
                          ? `Connected • Last sync: ${device.lastSync ? new Date(device.lastSync).toLocaleDateString() : "Never"}`
                          : "Not connected"
                        }
                      </Text>
                    </View>
                  </View>
                  
                  <Switch
                    value={device.isConnected}
                    onValueChange={(value) => toggleDeviceConnection(device.id, value)}
                    trackColor={{ false: "#777777", true: "#1C1C2E" }}
                    thumbColor={device.isConnected ? "#D4AF37" : "#F9F6F1"}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* EHR Connections */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-navy text-lg font-semibold mb-4">
              Electronic Health Records
            </Text>
            
            <View className="bg-navy/5 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="medical-outline" size={20} color="#1C1C2E" />
                <Text className="text-navy font-semibold ml-2">
                  EHR Integration
                </Text>
              </View>
              <Text className="text-ash text-sm mb-3">
                Connect your electronic health records to sync medical history, lab results, and provider information.
              </Text>
              <Pressable className="bg-navy/10 rounded-lg py-2 px-4 self-start">
                <Text className="text-navy font-semibold">
                  Coming Soon
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Settings */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-navy text-lg font-semibold mb-4">
              Notification Settings
            </Text>
            
            <View className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <View key={key} className="flex-row items-center justify-between">
                  <Text className="text-navy capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={(newValue) => 
                      updateSettings({
                        notifications: {
                          ...settings.notifications,
                          [key]: newValue,
                        },
                      })
                    }
                    trackColor={{ false: "#777777", true: "#1C1C2E" }}
                    thumbColor={value ? "#D4AF37" : "#F9F6F1"}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Privacy Settings */}
          <View className="bg-white rounded-xl p-4 mb-8 shadow-sm">
            <Text className="text-navy text-lg font-semibold mb-4">
              Privacy Settings
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-navy">Share Data</Text>
                  <Text className="text-ash text-sm">
                    Allow sharing anonymized health data for research
                  </Text>
                </View>
                <Switch
                  value={settings.privacy.shareData}
                  onValueChange={(value) => 
                    updateSettings({
                      privacy: {
                        ...settings.privacy,
                        shareData: value,
                      },
                    })
                  }
                  trackColor={{ false: "#777777", true: "#1C1C2E" }}
                  thumbColor={settings.privacy.shareData ? "#D4AF37" : "#F9F6F1"}
                />
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-navy">Analytics</Text>
                  <Text className="text-ash text-sm">
                    Help improve the app with usage analytics
                  </Text>
                </View>
                <Switch
                  value={settings.privacy.analytics}
                  onValueChange={(value) => 
                    updateSettings({
                      privacy: {
                        ...settings.privacy,
                        analytics: value,
                      },
                    })
                  }
                  trackColor={{ false: "#777777", true: "#1C1C2E" }}
                  thumbColor={settings.privacy.analytics ? "#D4AF37" : "#F9F6F1"}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-ivory rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-navy text-xl font-bold">Edit Profile</Text>
              <Pressable
                onPress={() => setShowEditModal(false)}
                className="bg-ash/20 rounded-full p-2"
              >
                <Ionicons name="close" size={20} color="#777777" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Name</Text>
                <TextInput
                  value={editingProfile.name}
                  onChangeText={(text) => setEditingProfile({ ...editingProfile, name: text })}
                  placeholder="Your full name"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Email</Text>
                <TextInput
                  value={editingProfile.email}
                  onChangeText={(text) => setEditingProfile({ ...editingProfile, email: text })}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-navy font-semibold mb-2">Height (cm)</Text>
                  <TextInput
                    value={editingProfile.height?.toString()}
                    onChangeText={(text) => setEditingProfile({ ...editingProfile, height: parseFloat(text) || undefined })}
                    placeholder="170"
                    keyboardType="numeric"
                    className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-navy font-semibold mb-2">Weight (kg)</Text>
                  <TextInput
                    value={editingProfile.weight?.toString()}
                    onChangeText={(text) => setEditingProfile({ ...editingProfile, weight: parseFloat(text) || undefined })}
                    placeholder="70"
                    keyboardType="numeric"
                    className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                  />
                </View>
              </View>

              <View className="flex-row space-x-3 mt-6">
                <Pressable
                  onPress={() => setShowEditModal(false)}
                  className="flex-1 bg-ash/20 rounded-xl py-4"
                >
                  <Text className="text-ash font-semibold text-center">
                    Cancel
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={handleSaveProfile}
                  className="flex-1 bg-navy rounded-xl py-4"
                >
                  <Text className="text-ivory font-semibold text-center">
                    Save Changes
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Emergency Contact Modal */}
      <Modal
        visible={showEmergencyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmergencyModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-ivory rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-navy text-xl font-bold">Add Emergency Contact</Text>
              <Pressable
                onPress={() => setShowEmergencyModal(false)}
                className="bg-ash/20 rounded-full p-2"
              >
                <Ionicons name="close" size={20} color="#777777" />
              </Pressable>
            </View>

            <View className="mb-4">
              <Text className="text-navy font-semibold mb-2">Name *</Text>
              <TextInput
                value={newContact.name}
                onChangeText={(text) => setNewContact({ ...newContact, name: text })}
                placeholder="Contact name"
                className="bg-white rounded-xl p-4 text-navy border border-ash/20"
              />
            </View>

            <View className="mb-4">
              <Text className="text-navy font-semibold mb-2">Relationship</Text>
              <TextInput
                value={newContact.relationship}
                onChangeText={(text) => setNewContact({ ...newContact, relationship: text })}
                placeholder="e.g., Spouse, Parent, Friend"
                className="bg-white rounded-xl p-4 text-navy border border-ash/20"
              />
            </View>

            <View className="mb-4">
              <Text className="text-navy font-semibold mb-2">Phone Number *</Text>
              <TextInput
                value={newContact.phoneNumber}
                onChangeText={(text) => setNewContact({ ...newContact, phoneNumber: text })}
                placeholder="+1 (555) 123-4567"
                keyboardType="phone-pad"
                className="bg-white rounded-xl p-4 text-navy border border-ash/20"
              />
            </View>

            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-navy font-semibold">Primary Contact</Text>
              <Switch
                value={newContact.isPrimary}
                onValueChange={(value) => setNewContact({ ...newContact, isPrimary: value })}
                trackColor={{ false: "#777777", true: "#1C1C2E" }}
                thumbColor={newContact.isPrimary ? "#D4AF37" : "#F9F6F1"}
              />
            </View>

            <View className="flex-row space-x-3">
              <Pressable
                onPress={() => setShowEmergencyModal(false)}
                className="flex-1 bg-ash/20 rounded-xl py-4"
              >
                <Text className="text-ash font-semibold text-center">
                  Cancel
                </Text>
              </Pressable>
              
              <Pressable
                onPress={handleAddEmergencyContact}
                disabled={!newContact.name.trim() || !newContact.phoneNumber.trim()}
                className={`flex-1 rounded-xl py-4 ${
                  newContact.name.trim() && newContact.phoneNumber.trim()
                    ? "bg-navy"
                    : "bg-ash/30"
                }`}
              >
                <Text
                  className={`font-semibold text-center ${
                    newContact.name.trim() && newContact.phoneNumber.trim()
                      ? "text-ivory"
                      : "text-ash"
                  }`}
                >
                  Add Contact
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}