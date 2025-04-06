import * as Speech from "expo-speech";
import Voice from "@react-native-voice/voice";

export class SpeechService {
  static async startListening(language: string = "ne-NP") {
    try {
      await Voice.start(language);
    } catch (error) {
      console.error("Voice start error:", error);
    }
  }

  static async stopListening() {
    try {
      await Voice.stop();
    } catch (error) {
      console.error("Voice stop error:", error);
    }
  }

  static speak(text: string, options: any) {
    return new Promise((resolve) => {
      Speech.speak(text, {
        ...options,
        onDone: () => resolve(true),
      });
    });
  }

  static async destroy() {
    await Voice.destroy();
    await Voice.removeAllListeners();
  }
}
