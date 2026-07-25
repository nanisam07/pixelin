import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const genAI =
  new GoogleGenerativeAI(
    process.env
      .NEXT_PUBLIC_GEMINI_API
  );

export async function
understandFarmerQuery(
  query
) {
  const model =
    genAI.getGenerativeModel({
      model:
        "gemini-2.5-flash",
    });

  const result =
    await model.generateContent(
      query
    );

  return result.response.text();
}