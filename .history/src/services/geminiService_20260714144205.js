import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API;

console.log("API KEY =", apiKey);

const genAI = new GoogleGenerativeAI(apiKey);

export async function understandFarmerQuery(query) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(query);

    return result.response.text();
  } catch (err) {
    console.log("FULL ERROR:");
    console.log(err);
    console.log(JSON.stringify(err, null, 2));

    return "Gemini Failed";
  }
}