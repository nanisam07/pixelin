"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, FileImage, Loader2, RefreshCw, CheckCircle } from "lucide-react";
import { analyzeCropImage } from "../../services/aiService";

export default function ScannerCard({ onScanStart, onScanComplete }) {
  const [image, setImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const statuses = [
    "Uploading crop image...",
    "Analyzing leaf chlorophyll distribution...",
    "Scanning for foliar pathogens & lesions...",
    "Cross-referencing crop distress database...",
    "Generating product recommendation matrix...",
  ];

  const simulateScanning = async (file) => {
    setIsScanning(true);
    onScanStart();
    setScanProgress(0);
    setScanStatus(statuses[0]);

    // Interval to update progress and status text
    const intervalTime = 500; // updates every 500ms
    const totalTime = 2500; // 2.5s total
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const progressPercent = Math.min(100, Math.floor((elapsed / totalTime) * 100));
      setScanProgress(progressPercent);

      // Cycle status text
      const statusIdx = Math.min(
        statuses.length - 1,
        Math.floor((elapsed / totalTime) * statuses.length)
      );
      setScanStatus(statuses[statusIdx]);

      if (elapsed >= totalTime) {
        clearInterval(timer);
      }
    }, intervalTime);

    try {
      const result = await analyzeCropImage(file);
      setIsScanning(false);
      onScanComplete(result);
    } catch (error) {
      console.error("Scan error:", error);
      setIsScanning(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      simulateScanning(file);
    }
    const img = new Image();

img.src = imageUrl;

img.onload = async () => {
  const predictions =
    await validateCropImage(img);

  console.log(predictions);
};
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        simulateScanning(file);
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const triggerCameraSelect = () => {
    cameraInputRef.current.click();
  };

  const resetScanner = () => {
    setImage(null);
    setScanProgress(0);
    setScanStatus("");
    onScanComplete(null);
  };

  return (
    <div className="w-full">
      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border transition-all duration-500 shadow-2xl p-6 md:p-8 ${
          dragActive
            ? "border-secondary bg-secondary/5 shadow-secondary/10"
            : "border-white/10 bg-white/5 hover:border-white/20 shadow-black/40"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              {/* Outer glowing ring */}
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary-muted border border-white/10 mb-6 group cursor-pointer hover:border-secondary/50 transition-all duration-300 shadow-lg shadow-black/10" onClick={triggerFileSelect}>
                <motion.div 
                  className="absolute inset-0 rounded-full border border-secondary/30 scale-100 opacity-60"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <Upload className="w-10 h-10 text-secondary group-hover:scale-110 transition-transform duration-300" />
              </div>

              <h3 className="font-headline text-xl font-bold text-white mb-2 tracking-wide">
                Upload Crop Leaf Image
              </h3>
              <p className="font-body text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
                Drag and drop your image here, or select one from your local files or camera.
              </p>

              {/* Upload actions */}
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="px-6 py-3.5 bg-primary-light hover:bg-primary text-white font-label font-bold text-sm tracking-wide rounded-xl border border-white/10 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-md cursor-pointer"
                >
                  <FileImage className="w-4 h-4 text-secondary" />
                  Select Image
                </button>
                <button
                  type="button"
                  onClick={triggerCameraSelect}
                  className="px-6 py-3.5 bg-secondary hover:bg-secondary-light text-white font-label font-bold text-sm tracking-wide rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-secondary-dark/20 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Capture Photo
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview-and-scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Image Preview Container */}
              <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[360px] rounded-2xl overflow-hidden border border-white/10 bg-black/30 group">
                <img
                  src={image}
                  alt="Crop preview"
                  className="w-full h-full object-contain"
                />

                {/* Laser scan lines */}
                {isScanning && (
                  <>
                    {/* Laser line bar */}
                    <motion.div
                      className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-secondary to-transparent z-10 shadow-[0_0_15px_#52C452,0_0_5px_#52C452]"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Glowing scanning shade */}
                    <motion.div
                      className="absolute left-0 w-full bg-gradient-to-b from-secondary/5 to-transparent z-0"
                      style={{ height: "40px" }}
                      animate={{ top: ["-40px", "100%", "-40px"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Tech scanning grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(82,196,82,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                  </>
                )}
              </div>

              {/* Progress and status */}
              <div className="w-full mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label text-xs uppercase tracking-widest text-gray-400 font-bold">
                    {isScanning ? "AI Diagnostics Active" : "Image Staged"}
                  </span>
                  <span className="font-label text-sm text-secondary font-bold">
                    {scanProgress}%
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-secondary-light to-secondary shadow-[0_0_10px_#52C452]"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ ease: "easeInOut" }}
                  />
                </div>

                {/* Status text */}
                <div className="mt-4 flex items-center justify-between min-h-[24px]">
                  <p className="font-body text-xs text-gray-300 italic flex items-center gap-2">
                    {isScanning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-secondary" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                    )}
                    {scanStatus || "Ready to evaluate crop tissue"}
                  </p>

                  {!isScanning && (
                    <button
                      type="button"
                      onClick={resetScanner}
                      className="text-xs text-accent hover:text-accent-light flex items-center gap-1 font-label uppercase font-bold tracking-wider transition-colors duration-200 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset Scan
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
