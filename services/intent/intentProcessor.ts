import { CONSTANT_WORDS_TO_SPEAK } from "@/constants/wordsToSpeak";
import intentResponses from "@/constants/intentResponses";

export class IntentProcessor {
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
      // Create API request to local LM Studio server
      const response = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "nepaligpt", //configured model name in LM Studio
          messages: [
            {
              role: "system",
              content: "तपाईं एकजना दयालु, सरल भाषा बोल्ने सहायक हुनुहुन्छ जसले बुढाबुढी मानिसलाई सहयोग गर्नुहुन्छ। तपाईंले नेपाली भाषामा कुराकानी गर्नुहोस्। तपाईंको उद्देश्य भनेको बिरामी, थाकेका वा चिन्तित भएका ज्येष्ठ नागरिकलाई आरामदायी जवाफ दिनु हो। यदि उनीहरूले औषधी, डाक्टर, सन्चो छैन, एक्लो छु जस्ता कुरा भने भने, तपाईंले सजिलो र सहानुभूतिको साथ जवाफ दिनुपर्छ। प्रत्येक जवाफ छोटो, मीठो र सहायक हुनुहोस्।"
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 1,
          max_tokens: 500,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`LM Studio API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the assistant's response from the LM Studio API response format
      return data.choices[0]?.message?.content || CONSTANT_WORDS_TO_SPEAK.error_server;
    } catch (error) {
      console.error("LM Studio API error:", error);
      return CONSTANT_WORDS_TO_SPEAK.error_server;
    }
  }
}