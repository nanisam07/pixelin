"use client";

import React, { useState } from "react";
import { Share2, Link as LinkIcon, Check, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const currentUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";

  return (
    <div className="flex flex-wrap items-center gap-3 py-6 border-y border-emerald-100 my-8">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
        <Share2 className="w-4 h-4 text-[#2E7D32]" /> Share Article:
      </span>

      <div className="flex items-center gap-2">
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm flex items-center gap-1 text-xs font-semibold px-3"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm text-xs font-semibold px-3"
          title="Share on Facebook"
        >
          Facebook
        </a>

        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all duration-300 shadow-sm text-xs font-semibold px-3"
          title="Share on Twitter"
        >
          Twitter
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="p-2.5 rounded-full bg-emerald-50 text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all duration-300 shadow-sm flex items-center gap-1 text-xs font-semibold px-3 cursor-pointer"
          title="Copy Link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  );
}
