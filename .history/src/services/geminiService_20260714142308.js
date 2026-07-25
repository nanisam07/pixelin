import {
  GoogleGenerativeAI
} from "@google/generative-ai";

const genAI =
new GoogleGenerativeAI(
  process.env
  .NEXT_PUBLIC_GEMINI_API!
);

export async function
understandFarmerQuery(
query:string
){

const model =
genAI.getGenerativeModel({
  model:"gemini-2.5-flash"
});

const prompt = `
You are Pixelin AI.

Farmer Query:

"${query}"

Return ONLY JSON.

{
 "language":"",
 "crop":"",
 "problem":"",
 "recommendationType":"",
 "confidence":0
}
`;

const result =
await model.generateContent(
  prompt
);

let text =
result.response.text();

text = text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

return JSON.parse(text);
}