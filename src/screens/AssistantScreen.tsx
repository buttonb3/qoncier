import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useChatStore } from "../state/chatStore";
import { useUIStore } from "../state/uiStore";
import { useHealthStore } from "../state/healthStore";
import { getOpenAIChatResponse } from "../api/chat-service";
import { transcribeAudio } from "../api/transcribe-audio";
import { ChatMessage } from "../types/health";
import ChatBubble from "../components/ChatBubble";
import EmergencyModal from "../components/EmergencyModal";

export default function AssistantScreen() {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const { setShowEmergencyModal } = useUIStore();
  const { symptoms, medications, nutritionEntries } = useHealthStore();

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    // Add welcome message if no messages exist
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        content: "Hello! I'm your AI health assistant. I can help you track symptoms, manage medications, analyze nutrition, and answer health-related questions. How can I assist you today?",
        role: "assistant",
        timestamp: new Date().toISOString(),
        type: "text",
      };
      addMessage(welcomeMessage);
    }
  }, []);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow microphone access to use voice input.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Recording Error", "Could not start voice recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      setLoading(true);
      try {
        const transcription = await transcribeAudio(uri);
        setInputText(transcription);
      } catch (error) {
        console.error("Transcription error:", error);
        Alert.alert("Transcription Error", "Could not transcribe audio. Please try typing instead.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText.trim(),
      role: "user",
      timestamp: new Date().toISOString(),
      type: "text",
    };

    addMessage(userMessage);
    setInputText("");
    setLoading(true);

    try {
      // Create health context from user data
      const healthContext = `
Current Health Data:
- Recent Symptoms: ${symptoms.slice(0, 3).map(s => `${s.name} (${s.severity}/5)`).join(", ") || "None"}
- Active Medications: ${medications.filter(m => m.isActive).map(m => `${m.name} ${m.dosage}`).join(", ") || "None"}
- Recent Nutrition: ${nutritionEntries.slice(0, 3).map(n => `${n.name} (${n.calories} cal)`).join(", ") || "None"}
      `;

      // Create health-focused system prompt
      const systemPrompt = `You are Qoncier, an AI health assistant. You help users track symptoms, medications, nutrition, and provide health guidance. 

${healthContext}

Key capabilities:
- Answer health-related questions using the user's health data context
- Help log symptoms, medications, and nutrition
- Provide personalized health insights and recommendations
- Offer emergency guidance when needed

Important: 
- Always recommend consulting healthcare professionals for serious concerns
- Be empathetic and supportive
- Keep responses concise and actionable
- If user mentions emergency symptoms, suggest they seek immediate medical attention
- Reference their existing health data when relevant

User message: ${inputText}`;

      const response = await getOpenAIChatResponse(systemPrompt);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: "assistant",
        timestamp: new Date().toISOString(),
        type: "text",
      };

      addMessage(assistantMessage);

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date().toISOString(),
        type: "text",
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-ivory">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="bg-navy px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-gold rounded-full p-2 mr-3">
                <Ionicons name="medical" size={20} color="#1C1C2E" />
              </View>
              <View>
                <Text className="text-ivory text-lg font-bold">
                  AI Health Assistant
                </Text>
                <Text className="text-ivory/80 text-sm">
                  Always here to help
                </Text>
              </View>
            </View>
            
            <Pressable
              onPress={() => setShowEmergencyModal(true)}
              className="bg-danger rounded-full p-2"
            >
              <Ionicons name="medical" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <View className="items-start mb-4">
              <View className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <ActivityIndicator size="small" color="#1C1C2E" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="bg-white border-t border-ash/20 px-4 py-3">
          <View className="flex-row items-end space-x-3">
            <View className="flex-1 bg-ivory rounded-2xl px-4 py-3 border border-ash/20">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask about your health, log symptoms, medications..."
                placeholderTextColor="#777777"
                multiline
                maxLength={500}
                className="text-navy text-base max-h-24"
                onSubmitEditing={handleSendMessage}
              />
            </View>
            
            <Pressable
              onPress={isRecording ? stopRecording : startRecording}
              className={`rounded-full p-3 mr-2 ${
                isRecording ? "bg-danger" : "bg-gold"
              }`}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={20} 
                color={isRecording ? "white" : "#1C1C2E"} 
              />
            </Pressable>
            
            <Pressable
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className={`rounded-full p-3 ${
                inputText.trim() && !isLoading
                  ? "bg-navy"
                  : "bg-ash/30"
              }`}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() && !isLoading ? "#F9F6F1" : "#777777"} 
              />
            </Pressable>
          </View>
          
          {/* Quick Actions */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mt-3"
          >
            <View className="flex-row space-x-2">
              <Pressable
                onPress={() => setInputText("I want to log a new symptom")}
                className="bg-navy/10 rounded-full px-3 py-2"
              >
                <Text className="text-navy text-sm font-medium">
                  Log Symptom
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => setInputText("Help me track my medication")}
                className="bg-navy/10 rounded-full px-3 py-2"
              >
                <Text className="text-navy text-sm font-medium">
                  Medication Help
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => setInputText("Analyze my nutrition today")}
                className="bg-navy/10 rounded-full px-3 py-2"
              >
                <Text className="text-navy text-sm font-medium">
                  Nutrition Analysis
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => setInputText("What should I know about my health today?")}
                className="bg-navy/10 rounded-full px-3 py-2"
              >
                <Text className="text-navy text-sm font-medium">
                  Health Insights
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      
      <EmergencyModal />
    </SafeAreaView>
  );
}