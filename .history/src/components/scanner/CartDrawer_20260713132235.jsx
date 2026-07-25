"use client";

import { motion, AnimatePresence } from "framer-motion";

import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { useState } from "react";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST typical for agri-inputs
  const total = subtotal + tax;

  const handleCheckout = async () => {
  setIsCheckingOut(true);

  if (!navigator.geolocation) {
    alert("Location is not supported");
    setIsCheckingOut(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        // Get address from coordinates
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await res.json();

        const address = data.display_name;

        console.log("Location:", {
          latitude,
          longitude,
          address,
        });

        // Save order data
        const orderData = {
          products: cartItems,
          latitude,
          longitude,
          address,
        };

        console.log(orderData);

        // Later send this to backend
        localStorage.setItem(
          "latestOrder",
          JSON.stringify(orderData)
        );

        setIsCheckingOut(false);
        setCheckoutSuccess(true);

        setTimeout(() => {
          setCheckoutSuccess(false);
          onClearCart();
          onClose();
        }, 3500);
      } catch (err) {
        console.log(err);
        setIsCheckingOut(false);
      }
    },
    (error) => {
      alert("Please allow location access.");
      setIsCheckingOut(false);
    }
  );
};

  // Render product preview mini icon
  const renderProductMiniIcon = (id) => {
    let color = "#EF4444";
    if (id === "pixel-sensa") color = "#10B981";
    if (id === "dodger") color = "#3B82F6";

    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10"
        style={{ backgroundColor: `${color}15` }}
      >
        <span style={{ color }} className="font-label font-bold text-xs">
          {id === "expel-r" ? "EXP" : id === "pixel-sensa" ? "SEN" : "DOD"}
        </span>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-darkBg border-l border-white/10 shadow-2xl z-50 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                  <ShoppingBag className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-headline text-lg font-bold text-white tracking-wide">
                  Your Ag-Tech Cart
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="wait">
                {checkoutSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary mb-6 shadow-[0_0_20px_rgba(82,196,82,0.2)]">
                      <CheckCircle2 className="w-10 h-10 animate-bounce" />
                    </div>
                    <h4 className="font-headline text-2xl font-bold text-white mb-2">
                      Order Placed!
                    </h4>
                    <p className="font-body text-gray-400 text-sm max-w-xs leading-relaxed">
                      Thank you for choosing Pixelin Sciences. A digital invoice and application guide have been sent.
                    </p>
                  </motion.div>
                ) : cartItems.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20 text-gray-500"
                  >
                    <ShoppingBag className="w-12 h-12 mb-4 text-gray-600 stroke-[1.5]" />
                    <p className="font-label text-sm uppercase tracking-wider mb-1 font-bold text-gray-400">
                      Cart is Empty
                    </p>
                    <p className="font-body text-xs text-gray-500 max-w-[200px]">
                      Add products from your crop diagnostic report.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="list" className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group"
                      >
                        {renderProductMiniIcon(item.id)}

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-label font-bold text-sm text-white truncate">
                            {item.name}
                          </h4>
                          <span className="block text-[10px] text-gray-400 font-body mb-2">
                            Dosage: {item.dosage.split(" per ")[0]}
                          </span>
                          <span className="font-headline text-sm text-secondary font-bold">
                            ₹{item.price}
                          </span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-label font-bold text-xs text-white min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Trash */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && !checkoutSuccess && (
              <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs text-gray-400 font-body">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-body">
                    <span>GST (18% Ag-tax)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white font-label font-bold border-t border-white/5 pt-3">
                    <span>Total Amount</span>
                    <span className="text-secondary text-base">₹{total}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 bg-secondary hover:bg-secondary-light disabled:bg-secondary/40 text-white font-label font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-secondary-dark/15 cursor-pointer"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      Securing Checkout...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
