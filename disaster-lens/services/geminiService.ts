import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse } from "../types";

const GEMINI_MODEL = "gemini-2.5-flash"; // Using Flash for reliable multimodal performance

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the Data-URL declaration (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scene_summary: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
          hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
          rescue_priority: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
          safety_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommended_resources: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          "scene_summary",
          "severity",
          "hazards",
          "rescue_priority",
          "safety_steps",
          "recommended_resources",
        ],
      },
    },
  },
  required: ["results"],
};

export const analyzeImages = async (
  files: File[],
  disasterType: string,
  extraNotes: string
): Promise<AnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageParts = await Promise.all(files.map(fileToGenerativePart));

  const promptText = `
    You are Disaster Lens — an AI-powered disaster analyzer. 
    Analyze the ${files.length} uploaded image(s) regarding the following disaster context: "${disasterType}".
    Extra user notes: "${extraNotes}".

    Analyze each image separately and return a structured analysis.

    1. DAMAGE SEVERITY (Low / Medium / High / Critical)
    2. HAZARD DETECTION (e.g. electric poles, deep water, gas leaks)
    3. RESCUE PRIORITY (Low / Medium / High / Critical)
    4. SAFETY INSTRUCTIONS (Step-by-step guidance for immediate safety)
    5. RESOURCE RECOMMENDATIONS (Items required, suggested responders)
    6. SCENE SUMMARY (Describe what is visible)

    Be precise, concise, and safety-focused.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [...imageParts, { text: promptText }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Lower temperature for more deterministic/factual analysis
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResponse;
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
