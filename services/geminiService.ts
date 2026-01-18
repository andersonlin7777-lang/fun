
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

export async function generateGroupNames(count: number, theme: string = "superheroes"): Promise<string[]> {
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Generate ${count} creative group names based on the theme: ${theme}. Return them as a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const text = response.text;
      if (text) {
        return JSON.parse(text);
      }
    } catch (error) {
      console.error("Gemini Error:", error);
    }
  } else {
    console.warn("Gemini API Key is missing. Using fallback names.");
  }

  // Fallback names
  return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
}
