"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, Activity, ShieldAlert, Award, ChevronRight } from "lucide-react";
import BackgroundParticles from "../../components/scanner/BackgroundParticles";
import ScannerCard from "../../components/scanner/ScannerCard";
import ProductRecommendations from "../../components/scanner/ProductRecommendations";
import CartDrawer from "../../components/scanner/CartDrawer";
import { useTranslation } from "../../hooks/useTranslation";

// Local translations database for common diseases to keep JSON files light
const diseaseTranslations = {
  te: {
    "brown plant hopper": "సుడి దోమ (BPH)",
    "stem borer": "కాండం తొలిచే పురుగు",
    "rice blast": "వరి అగ్గి తెగులు",
    "whitefly": "తెల్లదోമ",
    "aphids": "పేను పురుగు",
    "pink bollworm": "గులాబీ రంగు పురుగు",
    "leaf spot": "ఆకు మచ్చ తెగులు",
    "healthy": "ఆరోగ್ಯಕರమైన ఆకు",
    "sheath blight": "వరి పొದ తెగులు",
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

export default function ScannerPage() {
  const { t, language } = useTranslation();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleScanStart = () => {
    setIsScanning(true);
    setScanResult(null);
  };

  const handleScanComplete = (result) => {
    setIsScanning(false);
    setScanResult(result);
  };

  const getTranslatedIssue = (issue, lang) => {
    const key = issue.toLowerCase();
    if (diseaseTranslations[lang]?.[key]) {
      return diseaseTranslations[lang][key];
    }
    return issue;
  };

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const addedProductIds = cart.map((item) => item.id);

  return (
    <div className="min-h-screen bg-darkBg text-white relative overflow-hidden flex flex-col justify-between selection:bg-secondary selection:text-white">
      {/* Bio-network background canvas */}
      <BackgroundParticles />

      {/* --- HEADER NAVBAR --- */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-darkBg/85 backdrop-blur-md px-6 py-4 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs md:text-sm font-label font-bold text-gray-400 hover:text-white transition-colors duration-200 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t("scanner.back_to_home")}</span>
          </Link>
          <span className="h-4 w-[1px] bg-white/10 hidden sm:inline" />
          <Link href="/" className="font-headline font-bold text-lg md:text-xl tracking-tight text-white select-none cursor-pointer">
            Pixelin <span className="text-secondary">Sciences</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Cart Icon in Nav */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5 text-gray-300 hover:text-white" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white font-label font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-darkBg animate-pulse">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-16 space-y-12">
        
        {/* HERO TITLE BLOCK */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 bg-secondary/10">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold">
              {t("scanner.bio_solution_tag")}
            </span>
          </div>

          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300 leading-tight">
            {t("scanner.title")}
          </h1>
          <p className="font-body text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("scanner.subtitle")}
          </p>
        </div>

        {/* WORKSPACE SCANNER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload Scanner Card */}
          <div className="lg:col-span-7 flex justify-center w-full">
            <ScannerCard
              onScanStart={handleScanStart}
              onScanComplete={handleScanComplete}
            />
          </div>

          {/* Right Column: Diagnostic Result / Dynamic Instructions */}
          <div className="lg:col-span-5 h-full flex flex-col">
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div
                  key="analyzing-instructions"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col justify-center items-center text-center h-[350px]"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-6 relative">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-secondary border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <Activity className="w-6 h-6" />
                  </div>
                  <h4 className="font-headline text-lg font-bold text-white mb-2">
                    {t("scanner.sequencing_pathogens")}
                  </h4>
                  <p className="font-body text-gray-400 text-xs max-w-xs leading-relaxed">
                    {t("scanner.sequencing_desc")}
                  </p>
                </motion.div>
              ) : scanResult ? (
                <motion.div
                  key="diagnostic-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-3xl border border-secondary/20 bg-gradient-to-b from-secondary/5 to-transparent p-6 md:p-8 space-y-6 shadow-xl shadow-secondary-dark/5"
                >
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-headline text-lg font-bold text-white">
                        {t("scanner.diagnostic_report")}
                      </h4>
                      <span className="text-[10px] text-gray-500 font-label uppercase tracking-widest">
                        {t("scanner.status_complete")}
                      </span>
                    </div>
                  </div>

                  {/* Scientific Results details */}
                  <div className="space-y-4 font-label">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-gray-400 text-xs uppercase tracking-wider">{t("scanner.target_crop")}</span>
                      <span className="text-white text-sm font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {t(`contact.${scanResult.crop.toLowerCase()}`)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-gray-400 text-xs uppercase tracking-wider">{t("scanner.detected_issue")}</span>
                      <span className="text-accent text-sm font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        {getTranslatedIssue(scanResult.issue, language)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400 text-xs uppercase tracking-wider">{t("scanner.confidence")}</span>
                      <span className="text-white text-sm font-bold flex items-center gap-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        {scanResult.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Summary recommendation message */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-xs font-body text-gray-300 leading-relaxed">
                    <strong className="text-secondary block mb-1">{t("scanner.recommended_action")}:</strong>
                    {scanResult.explanation || "Apply preventative bio-stimulants."}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle-instructions"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col justify-center items-center text-center h-[350px]"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-6">
                    <Activity className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="font-headline text-lg font-bold text-white mb-2">
                    {t("scanner.waiting_input_title")}
                  </h4>
                  <p className="font-body text-gray-400 text-xs max-w-xs leading-relaxed">
                    {t("scanner.waiting_input_desc")}
                  </p>
                  
                  {/* Dynamic checklist */}
                  <div className="mt-6 space-y-2.5 text-left w-full max-w-[240px] mx-auto border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-label">
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span>{t("scanner.supported_crops")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-label">
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span>{t("scanner.supports_hd")}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RECOMMENDATIONS SECTION --- */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="pt-8 border-t border-white/5"
            >
              <ProductRecommendations
                ids={scanResult.recommendedProductIds}
                onAddToCart={handleAddToCart}
                addedProductIds={addedProductIds}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-white/[0.01] px-6 py-6 md:px-12 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-label">
        <p>{t("footer.rights")}</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">{t("footer.main_website")}</Link>
          <span>·</span>
          <a href="#privacy" className="hover:text-white transition-colors cursor-pointer">{t("footer.diagnostic_terms")}</a>
        </div>
      </footer>

      {/* Floating Shopping Cart Trigger (Visible when item exists) */}
      <AnimatePresence>
        {totalCartItems > 0 && (
          <motion.button
            type="button"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 px-6 py-4 bg-secondary text-white border border-secondary-light/30 rounded-full flex items-center gap-3 hover:bg-secondary-light shadow-[0_10px_25px_rgba(82,196,82,0.3)] transition-all cursor-pointer font-label font-bold tracking-wide"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{t("scanner.open_cart")}</span>
            <span className="bg-white text-secondary font-bold text-xs px-2.5 py-1 rounded-full border border-secondary/15 flex items-center justify-center">
              {totalCartItems}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sliding Side Drawer Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}