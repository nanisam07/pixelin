"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import React, { useState, useEffect, useRef } from "react";
import { understandFarmerQuery } from "../services/aiService";
import { speakText } from "../services/speechService";
import { useTranslation } from "../hooks/useTranslation";
import { useAutoLanguageDetection } from "../hooks/useAutoLanguageDetection";
import { cropProducts } from "../constants/cropProducts";
import { Award, ShieldAlert, X, Mic, Camera, MapPin, Phone, Mail } from "lucide-react";

export default function Home() {
  const { language, setLanguage, t } = useTranslation();
  useAutoLanguageDetection();

  // --- States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("paddy");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [isPesticidesAccordionOpen, setIsPesticidesAccordionOpen] = useState(false);
  const [isCropsAccordionOpen, setIsCropsAccordionOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);

  // Recommendations States Setup
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [diagnosis, setDiagnosis] = useState<any | null>(null);

  // Counter States
  const [farmersCount, setFarmersCount] = useState(0);
  const [statesCount, setStatesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ecoPercent, setEcoPercent] = useState(0);
  
  // --- Refs ---
  const rootVideoRef = useRef<HTMLVideoElement>(null);
  const carbonVideoRef = useRef<HTMLVideoElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);

  // --- Speech Recognition ---
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // --- Lang Config mapping for Speech ---
  const speechLocales: Record<string, string> = {
    te: "te-IN",
    hi: "hi-IN",
    en: "en-US",
    kn: "kn-IN",
    ml: "ml-IN"
  };

  // --- Sync Voice Transcript ---
  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
    }
  }, [transcript]);

  // --- Trigger Action When Speech Ends ---
  useEffect(() => {
    if (!listening && transcript.trim().length > 0) {
      handleSearch(transcript);
    }
  }, [listening]);

  const startVoice = () => {
    if (!browserSupportsSpeechRecognition) {
      alert(t("ai_assistant.speech_unsupported"));
      return;
    }
    const locale = speechLocales[language] || "en-US";
    SpeechRecognition.startListening({
      continuous: false,
      language: locale
    });
  };

  // --- Search / Query understanding ---
  const handleSearch = async (customQuery?: string) => {
    const queryToEvaluate = (customQuery || searchQuery || "").trim();
    if (!queryToEvaluate) return;

    const lowerQ = queryToEvaluate.toLowerCase();
    if (
      lowerQ.includes("scan") ||
      lowerQ.includes("disease") ||
      lowerQ.includes("leaf") ||
      lowerQ.includes("crop") ||
      lowerQ.includes("స్కాన్") ||
      lowerQ.includes("తెగులు")
    ) {
      window.location.href = "/scanner";
      return;
    }

    try {
      const ai = await understandFarmerQuery(queryToEvaluate);
      
      // Automatically switch website language if speech query is in a different language
      if (ai.language && ai.language !== language) {
        setLanguage(ai.language);
      }

      setDiagnosis(ai);
      setRecommendations(ai.products || []);

      if (ai.replyText && voiceReply) {
        speakText(ai.replyText, ai.language || language);
      }
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsNavbarScrolled(true);
      } else {
        setIsNavbarScrolled(false);
      }

      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => revealObserver.observe(el));

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch((err) => console.log("Autoplay blocked: ", err));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (rootVideoRef.current) videoObserver.observe(rootVideoRef.current);
    if (carbonVideoRef.current) videoObserver.observe(carbonVideoRef.current);

    let statsAnimated = false;
    const statsObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (impactRef.current) statsObserver.observe(impactRef.current);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealObserver.disconnect();
      videoObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  // --- Stats Counter Logic ---
  const animateStats = () => {
    const duration = 2000;
    const frames = 50;
    const stepTime = duration / frames;

    const targets = { farmers: 500, states: 3, products: 15, eco: 100 };
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / frames;

      setFarmersCount(Math.min(Math.round(targets.farmers * progress), targets.farmers));
      setStatesCount(Math.min(Math.round(targets.states * progress), targets.states));
      setProductsCount(Math.min(Math.round(targets.products * progress), targets.products));
      setEcoPercent(Math.min(Math.round(targets.eco * progress), targets.eco));

      if (currentFrame >= frames) {
        clearInterval(timer);
      }
    }, stepTime);
  };

  const scrollToCategory = (index: number) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const cards = document.querySelectorAll(".category-card");
      if (cards && cards[index]) {
        cards[index].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  const selectCropAndScroll = (cropName: string) => {
    setActiveTab(cropName);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById("crop-solutions");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const phoneInput = target.elements.namedItem("phone") as HTMLInputElement;
    const phone = phoneInput?.value;
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setShowSuccessModal(true);
    target.reset();
  };

  const activePlaceholder = t("hero.search_placeholder");

  return (
    <>
      {/* ==================== HEADER / NAVIGATION ==================== */}
      <nav
        id="navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out px-6 md:px-12 flex justify-between items-center ${
          isNavbarScrolled ? "bg-white text-gray-800 shadow-md py-3" : "bg-transparent text-white py-5"
        }`}
      >
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Pixelin Sciences Logo"
            className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
          />
          <div>
            
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 font-medium">
          <a href="#hero" className="hover:text-accent transition-colors duration-300">
            {t("nav.home")}
          </a>
          <a href="#about" className="hover:text-accent transition-colors duration-300">
            {t("nav.about")}
          </a>

          {/* Products Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-accent transition-colors duration-300 focus:outline-none">
              {t("nav.products")}{" "}
              <i className="fa-solid fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180"></i>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 rounded-xl bg-white shadow-xl py-3 border border-gray-100 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 text-gray-800">
              <a
                href="#products"
                className="block px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200"
              >
                {t("nav.all_categories")}
              </a>
              <div className="h-[1px] bg-gray-100 my-1"></div>
              <button
                onClick={() => scrollToCategory(0)}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                {t("nav.pesticides")}
              </button>
              <button
                onClick={() => scrollToCategory(1)}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                {t("nav.fertilizers")}
              </button>
              <button
                onClick={() => scrollToCategory(2)}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                {t("nav.ipnm_products")}
              </button>
              <button
                onClick={() => scrollToCategory(3)}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                {t("nav.farm_advisory")}
              </button>
            </div>
          </div>

          {/* Crops Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-accent transition-colors duration-300 focus:outline-none">
              {t("nav.crops")}{" "}
              <i className="fa-solid fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180"></i>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 rounded-xl bg-white shadow-xl py-3 border border-gray-100 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 text-gray-800">
              <button
                onClick={() => selectCropAndScroll("paddy")}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                {t("nav.paddy_solutions")}
              </button>
              <button
                onClick={() => selectCropAndScroll("cotton")}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                {t("nav.cotton_solutions")}
              </button>
              <button
                onClick={() => selectCropAndScroll("vegetables")}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                {t("nav.vegetable_solutions")}
              </button>
            </div>
          </div>

          <a href="#sustainability" className="hover:text-accent transition-colors duration-300">
            {t("nav.sustainability")}
          </a>
          <a href="#contact" className="hover:text-accent transition-colors duration-300">
            {t("nav.contact")}
          </a>
        </div>

        {/* Call to Action Button */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="https://wa.me/917673984949"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#25d366] text-white rounded-full font-label font-bold text-sm hover:bg-[#20ba5a] transition-all duration-300 hover:scale-105 shadow-md shadow-[#25d366]/20"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i> +91 76739 84949
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 focus:outline-none cursor-pointer"
          aria-label="Toggle Mobile Menu"
        >
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 right-0 h-screen w-80 bg-darkBg text-white z-50 transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col justify-between py-8 px-6 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Pixelin Sciences Logo" className="h-10 w-auto" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white cursor-pointer"
                aria-label="Close Mobile Menu"
              >
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>

            <div className="flex flex-col gap-5 text-lg font-medium">
              <a
                href="#hero"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-accent transition-colors duration-200"
              >
                {t("nav.home")}
              </a>
              
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-accent transition-colors duration-200"
              >
                {t("nav.about")}
              </a>

              {/* Mobile Accordion: Products */}
              <div>
                <button
                  onClick={() => setIsPesticidesAccordionOpen(!isPesticidesAccordionOpen)}
                  className="flex justify-between items-center w-full hover:text-accent transition-colors duration-200 text-left cursor-pointer"
                >
                  {t("nav.products")}{" "}
                  <i
                    className={`fa-solid fa-chevron-down text-xs ml-2 transition-transform duration-200 ${
                      isPesticidesAccordionOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>
                <div
                  className={`${
                    isPesticidesAccordionOpen ? "flex" : "hidden"
                  } flex-col pl-4 mt-2 gap-2 text-base text-gray-300`}
                >
                  <a
                    href="#products"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-accent"
                  >
                    {t("nav.all_categories")}
                  </a>
                  <button onClick={() => scrollToCategory(0)} className="text-left hover:text-accent cursor-pointer">
                    {t("nav.pesticides")}
                  </button>
                  <button onClick={() => scrollToCategory(1)} className="text-left hover:text-accent cursor-pointer">
                    {t("nav.fertilizers")}
                  </button>
                  <button onClick={() => scrollToCategory(2)} className="text-left hover:text-accent cursor-pointer">
                    {t("nav.ipnm_products")}
                  </button>
                  <button onClick={() => scrollToCategory(3)} className="text-left hover:text-accent cursor-pointer">
                    {t("nav.farm_advisory")}
                  </button>
                </div>
              </div>

              {/* Mobile Accordion: Crops */}
              <div>
                <button
                  onClick={() => setIsCropsAccordionOpen(!isCropsAccordionOpen)}
                  className="flex justify-between items-center w-full hover:text-accent transition-colors duration-200 text-left cursor-pointer"
                >
                  {t("nav.crops")}{" "}
                  <i
                    className={`fa-solid fa-chevron-down text-xs ml-2 transition-transform duration-200 ${
                      isCropsAccordionOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>
                <div
                  className={`${
                    isCropsAccordionOpen ? "flex" : "hidden"
                  } flex-col pl-4 mt-2 gap-2 text-base text-gray-300`}
                >
                  <button onClick={() => selectCropAndScroll("paddy")} className="text-left hover:text-accent cursor-pointer">
                    {t("nav.paddy_solutions")}
                  </button>
                  <button onClick={() => selectCropAndScroll("cotton")} className="text-left hover:text-accent cursor-pointer">
                    {t("nav.cotton_solutions")}
                  </button>
                  <button onClick={() => selectCropAndScroll("vegetables")} className="text-left hover:text-accent cursor-pointer">
                    {t("nav.vegetable_solutions")}
                  </button>
                </div>
              </div>
              <Link
                href="/scanner"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-accent transition-colors duration-200"
              >
                📸 {t("nav.scan_your_crop")}
              </Link>
              <a
                href="#sustainability"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-accent transition-colors duration-200"
              >
                {t("nav.sustainability")}
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-accent transition-colors duration-200"
              >
                {t("nav.contact")}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href="https://wa.me/917673984949"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25d366] text-white rounded-full font-label font-bold text-center hover:bg-[#20ba5a] transition-all duration-300"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i> +91 76739 84949
            </a>
            <div className="text-center text-xs text-gray-500">Developed for safe foods.</div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-500"
          ></div>
        )}
      </nav>

      {/* ==================== SECTION 1: HERO ==================== */}
      <section id="hero" className="relative h-screen overflow-hidden">
        {/* Hero video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,31,77,0.7) 0%, rgba(0,31,77,0.35) 50%, rgba(0,31,77,0.9) 100%)",
            zIndex: 1,
          }}
        ></div>
        
        {/* Hero content container */}
        <div className="relative z-10 h-full w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col justify-center items-center text-center text-white select-none pt-16">
          <p className="eyebrow animate-fade-up font-label text-accent uppercase tracking-widest text-xs md:text-sm lg:text-base font-bold mb-4">
            Pixelin Sciences Pvt Ltd
          </p>
          <h1 className="animate-fade-up delay-1 font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 tracking-tight max-w-5xl">
            {t("hero.title_part1")}
            <br />
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-accent to-[#fff]">
              {t("hero.title_part2")}
            </span>
          </h1>
          <p className="animate-fade-up delay-2 font-body text-gray-200 text-sm md:text-base lg:text-lg max-w-3xl mb-6 leading-relaxed font-light">
            {t("hero.subtitle")}
          </p>

          <div className="animate-fade-up delay-3 w-full max-w-2xl mx-auto flex flex-col items-center">
            {/* Language Selector Above Search Bar */}
            <div className="flex items-center gap-2 mb-3 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs md:text-sm">
              <span className="text-gray-300 flex items-center gap-1">🌐</span>
              <div className="flex gap-3">
                {[
                  { key: "en", label: "English" },
                  { key: "te", label: "తెలుగు" },
                  { key: "hi", label: "हिन्दी" },
                  { key: "kn", label: "ಕನ್ನಡ" },
                  { key: "ml", label: "മലയാളം" }
                ].map((lang) => (
                  <button
                    key={lang.key}
                    onClick={() => setLanguage(lang.key)}
                    className={`transition-colors duration-200 font-medium cursor-pointer ${
                      language === lang.key ? "text-accent font-bold scale-105" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Google-like Modern Search Interface */}
            <div className="w-full bg-white rounded-full shadow-2xl border border-gray-200/80 p-1.5 flex items-center transition-all duration-300 focus-within:ring-4 focus-within:ring-accent/30">
              <div className="pl-4 text-gray-400 flex items-center justify-center">
                <i className="fa-solid fa-magnifying-glass text-base md:text-lg"></i>
              </div>
              <input
                type="text"
                placeholder={activePlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="flex-1 px-3 py-2.5 bg-transparent outline-none text-gray-800 text-sm md:text-base placeholder-gray-400 font-body"
              />

              {/* Action Buttons inside Search bar */}
              <div className="flex items-center gap-1 pr-1">
                {/* Voice Icon Button */}
                <button
                  onClick={startVoice}
                  title="Search by voice"
                  className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    listening ? "bg-red-500 text-white animate-pulse" : "hover:bg-gray-100 text-gray-500 hover:text-primary"
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>

                {/* Camera Scan Icon Button */}
                <Link
                  href="/scanner"
                  title="Scan using camera"
                  className="h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </Link>

                {/* Primary Search Submission Trigger */}
                <button
                  onClick={() => handleSearch()}
                  className="h-9 px-4 md:h-10 md:px-5 rounded-full bg-primary text-white font-label font-bold text-xs md:text-sm hover:bg-primary-dark transition-all duration-200 shadow-sm shadow-primary/20 cursor-pointer"
                >
                  {t("ai_assistant.search_btn")}
                </button>
              </div>
            </div>

            {/* Popular Tags / Searches Matrix */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/90">
              <span className="font-semibold text-white/70">{t("hero.popular_searches")}</span>
              {[
                { label: `🌾 ${t("hero.paddy_disease")}`, val: "Paddy Disease" },
                { label: `🍅 ${t("hero.tomato_wilt")}`, val: "Tomato Wilt" },
                { label: `🐛 ${t("hero.pest_control")}`, val: "Pest Control" },
                { label: `🧪 ${t("hero.fertilizers")}`, val: "Fertilizers" }
              ].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(tag.val);
                    handleSearch(tag.val);
                  }}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5 transition-all duration-200 cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Call To Action Container Setup */}
            <div className="mt-8 flex items-center gap-4">
              <a
                href="#contact"
                className="px-6 py-2.5 border border-white/80 rounded-full text-white font-label font-bold text-sm hover:bg-white hover:text-primary-dark transition-all duration-300 hover:scale-105 shadow-md"
              >
                {t("hero.get_in_touch")}
              </a>
            </div>
          </div>
        </div>

        {/* Decorative scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 text-xs animate-bounce hidden md:flex">
          <span>{t("hero.scroll_down")}</span>
          <i className="fa-solid fa-angle-down text-sm"></i>
        </div>
      </section>

      {/* ==================== AI SEARCH RECOMMENDATIONS LIVE RENDER ADAPTER ==================== */}
      {diagnosis && (
        <section id="recommendations-display" className="py-16 px-6 md:px-12 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-xl bg-gray-50 border border-primary/5 rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                <div>
                  <span className="px-3 py-1 bg-primary text-white text-xs font-label uppercase font-bold rounded-full tracking-wider">
                    {t("ai_assistant.results_header")}
                  </span>
                  <h3 className="font-headline font-bold text-2xl md:text-3xl text-primary-dark mt-2">
                    {t("scanner.target_crop")}: <span className="capitalize text-accent-dark">{t(`contact.${diagnosis.crop.toLowerCase()}`)}</span> 
                    {diagnosis.problem && ` · ${t("scanner.detected_issue")}: ${diagnosis.problem}`}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-label">
                    <p className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      {t("scanner.confidence")}: <span>{diagnosis.confidence}%</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      Severity: <span>{diagnosis.severity}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (diagnosis.replyText) {
                        speakText(diagnosis.replyText, language);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-label font-bold text-xs uppercase tracking-wide cursor-pointer transition-colors"
                  >
                    🔊 {t("scanner.listen")}
                  </button>

                  <button
                    onClick={() => {
                      setDiagnosis(null);
                      setRecommendations([]);
                    }}
                    className="px-3 py-2 text-xs text-gray-500 hover:text-gray-900 border border-gray-300 rounded-lg cursor-pointer transition-all"
                  >
                    {t("ai_assistant.clear_results")} ×
                  </button>
                </div>
              </div>

              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((prod, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <span className="px-2.5 py-1 bg-amber-50 border border-accent/20 text-accent-dark font-label font-bold text-xs uppercase rounded">
                            {prod.category}
                          </span>
                          <span className="text-xs text-gray-400 font-label">{t("scanner.dosage")}: {prod.dosage || prod.dosageAcre}</span>
                        </div>
                        <h4 className="font-headline font-bold text-xl text-primary-dark mb-1">{prod.product || prod.name}</h4>
                        <p className="font-body text-xs text-gray-500 mb-3 italic">"{prod.tagline || 'Targeted Formulation'}"</p>
                        <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">{prod.technical || prod.desc}</p>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        {prod.alsoFits && (
                          <div className="mb-2">
                            <span className="text-xs font-bold text-primary block uppercase font-label mb-1">Also fits for:</span>
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{prod.alsoFits}</span>
                          </div>
                        )}
                        {prod.timing && (
                          <span className="text-xs font-bold text-primary flex items-center gap-1 uppercase font-label">
                            <i className="fa-solid fa-circle-info text-[10px] text-accent"></i> {prod.timing}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-200">
                  <p className="font-body text-gray-500 text-sm">
                    {t("ai_assistant.no_results")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==================== SECTION 3: ABOUT US ==================== */}
      <section id="about" className="py-24 px-6 md:px-12 bg-lightBg relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            {/* Text Column */}
            <div className="lg:col-span-7 reveal">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-[2px] w-8 bg-primary"></span>
                <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                  {t("about.about_eyebrow")}
                </span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark mb-6 leading-tight">
                {t("about.welcome_title")}
              </h2>
              <p className="font-body text-gray-700 text-sm md:text-base leading-relaxed mb-6 font-light">
                {t("about.para1")}
              </p>
              <p className="font-body text-gray-700 text-sm md:text-base leading-relaxed mb-8 font-light">
                {t("about.para2")}
              </p>
              <div className="border-l-4 border-accent pl-5 py-1 italic text-gray-600 text-sm md:text-base mb-8">
                "{t("about.quote")}"
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-primary font-label font-bold border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-all duration-300"
              >
                {t("about.learn_more")} <i className="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>

            {/* Video Column */}
            <div className="lg:col-span-5 reveal">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <video
                  ref={rootVideoRef}
                  id="root-video"
                  muted
                  playsInline
                  className="w-full h-auto object-cover rounded-xl bg-darkBg"
                >
                  <source src="/assets/root-journey.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
                <div className="absolute bottom-4 left-4 glass-card px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span>{t("about.root_video")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="reveal p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-muted flex items-center justify-center text-primary text-xl">
                <i className="fa-solid fa-award"></i>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary-dark mb-1">
                  {t("about.certified_title")}
                </h3>
                <p className="font-body text-sm text-gray-500">{t("about.certified_desc")}</p>
              </div>
            </div>

            <div className="reveal p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center text-accent text-xl">
                <i className="fa-solid fa-users-gear"></i>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary-dark mb-1">
                  {t("about.empowering_title")}
                </h3>
                <p className="font-body text-sm text-gray-500">
                  {t("about.empowering_desc")}
                </p>
              </div>
            </div>

            <div className="reveal p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-muted flex items-center justify-center text-primary text-xl">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary-dark mb-1">
                  {t("about.protecting_title")}
                </h3>
                <p className="font-body text-sm text-gray-500">
                  {t("about.protecting_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: PRODUCTS ==================== */}
      <section id="products" className="relative py-24 bg-darkBg text-white overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.08,
            zIndex: 0,
          }}
        >
          <source src="/assets/molecular.mp4" type="video/mp4" />
        </video>

        <div style={{ position: "relative", zIndex: 1 }} className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="text-center mb-16 reveal">
            <p className="font-label text-accent uppercase tracking-widest text-xs font-bold mb-3">
              {t("nav.products")}
            </p>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl mx-auto leading-tight text-white mb-6">
              {t("about.quote")}
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          {/* 4 Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Pesticides */}
            <div className="category-card reveal glass-card-dark rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-t-4 border-primary flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light text-2xl mb-6">
                  <i className="fa-solid fa-spray-can-sparkles"></i>
                </div>
                <h3 className="font-headline font-bold text-xl mb-4">{t("nav.pesticides")}</h3>
                <ul className="font-body text-sm text-gray-300 space-y-2 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Insecticides
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Fungicides
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Herbicides
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Plant Growth Regulators (PGR)
                  </li>
                </ul>
              </div>
              <a
                href="#crop-solutions"
                className="text-accent hover:text-accent-light font-label text-xs uppercase font-bold tracking-wider flex items-center gap-1"
              >
                View Solutions <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </a>
            </div>

            {/* Card 2: Fertilizers */}
            <div className="category-card reveal glass-card-dark rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-t-4 border-primary flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-white text-2xl mb-6">
                  <i className="fa-solid fa-wheat-awn"></i>
                </div>
                <h3 className="font-headline font-bold text-xl mb-4">{t("nav.fertilizers")}</h3>
                <p className="font-body text-sm text-gray-300 mb-4 leading-relaxed">
                  We offer diverse fertilizer selections to enrich soil fertility and provide critical nutrients.
                </p>
              </div>
              <a
                href="#crop-solutions"
                className="text-accent hover:text-accent-light font-label text-xs uppercase font-bold tracking-wider flex items-center gap-1"
              >
                View Solutions <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </a>
            </div>

            {/* Card 3: IPNM Products */}
            <div className="category-card reveal glass-card-dark rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-t-4 border-primary flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light text-2xl mb-6">
                  <i className="fa-solid fa-seedling"></i>
                </div>
                <h3 className="font-headline font-bold text-xl mb-4">{t("nav.ipnm_products")}</h3>
                <p className="font-body text-sm text-gray-300 mb-8 leading-relaxed">
                  Integrated Pest & Nutrient Management formulations combining biology and chemistry to enhance crop defense networks naturally.
                </p>
              </div>
              <a
                href="#crop-solutions"
                className="text-accent hover:text-accent-light font-label text-xs uppercase font-bold tracking-wider flex items-center gap-1"
              >
                View Solutions <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </a>
            </div>

            {/* Card 4: Farm Advisory */}
            <div className="category-card reveal glass-card-dark rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-t-4 border-accent flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-2xl mb-6">
                  <i className="fa-solid fa-phone-volume"></i>
                </div>
                <h3 className="font-headline font-bold text-xl mb-4 text-accent">{t("nav.farm_advisory")}</h3>
                <p className="font-body text-sm text-gray-300 mb-6 leading-relaxed">
                  Get personalized agronomic consultation for soil health, pest management, and maximizing crop yields.
                </p>
                <div className="bg-primary/20 border border-primary/30 rounded-xl p-4 mb-6">
                  <span className="text-xs text-gray-400 block mb-1 uppercase font-label">
                    Advisory Helpline
                  </span>
                  <span className="text-base font-bold text-white block">+91 76739 84949</span>
                </div>
              </div>
              <a
                href="tel:+917673984949"
                className="w-full text-center py-2.5 bg-accent hover:bg-accent-light text-darkBg font-label font-bold text-xs uppercase rounded-xl transition-all duration-200"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5: CROP-WISE PRODUCTS ==================== */}
      <section id="crop-solutions" className="py-24 px-6 md:px-12 bg-lightBg relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 reveal">
            <p className="font-label text-primary uppercase tracking-widest text-xs font-bold mb-3">
              Customized Crop Input Matrix
            </p>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark mb-4">
              Solutions for Every Crop
            </h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto text-sm md:text-base font-light">
              We engineer specific products engineered for the critical pests, diseases, and growth phases of Paddy, Cotton, and Vegetables.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex justify-center mb-12 reveal">
            <div className="bg-gray-200/60 p-1.5 rounded-2xl flex gap-2 w-full max-w-lg shadow-inner">
              {Object.keys(cropProducts).map((cropName) => (
                <button
                  key={cropName}
                  onClick={() => setActiveTab(cropName)}
                  className={`tab-btn flex-1 py-3 px-4 rounded-xl font-label font-bold text-sm transition-all duration-300 capitalize cursor-pointer ${
                    activeTab === cropName
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 hover:text-primary hover:bg-white/40"
                  }`}
                >
                  {t(`contact.${cropName.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="tab-pane reveal block">
            {/* Target Districts Banner */}
            <div className="bg-white border border-primary/10 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-label uppercase">
                    Target Regions for {t(`contact.${activeTab.toLowerCase()}`)}
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {cropProducts[activeTab].target}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary-muted text-primary text-xs font-bold font-label uppercase rounded-full">
                {cropProducts[activeTab].items.length} Key Products
              </span>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cropProducts[activeTab].items.map((prod, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[300px]"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span className="px-2.5 py-1 bg-amber-50 border border-accent/20 text-accent-dark font-label font-bold text-xs uppercase rounded">
                        {prod.category}
                      </span>
                      <span className="text-xs text-gray-400 font-label">{prod.stage}</span>
                    </div>
                    <h3 className="font-headline font-bold text-2xl text-primary-dark mb-2">
                      {prod.name}
                    </h3>
                    <p className="font-body text-xs text-gray-500 mb-4 italic">"{prod.tagline}"</p>
                    <p className="font-body text-sm text-gray-600 mb-6 leading-relaxed">
                      {prod.desc}
                    </p>
                  </div>
                  <div className="border-t border-gray-100 pt-4 mt-auto">
                    {"targets" in prod && prod.targets && (
                      <div className="mb-2">
                        <span className="text-xs font-bold text-primary block uppercase font-label mb-1">
                          Target Pests:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {prod.targets.map((tgt, i) => (
                            <span
                              key={i}
                              className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                            >
                              {tgt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {"crops" in prod && prod.crops && (
                      <div className="mb-2">
                        <span className="text-xs font-bold text-primary block uppercase font-label mb-1">
                          Crops Supported:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {prod.crops.map((crp, i) => (
                            <span
                              key={i}
                              className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                            >
                              {crp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {"timing" in prod && prod.timing && (
                      <span className="text-xs font-bold text-primary flex items-center gap-1 uppercase font-label">
                        <i className="fa-solid fa-circle-info text-[10px] text-accent"></i>{" "}
                        {prod.timing}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 6: IMPACT STATS ==================== */}
      <section
        ref={impactRef}
        id="impact"
        className="relative py-28 flex items-center justify-center overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src="/assets/drone-flyover.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,31,77,0.78)",
            zIndex: 1,
          }}
        ></div>

        <div style={{ position: "relative", zIndex: 2 }} className="max-w-6xl mx-auto px-6 w-full text-center text-white">
          <div className="mb-16 reveal">
            <h2 className="font-headline text-4xl sm:text-5xl font-bold text-white mb-4">
              Real results in real fields
            </h2>
            <p className="font-body text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-light">
              Trusted by farmers across Telangana and Andhra Pradesh since 2023. Our statistics speak to our commitment on the ground.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="reveal p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="font-label text-4xl lg:text-5xl font-bold text-accent mb-2">
                <span>{farmersCount}</span>+
              </div>
              <div className="font-body text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">
                {t("stats.farmers_served")}
              </div>
            </div>

            <div className="reveal p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="font-label text-4xl lg:text-5xl font-bold text-accent mb-2">
                <span>{statesCount}</span>
              </div>
              <div className="font-body text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">
                {t("stats.states_reached")}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 italic font-light">(TS, AP, KA)</div>
            </div>

            <div className="reveal p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="font-label text-4xl lg:text-5xl font-bold text-accent mb-2">
                <span>{productsCount}</span>+
              </div>
              <div className="font-body text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">
                {t("stats.products_available")}
              </div>
            </div>

            <div className="reveal p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="font-label text-4xl lg:text-5xl font-bold text-accent mb-2">
                <span>{ecoPercent}</span>%
              </div>
              <div className="font-body text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">
                {t("stats.eco_friendly")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 7: SUSTAINABILITY ==================== */}
      <section id="sustainability" className="bg-lightBg py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side Info */}
            <div className="reveal">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-[2px] w-8 bg-primary"></span>
                <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                  {t("nav.sustainability")}
                </span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark mb-6 leading-tight">
                {t("about.certified_desc")}
              </h2>
              <p className="font-body text-gray-700 text-sm md:text-base leading-relaxed mb-10 font-light">
                Committed to reducing carbon footprints, safeguarding farmer health, and building a greener, more resilient future for Indian agriculture. Our four sustainability pillars define every formula we release.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                    <i className="fa-solid fa-leaf"></i>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-primary-dark">Soil Health First</h4>
                    <p className="font-body text-sm text-gray-600 leading-relaxed font-light">
                      Enrich soil with organic inputs that improve fertility and microbial biology season after season.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                    <i className="fa-solid fa-droplet"></i>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-primary-dark">Water Smart</h4>
                    <p className="font-body text-sm text-gray-600 leading-relaxed font-light">
                      Conserve water resources through improved soil moisture retention dynamics and precision drip fertigation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                    <i className="fa-solid fa-microscope"></i>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-primary-dark font-semibold">
                      Science-Backed
                    </h4>
                    <p className="font-body text-sm text-gray-600 leading-relaxed font-light">
                      Every product developed by agronomists with rigorous laboratory testing and measurable crop results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-muted flex-shrink-0 flex items-center justify-center text-accent mt-1">
                    <i className="fa-solid fa-people-roof"></i>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-primary-dark font-semibold">
                      Eco-Friendly
                    </h4>
                    <p className="font-body text-sm text-gray-600 leading-relaxed font-light">
                      Minimizing chemical toxicity, reducing environmental carbon footprint, while safeguarding consumer safety.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Video */}
            <div className="reveal">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-darkBg">
                <video
                  ref={carbonVideoRef}
                  id="carbon-video"
                  muted
                  playsInline
                  className="w-full h-auto object-cover rounded-2xl"
                >
                  <source src="/assets/carbon-dissolve.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
                <div className="absolute bottom-5 left-5 glass-card px-4 py-2 rounded-xl flex items-center gap-2 text-white">
                  <i
                    className="fa-solid fa-clover text-accent text-sm animate-spin"
                    style={{ animationDuration: "4s" }}
                  ></i>
                  <div className="text-[10px] md:text-xs">
                    <span className="block font-bold">Carbon Dissolve Initiative</span>
                    <span className="block text-gray-300">Reducing agricultural carbon output</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 8: TARGET DISTRICTS ==================== */}
      <section id="districts" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 reveal">
            <p className="font-label text-primary uppercase tracking-widest text-xs font-bold mb-3">
              Operating Footprint
            </p>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark mb-4">
              Where We Operate
            </h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto text-sm md:text-base font-light">
              Providing high-grade agrochemical products and technical guidance across historical crop zones in Telangana and Andhra Pradesh.
            </p>
          </div>

          {/* District Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Paddy Districts */}
            <div className="reveal p-8 bg-lightBg border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-lg">
                  <i className="fa-solid fa-bowl-rice"></i>
                </div>
                <h3 className="font-headline font-bold text-xl text-primary-dark">{t("nav.paddy_solutions")}</h3>
              </div>
              <p className="text-xs text-gray-400 font-label uppercase mb-4 tracking-wider">
                Active Operations in:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Medak", "Nizamabad", "Karimnagar", "Warangal", "Nalgonda", 
                  "Kurnool", "Kadapa", "Krishna", "Khammam", "East Godavari", "West Godavari"
                ].map((dist) => (
                  <span
                    key={dist}
                    className="px-3 py-1 bg-white border border-gray-200 text-gray-700 font-body text-xs rounded-full hover:border-primary hover:text-primary transition-colors cursor-default"
                  >
                    {dist}
                  </span>
                ))}
              </div>
            </div>

            {/* Cotton Districts */}
            <div className="reveal p-8 bg-lightBg border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-lg">
                  <i className="fa-solid fa-shirt"></i>
                </div>
                <h3 className="font-headline font-bold text-xl text-primary-dark">{t("nav.cotton_solutions")}</h3>
              </div>
              <p className="text-xs text-gray-400 font-label uppercase mb-4 tracking-wider">
                Active Operations in:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Adilabad", "Medak", "Nalgonda", "Mahabubnagar", 
                  "Kurnool", "Krishna", "Khammam", "Warangal"
                ].map((dist) => (
                  <span
                    key={dist}
                    className="px-3 py-1 bg-white border border-gray-200 text-gray-700 font-body text-xs rounded-full hover:border-primary hover:text-primary transition-colors cursor-default"
                  >
                    {dist}
                  </span>
                ))}
              </div>
            </div>

            {/* Vegetable Districts */}
            <div className="reveal p-8 bg-lightBg border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-lg">
                  <i className="fa-solid fa-carrot"></i>
                </div>
                <h3 className="font-headline font-bold text-xl text-primary-dark">
                  {t("nav.vegetable_solutions")}
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-label uppercase mb-4 tracking-wider">
                Active Operations in:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Medak", "Rangareddy", "Anatapur", "Chittoor", "Mahabubnagar", "Kadapa", "Jangareddygudem"
                ].map((dist) => (
                  <span
                    key={dist}
                    className="px-3 py-1 bg-white border border-gray-200 text-gray-700 font-body text-xs rounded-full hover:border-primary hover:text-primary transition-colors cursor-default"
                  >
                    {dist}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 9: CONTACT FORM ==================== */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-lightBg relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 reveal">
            <p className="font-label text-primary uppercase tracking-widest text-xs font-bold mb-3">
              Partnership & Advisory
            </p>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark mb-4">
              {t("contact.title")}
            </h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto text-sm md:text-base font-light">
              Are you a farmer seeking advisory services, a dealer looking for distribution partnerships, or an organization wanting crop inputs? Fill out the form below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            {/* Form */}
            <div className="lg:col-span-7 p-8 md:p-12 reveal">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                    >
                      {t("contact.name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50/55"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50/55"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                  >
                    {t("contact.phone")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-label text-sm font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      pattern="[0-9]{10}"
                      placeholder="9876543210"
                      className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50/55 font-label"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="state"
                      className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                    >
                      {t("contact.state")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="state"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50/55"
                    >
                      <option value="Telangana">{t("contact.telangana")}</option>
                      <option value="AP">{t("contact.ap")}</option>
                      <option value="Karnataka">{t("contact.karnataka")}</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="crop"
                      className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                    >
                      {t("contact.crop")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="crop"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50/55"
                    >
                      <option value="Paddy">{t("contact.paddy")}</option>
                      <option value="Cotton">{t("contact.cotton")}</option>
                      <option value="Vegetables">{t("contact.vegetables")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                  >
                    {t("contact.message")}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50/55 resize-y"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary hover:bg-primary-light text-white font-label font-bold text-sm tracking-wider uppercase rounded-xl transition-all duration-300 hover:scale-[1.01] shadow-md shadow-primary/20 cursor-pointer"
                >
                  {t("contact.submit")}
                </button>
              </form>
            </div>

            {/* Sidebar details */}
            <div className="lg:col-span-5 bg-darkBg p-8 md:p-12 text-white flex flex-col justify-between relative">
              <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

              <div>
                <h3 className="font-headline font-bold text-2xl mb-8 text-accent">
                  Contact Details
                </h3>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex-shrink-0 flex items-center justify-center text-accent">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-label text-gray-400 uppercase font-bold mb-1">
                        Office Address
                      </span>
                      <p className="font-body text-sm text-gray-200 leading-relaxed font-light">
                        4th Floor, Sri Sai Krishna Layout, Plot No-36 & 47,
                        <br />
                        near NTR Circle, Pragathi Nagar, Nizampet,
                        <br />
                        Hyderabad, Telangana 500090
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex-shrink-0 flex items-center justify-center text-accent">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-label text-gray-400 uppercase font-bold mb-1">
                        Call Helpline
                      </span>
                      <div className="font-body text-base text-gray-200 font-semibold space-y-1">
                        <a href="tel:+917673984949" className="block hover:text-accent transition-colors">
                          +91 76739 84949
                        </a>
                        <a href="tel:+918121414949" className="block hover:text-accent transition-colors">
                          +91 81214 14949
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex-shrink-0 flex items-center justify-center text-accent">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-label text-gray-400 uppercase font-bold mb-1">
                        Email Address
                      </span>
                      <a
                        href="mailto:pIxelinsciences@gmail.com"
                        className="font-body text-sm text-gray-200 hover:text-accent transition-colors"
                      >
                        pIxelinsciences@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-8 mt-12">
                <span className="text-xs text-accent block font-label uppercase tracking-widest font-bold mb-2">
                  Technical Support
                </span>
                <p className="text-xs text-gray-400 font-light">
                  Formulated with precision. Delivered for safe foods. Backed by science.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-darkBg text-white pt-16 pb-8 border-t border-primary-dark/40">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <a href="#hero" className="flex items-center gap-3">
              <img src="/logo.png" alt="Pixelin Sciences Logo" className="h-10 w-auto" />
              
            </a>
            <p className="font-body text-sm text-gray-400 leading-relaxed font-light">
              "Developed with science. Formulated with precision. Delivered for safe foods."
            </p>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6 border-b-2 border-accent pb-2 w-max text-accent">
              Quick Links
            </h4>
            <ul className="font-body text-sm text-gray-400 space-y-3">
              <li>
                <a href="#hero" className="hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-accent transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#crop-solutions" className="hover:text-accent transition-colors">
                  Crops Matrix
                </a>
              </li>
              <li>
                <a href="#sustainability" className="hover:text-accent transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6 border-b-2 border-accent pb-2 w-max text-accent">
              Our Products
            </h4>
            <ul className="font-body text-sm text-gray-400 space-y-3">
              <li>
                <button
                  onClick={() => scrollToCategory(0)}
                  className="hover:text-accent transition-colors text-left cursor-pointer"
                >
                  Pesticides
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCategory(1)}
                  className="hover:text-accent transition-colors text-left cursor-pointer"
                >
                  Fertilizers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCategory(2)}
                  className="hover:text-accent transition-colors text-left cursor-pointer"
                >
                  IPNM Bio Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCategory(3)}
                  className="hover:text-accent transition-colors text-left cursor-pointer"
                >
                  Farm Advisory Service
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6 border-b-2 border-accent pb-2 w-max text-accent">
              Crops Matrix
            </h4>
            <ul className="font-body text-sm text-gray-400 space-y-3">
              <li>
                <button
                  onClick={() => selectCropAndScroll("paddy")}
                  className="hover:text-accent transition-colors text-left cursor-pointer"
                >
                  Paddy (Rice)
                </button>
              </li>
              <li>
                <button
                  onClick={() => selectCropAndScroll("cotton")}
                  className="hover:text-accent transition-colors text-left cursor-pointer"
                >
                  Cotton
                </button>
              </li>
              <li>
                <button
                  onClick={() => selectCropAndScroll("vegetables")}
                  className="hover:text-accent transition-colors text-left cursor-pointer"
                >
                  Vegetables
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-gray-500 text-center md:text-left">
            {t("footer.rights")}
          </p>
          <div className="flex gap-6 text-xs text-gray-500 font-label uppercase">
            <a href="#" className="hover:text-accent">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

      {/* ==================== FLOATING ELEMENTS & VOICE INTERFACE ==================== */}

      {/* Scroll to Top */}
      {showScrollToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-36 right-6 w-12 h-12 bg-primary/95 text-white border border-accent/20 rounded-full flex items-center justify-center hover:bg-accent hover:text-darkBg shadow-lg z-40 transition-all duration-300 cursor-pointer"
          aria-label="Scroll to Top"
        >
          <i className="fa-solid fa-arrow-up text-lg"></i>
        </button>
      )}

      {/* WhatsApp Chat Button */}
      <a
        href="https://wa.me/917673984949"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 w-14 h-14 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-[#20ba5a] transition-all duration-300 z-40 group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25d366]/40 animate-ping scale-110 pointer-events-none"></span>
        <span className="absolute inset-0 rounded-full bg-[#25d366]/20 animate-pulse scale-125 pointer-events-none"></span>
        <i className="fa-brands fa-whatsapp text-3xl"></i>
      </a>

      {/* Siri-like Floating AI Voice Assistant Orb */}
      <div className="fixed bottom-4 right-6 z-40 flex items-center gap-3">
        <AnimatePresence>
          {listening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="backdrop-blur-xl bg-black/75 border border-white/10 rounded-2xl px-4 py-2.5 shadow-2xl text-xs flex items-center gap-3 max-w-[200px]"
            >
              <div className="space-y-0.5">
                <span className="block text-accent font-bold uppercase tracking-wider text-[9px] animate-pulse">
                  {t("ai_assistant.listening")}
                </span>
                <span className="block text-gray-300 italic truncate w-[120px]">
                  {transcript || "Speak now..."}
                </span>
              </div>
              
              {/* Premium Waveform Visualizer */}
              <div className="flex items-center gap-0.5 h-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[2px] bg-accent rounded-full"
                    animate={{
                      height: ["4px", "20px", "4px"]
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={startVoice}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border transition-all duration-300 group cursor-pointer ${
            listening 
              ? "bg-red-600 border-red-500 shadow-red-500/30 scale-105" 
              : "bg-gradient-to-tr from-primary to-accent border-white/15 hover:scale-105 shadow-primary-dark/25"
          }`}
          title="Talk to Farming AI"
        >
          {listening ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              {/* Dynamic Aura Gradient Effects */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent opacity-50 blur-[8px] group-hover:scale-110 transition-transform duration-300" />
              <Mic className="w-6 h-6 text-white relative z-10" />
            </>
          )}
        </button>
      </div>

      {/* ==================== SUCCESS TOAST MODAL ==================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            onClick={() => setShowSuccessModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></div>
          <div className="relative bg-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl text-center border border-gray-100 transform transition-all duration-300 scale-100 opacity-100">
            <div className="w-16 h-16 bg-primary-muted rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-6 border border-primary/10">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h4 className="font-headline font-bold text-2xl text-primary-dark mb-3">
              {t("contact.success_title")}
            </h4>
            <p className="font-body text-sm text-gray-500 leading-relaxed mb-6 font-light">
              {t("contact.success_desc")}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-label font-bold text-sm tracking-wider uppercase rounded-xl transition-all duration-200 cursor-pointer"
            >
              {t("contact.success_close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}