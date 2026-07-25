/**
 * AI Crop Scanner Service (Mock API Client)
 * 
 * This service simulates the AI analysis of crop images.
 * In a production environment, this file can be updated to make
 * a multipart/form-data POST request to an AI detection endpoint.
 */

export async function analyzeCropImage(imageFile) {
  // Simulate network request and AI inference processing time
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Mock response for the prototype (as requested in Step 4)
  return {
    success: true,
    crop: "Paddy",
    issue: "Stem Borer",
    confidence: 96,
    recommendedProductIds: ["expel-r", "pixel-sensa", "dodger"],
    timestamp: new Date().toISOString(),
  };
}
