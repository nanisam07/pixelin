export interface TimelineCard {
  crop: "paddy" | "cotton" | "vegetables";
  stage: string;
  das: string;
  months: string;
  pestOrProduct: string;
  symptoms: string;
  prevention: string;
  recommendedProduct: string;
}

export interface PestLifecycle {
  name: string;
  teluguName: string;
  crop: "paddy" | "cotton" | "vegetables";
  timeline: string;
  symptoms: string[];
  prevention: string[];
  details: string;
}

export const seasonalAdvisories: TimelineCard[] = [
  // --- COTTON TIMELINE ---
  {
    crop: "cotton",
    stage: "Seedling to Early Vegetative",
    das: "0–45 DAS",
    months: "June–August",
    pestOrProduct: "Thrips (పై ముడత కೀటకం)",
    symptoms: "Leaves curl upward (Pai Mudatha) and show silver or brown patches. Damaged growing tips cause abnormal branching.",
    prevention: "Deter early sucking pests. Maintain adequate soil moisture during seedling stage. Spray Extend (bio-stimulant) early.",
    recommendedProduct: "PIXEL 4D / EXTEND"
  },
  {
    crop: "cotton",
    stage: "Active Vegetative",
    das: "20–60 DAS",
    months: "July–August",
    pestOrProduct: "Aphids (పేను పురుగు / తేనె పురుగు)",
    symptoms: "Leaves curl downward (Kinda Mudatha) and look sticky due to honeydew. Black sooty mould grows, blocking sunlight.",
    prevention: "Avoid excess Nitrogen fertilizer which attracts aphids. Maintain field border sanitation.",
    recommendedProduct: "MAXCOTT"
  },
  {
    crop: "cotton",
    stage: "Vegetative to Flowering",
    das: "30–90 DAS",
    months: "July–September",
    pestOrProduct: "Jassids (ఆకు కాలు పురుగు)",
    symptoms: "Leaves turn yellow, then brick red, and finally brown and drop. Known as Hopper Burn.",
    prevention: "Monitor field edges closely. Spray immediately when yellowing starts at leaf margins.",
    recommendedProduct: "MAXCOTT"
  },
  {
    crop: "cotton",
    stage: "Flowering Start",
    das: "50–70 DAS",
    months: "September",
    pestOrProduct: "Spotted Bollworm (మచ్చల పురుగు)",
    symptoms: "Caterpillar bores into tender growing tips, causing them to wilt and droop (Movvu Kullu). Attacks young squares.",
    prevention: "Install pheromone traps. Avoid continuous chemical pesticide spraying to maintain natural predators.",
    recommendedProduct: "EXPEL-R / AIMER"
  },
  {
    crop: "cotton",
    stage: "Boll Development",
    das: "60–100 DAS",
    months: "September–October",
    pestOrProduct: "American Bollworm (ಕಾಯ ತೊಲುಚು ಪುರುಗು)",
    symptoms: "Caterpillar sits half-inside bolls eating seeds and fibers. Bolls rot, turn brown and fall early.",
    prevention: "Spray biological controllers during peak flowering. Rotate chemical groups to prevent resistance.",
    recommendedProduct: "EXPEL-R / LAMIGO"
  },
  {
    crop: "cotton",
    stage: "Boll Maturation",
    das: "90–150 DAS",
    months: "October–November",
    pestOrProduct: "Pink Bollworm (గులాబీ పురుగు)",
    symptoms: "Rosette flowers (deformed, half-open). Caterpillars feed hidden inside mature bolls, staining cotton fibers.",
    prevention: "Deep summer plowing. Destroy leftover crop stubble to prevent overwintering pupae.",
    recommendedProduct: "EXPEL-R"
  },

  // --- PADDY TIMELINE ---
  {
    crop: "paddy",
    stage: "Nursery & Transplanting",
    das: "0–25 DAS",
    months: "June–July",
    pestOrProduct: "Root Establishment",
    symptoms: "Slow transplant recovery, weak root system, poor tillering.",
    prevention: "Apply Humic / Fulvic acid mixes in nursery or at transplanting to boost root mass.",
    recommendedProduct: "KARBAC / PURE AUXIN"
  },
  {
    crop: "paddy",
    stage: "Early Vegetative",
    das: "20–45 DAS",
    months: "July–August",
    pestOrProduct: "Stem Borer & Leaf Folder",
    symptoms: "Dead hearts (stem borer larvae drying main shoot). Folded leaves with white papery streaks (leaf folder).",
    prevention: "Incorporate systemic granule insecticides. Clip leaf tips during transplanting to destroy egg masses.",
    recommendedProduct: "EXPEL-R / LAMIGO / AIMER"
  },
  {
    crop: "paddy",
    stage: "Panicle Initiation",
    das: "50–70 DAS",
    months: "September",
    pestOrProduct: "Reproductive Stage Support",
    symptoms: "Uneven flowering, lower grain set, crop stress from temperature drops.",
    prevention: "Provide amino acid foliar sprays to optimize cell division and uniform panicle emergence.",
    recommendedProduct: "FLORA / PROBION"
  },
  {
    crop: "paddy",
    stage: "Booting to Heading",
    das: "70–90 DAS",
    months: "September–October",
    pestOrProduct: "Neck Blast & Sheath Blight",
    symptoms: "Neck blast shows dark lesions at panicle base, causing heads to break. Sheath blight shows snake-skin like lesions on stem.",
    prevention: "Avoid excessive nitrogen application. Apply preventative systemic fungicides before head emergence.",
    recommendedProduct: "PIXEL SENSA / TRIKOZE"
  },
  {
    crop: "paddy",
    stage: "Grain Filling",
    das: "80–110 DAS",
    months: "October",
    pestOrProduct: "Brown Plant Hopper (BPH - సుడి దోమ)",
    symptoms: "Sudden drying up of crop patches, starting from the center of the field, resembling fire damage (Hopper Burn).",
    prevention: "Ensure proper spacing (forming paths every 2-3 meters for aeration). Spray systemic anti-hoppers at the base.",
    recommendedProduct: "PIX-ARCHER / PIXEL DODGER"
  },

  // --- VEGETABLES TIMELINE ---
  {
    crop: "vegetables",
    stage: "Early Vegetative",
    das: "15–40 DAS",
    months: "July–August",
    pestOrProduct: "Seedling vigor & Stress recovery",
    symptoms: "Stunted growth, pale green leaves, poor lateral branch development.",
    prevention: "Foliar application of pre-digested L-amino acids to bypass plant synthesis.",
    recommendedProduct: "PROBION"
  },
  {
    crop: "vegetables",
    stage: "Pre-Flowering",
    das: "30–50 DAS",
    months: "August–September",
    pestOrProduct: "Flower bud initiation",
    symptoms: "Premature bud drop, flowers falling off due to temperature spikes or nutritional gaps.",
    prevention: "Apply trace minerals (Mg, Zn, B, P) to reinforce cellular walls before flowering.",
    recommendedProduct: "BUILDER"
  },
  {
    crop: "vegetables",
    stage: "Fruit Setting",
    das: "45–80 DAS",
    months: "September–October",
    pestOrProduct: "Fruit Set Booster",
    symptoms: "High flower drop rate in Tomato/Chilli. Small, deformed fruits or blossom end rot.",
    prevention: "Spray hormone regulating stimulators to prevent blossom drop and encourage uniform sizes.",
    recommendedProduct: "FLORA"
  },
  {
    crop: "vegetables",
    stage: "Fruit Harvesting",
    das: "60–120 DAS",
    months: "October–November",
    pestOrProduct: "Fruit Borer & caterpillars",
    symptoms: "Holes in tomato fruits, internal rotting, chewing marks on leaves.",
    prevention: "Deploy pheromone traps. Rotate biological and chemical sprays to prevent chewing pest damage.",
    recommendedProduct: "LAMIGO / EXPEL-R"
  }
];

