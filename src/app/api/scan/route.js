import { GoogleGenerativeAI } from "@google/generative-ai";
import { exec } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

// Retrieve API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  let tempFilePath = "";
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    
    if (!file) {
      return Response.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save image to a temporary path
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `scan_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`);
    await fs.promises.writeFile(tempFilePath, buffer);
    
    // Load knowledge database
    const knowledgePath = path.join(process.cwd(), "src", "knowledge", "knowledge_db.json");
    let knowledgeDb = { diseases: {}, products: {} };
    if (fs.existsSync(knowledgePath)) {
      knowledgeDb = JSON.parse(fs.readFileSync(knowledgePath, "utf-8"));
    }
    
    // 1. Run local PyTorch hierarchical prediction
    let localResult = { local_model_available: false };
    try {
      const predictScript = path.join(process.cwd(), "inference", "predict.py");
      // Use python to execute predict.py
      const { stdout } = await execAsync(`python "${predictScript}" "${tempFilePath}"`);
      localResult = JSON.parse(stdout.trim());
    } catch (err) {
      console.warn("Local model inference failed or skipped:", err.message);
    }
    
    let prediction = null;
    
    // 2. Determine if we use local prediction or fall back to Gemini API
    if (localResult.local_model_available) {
      console.log("Using Local PyTorch Model prediction:", localResult);
      prediction = {
        crop: localResult.crop, // "Paddy" or "Vegetables"
        sub_crop: localResult.sub_crop, // "paddy", "tomato", "pepper", "potato"
        status: localResult.status, // "healthy" or "diseased"
        issue: localResult.status === "healthy" ? "Healthy" : localResult.disease,
        confidence: localResult.status === "healthy" ? localResult.healthy_confidence : localResult.disease_confidence,
        severity: localResult.status === "healthy" ? "No disease detected." : "Moderate (45%)",
        explanation: localResult.status === "healthy" ? "Healthy crop. No pesticide recommendation required." : "Foliar infection identified. Apply target treatment."
      };
      
      // Calculate dynamic severity based on disease confidence if diseased
      if (localResult.status === "diseased") {
        const conf = localResult.disease_confidence || 80;
        if (conf > 85) {
          prediction.severity = "Severe (75%)";
        } else if (conf > 65) {
          prediction.severity = "Moderate (45%)";
        } else {
          prediction.severity = "Low (20%)";
        }
      }
    } else {
      console.log("No local model weights, or crop is Untrained (e.g. Cotton). Falling back to Gemini Multimodal API.");
      if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
      }
      
      // Convert image buffer to base64 for Gemini
      const base64Image = buffer.toString("base64");
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `
        You are an expert plant pathologist. Inspect this leaf image.
        Identify the crop (must be "Paddy", "Cotton", or "Vegetables") and the disease/pest name in English.
        If the leaf is healthy, specify the issue as "Healthy".
        
        Return strictly a JSON structure containing:
        1. "crop": "Paddy" | "Cotton" | "Vegetables"
        2. "issue": Name of disease, pest, or "Healthy" (e.g. "Brown Plant Hopper", "Stem Borer", "Whitefly", "Bollworms", "Early Blight", "Late Blight", "Bacterial Spot", "Healthy")
        3. "confidence": Integer percentage 1-100
        4. "severity": Severity rating (e.g. "Low (10%)", "Moderate (45%)", "Severe (75%)")
        5. "explanation": 1-2 sentence advice.
      `;
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: file.type || "image/jpeg"
        }
      };
      
      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text();
      
      // Safe JSON cleaning and parsing
      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedGemini = JSON.parse(jsonStr);
      
      prediction = {
        crop: parsedGemini.crop,
        sub_crop: parsedGemini.crop.toLowerCase(),
        status: parsedGemini.issue.toLowerCase() === "healthy" ? "healthy" : "diseased",
        issue: parsedGemini.issue,
        confidence: parsedGemini.confidence || 90,
        severity: parsedGemini.issue.toLowerCase() === "healthy" ? "No disease detected." : (parsedGemini.severity || "Moderate (40%)"),
        explanation: parsedGemini.explanation || ""
      };
    }
    
    // 3. Look up details in the compiled agricultural database
    const cropKey = prediction.crop.toLowerCase();
    const issueName = prediction.issue.toLowerCase();
    
    let report = {
      success: true,
      crop: prediction.crop,
      issue: prediction.issue,
      confidence: prediction.confidence,
      severity: prediction.severity,
      explanation: prediction.explanation,
      affectedArea: "0%",
      symptoms: [],
      reason: "No disease pathogens detected on the leaf tissue.",
      preventiveMeasures: [],
      recommendedProducts: [],
      recommendedProductIds: []
    };
    
    if (prediction.status === "healthy") {
      // Return healthy structure directly. Do not recommend products.
      report.issue = "Healthy Crop";
      report.severity = "No disease detected.";
      report.explanation = "Healthy crop. No pesticide recommendation required.";
      return Response.json(report);
    }
    
    // Calculate dynamic affected area based on confidence
    const affectedPercent = Math.min(95, Math.max(5, Math.floor((100 - prediction.confidence) * 0.4 + 10)));
    report.affectedArea = `${affectedPercent}%`;
    
    // Find matching disease key in knowledge base
    let matchedDiseaseKey = null;
    const diseaseKeys = Object.keys(knowledgeDb.diseases);
    
    // Fuzzy matching: check which key matches the crop and contains the most keywords of the issue
    let maxMatchScore = 0;
    const issueWords = issueName.split(/[^a-z0-9]/).filter(w => w.length > 2);
    
    for (const dKey of diseaseKeys) {
      if (dKey.startsWith(cropKey) || (cropKey === "vegetables" && (dKey.startsWith("tomato") || dKey.startsWith("pepper") || dKey.startsWith("potato")))) {
        let score = 0;
        for (const w of issueWords) {
          if (dKey.includes(w)) score += 1;
        }
        // Extra point if exact subcrop matches
        if (prediction.sub_crop && dKey.startsWith(prediction.sub_crop)) {
          score += 2;
        }
        if (score > maxMatchScore) {
          maxMatchScore = score;
          matchedDiseaseKey = dKey;
        }
      }
    }
    
    // Direct fallback fuzzy lookup in case crop matches aren't perfect
    if (!matchedDiseaseKey) {
      for (const dKey of diseaseKeys) {
        if (dKey.includes(issueName) || issueName.includes(dKey.split("_").slice(1).join(" "))) {
          matchedDiseaseKey = dKey;
          break;
        }
      }
    }
    
    if (matchedDiseaseKey && knowledgeDb.diseases[matchedDiseaseKey]) {
      const diseaseData = knowledgeDb.diseases[matchedDiseaseKey];
      report.issue = diseaseData.disease;
      report.symptoms = diseaseData.symptoms;
      report.reason = diseaseData.cause;
      report.preventiveMeasures = diseaseData.preventive_measures;
      
      // Look up products details
      const recProducts = diseaseData.products || [];
      const productIds = [];
      const productDetails = [];
      
      for (const pName of recProducts) {
        const upperPName = pName.trim().toUpperCase();
        if (knowledgeDb.products[upperPName]) {
          const prodInfo = knowledgeDb.products[upperPName];
          productIds.push(prodInfo.id);
          
          productDetails.push({
            id: prodInfo.id,
            name: prodInfo.name,
            price: getProductPrice(prodInfo.id),
            image: prodInfo.image_path,
            category: prodInfo.category,
            technical: prodInfo.technical_composition,
            dosage: prodInfo.dosage,
            suitableCrops: Array.isArray(prodInfo.suitable_crops) ? prodInfo.suitable_crops.join(", ") : prodInfo.suitable_crops,
            targetPest: prodInfo.target_pest,
            applicationMethod: prodInfo.application_method,
            advantages: Array.isArray(prodInfo.advantages) ? prodInfo.advantages.join(". ") : prodInfo.advantages,
            description: prodInfo.additional_notes
          });
        }
      }
      
      report.recommendedProducts = productDetails;
      report.recommendedProductIds = productIds;
    } else {
      // Generic fallback if disease not in our guide
      report.symptoms = ["Leaf spot and yellowing", "Signs of early stage stress"];
      report.reason = `Infection caused by crop pathogen: ${prediction.issue}.`;
      report.preventiveMeasures = ["Isolate infected plants", "Ensure proper sanitation", "Maintain adequate drainage"];
      report.recommendedProductIds = ["expel-r"];
      
      // Load expel-r details
      if (knowledgeDb.products["EXPEL-R"]) {
        const prodInfo = knowledgeDb.products["EXPEL-R"];
        report.recommendedProducts = [{
          id: prodInfo.id,
          name: prodInfo.name,
          price: 549,
          image: prodInfo.image_path,
          category: prodInfo.category,
          technical: prodInfo.technical_composition,
          dosage: prodInfo.dosage,
          suitableCrops: prodInfo.suitable_crops.join(", "),
          targetPest: prodInfo.target_pest,
          applicationMethod: prodInfo.application_method,
          advantages: prodInfo.advantages.join(". "),
          description: prodInfo.additional_notes
        }];
      }
    }
    
    // Clean up temporary image file
    if (fs.existsSync(tempFilePath)) {
      await fs.promises.unlink(tempFilePath);
    }
    
    return Response.json(report);
    
  } catch (error) {
    console.error("Scan route error:", error);
    
    // Clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch (e) {}
    }
    
    return Response.json({
      success: false,
      error: error.message || "An unexpected error occurred during image sequencing."
    }, { status: 500 });
  }
}

// Helper to retrieve static prices
function getProductPrice(id) {
  const prices = {
    "expel-r": 549,
    "dodger": 749,
    "pixel-sensa": 949,
    "pixel-4d": 899,
    "extend": 549,
    "maxcott": 799,
    "flora": 499,
    "builder": 599,
    "probion": 449,
    "k-mate": 399,
    "lamigo": 849,
    "aimer": 999,
    "pure-auxin": 499,
    "karbac": 399
  };
  return prices[id] || 499;
}