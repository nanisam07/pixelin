"use client";

import React, { useState, useMemo } from "react";
import BlogHeader from "@/components/blogs/BlogHeader";
import Hero from "@/components/blogs/Hero";
import FeaturedBlog from "@/components/blogs/FeaturedBlog";
import BlogGrid from "@/components/blogs/BlogGrid";
import SearchSection from "@/components/blogs/Search";
import Categories from "@/components/blogs/Categories";
import ReadMore from "@/components/blogs/ReadMore";
import Newsletter from "@/components/blogs/Newsletter";
import allBlogsData from "@/knowledge/all_blogs.json";
import { BlogItem } from "@/components/blogs/FeaturedBlog";
import { Sprout } from "lucide-react";

export default function BlogsPage() {
  const allBlogs: BlogItem[] = allBlogsData as BlogItem[];

  // Dynamic States
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [visibleCount, setVisibleCount] = useState(9); // Initially display ONLY 7-10 blog cards!

  // Category filter list
  const categoriesList = [
    "All",
    "Paddy",
    "Cotton",
    "Vegetables",
    "Organic Farming",
    "Government Schemes",
    "Crop Care",
    "Fertilizers",
    "Pesticides",
    "Fruit Crops",
  ];

  // Filter & Search Logic
  const filteredBlogs = useMemo(() => {
    return allBlogs
      .filter((blog) => {
        // Category Filter
        const matchesCategory =
          activeCategory === "All" || blog.category.toLowerCase() === activeCategory.toLowerCase();

        // Search Filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          blog.title.toLowerCase().includes(query) ||
          blog.description.toLowerCase().includes(query) ||
          blog.category.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "Newest") return b.id - a.id;
        if (sortBy === "Oldest") return a.id - b.id;
        if (sortBy === "Reading Time") {
          const timeA = parseInt(a.readingTime) || 0;
          const timeB = parseInt(b.readingTime) || 0;
          return timeB - timeA;
        }
        return b.id - a.id; // Popularity fallback
      });
  }, [allBlogs, activeCategory, searchQuery, sortBy]);

  // Featured blog (always latest featured)
  const featuredBlog = allBlogs[0];

  // Currently displayed blog cards (Excluding featured if viewing All, or taking slice)
  const gridBlogs = filteredBlogs.slice(0, visibleCount);

  // Load All remaining blogs dynamically without page reload
  const handleLoadMore = () => {
    setVisibleCount(filteredBlogs.length);
  };

  const scrollToGrid = () => {
    const el = document.getElementById("blog-grid-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FFF6] text-gray-800 flex flex-col justify-between font-body antialiased">
      {/* Dynamic Navbar */}
      <BlogHeader />

      <main className="flex-grow">
        {/* Full-width Hero Section */}
        <Hero totalBlogs={allBlogs.length} onExploreClick={scrollToGrid} />

        {/* Featured Blog Section */}
        <FeaturedBlog blog={featuredBlog} />

        {/* Section Divider with Agriculture Graphic */}
        <div className="max-w-7xl mx-auto px-4 my-8 flex items-center justify-center">
          <div className="h-px bg-emerald-200 flex-grow max-w-md" />
          <div className="px-4 flex items-center gap-2 text-[#2E7D32] text-xs font-bold uppercase tracking-wider bg-[#F8FFF6]">
            <Sprout className="w-4 h-4 text-[#8BC34A]" /> Agricultural Knowledge Vault
          </div>
          <div className="h-px bg-emerald-200 flex-grow max-w-md" />
        </div>

        {/* Search Bar */}
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalResults={filteredBlogs.length}
        />

        {/* Category Filters */}
        <Categories
          categories={categoriesList}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Blog Cards Grid */}
        <section id="blog-grid-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BlogGrid blogs={gridBlogs} />
        </section>

        {/* Read More Blogs Section (Loads remaining dynamically) */}
        {visibleCount < filteredBlogs.length && (
          <ReadMore
            onLoadMore={handleLoadMore}
            remainingCount={filteredBlogs.length - visibleCount}
          />
        )}

        {/* Farmer Newsletter */}
        <Newsletter />
      </main>

      {/* Footer */}
      <footer className="bg-[#001F4D] text-white py-12 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/pixelein_logo.png" alt="Pixelin Logo" className="h-10 w-auto" />
            <div>
              <span className="font-headline font-bold text-lg text-white">Pixelin Sciences Pvt Ltd</span>
              <p className="text-xs text-emerald-200">Developed with Science. Formulated with Precision.</p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Pixelin Sciences Pvt Ltd. All rights reserved. Agri Tech & Crop Solutions.
          </p>
        </div>
      </footer>
    </div>
  );
}