export const pestLifecycles: PestLifecycle[] = [
  {
    name: "Whitefly",
    teluguName: "తెల్ల పురుగు",
    crop: "cotton",
    timeline: "30–120 DAS (Flowering & Boll Development)",
    symptoms: [
      "Yellowing and weakening of leaves",
      "Sooty mold growth due to honeydew secretion",
      "Spread of Cotton Leaf Curl Virus (ఆకు ముడత వ్యాధి)"
    ],
    prevention: [
      "Avoid excessive nitrogen fertilizers",
      "Use yellow sticky traps",
      "Apply Pixel 4D or Maxcott at initial infestation"
    ],
    details: "Whiteflies are tiny sucking insects that gather in thousands under the leaves. They weaken the plant and spread viruses with no chemical cure."
  },
  {
    name: "Thrips",
    teluguName: "పై ముడత కೀಟకం",
    crop: "cotton",
    timeline: "0–45 DAS (Seedling to Vegetative)",
    symptoms: [
      "Leaves curl upward (Pai Mudatha)",
      "Silver-white streaks on the underside of leaves",
      "Damaged growing tip leading to abnormal branches"
    ],
    prevention: [
      "Maintain proper field humidity",
      "Apply early foliar bio-protectors",
      "Deploy Pixel 4D or Extend at 0-30 DAS"
    ],
    details: "Thrips scrape the tender plant tissue and suck sap, causing upward leaf curling and delaying crop establishment."
  },
  {
    name: "Pink Bollworm",
    teluguName: "గులాబీ పురుగు",
    crop: "cotton",
    timeline: "90–150 DAS (Boll Maturation)",
    symptoms: [
      "Deformed, half-opened flowers (Rosette Flowers)",
      "Internal feeding inside bolls, hollowed seeds",
      "Stained, low-grade cotton fibers"
    ],
    prevention: [
      "Deep summer plowing to expose pupae",
      "Avoid extending the cotton season beyond January",
      "Spray Expel-R at early square formation to repel moths"
    ],
    details: "The pink bollworm larva lives completely inside the cotton boll, making it immune to contact chemical sprays. Prevention and early bio-stimulants are key."
  },
  {
    name: "Brown Plant Hopper",
    teluguName: "సుడి దోമ (BPH)",
    crop: "paddy",
    timeline: "80–110 DAS (Grain Filling)",
    symptoms: [
      "Rapid yellowing and drying of leaves",
      "Circular patches of dried crop ('Hopper Burn')",
      "Presence of hoppers at the base of rice stems"
    ],
    prevention: [
      "Provide proper row spacing / ventilation paths",
      "Drain water from field for a few days to disrupt lifecycle",
      "Spray Pixel Dodger or Pix-Archer directly to the stem base"
    ],
    details: "BPH feeds on the sap of rice stems. In warm, humid conditions, their populations explode, causing entire patches to dry out in a few days."
  }
];

export function queryKnowledgeEngine(query: string): any {
  const q = query.toLowerCase();

  // Try to match a pest
  const matchedPest = pestLifecycles.find(
    p => q.includes(p.name.toLowerCase()) || q.includes(p.teluguName)
  );

  if (matchedPest) {
    return {
      type: "pest",
      data: matchedPest
    };
  }

  // Try to match a crop timeline
  if (q.includes("paddy") || q.includes("వరి") || q.includes(" धान")) {
    return {
      type: "timeline",
      crop: "paddy",
      data: seasonalAdvisories.filter(a => a.crop === "paddy")
    };
  }
  if (q.includes("cotton") || q.includes("పత్తి") || q.includes("कपास")) {
    return {
      type: "timeline",
      crop: "cotton",
      data: seasonalAdvisories.filter(a => a.crop === "cotton")
    };
  }
  if (q.includes("vegetable") || q.includes("కూరగాయలు") || q.includes("टमाटर") || q.includes("tomato") || q.includes("chilli")) {
    return {
      type: "timeline",
      crop: "vegetables",
      data: seasonalAdvisories.filter(a => a.crop === "vegetables")
    };
  }

  return null;
}
