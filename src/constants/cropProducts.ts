export interface ProductItem {
  id: string;
  name: string;
  category: string;
  stage: string;
  tagline: string;
  desc: string;
  image: string;
  timing?: string;
  targets?: string[];
  crops?: string[];
}

export const cropProducts: Record<string, { target: string; items: ProductItem[] }> = {
  paddy: {
    target: "Medak · Nizamabad · Karimnagar · Warangal · Nalgonda · Kurnool · Kadapa · Krishna · Khammam · East & West Godavari",
    items: [
      {
        id: "pure-auxin",
        name: "PURE AUXIN",
        category: "PGR",
        stage: "Transplanting",
        tagline: "Explosive root growth from day one",
        desc: "Formulated as a root booster, it promotes vigorous root development during transplanting, ensuring maximum nutrient intake.",
        image: "/product-images/paddy/Auxin.jpeg",
        timing: "Apply at transplanting stage"
      },
      {
        id: "karbac",
        name: "KARBAC",
        category: "Soil Health",
        stage: "Growth Phase",
        tagline: "Restores soil health season after season",
        desc: "Contains Humic acid, Fulvic acid, and Leonardite. Improves soil structure, water retention, and microbial activity.",
        image: "/product-images/paddy/Pixel_Karbac.jpeg",
        timing: "Soil Conditioner"
      },
      {
        id: "expel-r",
        name: "EXPel-R",
        category: "Bio Pest Control",
        stage: "Early / Mid Stage",
        tagline: "Biological. Stops the borer before it enters.",
        desc: "Advanced botanical insect control targeting Stem Borer and Leaf Folder. Highly effective and resistance-proof.",
        image: "/product-images/cotton/Expel-R.jpeg",
        targets: ["Stem Borer", "Leaf Folder"]
      },
      {
        id: "pixel-sensa",
        name: "PIXEL SENSA",
        category: "Fungicide",
        stage: "Booting Stage",
        tagline: "Two deadly diseases. One solution.",
        desc: "Formulation: Picoxystrobin + Tricyclazole 20.33% SC. Synergistic action against rice blast and sheath blight.",
        image: "/product-images/paddy/Pixel_Sena.jpeg",
        targets: ["Rice Blast", "Sheath Blight"],
        timing: "Apply at Booting Stage"
      },
      {
        id: "dodger",
        name: "PIXEL DODGER",
        category: "Insecticide",
        stage: "Infection Window",
        tagline: "Stops feeding in minutes. Eliminates completely.",
        desc: "Formulation: Dinotefuran 15% + Pymetrozine 45% WG. Systemic insecticide targeting sap-feeding pests immediately.",
        image: "/product-images/paddy/Dodger.jpeg",
        targets: ["BPH", "WBPH", "Green Leafhopper"]
      }
    ]
  },
  cotton: {
    target: "Adilabad · Medak · Nalgonda · Mahabubnagar · Kurnool · Krishna · Khammam · Warangal",
    items: [
      {
        id: "pixel-4d",
        name: "PIXEL 4D",
        category: "Insecticide",
        stage: "Vapour Action",
        tagline: "All three threats. One spray.",
        desc: "Formulation: Fipronil 10% + Diafenthiuron 30% WG. Broad-spectrum protection. Vapour action reaches hidden pests under leaves.",
        image: "/product-images/cotton/Pixel4D.jpeg",
        targets: ["Whitefly", "Thrips", "Mites"]
      },
      {
        id: "extend",
        name: "EXTEND",
        category: "Bio Protection",
        stage: "Zero Residue",
        tagline: "Natural protection. Zero residue.",
        desc: "Natural herbal extract biostimulant that deters sucking pests and activates crop defense pathways.",
        image: "/product-images/cotton/Extend.jpeg",
        targets: ["Thrips", "Mites"]
      },
      {
        id: "maxcott",
        name: "MAXCOTT",
        category: "Insecticide + Growth",
        stage: "Dual Action",
        tagline: "Three pests. One spray. Plus growth boost.",
        desc: "Knocks down sucking insects instantly while stimulating lateral branching and greening.",
        image: "/product-images/cotton/Maxcott.jpeg",
        targets: ["Whitefly", "Aphid", "Jassid"]
      },
      {
        id: "flora",
        name: "FLORA",
        category: "Yield Booster",
        stage: "50-100 Days",
        tagline: "More flowers. More bolls. Less square drop.",
        desc: "Hormonal and nutrient formulation that regulates blossom production, preventing square drop and promoting boll development.",
        image: "/product-images/vegetables/Flora.jpeg",
        timing: "Apply 50–100 Days After Sowing"
      },
      {
        id: "expel-r",
        name: "EXPel-R (Bio)",
        category: "Bio Controller",
        stage: "Bollworm Protection",
        tagline: "Biological. Resistance-proof.",
        desc: "Eco-safe botanical insect growth regulator targeting highly resistant bollworm varieties.",
        image: "/product-images/cotton/Expel-R.jpeg",
        targets: ["American", "Spotted", "Pink Bollworm"]
      }
    ]
  },
  vegetables: {
    target: "Medak · Rangareddy · Anatapur · Chittoor · Mahabubnagar · Kadapa · Jangareddygudem",
    items: [
      {
        id: "flora",
        name: "FLORA",
        category: "Yield Booster",
        stage: "Pre-Flowering",
        tagline: "Every dropped flower is income lost. Flora stops the drop.",
        desc: "Specially designed fruit set booster to trigger hormone synthesis and prevent early bud drop.",
        image: "/product-images/vegetables/Flora.jpeg",
        crops: ["Tomato", "Brinjal", "Chilli", "Okra", "Cucumber", "Beans"]
      },
      {
        id: "builder",
        name: "BUILDER",
        category: "Micronutrient",
        stage: "Vegetative / Pre-flowering",
        tagline: "The targeted meal before flowering. Bigger, better fruits.",
        desc: "Balanced multi-micronutrient formulation featuring Magnesium, Zinc, Phosphorus, and Boron to build tissue structural integrity.",
        image: "/product-images/vegetables/Pixel_Builder.jpeg",
        timing: "Mg + Zn + P + B Complex"
      },
      {
        id: "lamigo",
        name: "LAMIGO",
        category: "Insecticide",
        stage: "Rainfast 2 Hours",
        tagline: "10–14 days residual. Rainfast in 2 hours.",
        desc: "Formulation: Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC. Fast acting caterpillar and borer control.",
        image: "/product-images/vegetables/Lamigo.jpeg",
        targets: ["Shoot Borer", "Fruit Borer", "Caterpillars"]
      },
      {
        id: "probion",
        name: "PROBION",
        category: "Biostimulant",
        stage: "All Stages",
        tagline: "Pre-digested nutrition. Stress recovery. Faster growth.",
        desc: "Amino acid complex biostimulant. Helps plants recover from temperature, drought, or herbicide stress quickly.",
        image: "/product-images/vegetables/Probin.jpeg",
        timing: "L-Amino Acids & Organic Peptides"
      },
      {
        id: "k-mate",
        name: "K-MATE",
        category: "Soil Health via Drip",
        stage: "Root Application",
        tagline: "The soil doctor that works through the drip pipe.",
        desc: "Concentrated Potassium Humate designed specifically for drip fertigation. Enhances root mass and unlocks phosphorus.",
        image: "/product-images/vegetables/Pixel_K-Mate.jpeg",
        timing: "Drip / Fertigation System"
      },
      {
        id: "expel-r",
        name: "EXPel-R (Bio)",
        category: "Bio Insecticide",
        stage: "Foliar Spray",
        tagline: "One hole in a tomato = zero price. Expel-R prevents that.",
        desc: "Targeted bio-caterpillar controller designed to eliminate damaging borers and fruit worms from chewing valuable harvest.",
        image: "/product-images/cotton/Expel-R.jpeg",
        targets: ["Caterpillar Complex", "Fruit Chewing Pests"]
      }
    ]
  }
};
