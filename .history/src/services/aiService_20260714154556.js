export function understandFarmerQuery(query) {
  const q = query.toLowerCase().trim();

  // --- Telugu Local Rule Mapping Patterns ---
  if (q.includes("వరి") || q.includes("వరి పంట") || q.includes("धान") || q.includes("paddy") || q.includes("rice")) {
    if (q.includes("తెల్ల దోమ") || q.includes("బ్రౌన్ ప్లాంట్") || q.includes("హాపర్") || q.includes("brown plant") || q.includes("bph") || q.includes("हॉपर")) {
      return { crop: "Paddy", problem: "Brown Plant Hopper" };
    }
    if (q.includes("تొలిచే పురుగు") || q.includes("కాండం తొలిచే") || q.includes("तना छेदक") || q.includes("stem borer") || q.includes("borer")) {
      return { crop: "Paddy", problem: "Stem Borer" };
    }
    if (q.includes("ఆకు మచ్చ") || q.includes("అగ్గి తెగులు") || q.includes("blast")) {
      return { crop: "Paddy", problem: "Rice Blast" };
    }
    return { crop: "Paddy", problem: "Unknown" };
  }

  // --- Cotton Local Rule Mapping Patterns ---
  if (q.includes("పత్తి") || q.includes("కపాస్") || q.includes("cotton") || q.includes("धान की फसल")) {
    if (q.includes("తెల్ల పురుగు") || q.includes("తెల్లదోమ") || q.includes("whitefly") || q.includes("सफेद मक्खी")) {
      return { crop: "Cotton", problem: "Whitefly" };
    }
    if (q.includes("పేను పురుగు") || q.includes("aphid")) {
      return { crop: "Cotton", problem: "Aphid" };
    }
    if (q.includes("గులాబీ రంగు") || q.includes("pink bollworm")) {
      return { crop: "Cotton", problem: "Pink Bollworm" };
    }
    return { crop: "Cotton", problem: "Unknown" };
  }

  // --- Vegetables Local Rule Mapping Patterns ---
  if (q.includes("టమోటా") || q.includes("కూరగాయలు") || q.includes("vegetable") || q.includes("tomato")) {
    if (q.includes("పురుగు") || q.includes("caterpillar") || q.includes("borer")) {
      return { crop: "Vegetables", problem: "Caterpillars" };
    }
  }

  return { crop: "Unknown", problem: "Unknown" };
}