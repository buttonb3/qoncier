import React from "react";
import { View, Text } from "react-native";
import { ChatMessage } from "../types/health";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <View className={`mb-4 ${isUser ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-navy rounded-br-md"
            : "bg-white rounded-bl-md shadow-sm"
        }`}
      >
        <Text
          className={`text-base ${
            isUser ? "text-ivory" : "text-navy"
          }`}
        >
          {message.content}
        </Text>
        
        {message.metadata?.actionType && (
          <View className={`mt-2 px-2 py-1 rounded-lg ${
            isUser ? "bg-ivory/20" : "bg-navy/10"
          }`}>
            <Text className={`text-xs ${
              isUser ? "text-ivory/80" : "text-navy/80"
            }`}>
              Action: {message.metadata.actionType.replace("-", " ")}
            </Text>
          </View>
        )}
      </View>
      
      <Text className="text-xs text-ash mt-1 px-2">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
}