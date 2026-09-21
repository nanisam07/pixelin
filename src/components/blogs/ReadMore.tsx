"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";

interface ReadMoreProps {
  onLoadMore: () => void;
  remainingCount: number;
}

export default function ReadMore({ onLoadMore, remainingCount }: ReadMoreProps) {
  if (remainingCount <= 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 text-center"
    >
      <div className="relative p-10 lg:p-14 rounded-3xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white shadow-2xl overflow-hidden border border-white/20">
        {/* Ambient Decorative Shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-[#8BC34A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#8BC34A] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Infinite Knowledge Hub
          </span>

          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
            Explore More Farming Articles
          </h2>

          <p className="text-emerald-100 text-sm sm:text-base font-light">
            We have <span className="font-bold text-amber-300">{remainingCount}</span> more expert guides on paddy, cotton, government subsidies, crop protection, and sustainable practices waiting for you.
          </p>

          <div className="pt-4">
            <button
              onClick={onLoadMore}
              className="px-8 py-4 bg-[#8BC34A] hover:bg-[#9CCC65] text-[#001F4D] font-extrabold rounded-full text-base sm:text-lg transition-all duration-300 shadow-xl shadow-[#8BC34A]/30 hover:scale-105 inline-flex items-center gap-3 cursor-pointer group"
            >
              <span>Read More Blogs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
