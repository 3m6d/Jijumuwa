import React, { useCallback, useEffect, useState } from "react";
import { SpeechService } from "@/services/speech/speechService";

import { useRouter } from "expo-router";
import uuid from "react-native-uuid";
import { IntentProcessor } from "@/services/intent/intentProcessor";
import { Message } from "../Coversation";
import Voice from "@react-native-voice/voice";

interface ConversationManagerProps {
  onConversationUpdate: (messages: Message[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const ConversationManager: React.FC<ConversationManagerProps> = ({
  onConversationUpdate,
  onLoadingChange,
}) => {
  // Add your conversation management logic here
  return null; // Or your UI components
};
