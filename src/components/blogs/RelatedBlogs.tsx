"use client";

import React from "react";
import BlogCard from "./BlogCard";
import { BlogItem } from "./FeaturedBlog";
import { Sparkles } from "lucide-react";

interface RelatedBlogsProps {
  currentBlogId: number;
  category: string;
  allBlogs: BlogItem[];
}

export default function RelatedBlogs({ currentBlogId, category, allBlogs }: RelatedBlogsProps) {
  // Filter related articles in same category or fallback to top blogs
  const related = allBlogs
    .filter((b) => b.id !== currentBlogId && (b.category === category || category === "All"))
    .slice(0, 3);

  const displayBlogs = related.length >= 3 ? related : allBlogs.filter((b) => b.id !== currentBlogId).slice(0, 3);

  if (displayBlogs.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#8BC34A]" /> Recommended Agronomy Reads
          </span>
          <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#001F4D]">
            Related Articles You Might Like
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayBlogs.map((blog, idx) => (
          <BlogCard key={blog.id} blog={blog} index={idx} />
        ))}
      </div>
    </section>
  );
}
