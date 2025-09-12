import React, { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../state/userStore";
import OnboardingContainer from "../../components/onboarding/OnboardingContainer";
import OnboardingInput from "../../components/onboarding/OnboardingInput";
import OnboardingButton from "../../components/onboarding/OnboardingButton";
import OnboardingCard from "../../components/onboarding/OnboardingCard";
import { EmergencyContact } from "../../types/health";

export default function OnboardingEmergencyContactsScreen() {
  const navigation = useNavigation();
  const { updateProfile, nextOnboardingStep, completeOnboardingStep } = useUserStore();
  
  const [contacts, setContacts] = useState<Partial<EmergencyContact>[]>([
    { name: "", relationship: "", phoneNumber: "", isPrimary: true }
  ]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addContact = () => {
    setContacts([...contacts, { name: "", relationship: "", phoneNumber: "", isPrimary: false }]);
  };

  const updateContact = (index: number, field: keyof EmergencyContact, value: string | boolean) => {
    const updated = contacts.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    );
    setContacts(updated);
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    contacts.forEach((contact, index) => {
      if (contact.name && !contact.phoneNumber) {
        newErrors[`phone-${index}`] = "Phone number is required";
      }
      if (contact.phoneNumber && !contact.name) {
        newErrors[`name-${index}`] = "Name is required";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const validContacts = contacts
        .filter(contact => contact.name && contact.phoneNumber)
        .map((contact, index) => ({
          id: `emergency-${index}`,
          name: contact.name!,
          relationship: contact.relationship || "Emergency Contact",
          phoneNumber: contact.phoneNumber!,
          isPrimary: contact.isPrimary || false,
        }));
      
      updateProfile({ emergencyContacts: validContacts });
      completeOnboardingStep("emergency-contacts");
      nextOnboardingStep();
      navigation.navigate("Completion" as never);
    }
  };

  const handleSkip = () => {
    updateProfile({ emergencyContacts: [] });
    completeOnboardingStep("emergency-contacts");
    nextOnboardingStep();
    navigation.navigate("Completion" as never);
  };

  return (
    <OnboardingContainer currentStep={10} totalSteps={11}>
      <View className="flex-1 py-8">
        <Text className="text-ivory text-3xl font-bold text-center mb-2">
          Emergency Contacts
        </Text>
        <Text className="text-ivory/80 text-lg text-center mb-8">
          Add emergency contacts for quick access during health emergencies
        </Text>

        <OnboardingCard
          title="Emergency Contacts"
          description="These contacts will be easily accessible from your AI assistant"
          icon="call"
        >
          <View className="mt-4">
            {contacts.map((contact, index) => (
              <View key={index} className="bg-ivory/5 rounded-xl p-4 mb-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-ivory font-semibold">
                    Contact {index + 1} {contact.isPrimary && "(Primary)"}
                  </Text>
                  {contacts.length > 1 && (
                    <OnboardingButton
                      title="Remove"
                      onPress={() => removeContact(index)}
                      variant="outline"
                      fullWidth={false}
                    />
                  )}
                </View>
                
                <OnboardingInput
                  label="Name"
                  value={contact.name || ""}
                  onChangeText={(text) => updateContact(index, "name", text)}
                  placeholder="Full name"
                  error={errors[`name-${index}`]}
                />
                
                <OnboardingInput
                  label="Relationship"
                  value={contact.relationship || ""}
                  onChangeText={(text) => updateContact(index, "relationship", text)}
                  placeholder="e.g., Spouse, Parent, Friend"
                />
                
                <OnboardingInput
                  label="Phone Number"
                  value={contact.phoneNumber || ""}
                  onChangeText={(text) => updateContact(index, "phoneNumber", text)}
                  placeholder="+1 (555) 123-4567"
                  keyboardType="phone-pad"
                  error={errors[`phone-${index}`]}
                />
              </View>
            ))}
            
            <OnboardingButton
              title="Add Another Contact"
              onPress={addContact}
              variant="outline"
            />
          </View>
        </OnboardingCard>

        <View className="bg-ivory/10 rounded-xl p-4 mt-6">
          <Text className="text-ivory/80 text-sm text-center">
            🚨 Emergency contacts can be accessed quickly from the AI assistant
          </Text>
        </View>
      </View>

      <View className="pb-8 space-y-3">
        <OnboardingButton
          title="Continue"
          onPress={handleNext}
        />
        
        <OnboardingButton
          title="Skip for Now"
          onPress={handleSkip}
          variant="outline"
        />
      </View>
    </OnboardingContainer>
  );
}