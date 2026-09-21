"use client";

import React from "react";
import { motion } from "framer-motion";
import { BlogItem } from "./FeaturedBlog";
import { Calendar, Clock, Tag, User, Sprout, CheckCircle2 } from "lucide-react";
import ShareButtons from "./ShareButtons";

interface BlogContentProps {
  blog: BlogItem;
  headings: string[];
}

export default function BlogContent({ blog, headings }: BlogContentProps) {
  // Process raw text into structured HTML paragraphs with headings
  const renderParagraphs = () => {
    if (!blog.content) return null;

    const lines = blog.content.split("\n\n");
    let headingCounter = 0;

    return lines.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      // Check if paragraph is a heading title
      const isHeader =
        trimmed.length < 80 &&
        !trimmed.endsWith(".") &&
        !trimmed.startsWith("*") &&
        !trimmed.startsWith("-") &&
        index > 0 &&
        lines[index - 1] === "";

      if (isHeader) {
        const id = `heading-${headingCounter++}`;
        return (
          <h2
            key={index}
            id={id}
            className="font-headline font-extrabold text-2xl sm:text-3xl text-[#001F4D] mt-10 mb-4 pt-4 border-t border-emerald-50 scroll-mt-28"
          >
            {trimmed}
          </h2>
        );
      }

      // Check if bullet point list
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        const bulletItems = trimmed.split("\n").filter(Boolean);
        return (
          <ul key={index} className="my-4 space-y-2.5 pl-2">
            {bulletItems.map((item, bIdx) => {
              const cleanItem = item.replace(/^[\*\-]\s*/, "");
              return (
                <li key={bIdx} className="flex items-start gap-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>{cleanItem}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={index} className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 font-normal">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl relative overflow-hidden">
      {/* Blog Article Banner */}
      <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden mb-8 shadow-md">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs font-semibold">
          <span className="px-3.5 py-1.5 rounded-full bg-[#2E7D32] uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <Tag className="w-3.5 h-3.5 text-[#8BC34A]" /> {blog.category}
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> {blog.readingTime}
          </span>
        </div>
      </div>

      {/* Author & Date Bar */}
      <div className="flex items-center justify-between border-b border-emerald-100 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-lg shadow-md">
            {blog.authorName.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#001F4D]">{blog.authorName}</h4>
            <p className="text-xs text-gray-500">{blog.authorRole}</p>
          </div>
        </div>

        <div className="text-right text-xs text-gray-500 font-medium">
          <span className="block font-semibold text-emerald-700">{blog.date}</span>
          <span>Verified Agronomy Article</span>
        </div>
      </div>

      {/* Main Formatted Article Body */}
      <div className="prose max-w-none prose-emerald font-body">{renderParagraphs()}</div>

      {/* Agronomy Disclaimer Banner */}
      <div className="mt-10 p-6 rounded-2xl bg-[#F8FFF6] border border-emerald-200 flex items-start gap-4">
        <Sprout className="w-8 h-8 text-[#2E7D32] shrink-0" />
        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
          <h5 className="font-bold text-[#001F4D]">Pixelin Agronomy Field Advisory</h5>
          <p>
            Always follow local weather advisory recommendations and field dosage guidelines. For specific pest outbreaks or severe crop distress, consult our Pixelin Agronomists or use our AI Crop Doctor Scanner.
          </p>
        </div>
      </div>

      {/* Social Share Buttons */}
      <ShareButtons title={blog.title} />
    </article>
  );
}
