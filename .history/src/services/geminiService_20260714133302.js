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