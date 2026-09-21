"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Camera, FileImage, Loader2, RefreshCw, 
  CheckCircle, Volume2, ShoppingCart, Globe, Award, ShieldAlert, ChevronRight
} from "lucide-react";
import { analyzeCropImage } from "../../services/aiService";
import { useTranslation } from "../../hooks/useTranslation";
import { speakText } from "../../services/speechService";

// Local translations database for common diseases to keep JSON files light
const diseaseTranslations = {
  te: {
    "brown plant hopper": "సుడి దోమ (BPH)",
    "stem borer": "కాండం తొలిచే పురుగు",
    "rice blast": "వరి అగ్గి తెగులు",
    "whitefly": "తెల్లదోమ",
    "aphids": "పేను పురుగు",
    "pink bollworm": "గులాబీ రంగు పురుగు",
    "leaf spot": "ఆకు మచ్చ తెగులు",
    "healthy": "ఆరోగ్యకరమైన ఆకు",
    "sheath blight": "వరి పొద తెగులు",
    "bacterial leaf blight": "బ్యాక్టీరియల్ ఆకు బ్లైట్",
    "false smut": "వరి వెన్ను తెగులు",
    "alternaria": "ఆల్టర్నేరియా తెగులు",
    "grey mildew": "బూడిద తెగులు",
    "boll rot": "కాయ కుళ్ళు తెగులు"
  },
  hi: {
    "brown plant hopper": "ब्राउन प्लांट हॉपर (BPH)",
    "stem borer": "तना छेदक",
    "rice blast": "धान का ब्लास्ट",
    "whitefly": "सफेद मक्खी",
    "aphids": "चेपा (एफिड)",
    "pink bollworm": "गुलाबी सुंडी",
    "leaf spot": "पत्ती धब्बा",
    "healthy": "स्वस्थ पत्ता",
    "sheath blight": "शीथ ब्लाइट",
    "bacterial leaf blight": "जीवाणु पत्ती झुलसा",
    "false smut": "झूठा कंडुआ",
    "alternaria": "अल्टरनेरिया",
    "grey mildew": "ग्रे मिल्ड्यू",
    "boll rot": "बोल सड़न"
  },
  kn: {
    "brown plant hopper": "ಕಂದು ಜಿಗಿ ಹುಳು (BPH)",
    "stem borer": "ಕಾಂಡ ಕೊರಕ",
    "rice blast": "ಭತ್ತದ ಬೆಂಕಿ ರೋಗ",
    "whitefly": "ಬಿಳಿ ನೊಣ",
    "aphids": "ಗಿಡಹೇನು (ಅಫಿಡ್)",
    "pink bollworm": "ಗುಲಾಬಿ ಕಾಯಿ ಕೊರಕ",
    "leaf spot": "ಎಲೆ ಚುಕ್ಕೆ ರೋಗ",
    "healthy": "ಆರೋಗ್ಯಕರ ಎಲೆ",
    "sheath blight": "ಹೊದಿಕೆ ಕರಕಲು ರೋಗ",
    "bacterial leaf blight": "ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಎಲೆ ಒಣಗುವಿಕೆ",
    "false smut": "ಸುಳ್ಳು ಕಾಡಿಗೆ ರೋಗ",
    "alternaria": "ಆಲ್ಟರ್ನೇರಿಯಾ",
    "grey mildew": "ಬೂದು ಬೂಷ್ಟು ರೋಗ",
    "boll rot": "ಕಾಯಿ ಕೊಳೆತ"
  },
  ml: {
    "brown plant hopper": "തവിട്ടു തുളളൻ (BPH)",
    "stem borer": "തണ്ടുതുരപ്പൻ പുഴു",
    "rice blast": "നെല്ലിലെ കുലവാട്ടം",
    "whitefly": "വെള്ളീച്ച",
    "aphids": "ഇലപ്പേൻ (അഫിഡ്)",
    "pink bollworm": "പൂപ്പൽ രോഗം",
    "leaf spot": "ഇലപ്പുള്ളി രോഗം",
    "healthy": "ആരോഗ്യമുള്ള ഇല",
    "sheath blight": "പൊള രോഗം",
    "bacterial leaf blight": "ബാക്ടീരിയൽ ഇലവാട്ടം",
    "false smut": "കരിമ്പൂപ്പൻ രോഗം",
    "alternaria": "ആൾട്ടർനേറിയ",
    "grey mildew": "ചാര പൂപ്പൽ",
    "boll rot": "കായ് ചീയൽ"
  }
};

