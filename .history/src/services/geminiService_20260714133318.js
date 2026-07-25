import {
GoogleGenerativeAI
}
from
"@google/generative-ai";

const genAI =
new GoogleGenerativeAI(
process.env
.NEXT_PUBLIC_GEMINI_KEY
);

export async function
understandFarmerQuery(
query
){

const model =
genAI.getGenerativeModel({
 model:
 "gemini-2.5-flash"
});

const result =
await model.generateContent(
`
Farmer Query:

${query}

Return ONLY JSON.

{
 "crop":"",
 "problem":"",
 "language":""
}
`
);

return JSON.parse(
result.response.text()
);
}