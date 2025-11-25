import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMalayPhrases = async (): Promise<string[]> => {
  const ai = getAIClient();
  
  const prompt = `
    Generate 5 very short, punchy, viral Malay phrases (Bahasa Melayu) for a product on TikTok Shop.
    Context: A Giant 80cm-100cm Crocodile Plushie (Buaya Kawan Setia).
    Target: Malaysians.
    Tone: Fun, Hype, Casual (Bahasa Pasar).
    Constraint: MUST be 1 to 3 words max per phrase.
    
    Examples: 
    - "Memang Padu!"
    - "Gebuu Sangat!"
    - "Wajib Beli!"
    - "Peluk Best!"
    
    Return ONLY a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Text Gen Error:", error);
    // Fallbacks that fit the 1-3 word constraint
    return ["Memang Padu!", "Comel Gila!", "Wajib Beli!", "Peluk Best!", "Murah Je!"];
  }
};

export const generateProductImage = async (): Promise<string> => {
  const ai = getAIClient();
  const prompt = "A cute, giant, fluffy green crocodile plushie toy sitting in a bright, cozy modern malaysian home. High quality product photography, soft lighting, 4k, instagram worthy.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};