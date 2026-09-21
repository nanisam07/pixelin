"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, Sparkles, Tag, Sprout } from "lucide-react";

export interface BlogItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  authorName: string;
  authorRole: string;
  date: string;
  readingTime: string;
  image: string;
  content: string;
}

interface FeaturedBlogProps {
  blog: BlogItem;
}

export default function FeaturedBlog({ blog }: FeaturedBlogProps) {
  if (!blog) return null;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6 z-20">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#8BC34A]" /> Featured Agronomy Article
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-100 flex flex-col lg:flex-row group hover:shadow-emerald-900/10 transition-all duration-500"
      >
        {/* Decorative Crop Watermark */}
        <div className="absolute -bottom-16 -right-16 text-emerald-900/5 pointer-events-none select-none">
          <Sprout className="w-96 h-96" />
        </div>

        {/* Large Featured Image Column */}
        <div className="lg:w-7/12 relative min-h-[320px] lg:min-h-[460px] overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />

          {/* Category Badge overlay */}
          <div className="absolute top-6 left-6 z-10">
            <span className="px-4 py-1.5 rounded-full bg-[#2E7D32] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <Tag className="w-3.5 h-3.5 text-[#8BC34A]" /> {blog.category}
            </span>
          </div>
        </div>

        {/* Article Details Column */}
        <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-between relative z-10 bg-gradient-to-br from-white via-[#F8FFF6] to-emerald-50/30">
          <div className="space-y-4">
            {/* Meta Stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-md">
                <Calendar className="w-3.5 h-3.5" />
                {blog.date}
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingTime}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-headline text-2xl lg:text-3xl font-extrabold text-[#001F4D] group-hover:text-[#2E7D32] transition-colors duration-300 leading-snug">
              <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed line-clamp-4">
              {blog.description}
            </p>
          </div>

          {/* Footer: Author & Read More Button */}
          <div className="pt-8 mt-6 border-t border-emerald-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-sm shadow-md">
                {blog.authorName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#001F4D]">{blog.authorName}</h4>
                <p className="text-[11px] text-gray-500">{blog.authorRole}</p>
              </div>
            </div>

            <Link
              href={`/blogs/${blog.slug}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md shadow-[#2E7D32]/20 hover:scale-105 shrink-0"
            >
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
