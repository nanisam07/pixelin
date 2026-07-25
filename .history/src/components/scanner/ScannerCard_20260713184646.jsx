"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Camera, FileImage, Loader2, RefreshCw, 
  CheckCircle, Volume2, ShoppingCart, Globe, AlertCircle 
} from "lucide-react";
import { analyzeCropImage } from "../../services/aiService";
import {
  getTranslation
}
from "../../constants/translations";



// Dynamic mock product catalog definitions referenced inside aiService responses
const localProductCatalog = {
  "expel-r": {
    id: "expel-r",
    name: "Expel-R Insecticide",
    description: "High performance systemic insecticide protecting the primary vascular system from internal stalk borers.",
    instruction: "Apply 2.5ml per Liter of clean water. Spray uniformly across the foliage during early morning or late evening hours."
  },
  "pixel-sensa": {
    id: "pixel-sensa",
    name: "Pixel Sensa Bio-Immunity",
    description: "Broad spectrum bio-stimulant enhancing plant immune response and cell wall resilience against leaf lesions."
  },
  "dodger": {
    id: "dodger",
    name: "Dodger Anti-Fungal Protective",
    description: "Targeted anti-fungal treatment that controls leaf spot spreading and eliminates ongoing spores.",
    instruction: "Mix 3ml per Liter. Ensure complete application over affected leaves. Repeat once every 10 days for optimal recovery."
  }
};

export default function ScannerCard({ onScanStart, onScanComplete }) {
  const [image, setImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("");
  
  // Real-time translation states
  const [rawScanResult, setRawScanResult] = useState(null);
  const [selectedLang, setSelectedLang] = useState("en");
  const [translatedContent, setTranslatedContent] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Cart state management
  const [cart, setCart] = useState([]);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const statuses = [
    "Uploading crop image...",
    "Analyzing leaf chlorophyll distribution...",
    "Scanning for foliar pathogens & lesions...",
    "Cross-referencing crop distress database...",
    "Generating product recommendation matrix...",
  ];

  // Lifecycle hook for fetching existing local language configurations
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem("preferred-language");
      if (storedLanguage) {
        setSelectedLang(storedLanguage);
      }
    }
  }, []);

  // Process translation layers whenever the data payload modifications occur or selector changes
  useEffect(() => {
    if (rawScanResult) {
      processLocalizationPipeline(rawScanResult, selectedLang);
    }
  }, [selectedLang, rawScanResult]);

 const processLocalizationPipeline =
