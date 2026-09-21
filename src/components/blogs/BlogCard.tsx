"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag, User } from "lucide-react";
import { BlogItem } from "./FeaturedBlog";

interface BlogCardProps {
  blog: BlogItem;
  index: number;
}

export default function BlogCard({ blog, index }: BlogCardProps) {
  // Crop inspired dynamic gradient borders based on category
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "Cotton":
        return { badgeBg: "bg-blue-600", text: "text-blue-700", border: "hover:border-blue-300" };
      case "Paddy":
        return { badgeBg: "bg-emerald-600", text: "text-emerald-700", border: "hover:border-emerald-300" };
      case "Vegetables":
        return { badgeBg: "bg-green-600", text: "text-green-700", border: "hover:border-green-300" };
      case "Government Schemes":
        return { badgeBg: "bg-purple-600", text: "text-purple-700", border: "hover:border-purple-300" };
      case "Organic Farming":
        return { badgeBg: "bg-lime-600", text: "text-lime-700", border: "hover:border-lime-300" };
      case "Fertilizers":
        return { badgeBg: "bg-amber-600", text: "text-amber-700", border: "hover:border-amber-300" };
      case "Pesticides":
        return { badgeBg: "bg-rose-600", text: "text-rose-700", border: "hover:border-rose-300" };
      default:
        return { badgeBg: "bg-[#2E7D32]", text: "text-[#2E7D32]", border: "hover:border-[#2E7D32]" };
    }
  };

  const theme = getCategoryTheme(blog.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100/80 ${theme.border} flex flex-col justify-between hover:-translate-y-1.5`}
    >
      <div>
        {/* Card Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={blog.image}
            alt={blog.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

          {/* Category Badge Animation */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${theme.badgeBg} flex items-center gap-1 group-hover:scale-105 transition-transform`}
            >
              <Tag className="w-3 h-3" /> {blog.category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-3">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {blog.date}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {blog.readingTime}
            </span>
          </div>

          {/* Blog Title */}
          <h3 className="font-headline font-bold text-lg text-[#001F4D] group-hover:text-[#2E7D32] transition-colors duration-300 line-clamp-2 leading-snug">
            <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
          </h3>

          {/* Short Description */}
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
            {blog.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-100 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold text-xs">
            {blog.authorName.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
            {blog.authorName}
          </span>
        </div>

        <Link
          href={`/blogs/${blog.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] group-hover:text-[#1B5E20] hover:underline transition-colors"
        >
          <span>Read More</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}
