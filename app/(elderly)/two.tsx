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
import CONSTANT_WORDS_TO_SPEAK from "@/constants/wordsToSpeak";
import { GoogleGenerativeAI } from "@google/generative-ai";

// {"entities": {}, "intents": [{"confidence": 0.9709269656906307, "id": "1436792370584032", "name": "Dhara_Nam_Sari"}], "text": "ढल निकास व्यवस्थापन गर्न के चाहिन्छ", "traits": {}}

type IntentResponse = {
  entities: Record<string, any>;
  intents: { confidence: number; id: string; name: string }[];
  text: string;
  traits: Record<string, any>;
};

export default function TabTwoScreen() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const router = useRouter();
  const [latestSpeakMessage, setLatestSpeakMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      setupVoiceHandlers();
      greetUser();

      return () => {
        stopSpeechToText();
        resetAppState();
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, [])
  );

  const updateConversation = (sender: "user" | "sarathi", text: string) => {
    setConversation((prevConvo) => [
      ...prevConvo,
      { id: uuid.v4().toString(), text, sender },
    ]);
  };

  const setupVoiceHandlers = () => {
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
  };

  const greetUser = () => {
    speak(CONSTANT_WORDS_TO_SPEAK.greet_customer);
  };

  const startSpeechToText = async () => {
    if (!isSpeaking) {
      try {
        await Voice.start("ne-NP");
      } catch (error) {
        console.log("Voice start error:", error);
      }
    }
  };

  const resetAppState = () => {
    setConversation([]);
    setLoading(false);
    setIsSpeaking(false);
  };

  const stopSpeechToText = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error("Voice stop error:", error);
    }
  };

  const onSpeechResults = (result: SpeechResultsEvent) => {
    const text = result.value?.[0] || CONSTANT_WORDS_TO_SPEAK.error_understand;
    updateConversation("user", text);
    processSpeechResult(text);
  };

  const onSpeechEnd = () => {
    stopSpeechToText();
  };

  const onSpeechError = (error: SpeechErrorEvent) => {
    console.log("Speech error:", error);
    startSpeechToText();
  };

  const speak = (text: string) => {
    const processedText = text.replace(/[१२३४५६७८९०]+/g, (match) => {
      return match.split("").join(" ");
    });

    updateConversation("sarathi", text);
    setLatestSpeakMessage(text);
    setIsSpeaking(true);

    Speech.speak(processedText, {
      voice: "ne-NP-language",
      pitch: 1,
      rate: 1,
      onStart: () => {
        stopSpeechToText().catch(console.error);
      },
      language: "ne-NP",
      onDone: () => {
        setIsSpeaking(false);
        if (!loading) {
          startSpeechToText().catch(console.error);
        }
      },
    });
  };

  const processSpeechResult = (text: string) => {
    const q = encodeURIComponent(text);
    setLoading(true);

    if (q === "No result") {
      speak(
        "तपाईले के भन्नु भएको छ मैले ठ्याक्कै बुझिन, कृपया स्पष्ट रूपमा भन्न सक्नुहुन्छ"
      );
      return;
    }

    const regexMap = {
      bye: /(bye|goodbye|बिदाई|धन्यवाद)/i,
      repeat: /(फेरि भन्नुहोस्|फेरि भन्नु भएको छ|फेरि भन्नुहोस्)/i,
      notUnderstood: /(बुझिन|मैले ठ्याक्कै बुझिन|मैले ठ्याक्कै बुझिन)/i,
    };

    if (regexMap.notUnderstood.test(text) || regexMap.repeat.test(text)) {
      speak(latestSpeakMessage);
      return;
    }
    if (regexMap.bye.test(text)) {
      stopSpeechToText().then(speakGoodbye);
      return;
    }

    const uri = `https://api.wit.ai/message?v=20241113&q=${q}`;
    const auth = `Bearer ${process.env.EXPO_PUBLIC_AUTH_TOKEN}`;

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

  const callChatbotAPI = async (
    text: string,
    intentResponse: IntentResponse,
    ourResponse: string
  ) => {
    try {
      const response = await fetch('http://100.64.216.0:1234', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          intent: intentResponse.intents[0]?.name,
          entities: intentResponse.entities,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      if (data.response) {
        speak(data.response);
      } else {
        speak(CONSTANT_WORDS_TO_SPEAK.error_server);
      }
    } catch (error) {
      console.error("API Error:", error);
      speak(CONSTANT_WORDS_TO_SPEAK.error_server);
    }
  };

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

  const navigateAway = async () => {
    await stopSpeechToText();
    router.navigate("/(elderly)/index");
  };

  return (
    <View className="flex-1 items-center justify-center">
      <LinearGradient
        colors={["rgba(255,255,255,255)", "#fff", "#ffffd0"]}
        className="absolute flex-1 top-0 left-0 right-0 bottom-0 z-0"
      />
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

      <Conversation messages={conversation} loading={loading} />
    </View>
  );
}
