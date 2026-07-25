/**
 * Image Validator Service using TensorFlow.js and MobileNet
 * Ensures only plant/crop images are passed to the scanner diagnostics system.
 */

let tfModel = null;

async function loadTensorFlowAndMobileNet() {
  if (tfModel) return tfModel;

  // Dynamically inject scripts if not already present globally
  if (!window.tf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  if (!window.mobilenet) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Load the model
  tfModel = await window.mobilenet.load();
  return tfModel;
}

export async function validateCropImage(imageElement) {
  try {
    const model = await loadTensorFlowAndMobileNet();
    const predictions = await model.classify(imageElement);
    
    // Plant/Vegetation keywords mapping from MobileNet classes
    const plantKeywords = [
      "plant", "leaf", "tree", "flower", "organism", "vegetation",
      "pot", "crocus", "daisy", "zucchini", "corn", "ear", "head of cabbage",
      "broccoli", "head", "mushroom", "fungus", "gourd", "acorn squash"
    ];

    // Invalid clear keywords to instantly filter out false positives
    const invalidKeywords = [
      "person", "man", "woman", "face", "car", "wheel", "vehicle", "building", 
      "house", "laptop", "computer", "desk", "room", "cat", "dog"
    ];

    let highestPlantConfidence = 0;
    let isInvalidObject = false;

    predictions.forEach((p) => {
      const label = p.className.toLowerCase();
      
      // Check if top matches flag non-plant objects aggressively
      if (invalidKeywords.some(keyword => label.includes(keyword)) && p.probability > 0.35) {
        isInvalidObject = true;
      }

      if (plantKeywords.some(keyword => label.includes(keyword))) {
        if (p.probability > highestPlantConfidence) {
          highestPlantConfidence = p.probability;
        }
      }
    });

    // Valid if plant confidence passes 15% and no highly confident invalid objects match
    const isValid = highestPlantConfidence > 0.15 && !isInvalidObject;

    return {
      isValid,
      predictions
    };
  } catch (error) {
    console.error("TensorFlow.js / MobileNet validation failed:", error);
    // Fallback safe pass if network prevents CDN load, or route to robust check
    return { isValid: true, predictions: [], fallback: true };
  }
}