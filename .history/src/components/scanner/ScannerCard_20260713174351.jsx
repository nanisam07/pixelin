"use client";

import React, { useState } from "react";
import { analyzeCropImage } from "../../services/aiService";
import { getTranslation } from "../../constants/translations";
import ProductRecommendations from "./ProductRecommendations";

export default function ScannerCard() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [language, setLanguage] = useState("en");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setScanResult(null);
    }
  };

  const triggerScan = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await analyzeCropImage(image);
      setScanResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerSpeech = () => {
    if (!scanResult) return;
    const textToSpeak = `${getTranslation(language, scanResult.crop)}, ${getTranslation(language, scanResult.issue)}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    if (language === "te") utterance.lang = "te-IN";
    else if (language === "hi") utterance.lang = "hi-IN";
    else utterance.lang = "en-US";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex justify-end gap-2 mb-4">
        <button onClick={() => setLanguage("en")} className={`px-3 py-1 text-sm rounded ${language === "en" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}>EN</button>
        <button onClick={() => setLanguage("te")} className={`px-3 py-1 text-sm rounded ${language === "te" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}>తెలుగు</button>
        <button onClick={() => setLanguage("hi")} className={`px-3 py-1 text-sm rounded ${language === "hi" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}>हिंदी</button>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 transition hover:border-green-500 bg-gray-50">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="crop-image-input" />
        <label htmlFor="crop-image-input" className="cursor-pointer text-center">
          {image ? (
            <p className="text-sm font-medium text-green-600">{image.name}</p>
          ) : (
            <p className="text-sm text-gray-500">Click to upload crop image</p>
          )}
        </label>
      </div>

      {image && !scanResult && (
        <button onClick={triggerScan} disabled={loading} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-xl transition disabled:opacity-50">
          {loading ? "Analyzing..." : "Analyze Plant"}
        </button>
      )}

      {scanResult && scanResult.success && (
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">{getTranslation(language, "DiagnosticReport")}</h3>
            <button onClick={triggerSpeech} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition">
              <span>{getTranslation(language, "Listen")}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 block">Crop</span>
              <span className="font-semibold text-gray-800">{getTranslation(language, scanResult.crop)}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 block">Issue</span>
              <span className="font-semibold text-red-600">{getTranslation(language, scanResult.issue)}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
              <span className="text-xs text-gray-500 block">{getTranslation(language, "Confidence")}</span>
              <span className="font-semibold text-gray-800">{scanResult.confidence}%</span>
            </div>
          </div>

          <ProductRecommendations productIds={scanResult.recommendedProductIds} language={language} />
        </div>
      )}
    </div>
  );
}