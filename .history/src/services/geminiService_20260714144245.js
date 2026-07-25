import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API || "";
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Analyzes natural language queries from farmers across supported languages
 * and returns a structured object indicating crop and disease mapping.
 * @param {string} query 
 * @returns {Promise<{crop: string, problem: string}>}
 */
export async function understandFarmerQuery(query) {
  try {
    if (!apiKey) {
      console.warn("Gemini API key is missing. Check NEXT_PUBLIC_GEMINI_API setup.");
      return { crop: "", problem: "" };
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      You are an expert agronomy AI helper analyzing farmer issue statements.
      Identify the target crop category (must extract exactly one of: "paddy", "cotton", or "vegetables") and the underlying disease, pest, or structural problem mentioned.
      
      Examples:
      - "Whitefly threat detected on cotton plants" -> {"crop": "cotton", "problem": "Whitefly"}
      - "Rice blast infestation causing damage in my field" -> {"crop": "paddy", "problem": "Rice Blast"}
      - "Caterpillars complex destroying my green tomatoes" -> {"crop": "vegetables", "problem": "Caterpillar Complex"}

       Farmer Query: "${query}"
      Return strictly a JSON structure containing "crop" and "problem" properties.
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    return JSON.parse(textResponse);
  } catch (err) {
    console.error("Gemini processing error:", err);
    return { crop: "", problem: "" };
  }
}