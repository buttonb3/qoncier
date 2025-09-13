import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PhotoSourceModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseFromLibrary: () => void;
}

export default function PhotoSourceModal({
  visible,
  onClose,
  onTakePhoto,
  onChooseFromLibrary,
}: PhotoSourceModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-ivory rounded-2xl p-6 w-full max-w-sm">
          {/* Header */}
          <View className="items-center mb-6">
            <View className="bg-navy/10 rounded-full p-3 mb-3">
              <Ionicons name="camera" size={32} color="#1C1C2E" />
            </View>
            <Text className="text-navy text-xl font-bold mb-2">
              Analyze Food
            </Text>
            <Text className="text-ash text-center">
              Choose how you'd like to add a photo for nutritional analysis
            </Text>
          </View>

          {/* Photo Source Options */}
          <View className="space-y-3 mb-6">
            {/* Take Photo Option */}
            <Pressable
              onPress={onTakePhoto}
              className="bg-navy rounded-xl p-4 flex-row items-center"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Take a new photo with camera"
            >
              <View className="bg-ivory/20 rounded-full p-3 mr-4">
                <Ionicons name="camera" size={24} color="#F9F6F1" />
              </View>
              <View className="flex-1">
                <Text className="text-ivory text-lg font-semibold">
                  Take Photo
                </Text>
                <Text className="text-ivory/80 text-sm">
                  Use your camera to capture food
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#F9F6F1" />
            </Pressable>

            {/* Choose from Library Option */}
            <Pressable
              onPress={onChooseFromLibrary}
              className="bg-gold rounded-xl p-4 flex-row items-center"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Choose existing photo from library"
            >
              <View className="bg-navy/20 rounded-full p-3 mr-4">
                <Ionicons name="images" size={24} color="#1C1C2E" />
              </View>
              <View className="flex-1">
                <Text className="text-navy text-lg font-semibold">
                  Choose from Library
                </Text>
                <Text className="text-navy/80 text-sm">
                  Select an existing photo
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#1C1C2E" />
            </Pressable>
          </View>

          {/* Cancel Button */}
          <Pressable
            onPress={onClose}
            className="bg-ash/20 rounded-xl py-3"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Cancel photo selection"
          >
            <Text className="text-ash font-semibold text-center">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}