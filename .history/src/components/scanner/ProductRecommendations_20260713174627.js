"use client";

import React, { useState } from "react";
import { getRecommendedProducts } from "../../services/productService";
import { getTranslation } from "../../constants/translations";

export default function ProductRecommendations({ productIds = [], language = "en" }) {
  const [cart, setCart] = useState({});
  const recommendedList = getRecommendedProducts(productIds);

  const toggleCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (recommendedList.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 gap-4">
        {recommendedList.map((product) => {
          const isInCart = !!cart[product.id];
          return (
            <div key={product.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition bg-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs text-gray-400">
                  IMAGE
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{getTranslation(language, product.name)}</h4>
                  <p className="text-sm text-gray-500">₹{product.price}</p>
                </div>
              </div>
              <button onClick={() => toggleCart(product.id)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${isInCart ? "bg-gray-100 text-gray-600" : "bg-green-600 text-white hover:bg-green-700"}`}>
                {isInCart ? getTranslation(language, "AddedToCart") : getTranslation(language, "AddToCart")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}