"use client";

import React from "react";
import { motion } from "framer-motion";
import { Filter, Layers } from "lucide-react";

interface CategoriesProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function Categories({
  categories,
  activeCategory,
  setActiveCategory,
}: CategoriesProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-800">
        <Filter className="w-4 h-4 text-[#2E7D32]" />
        <span>Filter By Category & Topics</span>
      </div>

      {/* Horizontal Scrollable Category Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? "bg-[#2E7D32] text-white border-[#2E7D32] shadow-lg shadow-[#2E7D32]/25 scale-105"
                  : "bg-white text-gray-700 border-emerald-100 hover:bg-[#F8FFF6] hover:border-emerald-300 hover:text-[#2E7D32]"
              }`}
            >
              {cat === "All" && <Layers className="w-3.5 h-3.5" />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
