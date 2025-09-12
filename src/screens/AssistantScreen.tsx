import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useChatStore } from "../state/chatStore";
import { useUIStore } from "../state/uiStore";
// import { useHealthStore } from "../state/healthStore";
import { getOpenAIChatResponse } from "../api/chat-service";
import { ChatMessage } from "../types/health";
import ChatBubble from "../components/ChatBubble";
import EmergencyModal from "../components/EmergencyModal";

export default function AssistantScreen() {
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const { setShowEmergencyModal } = useUIStore();
  // Health store for future action logging
  // const healthStore = useHealthStore();

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

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
      // Create health-focused system prompt
      const systemPrompt = `You are Qoncier, an AI health assistant. You help users track symptoms, medications, nutrition, and provide health guidance. 

Key capabilities:
- Answer health-related questions
- Help log symptoms, medications, and nutrition
- Provide health insights and recommendations
- Offer emergency guidance when needed

Important: 
- Always recommend consulting healthcare professionals for serious concerns
- Be empathetic and supportive
- Keep responses concise and actionable
- If user mentions emergency symptoms, suggest they seek immediate medical attention

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

      // Check if the response suggests logging something
      const content = response.content.toLowerCase();
      if (content.includes("log") && content.includes("symptom")) {
        // Could add automatic symptom logging suggestion here
      }

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