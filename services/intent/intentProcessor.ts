import OpenAI from "openai";
import { CONSTANT_WORDS_TO_SPEAK } from "@/constants/wordsToSpeak";
import intentResponses from "@/constants/intentResponses";

export class IntentProcessor {
  private static openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY,
  });

  static async processIntent(text: string): Promise<string> {
    const q = encodeURIComponent(text);
    const uri = `https://api.wit.ai/message?v=20230215&q=${q}`;
    const auth = `Bearer ${process.env.EXPO_PUBLIC_AUTH_TOKEN}`;

    try {
      const response = await fetch(uri, { headers: { Authorization: auth } });
      const data = await response.json();

      const intent = data.intents?.[0]?.name;

      if (!intent) {
        return await this.handleUnknownIntent(text);
      }

      // Use the intentResponses directly instead of dynamic import
      return (
        intentResponses[intent as keyof typeof intentResponses] ||
        CONSTANT_WORDS_TO_SPEAK.error_understand
      );
    } catch (error) {
      console.error("Intent processing error:", error);
      throw error;
    }
  }

  private static async handleUnknownIntent(text: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content:
              "तपाईं लालितपुर वडा नं. ३ का विभिन्न कार्यहरू र सामान्य जानकारीहरू उपलब्ध गराउन डिजाइन गरिएको एक कृत्रिम बुद्धिमत्ता सहायक हुनुहुन्छ।",
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 1,
        max_tokens: 500,
      });

      return (
        response.choices[0].message.content ||
        CONSTANT_WORDS_TO_SPEAK.error_server
      );
    } catch (error) {
      console.error("OpenAI error:", error);
      return CONSTANT_WORDS_TO_SPEAK.error_server;
    }
  }
}