async (
  resultData,
  targetLanguage
) => {
  setIsTranslating(true);

  try {
    const productsList =
      resultData.recommendedProductIds || [];

    const translatedProducts =
      productsList.map((id) => {
        const item =
          localProductCatalog[id];

        if (!item)
          return null;

        return {
          id,
          name:
            getTranslation(
              targetLanguage,
              item.name
            ),

          description:
            getTranslation(
              targetLanguage,
              item.description
            ),

          instruction:
            getTranslation(
              targetLanguage,
              item.instruction
            ),
        };
      });

    setTranslatedContent({
      crop:
        getTranslation(
          targetLanguage,
          resultData.crop
        ),

      issue:
        getTranslation(
          targetLanguage,
          resultData.issue
        ),

      products:
        translatedProducts.filter(Boolean),

      uiHeaders: {
        resultHeader:
          getTranslation(
            targetLanguage,
            "DiagnosticReport"
          ),

        confidenceHeader:
          getTranslation(
            targetLanguage,
            "Confidence"
          ),

        productsHeader:
          getTranslation(
            targetLanguage,
            "Products"
          ),
      },
    });
  } finally {
    setIsTranslating(false);
  }
};

  const simulateScanning = async (file) => {
    setIsScanning(true);
    setRawScanResult(null);
    setTranslatedContent(null);
    if (onScanStart) onScanStart();
    setScanProgress(0);
    setScanStatus(statuses[0]);

    const intervalTime = 500; 
    const totalTime = 2500; 
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const progressPercent = Math.min(100, Math.floor((elapsed / totalTime) * 100));
      setScanProgress(progressPercent);

      const statusIdx = Math.min(
        statuses.length - 1,
        Math.floor((elapsed / totalTime) * statuses.length)
      );
      setScanStatus(statuses[statusIdx]);

      if (elapsed >= totalTime) {
        clearInterval(timer);
      }
    }, intervalTime);

    try {
      const result = await analyzeCropImage(file);
      setIsScanning(false);

      if (!result.success) {
        alert(result.error);
        setImage(null);
        return;
      }

      setRawScanResult(result);
      if (onScanComplete) onScanComplete(result);
    } catch (error) {
      console.error("Scan error:", error);
      setIsScanning(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      simulateScanning(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        simulateScanning(file);
      }
    }
  };

  const changeLanguage = (langCode) => {
    setSelectedLang(langCode);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", langCode);
    }
  };

  const triggerVoiceAssistant = () => {
    if (!translatedContent) return;

    // Terminate any ongoing audio responses to avoid overlap
    window.speechSynthesis.cancel();

    const textToSpeak = `
      ${translatedContent.uiHeaders.resultHeader}. 
      ${translatedContent.crop}. 
      ${translatedContent.issue}. 
      ${translatedContent.uiHeaders.confidenceHeader} ${rawScanResult?.confidence ?? 96} percent.
    `;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Map selecting language identifiers directly to standard regional language dialects
    const voiceLocales = {
      en: "en-US",
      te: "te-IN",
      hi: "hi-IN"
    };

    utterance.lang = voiceLocales[selectedLang] || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleAddToCart = (productId) => {
    if (!cart.includes(productId)) {
      setCart((prev) => [...prev, productId]);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setScanProgress(0);
    setScanStatus("");
    setRawScanResult(null);
    setTranslatedContent(null);
    if (onScanComplete) onScanComplete(null);
  };

  return (
    <div className="w-full text-white space-y-6">
      <div
        className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border transition-all duration-500 shadow-2xl p-6 md:p-8 ${
          dragActive
            ? "border-green-500 bg-green-500/5 shadow-green-500/10"
            : "border-white/10 bg-white/5 hover:border-white/20 shadow-black/40"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" capture="environment" id="crop-image-input" />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />

        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div 
                className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white/5 border border-white/10 mb-6 group cursor-pointer hover:border-green-500/50 transition-all duration-300 shadow-lg shadow-black/10" 
                onClick={() => fileInputRef.current.click()}
              >
                <motion.div 
                  className="absolute inset-0 rounded-full border border-green-500/30 scale-100 opacity-60"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <Upload className="w-10 h-10 text-green-400 group-hover:scale-110 transition-transform duration-300" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Upload Crop Leaf Image</h3>
              <p className="text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
                Drag and drop your image here, or select one from your local files or camera.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm tracking-wide rounded-xl border border-white/10 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                >
                  <FileImage className="w-4 h-4 text-green-400" /> Select Image
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current.click()}
                  className="px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold text-sm tracking-wide rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Capture Photo
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview-and-scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[360px] rounded-2xl overflow-hidden border border-white/10 bg-black/30 group">
                <img src={image} alt="Crop preview" className="w-full h-full object-contain" />
                {isScanning && (
                  <>
                    <motion.div
                      className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-green-400 to-transparent z-10 shadow-[0_0_15px_#4ade80]"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(74,222,128,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  </>
                )}
              </div>

              <div className="w-full mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                    {isScanning ? "AI Diagnostics Active" : "Image Staged"}
                  </span>
                  <span className="text-sm text-green-400 font-bold">{scanProgress}%</span>
                </div>

                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ ease: "easeInOut" }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between min-h-[24px]">
                  <p className="text-xs text-gray-300 italic flex items-center gap-2">
                    {isScanning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-green-400" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    )}
                    {scanStatus || "Ready to evaluate crop tissue"}
                  </p>

                  {!isScanning && (
                    <button
                      type="button"
                      onClick={resetScanner}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Scan
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Translation Result Layout */}
      {rawScanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl"
        >
          {/* Controls: Language Selector & Audio Voice Assistant */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-green-400" />
              <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1">
                {[
                  { code: "en", name: "English" },
                  { code: "te", name: "తెలుగు" },
                  { code: "hi", name: "हिन्दी" }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedLang === lang.code
                        ? "bg-green-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={triggerVoiceAssistant}
              disabled={isTranslating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> 🔊 Listen
            </button>
          </div>

          {/* Core Localization Loader Status Overlay */}
          <AnimatePresence mode="wait">
            {isTranslating ? (
              <motion.div
                key="translating-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center space-y-3"
              >
                <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                <p className="text-xs text-gray-400 animate-pulse font-medium">Translating agricultural parameters...</p>
              </motion.div>
            ) : (
              translatedContent && (
                <motion.div
                  key="translation-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Diagnosis Headers */}
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-green-400 block mb-1">
                      {translatedContent.uiHeaders.resultHeader}
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h2 className="text-2xl font-black text-white">{translatedContent.crop}</h2>
                      <span className="text-md text-red-400 font-bold">— {translatedContent.issue}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {translatedContent.uiHeaders.confidenceHeader}: <span className="font-bold text-white">{rawScanResult.confidence}%</span>
                    </p>
                  </div>

                  {/* Recommendation Grid Items Mapping */}
                  {translatedContent.products.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {translatedContent.uiHeaders.productsHeader}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {translatedContent.products.map((product) => (
                          <div
                            key={product.id}
                            className="bg-black/20 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-1">
                              <h5 className="font-bold text-sm text-white">{product.name}</h5>
                              <p className="text-xs text-gray-400 leading-relaxed">{product.description}</p>
                              {product.instruction && (
                                <div className="mt-2 text-[11px] text-green-400/80 bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                                  {product.instruction}
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              className={`w-full py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                                cart.includes(product.id)
                                  ? "bg-green-950/40 border border-green-500/30 text-green-400 pointer-events-none"
                                  : "bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <ShoppingCart className="w-3.5 h-3.5" />
                                {cart.includes(product.id) ? "Added To Cart" : "Add To Cart"}
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}