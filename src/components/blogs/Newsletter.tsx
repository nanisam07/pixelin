"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, ShieldCheck, Sprout } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="bg-gradient-to-br from-[#001F4D] via-[#002B66] to-[#1B5E20] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Background Accent Graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="md:w-1/2 space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#8BC34A] text-xs font-semibold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            <span>Weekly Farmer Digest</span>
          </div>

          <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-white">
            Get Weekly Agri Tips & Advisory Delivered
          </h3>

          <p className="text-gray-300 text-sm font-light leading-relaxed">
            Subscribe to Pixelin Agronomy insights. Receive timely pest alert warnings, crop schedules, and market pricing directly to your email.
          </p>
        </div>

        <div className="md:w-1/2 w-full z-10">
          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-800/60 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-2"
            >
              <CheckCircle2 className="w-10 h-10 text-[#8BC34A] mx-auto animate-bounce" />
              <h4 className="font-bold text-white text-lg">Thank You for Subscribing!</h4>
              <p className="text-emerald-200 text-xs">
                You will now receive weekly agronomy advice and crop protection alerts.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-[#8BC34A] hover:bg-[#9CCC65] text-[#001F4D] font-bold rounded-2xl text-sm transition-all duration-300 shadow-lg shadow-[#8BC34A]/25 shrink-0 cursor-pointer"
              >
                Subscribe Now
              </button>
            </form>
          )}

          <div className="flex items-center justify-center md:justify-start gap-4 text-[11px] text-gray-400 mt-3 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8BC34A]" /> No spam, cancel anytime
            </span>
            <span>•</span>
            <span>Over 15,000+ Farmers Subscribed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
