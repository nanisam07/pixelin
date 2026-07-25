export function getRecommendations(crop, problem, cropProducts) {
  if (!crop || !problem || crop === "Unknown") return [];

  const normalizedCrop = crop.toLowerCase();
  
  // Crop Map key routing validation safety
  let targetCategoryKey = "paddy";
  if (normalizedCrop.includes("cotton")) targetCategoryKey = "cotton";
  if (normalizedCrop.includes("vegetable") || normalizedCrop.includes("tomato")) targetCategoryKey = "vegetables";

  const targetCategory = cropProducts[targetCategoryKey];
  if (!targetCategory || !targetCategory.items) return [];

  const aliases = {
    "Brown Plant Hopper": ["bph", "brown plant hopper", "wbph", "sap-feeding"],
    "Stem Borer": ["stem borer", "leaf folder", "borer"],
    "Rice Blast": ["rice blast", "blast", "sheath blight"],
    "Whitefly": ["whitefly", "white fly", "sucking pests"],
    "Aphid": ["aphid", "jassid", "sucking insects"],
    "Pink Bollworm": ["pink bollworm", "american", "spotted", "bollworm"],
    "Caterpillars": ["shoot borer", "fruit borer", "caterpillars", "chewing pests"]
  };

  const searchTerms = aliases[problem] || [problem.toLowerCase()];

  return targetCategory.items.filter((product) =>
    product.targets?.some((target) =>
      searchTerms.some((term) =>
        target.toLowerCase().includes(term.toLowerCase())
      )
    )
  );
}