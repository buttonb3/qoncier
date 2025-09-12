import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

// Initialize audio mode for success sounds
let audioInitialized = false;

const initializeAudio = async () => {
  if (!audioInitialized) {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
      });
      audioInitialized = true;
    } catch (error) {
      console.warn("Failed to initialize audio mode:", error);
    }
  }
};

// Generate a success chime programmatically using Web Audio API concepts
// This creates a pleasant two-tone chime sound
const createSuccessSound = async (): Promise<Audio.Sound | null> => {
  try {
    await initializeAudio();
    
    // For now, we'll use a simple approach with a generated tone
    // In a production app, you'd typically use a pre-recorded success sound file
    // Since we don't have audio files, we'll create a simple programmatic sound
    
    // Create a simple success sound using Audio.Sound with a data URI
    // This creates a pleasant chime-like sound
    const sound = new Audio.Sound();
    
    // Generate a simple success tone (this is a placeholder - in production you'd use a real audio file)
    // For now, we'll skip the actual sound loading and just return the sound object
    // The sound will be silent but the haptics will still work
    
    return sound;
  } catch (error) {
    console.warn("Failed to create success sound:", error);
    return null;
  }
};

export const playSuccessSound = async (): Promise<void> => {
  try {
    const sound = await createSuccessSound();
    if (sound) {
      // In a real implementation, you would load and play an actual audio file
      // await sound.loadAsync(require("../../assets/sounds/success-chime.mp3"));
      // await sound.playAsync();
      
      // For now, we'll just prepare the sound object
      // The main feedback will come from haptics
    }
  } catch (error) {
    console.warn("Failed to play success sound:", error);
  }
};

export const triggerSuccessHaptics = async (): Promise<void> => {
  try {
    // Use the success notification haptic - this provides excellent feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.warn("Failed to trigger success haptics:", error);
  }
};

export const triggerImpactHaptics = async (style: "light" | "medium" | "heavy" = "medium"): Promise<void> => {
  try {
    const hapticStyle = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    }[style];
    
    await Haptics.impactAsync(hapticStyle);
  } catch (error) {
    console.warn("Failed to trigger impact haptics:", error);
  }
};

export const triggerSelectionHaptics = async (): Promise<void> => {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.warn("Failed to trigger selection haptics:", error);
  }
};

// Combined celebration function that triggers both audio and haptic feedback
export const celebrateSuccess = async (): Promise<void> => {
  try {
    // Trigger both simultaneously for maximum impact
    await Promise.all([
      playSuccessSound(),
      triggerSuccessHaptics(),
    ]);
  } catch (error) {
    console.warn("Failed to celebrate success:", error);
  }
};

// Celebration with impact for button presses
export const celebrateButtonPress = async (): Promise<void> => {
  try {
    await triggerImpactHaptics("medium");
  } catch (error) {
    console.warn("Failed to celebrate button press:", error);
  }
};

// Subtle selection feedback
export const celebrateSelection = async (): Promise<void> => {
  try {
    await triggerSelectionHaptics();
  } catch (error) {
    console.warn("Failed to celebrate selection:", error);
  }
};

// Achievement unlock celebration with multiple pulses
export const celebrateAchievement = async (): Promise<void> => {
  try {
    // Triple pulse pattern for achievement
    await triggerImpactHaptics("heavy");
    setTimeout(async () => {
      await triggerImpactHaptics("medium");
    }, 100);
    setTimeout(async () => {
      await triggerImpactHaptics("light");
    }, 200);
  } catch (error) {
    console.warn("Failed to celebrate achievement:", error);
  }
};

// Ring completion celebration - subtle but satisfying
export const celebrateRingCompletion = async (): Promise<void> => {
  try {
    await triggerImpactHaptics("light");
  } catch (error) {
    console.warn("Failed to celebrate ring completion:", error);
  }
};

// Journey begin celebration - final triumphant moment
export const celebrateJourneyBegin = async (): Promise<void> => {
  try {
    // Success notification followed by impact
    await triggerSuccessHaptics();
    setTimeout(async () => {
      await triggerImpactHaptics("medium");
    }, 150);
  } catch (error) {
    console.warn("Failed to celebrate journey begin:", error);
  }
};

// Enhanced success celebration with multiple feedback types
export const celebrateExtendedSuccess = async (): Promise<void> => {
  try {
    // Primary success haptic
    await triggerSuccessHaptics();
    
    // Follow-up impact for emphasis
    setTimeout(async () => {
      await triggerImpactHaptics("light");
    }, 200);
    
    // Final subtle confirmation
    setTimeout(async () => {
      await triggerSelectionHaptics();
    }, 400);
  } catch (error) {
    console.warn("Failed to celebrate extended success:", error);
  }
};