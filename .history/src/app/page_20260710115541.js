"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

export default function Home() {
  // --- States ---
  const [activeTab, setActiveTab] = useState("paddy");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [isPesticidesAccordionOpen, setIsPesticidesAccordionOpen] = useState(false);
  const [isCropsAccordionOpen, setIsCropsAccordionOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Counter States
  const [farmersCount, setFarmersCount] = useState(0);
  const [statesCount, setStatesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ecoPercent, setEcoPercent] = useState(0);

  // --- Refs ---
  const rootVideoRef = useRef(null);
  const carbonVideoRef = useRef(null);
  const impactRef = useRef(null);

  // --- Static Product Data (Easy to Edit) ---
  const cropProducts = useMemo(() => ({
    paddy: {
      target: "Medak · Nizamabad · Karimnagar · Warangal · Nalgonda · Kurnool · Kadapa · Krishna · Khammam · East & West Godavari",
      items: [
        {
          name: "PURE AUXIN",
          category: "PGR",
          stage: "Transplanting",
          tagline: "Explosive root growth from day one",
          desc: "Formulated as a root booster, it promotes vigorous root development during transplanting, ensuring maximum nutrient intake.",
          timing: "Apply at transplanting stage"
        },
        {
          name: "KARBAC",
          category: "Soil Health",
          stage: "Growth Phase",
          tagline: "Restores soil health season after season",
          desc: "Contains Humic acid, Fulvic acid, and Leonardite. Improves soil structure, water retention, and microbial activity.",
          timing: "Soil Conditioner"
        },
        {
          name: "EXPEL-R",
          category: "Bio Pest Control",
          stage: "Early / Mid Stage",
          tagline: "Biological. Stops the borer before it enters.",
          desc: "Advanced botanical insect control targeting Stem Borer and Leaf Folder. Highly effective and resistance-proof.",
          targets: ["Stem Borer", "Leaf Folder"]
        },
        {
          name: "PIXEL SENSA",
          category: "Fungicide",
          stage: "Booting Stage",
          tagline: "Two deadly diseases. One solution.",
          desc: "Formulation: Picoxystrobin + Tricyclazole 20.33% SC. Synergistic action against rice blast and sheath blight.",
          targets: ["Rice Blast", "Sheath Blight"],
          timing: "Apply at Booting Stage"
        },
        {
          name: "DODGER",
          category: "Insecticide",
          stage: "Infection Window",
          tagline: "Stops feeding in minutes. Eliminates completely.",
          desc: "Formulation: Dinotefuran 15% + Pymetrozine 45% WG. Systemic insecticide targeting sap-feeding pests immediately.",
          targets: ["BPH", "WBPH", "Green Leafhopper"]
        }
      ]
    },
    cotton: {
      target: "Adilabad · Medak · Nalgonda · Mahabubnagar · Kurnool · Krishna · Khammam · Warangal",
      items: [
        {
          name: "PIXEL 4D",
          category: "Insecticide",
          stage: "Vapour Action",
          tagline: "All three threats. One spray.",
          desc: "Formulation: Fipronil 10% + Diafenthiuron 30% WG. Broad-spectrum protection. Vapour action reaches hidden pests under leaves.",
          targets: ["Whitefly", "Thrips", "Mites"]
        },
        {
          name: "EXTEND",
          category: "Bio Protection",
          stage: "Zero Residue",
          tagline: "Natural protection. Zero residue.",
          desc: "Natural herbal extract biostimulant that deters sucking pests and activates crop defense pathways.",
          targets: ["Thrips", "Mites"]
        },
        {
          name: "MAXCOTT",
          category: "Insecticide + Growth",
          stage: "Dual Action",
          tagline: "Three pests. One spray. Plus growth boost.",
          desc: "Knocks down sucking insects instantly while stimulating lateral branching and greening.",
          targets: ["Whitefly", "Aphid", "Jassid"]
        },
        {
          name: "FLORA",
          category: "Yield Booster",
          stage: "50-100 Days",
          tagline: "More flowers. More bolls. Less square drop.",
          desc: "Hormonal and nutrient formulation that regulates blossom production, preventing square drop and promoting boll development.",
          timing: "Apply 50–100 Days After Sowing"
        },
        {
          name: "EXPEL-R (Bio)",
          category: "Bio Controller",
          stage: "Bollworm Protection",
          tagline: "Biological. Resistance-proof.",
          desc: "Eco-safe botanical insect growth regulator targeting highly resistant bollworm varieties.",
          targets: ["American", "Spotted", "Pink Bollworm"]
        }
      ]
    },
    vegetables: {
      target: "Medak · Rangareddy · Anatapur · Chittoor · Mahabubnagar · Kadapa · Jangareddygudem",
      items: [
        {
          name: "FLORA",
          category: "Yield Booster",
          stage: "Pre-Flowering",
          tagline: "Every dropped flower is income lost. Flora stops the drop.",
          desc: "Specially designed fruit set booster to trigger hormone synthesis and prevent early bud drop.",
          crops: ["Tomato", "Brinjal", "Chilli", "Okra", "Cucumber", "Beans"]
        },
        {
          name: "BUILDER",
          category: "Micronutrient",
          stage: "Vegetative / Pre-flowering",
          tagline: "The targeted meal before flowering. Bigger, better fruits.",
          desc: "Balanced multi-micronutrient formulation featuring Magnesium, Zinc, Phosphorus, and Boron to build tissue structural integrity.",
          timing: "Mg + Zn + P + B Complex"
        },
        {
          name: "LAMIGO",
          category: "Insecticide",
          stage: "Rainfast 2 Hours",
          tagline: "10–14 days residual. Rainfast in 2 hours.",
          desc: "Formulation: Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC. Fast acting caterpillar and borer control.",
          targets: ["Shoot Borer", "Fruit Borer", "Caterpillars"]
        },
        {
          name: "PROBION",
          category: "Biostimulant",
          stage: "All Stages",
          tagline: "Pre-digested nutrition. Stress recovery. Faster growth.",
          desc: "Amino acid complex biostimulant. Helps plants recover from temperature, drought, or herbicide stress quickly.",
          timing: "L-Amino Acids & Organic Peptides"
        },
        {
          name: "K-MATE",
          category: "Soil Health via Drip",
          stage: "Root Application",
          tagline: "The soil doctor that works through the drip pipe.",
          desc: "Concentrated Potassium Humate designed specifically for drip fertigation. Enhances root mass and unlocks phosphorus.",
          timing: "Drip / Fertigation System"
        },
        {
          name: "EXPEL-R (Bio)",
          category: "Bio Insecticide",
          stage: "Foliar Spray",
          tagline: "One hole in a tomato = zero price. Expel-R prevents that.",
          desc: "Targeted bio-caterpillar controller designed to eliminate damaging borers and fruit worms from chewing valuable harvest.",
          targets: ["Caterpillar Complex", "Fruit Chewing Pests"]
        }
      ]
    }
  }), []);

  // --- Effects ---
  useEffect(() => {
    // 1. Navbar Scroll and Scroll-to-Top triggers
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

    // 2. Reveal animations on scroll (Intersection Observer)
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

    // 3. Autoplay/Pause Videos based on visibility
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
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

    // 4. Stats Counter Animation Trigger
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

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealObserver.disconnect();
      videoObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  // --- Stats Counter Logic ---
  const animateStats = () => {
    const duration = 2000; // ms
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

  // --- Dynamic Category / Crop click navigation ---
  const scrollToCategory = (index) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const cards = document.querySelectorAll(".category-card");
      if (cards && cards[index]) {
        cards[index].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  const selectCropAndScroll = (cropName) => {
    setActiveTab(cropName);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById("crop-solutions");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // --- Form Submit Handling ---
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setShowSuccessModal(true);
    e.target.reset();
  };



  return (
    <>
      {/* ==================== HEADER / NAVIGATION ==================== */}
      <nav
        id="navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out px-6 md:px-12 flex justify-between items-center ${isNavbarScrolled
          ? "bg-white text-gray-800 shadow-md py-3"
          : "bg-transparent text-white py-5"
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
            <span
              className={`font-headline font-bold text-lg md:text-xl tracking-tight block transition-colors duration-300 ${isNavbarScrolled ? "text-primary-dark" : "text-white"
                } group-hover:text-accent hidden sm:block`}
            >
              Pixelin Sciences
            </span>
            <span className="font-label text-[10px] tracking-widest text-accent uppercase block leading-none hidden sm:block">
              Pvt Ltd
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 font-medium">
          <a href="#hero" className="hover:text-accent transition-colors duration-300">
            Home
          </a>
          <a href="#about" className="hover:text-accent transition-colors duration-300">
            About Us
          </a>

          {/* Products Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-accent transition-colors duration-300 focus:outline-none">
              Products{" "}
              <i className="fa-solid fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180"></i>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 rounded-xl bg-white shadow-xl py-3 border border-gray-100 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 text-gray-800">
              <a
                href="#products"
                className="block px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200"
              >
                All Categories
              </a>
              <div className="h-[1px] bg-gray-100 my-1"></div>
              <button
                onClick={() => scrollToCategory(0)}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200"
              >
                Pesticides
              </button>
              <button
                onClick={() => scrollToCategory(1)}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200"
              >
                Fertilizers
              </button>
              <button
                onClick={() => scrollToCategory(2)}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200"
              >
                IPNM Products
              </button>
              <button
                onClick={() => scrollToCategory(3)}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200"
              >
                Farm Advisory
              </button>
            </div>
          </div>

          {/* Crops Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-accent transition-colors duration-300 focus:outline-none">
              Crops{" "}
              <i className="fa-solid fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180"></i>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 rounded-xl bg-white shadow-xl py-3 border border-gray-100 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 text-gray-800">
              <button
                onClick={() => selectCropAndScroll("paddy")}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200"
              >
                Paddy Solutions
              </button>
              <button
                onClick={() => selectCropAndScroll("cotton")}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200"
              >
                Cotton Solutions
              </button>
              <button
                onClick={() => selectCropAndScroll("vegetables")}
                className="w-full text-left px-5 py-2 hover:bg-lightBg hover:text-primary transition-colors duration-200"
              >
                Vegetable Solutions
              </button>
            </div>
          </div>

          <a href="#sustainability" className="hover:text-accent transition-colors duration-300">
            Sustainability
          </a>
          <a href="#contact" className="hover:text-accent transition-colors duration-300">
            Contact Us
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
          className="lg:hidden p-2 focus:outline-none"
          aria-label="Toggle Mobile Menu"
        >
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 right-0 h-screen w-80 bg-darkBg text-white z-50 transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col justify-between py-8 px-6 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Pixelin Sciences Logo"
                  className="h-10 w-auto"
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
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
                Home
              </a>
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-accent transition-colors duration-200"
              >
                About Us
              </a>

              {/* Mobile Accordion: Products */}
              <div>
                <button
                  onClick={() => setIsPesticidesAccordionOpen(!isPesticidesAccordionOpen)}
                  className="flex justify-between items-center w-full hover:text-accent transition-colors duration-200 text-left"
                >
                  Products{" "}
                  <i
                    className={`fa-solid fa-chevron-down text-xs ml-2 transition-transform duration-200 ${isPesticidesAccordionOpen ? "rotate-180" : ""
                      }`}
                  ></i>
                </button>
                <div
                  className={`${isPesticidesAccordionOpen ? "flex" : "hidden"
                    } flex-col pl-4 mt-2 gap-2 text-base text-gray-300`}
                >
                  <a
                    href="#products"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-accent"
                  >
                    All Categories
                  </a>
                  <button onClick={() => scrollToCategory(0)} className="text-left hover:text-accent">
                    Pesticides
                  </button>
                  <button onClick={() => scrollToCategory(1)} className="text-left hover:text-accent">
                    Fertilizers
                  </button>
                  <button onClick={() => scrollToCategory(2)} className="text-left hover:text-accent">
                    IPNM Products
                  </button>
                  <button onClick={() => scrollToCategory(3)} className="text-left hover:text-accent">
                    Farm Advisory
                  </button>
                </div>
              </div>

              {/* Mobile Accordion: Crops */}
              <div>
                <button
                  onClick={() => setIsCropsAccordionOpen(!isCropsAccordionOpen)}
                  className="flex justify-between items-center w-full hover:text-accent transition-colors duration-200 text-left"
                >
                  Crops{" "}
                  <i
                    className={`fa-solid fa-chevron-down text-xs ml-2 transition-transform duration-200 ${isCropsAccordionOpen ? "rotate-180" : ""
                      }`}
                  ></i>
                </button>
                <div
                  className={`${isCropsAccordionOpen ? "flex" : "hidden"
                    } flex-col pl-4 mt-2 gap-2 text-base text-gray-300`}
                >
                  <button
                    onClick={() => selectCropAndScroll("paddy")}
                    className="text-left hover:text-accent"
                  >
                    Paddy Solutions
                  </button>
                  <button
                    onClick={() => selectCropAndScroll("cotton")}
                    className="text-left hover:text-accent"
                  >
                    Cotton Solutions
                  </button>
                  <button
                    onClick={() => selectCropAndScroll("vegetables")}
                    className="text-left hover:text-accent"
                  >
                    Vegetable Solutions
                  </button>
                </div>
              </div>

              <a
                href="#sustainability"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-accent transition-colors duration-200"
              >
                Sustainability
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-accent transition-colors duration-200"
              >
                Contact Us
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
            width: 100 + "%",
            height: 100 + "%",
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
            background:
              "linear-gradient(to bottom, rgba(0,31,77,0.7) 0%, rgba(0,31,77,0.35) 50%, rgba(0,31,77,0.9) 100%)",
            zIndex: 1,
          }}
        ></div>

        {/* Hero content container */}
        <div className="relative z-10 h-full w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col justify-center items-center text-center text-white select-none">
          <p className="eyebrow animate-fade-up font-label text-accent uppercase tracking-widest text-xs md:text-sm lg:text-base font-bold mb-4">
            Pixelin Sciences Pvt Ltd
          </p>
          <h1 className="animate-fade-up delay-1 font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight max-w-5xl">
            Growing the Future,
            <br />
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-accent to-[#fff]">
              One Crop at a Time
            </span>
          </h1>
          <p className="animate-fade-up delay-2 font-body text-gray-200 text-sm md:text-lg lg:text-xl max-w-3xl mb-10 leading-relaxed font-light">
            Innovative agrochemical solutions that enhance productivity and promote sustainability
            across Telangana, Andhra Pradesh, and Karnataka.
          </p>

          {/* Staggered buttons */}
          <div className="animate-fade-up delay-3 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href="#products"
              className="px-8 py-3.5 bg-primary hover:bg-primary-light text-white font-label font-bold tracking-wider rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-primary-dark/30 text-center"
            >
              Explore Products
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 border-2 border-white/80 hover:border-primary hover:bg-primary text-white font-label font-bold tracking-wider rounded-xl transition-all duration-300 hover:scale-[1.03] text-center backdrop-blur-sm"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Decorative scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 text-xs animate-bounce hidden md:flex">
          <span>Scroll Down</span>
          <i className="fa-solid fa-angle-down text-sm"></i>
        </div>
      </section>



      {/* ==================== SECTION 3: ABOUT US ==================== */}
      <section id="about" className="py-24 px-6 md:px-12 bg-lightBg relative overflow-hidden">
        {/* Subtle graphic elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            {/* Text Column */}
            <div className="lg:col-span-7 reveal">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-[2px] w-8 bg-primary"></span>
                <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                  About Our Company
                </span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark mb-6 leading-tight">
                Welcome to Pixelin Sciences
              </h2>
              <p className="font-body text-gray-700 text-sm md:text-base leading-relaxed mb-6 font-light">
                We are committed to revolutionizing agriculture by providing innovative
                agrochemical solutions that enhance productivity and promote sustainability.
                Established in 2023, our mission is to empower farmers to cultivate healthy,
                high-yielding crops using eco-friendly practices.
              </p>
              <p className="font-body text-gray-700 text-sm md:text-base leading-relaxed mb-8 font-light">
                Backed by a team of experienced agronomists, soil scientists, and agricultural
                experts, we specialize in creating high-quality agri-inputs tailored to diverse crop
                requirements and local climates.
              </p>
              <div className="border-l-4 border-accent pl-5 py-1 italic text-gray-600 text-sm md:text-base mb-8">
                "Developed with science. Formulated with precision. Delivered for safe foods."
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-primary font-label font-bold border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-all duration-300"
              >
                Learn More About Us <i className="fa-solid fa-arrow-right text-xs"></i>
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
                  <span>Root Journey Video</span>
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
                  Best Agrochemical Industry
                </h3>
                <p className="font-body text-sm text-gray-500">"We are Certified" to deliver high-quality inputs.</p>
              </div>
            </div>

            <div className="reveal p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center text-accent text-xl">
                <i className="fa-solid fa-users-gear"></i>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary-dark mb-1">
                  Empowering Farmers
                </h3>
                <p className="font-body text-sm text-gray-500">
                  "Trusted across AP & Telangana" with customized guidance.
                </p>
              </div>
            </div>

            <div className="reveal p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-muted flex items-center justify-center text-primary text-xl">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary-dark mb-1">
                  Protecting Crops
                </h3>
                <p className="font-body text-sm text-gray-500">
                  "Science-backed solutions" that reduce crop damages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: PRODUCTS ==================== */}
      <section id="products" className="relative py-24 bg-darkBg text-white overflow-hidden">
        {/* Molecular Background Video (Dimmed) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: 100 + "%",
            height: 100 + "%",
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
              Core Agrochemical Offerings
            </p>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl mx-auto leading-tight text-white mb-6">
              Developed with science. Formulated with precision. Delivered for safe foods.
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
                <h3 className="font-headline font-bold text-xl mb-4">Pesticides</h3>
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
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light text-2xl mb-6">
                  <i className="fa-solid fa-wheat-awn"></i>
                </div>
                <h3 className="font-headline font-bold text-xl mb-4">Fertilizers</h3>
                <p className="font-body text-sm text-gray-300 mb-4 leading-relaxed">
                  We offer 7 diverse types of fertilizers to enrich soil fertility and provide critical
                  nutrients:
                </p>
                <ul className="font-body text-xs text-gray-400 space-y-1 mb-8">
                  <li>• NPK Complexes</li>
                  <li>• Micronutrients</li>
                  <li>• Bio-fertilizers</li>
                  <li>• Organic Conditioners</li>
                  <li>• Soil Enhancers</li>
                  <li>• Water-Soluble Grades</li>
                  <li>• Specialty Fertigation Blends</li>
                </ul>
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
                <h3 className="font-headline font-bold text-xl mb-4">IPNM Products</h3>
                <p className="font-body text-sm text-gray-300 mb-8 leading-relaxed">
                  Integrated Pest & Nutrient Management formulations combining biology and chemistry
                  to enhance crop defense networks naturally.
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
                <h3 className="font-headline font-bold text-xl mb-4 text-accent">Farm Advisory</h3>
                <p className="font-body text-sm text-gray-300 mb-6 leading-relaxed">
                  Get personalized agronomic consultation for soil health, pest management, and
                  maximizing crop yields.
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
              We engineer specific products engineered for the critical pests, diseases, and growth
              phases of Paddy, Cotton, and Vegetables.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex justify-center mb-12 reveal">
            <div className="bg-gray-200/60 p-1.5 rounded-2xl flex gap-2 w-full max-w-lg shadow-inner">
              {Object.keys(cropProducts).map((cropName) => (
                <button
                  key={cropName}
                  onClick={() => setActiveTab(cropName)}
                  className={`tab-btn flex-1 py-3 px-4 rounded-xl font-label font-bold text-sm transition-all duration-300 capitalize ${activeTab === cropName
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:text-primary hover:bg-white/40"
                    }`}
                >
                  {cropName}
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
                    Target Regions for {activeTab}
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
                    {prod.targets && (
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
                    {prod.crops && (
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
                    {prod.timing && (
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
            width: 100 + "%",
            height: 100 + "%",
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
              Trusted by farmers across Telangana and Andhra Pradesh since 2023. Our statistics
              speak to our commitment on the ground.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="reveal p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="font-label text-4xl lg:text-5xl font-bold text-accent mb-2">
                <span>{farmersCount}</span>+
              </div>
              <div className="font-body text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">
                Farmers Empowered
              </div>
            </div>

            <div className="reveal p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="font-label text-4xl lg:text-5xl font-bold text-accent mb-2">
                <span>{statesCount}</span>
              </div>
              <div className="font-body text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">
                States Covered
              </div>
              <div className="text-[10px] text-gray-400 mt-1 italic font-light">(TS, AP, KA)</div>
            </div>

            <div className="reveal p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="font-label text-4xl lg:text-5xl font-bold text-accent mb-2">
                <span>{productsCount}</span>+
              </div>
              <div className="font-body text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">
                Crop-Specific Products
              </div>
            </div>

            <div className="reveal p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="font-label text-4xl lg:text-5xl font-bold text-accent mb-2">
                <span>{ecoPercent}</span>%
              </div>
              <div className="font-body text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">
                Eco Formulations
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
                  Ecological Integrity
                </span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark mb-6 leading-tight">
                We cultivate progress by blending tradition with modern, eco-smart farming
              </h2>
              <p className="font-body text-gray-700 text-sm md:text-base leading-relaxed mb-10 font-light">
                Committed to reducing carbon footprints, safeguarding farmer health, and building a
                greener, more resilient future for Indian agriculture. Our four sustainability
                pillars define every formula we release.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                    <i className="fa-solid fa-leaf"></i>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-primary-dark">Soil Health First</h4>
                    <p className="font-body text-sm text-gray-600 leading-relaxed font-light">
                      Enrich soil with organic inputs that improve fertility and microbial biology
                      season after season.
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
                      Conserve water resources through improved soil moisture retention dynamics and
                      precision drip fertigation.
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
                      Every product developed by agronomists with rigorous laboratory testing and
                      measurable crop results.
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
                      Minimizing chemical toxicity, reducing environmental carbon footprint, while
                      safeguarding consumer safety.
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
                    style={{ animationDuration: 4 + "s" }}
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
              Providing high-grade agrochemical products and technical guidance across historical
              crop zones in Telangana and Andhra Pradesh.
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
                <h3 className="font-headline font-bold text-xl text-primary-dark">Paddy Districts</h3>
              </div>
              <p className="text-xs text-gray-400 font-label uppercase mb-4 tracking-wider">
                Active Operations in:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Medak",
                  "Nizamabad",
                  "Karimnagar",
                  "Warangal",
                  "Nalgonda",
                  "Kurnool",
                  "Kadapa",
                  "Krishna",
                  "Khammam",
                  "East Godavari",
                  "West Godavari",
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
                <h3 className="font-headline font-bold text-xl text-primary-dark">Cotton Districts</h3>
              </div>
              <p className="text-xs text-gray-400 font-label uppercase mb-4 tracking-wider">
                Active Operations in:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Adilabad",
                  "Medak",
                  "Nalgonda",
                  "Mahabubnagar",
                  "Kurnool",
                  "Krishna",
                  "Khammam",
                  "Warangal",
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
                  Vegetable Districts
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-label uppercase mb-4 tracking-wider">
                Active Operations in:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Medak",
                  "Rangareddy",
                  "Anatapur",
                  "Chittoor",
                  "Mahabubnagar",
                  "Kadapa",
                  "Jangareddygudem",
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
              Get in Touch
            </h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto text-sm md:text-base font-light">
              Are you a farmer seeking advisory services, a dealer looking for distribution
              partnerships, or an organization wanting crop inputs? Fill out the form below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            {/* Form */}
            <div className="lg:col-span-7 p-8 md:p-12 reveal">
              <h3 className="font-headline font-bold text-2xl text-primary-dark mb-6">
                Send Us a Message
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                    >
                      First Name <span className="text-red-500">*</span>
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
                    htmlFor="companyName"
                    className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                  >
                    Company Name <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50/55"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                  >
                    Phone Number <span className="text-red-500">*</span>
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

                <div>
                  <label className="block font-label text-xs text-gray-500 uppercase font-bold mb-3">
                    What describes you best? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["Organization", "Dealer", "Farmer", "Student"].map((role) => (
                      <label
                        key={role}
                        className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-lightBg hover:border-primary transition-all duration-200 select-none"
                      >
                        <input
                          type="radio"
                          name="userRole"
                          value={role}
                          required
                          className="text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-xs font-medium text-gray-700">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50/55 resize-y"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-label text-xs text-gray-500 uppercase font-bold mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50/55 resize-y"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary hover:bg-primary-light text-white font-label font-bold text-sm tracking-wider uppercase rounded-xl transition-all duration-300 hover:scale-[1.01] shadow-md shadow-primary/20"
                >
                  Submit Inquiry
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
                      <i className="fa-solid fa-map-location-dot"></i>
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
                      <i className="fa-solid fa-phone-volume"></i>
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
                      <i className="fa-solid fa-envelope"></i>
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
              <img
                src="/logo.png"
                alt="Pixelin Sciences Logo"
                className="h-10 w-auto"
              />
              <div>
                <span className="font-headline font-bold text-lg tracking-tight text-white block">
                  Pixelin Sciences
                </span>
                <span className="font-label text-[10px] tracking-widest text-accent uppercase block leading-none">
                  Pvt Ltd
                </span>
              </div>
            </a>
            <p className="font-body text-sm text-gray-400 leading-relaxed font-light">
              "Developed with science. Formulated with precision. Delivered for safe foods."
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/Pixelinsciences/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-accent hover:text-darkBg flex items-center justify-center text-gray-300 transition-all duration-300"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/pixelinsciences"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-accent hover:text-darkBg flex items-center justify-center text-gray-300 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in text-sm"></i>
              </a>
              <a
                href="https://www.instagram.com/pixelinsciences/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-accent hover:text-darkBg flex items-center justify-center text-gray-300 transition-all duration-300"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a
                href="https://www.youtube.com/@PixelinSciences"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-accent hover:text-darkBg flex items-center justify-center text-gray-300 transition-all duration-300"
                aria-label="YouTube"
              >
                <i className="fa-brands fa-youtube text-sm"></i>
              </a>
            </div>
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
                  className="hover:text-accent transition-colors text-left"
                >
                  Pesticides (Insecticide, Fungicide)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCategory(1)}
                  className="hover:text-accent transition-colors text-left"
                >
                  Fertilizers (Specialty, Bio)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCategory(2)}
                  className="hover:text-accent transition-colors text-left"
                >
                  IPNM Bio Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCategory(3)}
                  className="hover:text-accent transition-colors text-left"
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
                  className="hover:text-accent transition-colors text-left"
                >
                  Paddy (Rice Solutions)
                </button>
              </li>
              <li>
                <button
                  onClick={() => selectCropAndScroll("cotton")}
                  className="hover:text-accent transition-colors text-left"
                >
                  Cotton (Crop Protection)
                </button>
              </li>
              <li>
                <button
                  onClick={() => selectCropAndScroll("vegetables")}
                  className="hover:text-accent transition-colors text-left"
                >
                  Vegetables (Yield Booster)
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-gray-500 text-center md:text-left">
            © 2025 Pixelin Sciences Pvt Ltd. All rights reserved.
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

      {/* ==================== FLOATING ELEMENTS ==================== */}

      {/* Scroll to Top */}
      {showScrollToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 w-12 h-12 bg-primary/95 text-white border border-accent/20 rounded-full flex items-center justify-center hover:bg-accent hover:text-darkBg shadow-lg z-40 transition-all duration-300"
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-[#20ba5a] transition-all duration-300 z-40 group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25d366]/40 animate-ping scale-110 pointer-events-none"></span>
        <span className="absolute inset-0 rounded-full bg-[#25d366]/20 animate-pulse scale-125 pointer-events-none"></span>

        <i className="fa-brands fa-whatsapp text-3xl"></i>

        <span className="absolute right-16 bg-darkBg text-white text-xs font-label font-bold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-xl border border-primary/20 w-max">
          Chat with PSPL
        </span>
      </a>

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
              Inquiry Submitted!
            </h4>
            <p className="font-body text-sm text-gray-500 leading-relaxed mb-6 font-light">
              Thank you for contacting Pixelin Sciences Pvt Ltd. An agricultural representative will
              review your message and contact you shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-label font-bold text-sm tracking-wider uppercase rounded-xl transition-all duration-200"
            >
              Return to Website
            </button>
          </div>
        </div>
      )}
    </>
  );
}
