"use client";

import React from "react";
import BlogCard from "./BlogCard";
import { BlogItem } from "./FeaturedBlog";
import { Frown } from "lucide-react";

interface BlogGridProps {
  blogs: BlogItem[];
}

export default function BlogGrid({ blogs }: BlogGridProps) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-emerald-100 shadow-sm max-w-2xl mx-auto my-8">
        <Frown className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-bounce" />
        <h3 className="text-xl font-bold text-[#001F4D]">No farming articles found</h3>
        <p className="text-gray-500 text-sm mt-1">
          Try adjusting your search query or selecting a different crop category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog, idx) => (
        <BlogCard key={blog.id} blog={blog} index={idx} />
      ))}
    </div>
  );
}
