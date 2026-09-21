"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogHeader from "@/components/blogs/BlogHeader";
import BlogContent from "@/components/blogs/BlogContent";
import TOC from "@/components/blogs/TOC";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import CommentSection from "@/components/blogs/CommentSection";
import Newsletter from "@/components/blogs/Newsletter";
import allBlogsData from "@/knowledge/all_blogs.json";
import { BlogItem } from "@/components/blogs/FeaturedBlog";
import { ArrowLeft, ArrowRight, Home, ChevronRight, BookOpen } from "lucide-react";

export default function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const allBlogs: BlogItem[] = allBlogsData as BlogItem[];

  // Find target blog by slug
  const blogIndex = allBlogs.findIndex((b) => b.slug === slug);
  const blog = allBlogs[blogIndex];

  if (!blog) {
    return notFound();
  }

  // Prev / Next articles
  const prevBlog = blogIndex > 0 ? allBlogs[blogIndex - 1] : null;
  const nextBlog = blogIndex < allBlogs.length - 1 ? allBlogs[blogIndex + 1] : null;

  // Extract headings from blog content for TOC
  const headings = React.useMemo(() => {
    if (!blog.content) return [];
    const lines = blog.content.split("\n\n");
    return lines.filter(
      (line, index) =>
        line.trim().length < 80 &&
        !line.trim().endsWith(".") &&
        !line.trim().startsWith("*") &&
        !line.trim().startsWith("-") &&
        index > 0 &&
        lines[index - 1] === ""
    );
  }, [blog]);

  const [activeHeading, setActiveHeading] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (let i = 0; i < headings.length; i++) {
        const el = document.getElementById(`heading-${i}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height + 300) {
            setActiveHeading(`heading-${i}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <div className="min-h-screen bg-[#F8FFF6] text-gray-800 flex flex-col justify-between font-body antialiased">
      <BlogHeader />

      <main className="flex-grow">
        {/* Breadcrumb Navigation Bar */}
        <div className="bg-[#E8F5E9] border-b border-emerald-100 py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <Link href="/blogs" className="hover:underline">
              Blogs
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-600 truncate max-w-[200px] sm:max-w-md">{blog.title}</span>
          </div>
        </div>

        {/* Article Banner Header */}
        <div className="bg-gradient-to-b from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-4 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#8BC34A] text-xs font-bold uppercase tracking-wider border border-white/20">
              🌾 {blog.category} Guide
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
              {blog.title}
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
              {blog.description}
            </p>
          </div>
        </div>

        {/* Article Layout Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] bg-white px-4 py-2 rounded-xl border border-emerald-100 shadow-sm transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sticky Table of Contents Sidebar */}
            {headings.length > 0 && (
              <aside className="lg:w-1/4 hidden lg:block">
                <TOC headings={headings} activeHeading={activeHeading} />
              </aside>
            )}

            {/* Main Content Area */}
            <div className={`w-full ${headings.length > 0 ? "lg:w-3/4" : "max-w-4xl mx-auto"}`}>
              <BlogContent blog={blog} headings={headings} />

              {/* Prev / Next Article Pagination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
                {prevBlog ? (
                  <Link
                    href={`/blogs/${prevBlog.slug}`}
                    className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-md hover:shadow-lg transition-all group flex items-start gap-3"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Previous Article
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-[#001F4D] group-hover:text-[#2E7D32] line-clamp-2">
                        {prevBlog.title}
                      </h5>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextBlog && (
                  <Link
                    href={`/blogs/${nextBlog.slug}`}
                    className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-md hover:shadow-lg transition-all group flex items-start justify-end gap-3 text-right"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Next Article
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-[#001F4D] group-hover:text-[#2E7D32] line-clamp-2">
                        {nextBlog.title}
                      </h5>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

              {/* Comments Section */}
              <CommentSection />
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <RelatedBlogs currentBlogId={blog.id} category={blog.category} allBlogs={allBlogs} />

        {/* Newsletter */}
        <Newsletter />
      </main>

      {/* Footer */}
      <footer className="bg-[#001F4D] text-white py-12 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Pixelin Logo" className="h-10 w-auto" />
            <div>
              <span className="font-headline font-bold text-lg text-white">Pixelin Sciences Pvt Ltd</span>
              <p className="text-xs text-emerald-200">Developed with Science. Formulated with Precision.</p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Pixelin Sciences Pvt Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
