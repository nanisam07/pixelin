import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

let model = null;

async function loadModel() {
  if (!model) {
    model = await mobilenet.load();
  }

  return model;
}

async function isPlantImage(file) {
  const img = new Image();

  img.src = URL.createObjectURL(file);

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const model = await loadModel();

  const predictions =
    await model.classify(img);

  console.log(
    "Predictions:",
    predictions
  );

  const plantKeywords = [
    "plant",
    "leaf",
    "flower",
    "tree",
    "corn",
    "maize",
    "mushroom",
    "vegetable",
    "fruit",
    "wheat",
    "rice",
    "paddy",
    "grass",
  ];

  const isPlant =
    predictions.some((p) =>
      plantKeywords.some(
        (keyword) =>
          p.className
            .toLowerCase()
            .includes(keyword)
      )
    );

  return isPlant;
}

export async function analyzeCropImage(
  imageFile
) {
  await new Promise((resolve) =>
    setTimeout(resolve, 2500)
  );

  const validPlant =
    await isPlantImage(
      imageFile
    );

  if (!validPlant) {
    return {
      success: false,
      error:
        "This doesn't appear to be a crop image. Please upload a crop leaf image.",
    };
  }

  /*
   ------------------------------------
   Later replace this section with
   your real AI disease detection API
   ------------------------------------
  */

  return {
    success: true,

    crop: "Paddy",

    issue: "Stem Borer",

    confidence: 96,

    recommendedProductIds: [
      "expel-r",
      "pixel-sensa",
      "dodger",
    ],

    timestamp:
      new Date().toISOString(),
  };
}