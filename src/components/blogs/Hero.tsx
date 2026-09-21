"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, BookOpen, Compass, Wheat, ShieldCheck } from "lucide-react";

interface HeroProps {
  totalBlogs: number;
  onExploreClick: () => void;
}

export default function Hero({ totalBlogs, onExploreClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden bg-gradient-to-b from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white">
      {/* Background Cinematic Image with Layered Overlay & Parallax feel */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-35 mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85"
          alt="Agriculture Field Background"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 animate-breeze"
        />
      </div>

      {/* Layered Gradient Overlays for Cinematic Lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20] via-transparent to-[#1B5E20]/60 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent z-0 pointer-events-none" />

      {/* Wind & Floating Leaf Particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <motion.div
          animate={{
            y: [-10, 20, -10],
            x: [-10, 15, -10],
            rotate: [0, 15, -5, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] text-[#8BC34A]/40 text-4xl"
        >
          🍃
        </motion.div>
        <motion.div
          animate={{
            y: [15, -25, 15],
            x: [20, -10, 20],
            rotate: [-10, 20, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-[12%] text-amber-300/40 text-5xl"
        >
          🌿
        </motion.div>
        <motion.div
          animate={{
            y: [-20, 15, -20],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-[35%] text-[#8BC34A]/30 text-3xl"
        >
          🌾
        </motion.div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#8BC34A] text-xs sm:text-sm font-semibold tracking-wide uppercase"
          >
            <Wheat className="w-4 h-4 text-amber-300" />
            <span>Pixelin Agronomy Knowledge Base • {totalBlogs}+ Expert Articles</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Empowering Farmers with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] via-emerald-300 to-amber-300">Knowledge</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-emerald-50 leading-relaxed font-light max-w-2xl"
          >
            Explore expert articles on farming, crop cultivation, modern agriculture, government schemes, crop protection, sustainable farming, and the latest agricultural innovations.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-2 flex flex-wrap items-center gap-4 justify-center md:justify-start"
          >
            <button
              onClick={onExploreClick}
              className="px-8 py-4 bg-[#8BC34A] hover:bg-[#9CCC65] text-[#001F4D] font-bold rounded-full text-base tracking-wide transition-all duration-300 shadow-xl shadow-[#8BC34A]/25 hover:scale-105 flex items-center gap-3 cursor-pointer group"
            >
              <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Explore Articles</span>
            </button>

            <a
              href="#search-section"
              className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium rounded-full text-base transition-all duration-300 border border-white/20 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#8BC34A]" />
              <span>Search Keywords</span>
            </a>
          </motion.div>
        </div>

        {/* Floating Hero Visual Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:block w-72 lg:w-80 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#8BC34A] text-[#001F4D] flex items-center justify-center font-bold text-lg">
              🌱
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Farmer Success Guarantee</h4>
              <p className="text-xs text-emerald-200">Scientifically Validated</p>
            </div>
          </div>
          <p className="text-xs text-emerald-100 italic leading-relaxed mb-4">
            "Empowering cotton & paddy farmers across Telangana & Andhra Pradesh with sustainable agronomy practices."
          </p>
          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-white/10">
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="block font-bold text-[#8BC34A] text-sm">75+</span>
              <span className="text-[10px] text-emerald-200">Articles</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="block font-bold text-amber-300 text-sm">100%</span>
              <span className="text-[10px] text-emerald-200">Free Knowledge</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Curve Bottom Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#F8FFF6] [clip-path:ellipse(60%_100%_at_50%_100%)]" />
    </section>
  );
}
