import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// We only initialize if the key is present to avoid errors in dev environments without keys
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateSummary = async (content: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key missing");
    return "AI summarization unavailable. Please check API key.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following article content into a concise, engaging teaser (max 2 sentences) for a magazine focused on social struggles and science. Content: ${content}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating summary.";
  }
};

export const suggestTags = async (title: string, category: string): Promise<string[]> => {
  if (!ai) return ['news', 'update'];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 5 relevant tags for an article titled "${title}" in the category "${category}". Return only a comma-separated list of lowercase strings.`,
    });
    
    const text = response.text || "";
    return text.split(',').map(s => s.trim().toLowerCase());
  } catch (error) {
    return ['politics', 'general'];
  }
};