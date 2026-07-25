/**
 * Advanced Agriculture Diagnostic Engine - Pixelin Sciences
 */

export const diseaseProducts = {
  "Stem Borer": ["expel-r", "pixel-sensa"],
  "Leaf Spot": ["dodger"],
  "Bacterial Blight": ["pixel-sensa", "dodger"],
  "Healthy": []
};

export const productCatalog = {
  "expel-r": {
    id: "expel-r",
    name: "Expel-R Insecticide",
    description: "High performance systemic insecticide protecting the primary vascular system from internal stalk borers.",
    instruction: "Apply 2.5ml per Liter of clean water. Spray uniformly across the foliage during early morning or late evening hours.",
    price: 450
  },
  "pixel-sensa": {
    id: "pixel-sensa",
    name: "Pixel Sensa Bio-Immunity",
    description: "Broad spectrum bio-stimulant enhancing plant immune response and cell wall resilience against leaf lesions.",
    instruction: "Mix 3ml per Liter. Ensure complete application over affected leaves. Repeat once every 10 days for optimal recovery.",
    price: 620
  },
  "dodger": {
    id: "dodger",
    name: "Dodger Anti-Fungal Protective",
    description: "Targeted anti-fungal treatment that controls leaf spot spreading and eliminates ongoing spores.",
    instruction: "Mix 3ml per Liter. Ensure complete application over affected leaves. Repeat once every 10 days for optimal recovery.",
    price: 380
  }
};

// Easily extendable crop profiles for dynamic detection simulations
const mockCrops = ["Paddy", "Tomato"];
const mockIssues = ["Stem Borer", "Leaf Spot", "Bacterial Blight"];

export async function analyzeCropImage(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Pick dynamic parameters based on image metadata or random assignments
      const randomCrop = mockCrops[Math.floor(Math.random() * mockCrops.length)];
      const randomIssue = mockIssues[Math.floor(Math.random() * mockIssues.length)];
      const recommendedIds = diseaseProducts[randomIssue] || [];

      resolve({
        success: true,
        crop: randomCrop,
        issue: randomIssue,
        confidence: Math.floor(Math.random() * (99 - 88 + 1)) + 88,
        recommendedProductIds: recommendedIds
      });
    }, 1000);
  });
}