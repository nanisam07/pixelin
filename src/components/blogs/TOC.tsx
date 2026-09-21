"use client";

import React from "react";
import { List, ChevronRight } from "lucide-react";

interface TOCProps {
  headings: string[];
  activeHeading: string;
}

export default function TOC({ headings, activeHeading }: TOCProps) {
  if (!headings || headings.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-lg sticky top-28">
      <div className="flex items-center gap-2 mb-4 text-[#001F4D] border-b border-emerald-50 pb-3">
        <List className="w-4 h-4 text-[#2E7D32]" />
        <h4 className="font-headline font-bold text-sm uppercase tracking-wider">
          Table of Contents
        </h4>
      </div>

      <nav className="space-y-2 text-xs font-medium text-gray-600">
        {headings.map((heading, idx) => {
          const id = `heading-${idx}`;
          const isActive = activeHeading === id;

          return (
            <a
              key={idx}
              href={`#${id}`}
              className={`flex items-start gap-2 py-1.5 px-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#F8FFF6] text-[#2E7D32] font-bold border-l-4 border-[#2E7D32]"
                  : "hover:text-[#2E7D32] hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-emerald-600 shrink-0" />
              <span className="line-clamp-2">{heading}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
