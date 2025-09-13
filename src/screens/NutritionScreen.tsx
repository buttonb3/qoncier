import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Modal, Image, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useHealthStore } from "../state/healthStore";
import { useUIStore } from "../state/uiStore";
import { NutritionEntry } from "../types/health";
import { analyzeImageWithOpenAI } from "../api/chat-service";
import PhotoSourceModal from "../components/PhotoSourceModal";

export default function NutritionScreen() {
  const { nutritionEntries, addNutritionEntry, deleteNutritionEntry } = useHealthStore();
  const { isScanning, setIsScanning, setIsAnalyzing } = useUIStore();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPhotoSourceModal, setShowPhotoSourceModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    name: "",
    brand: "",
    quantity: "",
    unit: "serving",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    mealType: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
  });

  const handleAddEntry = () => {
    if (!newEntry.name.trim() || !newEntry.calories) return;

    const entry: NutritionEntry = {
      id: Date.now().toString(),
      name: newEntry.name.trim(),
      brand: newEntry.brand.trim() || undefined,
      quantity: parseFloat(newEntry.quantity) || 1,
      unit: newEntry.unit,
      calories: parseFloat(newEntry.calories) || 0,
      macros: {
        protein: parseFloat(newEntry.protein) || 0,
        carbs: parseFloat(newEntry.carbs) || 0,
        fat: parseFloat(newEntry.fat) || 0,
      },
      mealType: newEntry.mealType,
      timestamp: new Date().toISOString(),
      source: "manual",
    };

    addNutritionEntry(entry);
    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setNewEntry({
      name: "",
      brand: "",
      quantity: "",
      unit: "serving",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      mealType: "breakfast",
    });
    setCapturedImage(null);
  };

  const handleBarcodeScanning = () => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
      return;
    }
    setIsScanning(true);
    setShowCameraModal(true);
  };

  const handleAnalyzeFood = () => {
    setShowPhotoSourceModal(true);
  };

  const handleTakePhoto = async () => {
    setShowPhotoSourceModal(false);
    
    // Check camera permissions
    if (!cameraPermission?.granted) {
      const permissionResult = await requestCameraPermission();
      if (!permissionResult.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access to take photos of your food for analysis.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        analyzeFood(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Camera Error", "Could not access camera. Please try again.");
    }
  };

  const handleChooseFromLibrary = async () => {
    setShowPhotoSourceModal(false);
    
    // Check media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Photo Library Permission Required",
        "Please allow photo library access to select images for analysis.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        analyzeFood(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Library error:", error);
      Alert.alert("Library Error", "Could not access photo library. Please try again.");
    }
  };

  const analyzeFood = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze this food image and provide nutritional information in this exact format:
      
      Food Name: [name]
      Estimated Calories: [number]
      Protein: [number]g
      Carbs: [number]g
      Fat: [number]g
      
      Be as accurate as possible with the estimates based on what you can see in the image.`;

      const response = await analyzeImageWithOpenAI(imageUri, prompt);
      
      // Parse the AI response to extract nutrition data
      const lines = response.content.split('\n');
      const foodName = lines.find((line: string) => line.includes('Food Name:'))?.split(':')[1]?.trim() || 'Unknown Food';
      const calories = lines.find((line: string) => line.includes('Calories:'))?.match(/\d+/)?.[0] || '0';
      const protein = lines.find((line: string) => line.includes('Protein:'))?.match(/\d+/)?.[0] || '0';
      const carbs = lines.find((line: string) => line.includes('Carbs:'))?.match(/\d+/)?.[0] || '0';
      const fat = lines.find((line: string) => line.includes('Fat:'))?.match(/\d+/)?.[0] || '0';

      setNewEntry({
        ...newEntry,
        name: foodName,
        calories,
        protein,
        carbs,
        fat,
      });
      
      setShowAddModal(true);
    } catch (error) {
      console.error("Food analysis error:", error);
      Alert.alert(
        "Analysis Error", 
        "Could not analyze the food image. Please enter details manually.",
        [
          { text: "OK", onPress: () => setShowAddModal(true) }
        ]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateBarcodeResult = () => {
    // Mock barcode scan result
    const mockFoods = [
      { name: "Organic Banana", brand: "Fresh Market", calories: "105", protein: "1", carbs: "27", fat: "0" },
      { name: "Greek Yogurt", brand: "Chobani", calories: "150", protein: "15", carbs: "20", fat: "0" },
      { name: "Whole Grain Bread", brand: "Dave's Killer", calories: "110", protein: "5", carbs: "22", fat: "2" },
    ];
    
    const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
    setNewEntry({ ...newEntry, ...randomFood });
    setShowCameraModal(false);
    setIsScanning(false);
    setShowAddModal(true);
  };

  const getTodayEntries = () => {
    const today = new Date().toDateString();
    return nutritionEntries.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
  };

  const getTodayCalories = () => {
    return getTodayEntries().reduce((total, entry) => total + entry.calories, 0);
  };

  const getMealEntries = (mealType: string) => {
    return getTodayEntries().filter(entry => entry.mealType === mealType);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
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
                Nutrition
              </Text>
              <Text className="text-ash">
                Track your daily nutrition
              </Text>
            </View>
            <Pressable
              onPress={() => setShowAddModal(true)}
              className="bg-navy rounded-full p-3"
            >
              <Ionicons name="add" size={24} color="#F9F6F1" />
            </Pressable>
          </View>

          {/* Today's Summary */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-navy text-lg font-semibold mb-3">
              Today's Summary
            </Text>
            <View className="flex-row justify-between items-center">
              <View className="items-center">
                <Text className="text-2xl font-bold text-navy">
                  {getTodayCalories()}
                </Text>
                <Text className="text-ash text-sm">Calories</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-semibold text-navy">
                  {getTodayEntries().length}
                </Text>
                <Text className="text-ash text-sm">Items</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-semibold text-navy">
                  {getTodayEntries().reduce((total, entry) => total + entry.macros.protein, 0).toFixed(0)}g
                </Text>
                <Text className="text-ash text-sm">Protein</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row gap-3 mb-6">
            <Pressable
              onPress={handleBarcodeScanning}
              className="flex-1 bg-gold rounded-xl p-4 items-center"
            >
              <Ionicons name="barcode-outline" size={24} color="#1C1C2E" />
              <Text className="text-navy font-semibold mt-2">
                Scan Barcode
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleAnalyzeFood}
              className="flex-1 bg-navy rounded-xl p-4 items-center"
            >
              <Ionicons name="camera-outline" size={24} color="#F9F6F1" />
              <Text className="text-ivory font-semibold mt-2">
                Analyze Food
              </Text>
            </Pressable>
          </View>

          {/* Meal Sections */}
          {["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
            const mealEntries = getMealEntries(mealType);
            const mealCalories = mealEntries.reduce((total, entry) => total + entry.calories, 0);
            
            return (
              <View key={mealType} className="mb-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-navy text-lg font-semibold capitalize">
                    {mealType}
                  </Text>
                  <Text className="text-ash">
                    {mealCalories} cal
                  </Text>
                </View>
                
                {mealEntries.length === 0 ? (
                  <View className="bg-white/50 rounded-xl p-4 border-2 border-dashed border-ash/30">
                    <Text className="text-ash text-center">
                      No items logged for {mealType}
                    </Text>
                  </View>
                ) : (
                  <View className="space-y-2">
                    {mealEntries.map((entry) => (
                      <View key={entry.id} className="bg-white rounded-xl p-4 shadow-sm">
                        <View className="flex-row items-start justify-between">
                          <View className="flex-1">
                            <Text className="text-navy font-semibold">
                              {entry.name}
                            </Text>
                            {entry.brand && (
                              <Text className="text-ash text-sm">
                                {entry.brand}
                              </Text>
                            )}
                            <Text className="text-ash text-sm">
                              {entry.quantity} {entry.unit} • {formatDate(entry.timestamp)}
                            </Text>
                          </View>
                          
                          <View className="items-end">
                            <Text className="text-navy font-semibold">
                              {entry.calories} cal
                            </Text>
                            <Pressable
                              onPress={() => deleteNutritionEntry(entry.id)}
                              className="bg-danger/10 rounded-full p-1 mt-1"
                            >
                              <Ionicons name="trash-outline" size={14} color="#EF4444" />
                            </Pressable>
                          </View>
                        </View>
                        
                        <View className="flex-row justify-between mt-2 pt-2 border-t border-ash/10">
                          <Text className="text-xs text-ash">
                            P: {entry.macros.protein}g
                          </Text>
                          <Text className="text-xs text-ash">
                            C: {entry.macros.carbs}g
                          </Text>
                          <Text className="text-xs text-ash">
                            F: {entry.macros.fat}g
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Camera Modal for Barcode Scanning */}
      <Modal
        visible={showCameraModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCameraModal(false);
          setIsScanning(false);
        }}
      >
        <View className="flex-1 bg-black">
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e"],
            }}
            onBarcodeScanned={() => {
              if (isScanning) {
                simulateBarcodeResult();
              }
            }}
          />
          
          <View className="absolute top-12 left-4 right-4">
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => {
                  setShowCameraModal(false);
                  setIsScanning(false);
                }}
                className="bg-black/50 rounded-full p-3"
              >
                <Ionicons name="close" size={24} color="white" />
              </Pressable>
              
              <Text className="text-white text-lg font-semibold">
                Scan Barcode
              </Text>
              
              <View className="w-12" />
            </View>
          </View>
          
          <View className="absolute bottom-20 left-4 right-4">
            <Text className="text-white text-center mb-4">
              Point camera at barcode to scan
            </Text>
            <Pressable
              onPress={simulateBarcodeResult}
              className="bg-gold rounded-xl py-3"
            >
              <Text className="text-navy font-semibold text-center">
                Simulate Scan (Demo)
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add Entry Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-ivory rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-navy text-xl font-bold">Add Food</Text>
              <Pressable
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="bg-ash/20 rounded-full p-2"
              >
                <Ionicons name="close" size={20} color="#777777" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {capturedImage && (
                <View className="mb-4">
                  <Image source={{ uri: capturedImage }} className="w-full h-32 rounded-xl" />
                </View>
              )}

              {/* Food Name */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Food Name *</Text>
                <TextInput
                  value={newEntry.name}
                  onChangeText={(text) => setNewEntry({ ...newEntry, name: text })}
                  placeholder="e.g., Apple, Chicken Breast"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Brand */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Brand</Text>
                <TextInput
                  value={newEntry.brand}
                  onChangeText={(text) => setNewEntry({ ...newEntry, brand: text })}
                  placeholder="e.g., Organic Valley"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                />
              </View>

              {/* Quantity and Unit */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-navy font-semibold mb-2">Quantity</Text>
                  <TextInput
                    value={newEntry.quantity}
                    onChangeText={(text) => setNewEntry({ ...newEntry, quantity: text })}
                    placeholder="1"
                    keyboardType="numeric"
                    className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-navy font-semibold mb-2">Unit</Text>
                  <TextInput
                    value={newEntry.unit}
                    onChangeText={(text) => setNewEntry({ ...newEntry, unit: text })}
                    placeholder="serving"
                    className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                  />
                </View>
              </View>

              {/* Meal Type */}
              <View className="mb-4">
                <Text className="text-navy font-semibold mb-2">Meal Type</Text>
                <View className="flex-row gap-2">
                  {["breakfast", "lunch", "dinner", "snack"].map((meal) => (
                    <Pressable
                      key={meal}
                      onPress={() => setNewEntry({ ...newEntry, mealType: meal as any })}
                      className={`flex-1 py-3 rounded-xl items-center ${
                        newEntry.mealType === meal
                          ? "bg-navy"
                          : "bg-white border border-ash/20"
                      }`}
                    >
                      <Text
                        className={`font-semibold capitalize ${
                          newEntry.mealType === meal ? "text-ivory" : "text-navy"
                        }`}
                      >
                        {meal}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Nutrition Info */}
              <Text className="text-navy font-semibold mb-2">Nutrition Information</Text>
              
              <View className="mb-4">
                <TextInput
                  value={newEntry.calories}
                  onChangeText={(text) => setNewEntry({ ...newEntry, calories: text })}
                  placeholder="Calories *"
                  keyboardType="numeric"
                  className="bg-white rounded-xl p-4 text-navy border border-ash/20 mb-3"
                />
              </View>

              <View className="flex-row gap-3 mb-6">
                <View className="flex-1">
                  <TextInput
                    value={newEntry.protein}
                    onChangeText={(text) => setNewEntry({ ...newEntry, protein: text })}
                    placeholder="Protein (g)"
                    keyboardType="numeric"
                    className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                  />
                </View>
                <View className="flex-1">
                  <TextInput
                    value={newEntry.carbs}
                    onChangeText={(text) => setNewEntry({ ...newEntry, carbs: text })}
                    placeholder="Carbs (g)"
                    keyboardType="numeric"
                    className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                  />
                </View>
                <View className="flex-1">
                  <TextInput
                    value={newEntry.fat}
                    onChangeText={(text) => setNewEntry({ ...newEntry, fat: text })}
                    placeholder="Fat (g)"
                    keyboardType="numeric"
                    className="bg-white rounded-xl p-4 text-navy border border-ash/20"
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-ash/20 rounded-xl py-4"
                >
                  <Text className="text-ash font-semibold text-center">
                    Cancel
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={handleAddEntry}
                  disabled={!newEntry.name.trim() || !newEntry.calories}
                  className={`flex-1 rounded-xl py-4 ${
                    newEntry.name.trim() && newEntry.calories
                      ? "bg-navy"
                      : "bg-ash/30"
                  }`}
                >
                  <Text
                    className={`font-semibold text-center ${
                      newEntry.name.trim() && newEntry.calories
                        ? "text-ivory"
                        : "text-ash"
                    }`}
                  >
                    Add Food
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Photo Source Selection Modal */}
      <PhotoSourceModal
        visible={showPhotoSourceModal}
        onClose={() => setShowPhotoSourceModal(false)}
        onTakePhoto={handleTakePhoto}
        onChooseFromLibrary={handleChooseFromLibrary}
      />
    </SafeAreaView>
  );
}