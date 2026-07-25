/**
 * Resolves product entries based on active crop categories and targets.
 * @param {string} crop 
 * @param {string} problem 
 * @param {any} cropProducts 
 * @returns {any[]} Array of matching products
 */
export function getRecommendations(crop, problem, cropProducts) {
  if (!crop || !problem || !cropProducts) return [];

  const targetCropKey = crop.toLowerCase().trim();
  const targetProblem = problem.toLowerCase().trim();

  // Route to structural crop keys safely matching incoming strings
  let cropData = null;
  if (targetCropKey.includes("paddy") || targetCropKey.includes("rice")) {
    cropData = cropProducts.paddy;
  } else if (targetCropKey.includes("cotton")) {
    cropData = cropProducts.cotton;
  } else if (targetCropKey.includes("vegetable") || targetCropKey.includes("tomato") || targetCropKey.includes("chilli")) {
    cropData = cropProducts.vegetables;
  }

  if (!cropData || !Array.isArray(cropData.items)) {
    return [];
  }

  return cropData.items.filter((product) => {
    if (!product.targets || !Array.isArray(product.targets)) return false;
    
    return product.targets.some(
      (t) => t.toLowerCase().trim() === targetProblem || t.toLowerCase().includes(targetProblem) || targetProblem.includes(t.toLowerCase())
    );
  });
}