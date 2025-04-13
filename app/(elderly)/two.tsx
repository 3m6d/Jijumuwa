import React, { useCallback, useState } from "react";
import { View } from "@/components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import Conversation, { Message } from "@/components/Coversation";
import * as Speech from "expo-speech";
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import uuid from "react-native-uuid";
import { useRouter } from "expo-router";
import { blurhash } from "@/constants";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import intentResponses from "@/constants/intentResponses";
import {CONSTANT_WORDS_TO_SPEAK} from "@/constants/wordsToSpeak";

// Type definition for the response from intent recognition API
type IntentResponse = {
  entities: Record<string, any>;  // Named entities extracted from speech
  intents: { confidence: number; id: string; name: string }[];  // Recognized intents with confidence scores
  text: string;  // Original text that was processed
  traits: Record<string, any>;  // Additional traits identified in the text
};

export default function TabTwoScreen() {
  // State variables for managing conversation and UI
  const [conversation, setConversation] = useState<Message[]>([]); // Stores conversation history
  const [loading, setLoading] = useState(false); // Tracks API request status
  const [isSpeaking, setIsSpeaking] = useState(false); // Tracks if TTS is active
  const router = useRouter(); // Navigation router
  const [latestSpeakMessage, setLatestSpeakMessage] = useState(""); // Stores most recent bot message for repeat functionality

  // Hook that runs when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Initialize voice recognition and greet user when screen loads
      setupVoiceHandlers();
      greetUser();

      // Cleanup function that runs when screen loses focus
      return () => {
        stopSpeechToText();
        resetAppState();
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, [])
  );

  // Adds a new message to the conversation history
  const updateConversation = (sender: "user" | "sarathi", text: string) => {
    setConversation((prevConvo) => [
      ...prevConvo,
      { id: uuid.v4().toString(), text, sender },
    ]);
  };

  // Sets up event handlers for voice recognition
  const setupVoiceHandlers = () => {
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
  };

  // Displays and speaks the initial greeting message
  const greetUser = () => {
    speak(CONSTANT_WORDS_TO_SPEAK.greet_customer);
  };

  // Initiates voice recognition if not currently speaking
  const startSpeechToText = async () => {
    if (!isSpeaking) {
      try {
        await Voice.start("ne-NP"); // Start listening for Nepali speech
      } catch (error) {
        console.log("Voice start error:", error);
      }
    }
  };

  // Resets all state variables to initial values
  const resetAppState = () => {
    setConversation([]);
    setLoading(false);
    setIsSpeaking(false);
  };

  // Stops the speech recognition process
  const stopSpeechToText = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error("Voice stop error:", error);
    }
  };

  // Handles speech recognition results
  const onSpeechResults = (result: SpeechResultsEvent) => {
    const text = result.value?.[0] || CONSTANT_WORDS_TO_SPEAK.error_understand;
    updateConversation("user", text); // Display recognized speech
    processSpeechResult(text); // Process the speech for intent recognition
  };

  // Called when speech recognition ends
  const onSpeechEnd = () => {
    stopSpeechToText();
  };

  // Handles speech recognition errors
  const onSpeechError = (error: SpeechErrorEvent) => {
    console.log("Speech error:", error);
    startSpeechToText(); // Restart speech recognition after error
  };

  // Converts text to speech and manages related states
  const speak = (text: string) => {
    // Process Nepali numbers for better pronunciation
    const processedText = text.replace(/[१२३४५६७८९०]+/g, (match) => {
      return match.split("").join(" ");
    });

    // Update UI with bot's message
    updateConversation("sarathi", text);
    setLatestSpeakMessage(text);
    setIsSpeaking(true);

    // Use Speech API to speak the text
    Speech.speak(processedText, {
      voice: "ne-NP-language",
      pitch: 1,
      rate: 1,
      onStart: () => {
        stopSpeechToText().catch(console.error); // Stop listening while speaking
      },
      language: "ne-NP",
      onDone: () => {
        setIsSpeaking(false);
        if (!loading) {
          startSpeechToText().catch(console.error); // Resume listening after speaking
        }
      },
    });
  };

  // Processes the user's speech input and determines response
  const processSpeechResult = async (text: string) => {
    const q = encodeURIComponent(text);
    setLoading(true);

    // Handle no recognition result
    if (q === "No result") {
      speak(
        "तपाईले के भन्नु भएको छ मैले ठ्याक्कै बुझिन, कृपया स्पष्ट रूपमा भन्न सक्नुहुन्छ"
      );
      return;
    }

    // Regular expressions for special commands
    const regexMap = {
      bye: /(bye|goodbye|बिदाई|धन्यवाद)/i,  // Farewell phrases
      repeat: /(फेरि भन्नुहोस्|फेरि भन्नु भएको छ|फेरि भन्नुहोस्)/i,  // Repeat request
      notUnderstood: /(बुझिन|मैले ठ्याक्कै बुझिन|मैले ठ्याक्कै बुझिन)/i,  // Not understanding
    };

    // Handle repeat request
    if (regexMap.notUnderstood.test(text) || regexMap.repeat.test(text)) {
      speak(latestSpeakMessage);
      return;
    }
    
    // Handle goodbye command
    if (regexMap.bye.test(text)) {
      await stopSpeechToText();
      speakGoodbye();
      return;
    }

    // This section would normally call a Wit.ai API but is commented out
    const uri = `https://api.wit.ai/message?v=20241113&q=${q}`;
    const auth = `Bearer ${process.env.EXPO_PUBLIC_AUTH_TOKEN}`;

    // Intent recognition would happen here
      fetch(uri, { headers: { Authorization: auth } })
      .then((res) => res.json())
      .then(async (res: IntentResponse) => {
        const intent = res.intents?.[0]?.name || "No_Intent";
        console.log("Intent : " + intent);

        await stopSpeechToText();
        await callChatbotAPI(
          text,
          res,
          intentResponses[intent as keyof typeof intentResponses]
        );
      })
      .catch((error) => {
        console.error("Error fetching data from Wit.ai:", error);
        speak(CONSTANT_WORDS_TO_SPEAK.error_server);
      })
      .finally(() => {
        setLoading(false);
      });
  };
      // Makes API call to chatbot backend with intent information
    const callChatbotAPI = async (
      text: string,
      intentResponse: IntentResponse,
      ourResponse: string
    ) => {
      try {
        setLoading(true);
        
        // Format conversation history for context
        const conversationHistory = conversation.map(msg => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        }));
        
        // Create the messages array for the LM Studio API
        const messages = [
          {
            role: "system",
            content: `तपाईं नेपाली भाषा विशेष रूपले तालिम प्राप्त गरिएको AI मोडेल हुनुहुन्छ। तपाईंको मुख्य उद्देश्य भनेको प्रयोगकर्तासँग आत्मीय र अर्थपूर्ण संवाद गर्नु हो, विशेष गरी वृद्ध व्यक्तिहरूलाई मानसिक रूपमा सहयोग पुर्‍याउने, उनीहरूको भावना बुझ्ने, र आत्मीयता प्रदान गर्ने हो।

          तपाईंको नाम सारथी हो, दिपावली मल्लले बनाउनुभएको। तपाईंको उद्देश्य वृद्ध प्रयोगकर्ताहरूलाई भावनात्मक सहयोग प्रदान गर्नु हो।

          प्रयोगकर्ताको प्रश्न: ${text}
          पहिचान गरिएको इन्टेन्ट: ${intentResponse.intents?.[0]?.name || "No_Intent"}
          एन्टिटीहरू: ${JSON.stringify(intentResponse.entities)}

          कृपया यी नियमहरू पालना गर्नुहोस्:
          - उत्तरहरू ८० शब्द भन्दा कम राख्नुहोस्
          - सरल र स्पष्ट भाषा प्रयोग गर्नुहोस्
          - भावनात्मक सहयोग प्रदान गर्नुहोस्
          - पूर्ण नेपाली भाषामा उत्तर दिनुहोस् (यदि प्रश्न अंग्रेजीमा छ भने अंग्रेजीमा उत्तर दिनुहोस्)`
                },
          // Add conversation history for context (limit to last few messages)
          ...conversationHistory.slice(-4),
          // Add the current user query
          { role: "user", content: text }
        ];
        
        // Make API call to local LM Studio server
        const response = await fetch('http://192.168.1.91:1234/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "nepaligpt", // Model name as configured in LM Studio
            messages: messages,
            temperature: 0.7,
            max_tokens: 300, 
            stream: false
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Extract the assistant's response
        const assistantResponse = data.choices?.[0]?.message?.content;
        
        if (assistantResponse) {
          speak(assistantResponse);
        } else {
          speak(CONSTANT_WORDS_TO_SPEAK.error_server);
        }
      } catch (error) {
        console.error("LM Studio API Error:", error);
        speak(CONSTANT_WORDS_TO_SPEAK.error_server);
      } finally {
        setLoading(false);
      }
    };
  // Speaks a goodbye message before navigating away
  const speakGoodbye = async () => {
    const speechOptions = {
      voice: "ne-NP-language",
      pitch: 1,
      rate: 1,
      language: "ne-NP",
      onStart: () => stopSpeechToText().catch(console.error),
      onDone: () => {
        console.log("Speech finished");
        navigateAway();
      },
    };
    
    updateConversation("sarathi", CONSTANT_WORDS_TO_SPEAK.goodbye);
    Speech.speak(CONSTANT_WORDS_TO_SPEAK.goodbye, {
      ...speechOptions,
      onStart: () => {
        stopSpeechToText().catch(console.error);
      },
      onDone: () => {
        console.log("Speech finished");
        navigateAway();
      },
    });
  };

  // Navigates back to the home screen after goodbye
  const navigateAway = async () => {
    await stopSpeechToText();
    router.navigate("/dashboard");
  };

  // UI Rendering
  return (
    <View className="flex-1 items-center justify-center">
      {/* Gradient background */}
      <LinearGradient
        colors={["rgba(255,255,255,255)", "#fff", "#ffffd0"]}
        className="absolute flex-1 top-0 left-0 right-0 bottom-0 z-0"
      />
      
      {/* Header images */}
      <View className="flex flex-row justify-center w-full bg-transparent">
        <Image
          placeholder={blurhash}
          source={require("@/assets/images/bye-en.svg")}
          className="h-16 mt-10 w-16 z-10"
        />
        <Image
          placeholder={blurhash}
          source={require("@/assets/images/header.svg")}
          className="h-32 w-32 z-10"
        />
        <Image
          placeholder={blurhash}
          source={require("@/assets/images/bye-np.svg")}
          className="h-16 w-16 mt-10 z-10"
        />
      </View>

      {/* Conversation component that renders message history */}
      <Conversation messages={conversation} loading={loading} />
    </View>
  );
}
