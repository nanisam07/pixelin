"use client";

import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalResults: number;
}

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  totalResults,
}: SearchProps) {
  return (
    <div id="search-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-100/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative w-full md:w-2/3">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2E7D32]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, crop (Paddy, Cotton, Vegetables), pests, or keywords..."
            className="w-full pl-12 pr-10 py-3.5 bg-[#F8FFF6] border border-emerald-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown & Counter */}
        <div className="w-full md:w-1/3 flex items-center justify-between md:justify-end gap-4">
          <div className="text-xs font-semibold text-gray-500 shrink-0">
            Showing <span className="text-[#2E7D32] font-bold text-sm">{totalResults}</span> Articles
          </div>

          <div className="relative flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-[#F8FFF6] border border-emerald-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] cursor-pointer"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Reading Time">Reading Time</option>
              <option value="Popular">Popularity</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
