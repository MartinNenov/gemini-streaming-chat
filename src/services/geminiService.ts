
import { GoogleGenAI } from '@google/genai';
import type { ChatMessage } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function* streamChatResponse(prompt: string, history: ChatMessage[]): AsyncGenerator<string, void, undefined> {
  const model = 'gemini-2.5-flash';
  
  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error streaming from Gemini API:", error);
    throw new Error(`Failed to get response from Gemini API. ${error instanceof Error ? error.message : String(error)}`);
  }
}