export default function ScannerCard({ onScanStart, onScanComplete }) {
  const { language, setLanguage, t } = useTranslation();
  const [image, setImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("");
  const [rawScanResult, setRawScanResult] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const statuses = [
    t("scanner.chlorophyll_analysis"),
    t("scanner.pathogen_scanning"),
    t("scanner.database_cross_ref"),
    t("scanner.recommendation_gen"),
  ];

  const getTranslatedIssue = (issue, lang) => {
    const key = issue.toLowerCase();
    if (diseaseTranslations[lang]?.[key]) {
      return diseaseTranslations[lang][key];
    }
    return issue; // Fallback to English
  };

  const simulateScanning = async (file) => {
    setIsScanning(true);
    setRawScanResult(null);
    if (onScanStart) onScanStart();
    setScanProgress(0);
    setScanStatus(statuses[0]);

    const intervalTime = 400; 
    const totalTime = 2000; 
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
    const file = e.target.files?.[0];
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

  // Automatic voice assistant trigger on new scan result or language change
  useEffect(() => {
    if (rawScanResult) {
      triggerVoiceAssistant();
    }
  }, [rawScanResult, language]);

  const triggerVoiceAssistant = () => {
    if (!rawScanResult) return;

    const translatedCrop = t(`contact.${rawScanResult.crop.toLowerCase()}`);
    const translatedIssue = getTranslatedIssue(rawScanResult.issue, language);
    
    // Construct recommended products list speech
    let productsText = "";
    let precautionsText = "";
    
    if (rawScanResult.recommendedProducts && rawScanResult.recommendedProducts.length > 0) {
      if (language === "te") {
        const doseText = rawScanResult.recommendedProducts.map(p => `${p.name} మోతాదు ${p.dosage}`).join(", ");
        productsText = `సిఫార్సు చేసిన ఉత్పత్తులు: ${doseText}. `;
      } else if (language === "hi") {
        const doseText = rawScanResult.recommendedProducts.map(p => `${p.name} खुराक ${p.dosage}`).join(", ");
        productsText = `अनुशंसित उत्पाद: ${doseText}। `;
      } else if (language === "kn") {
        const doseText = rawScanResult.recommendedProducts.map(p => `${p.name} ಪ್ರಮಾಣ ${p.dosage}`).join(", ");
        productsText = `ಶಿಫಾರಸು ಮಾಡಿದ ಉತ್ಪನ್ನಗಳು: ${doseText}. `;
      } else if (language === "ml") {
        const doseText = rawScanResult.recommendedProducts.map(p => `${p.name} അളവ് ${p.dosage}`).join(", ");
        productsText = `ശുപാർശ ചെയ്യുന്ന ഉൽപ്പന്നങ്ങൾ: ${doseText}. `;
      } else {
        const doseText = rawScanResult.recommendedProducts.map(p => `${p.name} dosage is ${p.dosage}`).join(", ");
        productsText = `Recommended products are: ${doseText}. `;
      }
    }
    
    if (rawScanResult.preventiveMeasures && rawScanResult.preventiveMeasures.length > 0) {
      precautionsText = rawScanResult.preventiveMeasures[0];
    }

    let textToSpeak = "";
    switch (language) {
      case "te":
        textToSpeak = `పంట రోగనిర్ధారణ పూర్తయింది. మీ ${translatedCrop} పంటలో ${translatedIssue} సమస్యను గుర్తించాము. నమ్మకమైన స్థాయి: ${rawScanResult.confidence} శాతం. తీవ్రత: ${rawScanResult.severity}. ${productsText} భద్రతా సూచన: ${precautionsText || 'తగిన జాగ్రత్తలు తీసుకోండి'}`;
        break;
      case "hi":
        textToSpeak = `फसल रोग निदान पूरा हो गया है। आपकी ${translatedCrop} की फसल में ${translatedIssue} की समस्या है। आत्मविश्वास: ${rawScanResult.confidence} प्रतिशत। तीव्रता: ${rawScanResult.severity}। ${productsText} सुरक्षा सलाह: ${precautionsText || 'उचित सावधानी बरतें'}`;
        break;
      case "kn":
        textToSpeak = `ಬೆಳೆ ರೋಗನಿರ್ಣಯ ಪೂರ್ಣಗೊಂಡಿದೆ. ನಿಮ್ಮ ${translatedCrop} ಬೆಳೆಯಲ್ಲಿ ${translatedIssue} समस्या ಪತ್ತೆಯಾಗಿದೆ. ವಿಶ್ವಾಸಾರ್ಹತೆ: ${rawScanResult.confidence} ಪ್ರತಿಶತ. ತೀವ್ರತೆ: ${rawScanResult.severity}. ${productsText} ಸುರಕ್ಷತಾ ಸಲಹೆ: ${precautionsText || 'ಸೂಕ್ತ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ'}`;
        break;
      case "ml":
        textToSpeak = `വിള രോഗനിർണയം പൂർത്തിയാക്കി. നിങ്ങളുടെ ${translatedCrop} വിളയിൽ ${translatedIssue} പ്രശ്നം കണ്ടെത്തിയിട്ടുണ്ട്. വിശ്വസ്തത: ${rawScanResult.confidence} ശതമാനം. തീവ്രത: ${rawScanResult.severity}. ${productsText} സുരക്ഷാ നിർദ്ദേശം: ${precautionsText || 'ഉചിതമായ മുൻകരുതലുകൾ എടുക്കുക'}`;
        break;
      default:
        textToSpeak = `Crop diagnosis complete. Your ${translatedCrop} crop has a ${translatedIssue} issue. Confidence is ${rawScanResult.confidence} percent. Severity level is ${rawScanResult.severity}. ${productsText} Safety advice: ${precautionsText || 'Follow clean culture practices.'}`;
        break;
    }

    speakText(textToSpeak, language);
  };

  const resetScanner = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setImage(null);
    setScanProgress(0);
    setScanStatus("");
    setRawScanResult(null);
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
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="crop-image-input" />
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
                onClick={() => fileInputRef.current?.click()}
              >
                <motion.div 
                  className="absolute inset-0 rounded-full border border-green-500/30 scale-100 opacity-60"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <Upload className="w-10 h-10 text-green-400 group-hover:scale-110 transition-transform duration-300" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{t("scanner.upload_title")}</h3>
              <p className="text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
                {t("scanner.upload_desc")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm tracking-wide rounded-xl border border-white/10 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                >
                  <FileImage className="w-4 h-4 text-green-400" /> {t("scanner.select_image")}
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold text-sm tracking-wide rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> {t("scanner.capture_photo")}
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
                    {isScanning ? t("scanner.sequencing_pathogens") : t("scanner.status_complete")}
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
                    {scanStatus || t("scanner.status_complete")}
                  </p>

                  {!isScanning && (
                    <button
                      type="button"
                      onClick={resetScanner}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> {t("scanner.reset_scan")}
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
              <div className="flex flex-wrap items-center bg-black/40 border border-white/10 rounded-xl p-1 gap-1">
                {[
                  { code: "en", name: "English" },
                  { code: "te", name: "తెలుగు" },
                  { code: "hi", name: "हिन्दी" },
                  { code: "kn", name: "ಕನ್ನಡ" },
                  { code: "ml", name: "മലയാളം" }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      language === lang.code
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> 🔊 {t("scanner.listen")}
            </button>
          </div>

          <div className="space-y-6">
            {/* Diagnosis Headers */}
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-green-400 block mb-1">
                {t("scanner.diagnostic_report")}
              </span>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="text-2xl font-black text-white">
                  {t(`contact.${rawScanResult.crop.toLowerCase()}`)}
                </h2>
                <span className="text-md text-red-400 font-bold">
                  — {getTranslatedIssue(rawScanResult.issue, language)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 bg-white/5 border border-white/5 rounded-2xl p-4 text-xs font-label">
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-0.5">{t("scanner.confidence")}</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-yellow-500" />
                    {rawScanResult.confidence}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-0.5">Severity</span>
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    {rawScanResult.severity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-0.5">Affected Area</span>
                  <span className="text-white font-bold block">{rawScanResult.affectedArea || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-0.5">Status</span>
                  <span className="text-green-400 font-bold block capitalize">{rawScanResult.recommendedProducts?.length > 0 ? "Diseased" : "Healthy"}</span>
                </div>
              </div>
            </div>

            {/* Symptoms & Cause */}
            {rawScanResult.symptoms && rawScanResult.symptoms.length > 0 && (
              <div className="space-y-4 font-body text-xs text-gray-300 border-t border-white/5 pt-4">
                <div>
                  <strong className="text-secondary block mb-1.5">Symptoms Identified:</strong>
                  <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-gray-300">
                    {rawScanResult.symptoms.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                {rawScanResult.reason && (
                  <div>
                    <strong className="text-secondary block mb-1.5">Reason / Cause:</strong>
                    <p className="leading-relaxed text-gray-300">{rawScanResult.reason}</p>
                  </div>
                )}
              </div>
            )}

            {/* Preventive Measures */}
            {rawScanResult.preventiveMeasures && rawScanResult.preventiveMeasures.length > 0 && (
              <div className="font-body text-xs text-gray-300 border-t border-white/5 pt-4">
                <strong className="text-secondary block mb-1.5">Preventive Measures / Precautions:</strong>
                <ul className="list-decimal pl-5 space-y-1.5 leading-relaxed text-gray-300">
                  {rawScanResult.preventiveMeasures.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Explanation box */}
            {rawScanResult.explanation && (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-xs font-body text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                <strong className="text-secondary block mb-1">{t("scanner.recommended_action")}:</strong>
                {rawScanResult.explanation}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}