"use client";

import React, { useState } from "react";
import { MessageSquare, Send, User, CheckCircle2 } from "lucide-react";

export default function CommentSection() {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Ramesh Reddy",
      location: "Nalgonda, TS",
      date: "2 days ago",
      text: "Extremely helpful article for cotton seedling stage. We applied Extend last week and noticed a significant decrease in thrips attack.",
    },
    {
      id: 2,
      name: "K. Venkatarao",
      location: "East Godavari, AP",
      date: "4 days ago",
      text: "Great insights on Karbac and Pure Auxin for paddy root growth. Thank you Pixelin team for providing scientific guidance to farmers.",
    },
  ]);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [posted, setPosted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    setComments([
      {
        id: Date.now(),
        name,
        location: "Verified Farmer",
        date: "Just now",
        text,
      },
      ...comments,
    ]);

    setName("");
    setText("");
    setPosted(true);
    setTimeout(() => setPosted(false), 4000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl my-12">
      <div className="flex items-center gap-2 mb-6 border-b border-emerald-50 pb-4">
        <MessageSquare className="w-5 h-5 text-[#2E7D32]" />
        <h3 className="font-headline font-bold text-xl text-[#001F4D]">
          Farmer Discussion ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-[#F8FFF6] p-6 rounded-2xl border border-emerald-100">
        <h4 className="font-bold text-sm text-[#001F4D]">Leave a comment or ask a crop question:</h4>

        {posted && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2E7D32] bg-emerald-100 p-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4" /> Thank you! Your comment has been posted successfully.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name (e.g. Farmer Suresh)"
            className="px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </div>

        <textarea
          required
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience or ask about recommended dosages..."
          className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
        />

        <button
          type="submit"
          className="px-6 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" /> Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {comment.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h5 className="font-bold text-sm text-[#001F4D]">{comment.name}</h5>
                <span className="text-[11px] text-gray-400 font-medium">• {comment.location}</span>
                <span className="text-[11px] text-gray-400 font-medium">• {comment.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
