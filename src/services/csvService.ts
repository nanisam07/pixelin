import Papa from "papaparse";

export interface PestRecord {
  crop: "paddy" | "cotton";
  category: string;
  problem: string;
  product: string;
  technical: string;
  dosage: string;
  alsoFits: string;
}

let cachedPaddyData: PestRecord[] = [];
let cachedCottonData: PestRecord[] = [];

// Helper to normalize Paddy solutions CSV row
function parsePaddyRow(row: any): PestRecord | null {
  if (!row.Product || !row["Pest / Disease"]) return null;
  return {
    crop: "paddy",
    category: row.Category || "Insecticide",
    problem: row["Pest / Disease"].trim(),
    product: row.Product.trim(),
    technical: row["Technical composition"] || "",
    dosage: row["Dose / Acre"] || "",
    alsoFits: row["Also fits for"] || ""
  };
}

// Helper to normalize Cotton solutions CSV row
function parseCottonRow(row: any): PestRecord | null {
  const problemName = row["Pest / Disease"];
  const productName = row["Recommended Product"];
  if (!problemName || !productName) return null;
  return {
    crop: "cotton",
    category: problemName.includes("Alternaria") || problemName.includes("Blight") || problemName.includes("Rot") ? "Fungicide" : "Insecticide",
    problem: problemName.trim(),
    product: productName.trim(),
    technical: row["Technical / Target Pest"] || "",
    dosage: row["Base Dosage / Acre"] || "",
    alsoFits: ""
  };
}

export async function fetchPaddyDataset(): Promise<PestRecord[]> {
  if (cachedPaddyData.length > 0) return cachedPaddyData;
  try {
    const res = await fetch("/data/paddy-solutions.csv");
    const text = await res.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    
    // Fill in empty fields caused by merged cells in CSV
    let currentCategory = "";
    let currentProblem = "";

    const records: PestRecord[] = [];
    parsed.data.forEach((row: any) => {
      if (row.Category) currentCategory = row.Category;
      else row.Category = currentCategory;

      if (row["Pest / Disease"]) currentProblem = row["Pest / Disease"];
      else row["Pest / Disease"] = currentProblem;

      const record = parsePaddyRow(row);
      if (record) records.push(record);
    });

    cachedPaddyData = records;
    return records;
  } catch (error) {
    console.error("Error loading paddy dataset:", error);
    return [];
  }
}

export async function fetchCottonDataset(): Promise<PestRecord[]> {
  if (cachedCottonData.length > 0) return cachedCottonData;
  try {
    const res = await fetch("/data/cotton-solutions.csv");
    const text = await res.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

    let currentProblem = "";

    const records: PestRecord[] = [];
    parsed.data.forEach((row: any) => {
      const problemField = row["Pest / Disease"];
      if (problemField && problemField.trim() !== "") {
        currentProblem = problemField;
      } else {
        row["Pest / Disease"] = currentProblem;
      }

      const record = parseCottonRow(row);
      if (record) records.push(record);
    });

    cachedCottonData = records;
    return records;
  } catch (error) {
    console.error("Error loading cotton dataset:", error);
    return [];
  }
}

export async function getRecommendationsFromDatasets(crop: string, problem: string): Promise<PestRecord[]> {
  const normCrop = crop.toLowerCase();
  const records = normCrop.includes("cotton") 
    ? await fetchCottonDataset() 
    : await fetchPaddyDataset();

  if (normCrop.includes("vegetable") || normCrop.includes("tomato") || normCrop.includes("chilli")) {
    // Return empty array for vegetables, handled by guides or static fallback
    return [];
  }

  const normProb = problem.toLowerCase();
  return records.filter(r => {
    const matchProblem = r.problem.toLowerCase().includes(normProb) || normProb.includes(r.problem.toLowerCase());
    const matchAlsoFits = r.alsoFits.toLowerCase().includes(normProb);
    const matchTech = r.technical.toLowerCase().includes(normProb);
    return matchProblem || matchAlsoFits || matchTech;
  });
}
