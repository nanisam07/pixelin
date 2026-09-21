"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Sprout, Menu, X, ArrowRight, Shield, Leaf } from "lucide-react";

export default function BlogHeader() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#2E7D32]/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Pixelin Sciences Logo" className="h-12 w-auto group-hover:scale-105 transition-transform duration-300" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link href="/" className="text-emerald-100 hover:text-white transition-colors duration-200">
            {t("nav.home") || "Home"}
          </Link>
          <Link href="/#about" className="text-emerald-100 hover:text-white transition-colors duration-200">
            {t("nav.about") || "About Us"}
          </Link>
          <Link href="/#products" className="text-emerald-100 hover:text-white transition-colors duration-200">
            {t("nav.products") || "Products"}
          </Link>
          <Link href="/blogs" className="text-white font-semibold flex items-center gap-1.5 bg-white/15 px-4 py-2 rounded-full border border-white/20 shadow-inner">
            <Leaf className="w-4 h-4 text-[#8BC34A]" />
            <span>Blogs</span>
          </Link>
          <Link href="/#contact" className="text-emerald-100 hover:text-white transition-colors duration-200">
            {t("nav.contact") || "Contact"}
          </Link>
        </nav>

        {/* CTA Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/scanner"
            className="flex items-center gap-2 px-4 py-2 bg-[#8BC34A] text-[#001F4D] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#9CCC65] transition-all duration-300 hover:scale-105 shadow-md shadow-[#8BC34A]/30"
          >
            <Sprout className="w-4 h-4" />
            AI Crop Doctor
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#8BC34A] hover:text-white rounded-lg focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1B5E20] border-b border-emerald-800 px-6 py-6 space-y-4 animate-fade-up">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white font-medium py-1"
          >
            Home
          </Link>
          <Link
            href="/#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white font-medium py-1"
          >
            About Us
          </Link>
          <Link
            href="/#products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white font-medium py-1"
          >
            Products
          </Link>
          <Link
            href="/blogs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-[#8BC34A] font-bold py-1"
          >
            🌾 Blogs & Articles
          </Link>
          <Link
            href="/scanner"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white font-medium py-1"
          >
            📸 AI Crop Doctor
          </Link>
          <Link
            href="/#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white font-medium py-1"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
