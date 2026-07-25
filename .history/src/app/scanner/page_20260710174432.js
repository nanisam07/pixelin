"use client";

import { useState } from "react";

export default function ScannerPage() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/scan", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResult(data);
  };

  return (
    <div className="min-h-screen p-10 bg-white">
      <h1 className="text-4xl font-bold mb-8">
        AI Crop Scanner
      </h1>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleUpload}
      />

      {image && (
        <img
          src={image}
          className="w-80 mt-8 rounded-xl"
        />
      )}

      {result && (
        <div className="mt-10 p-6 shadow rounded-2xl">

          <h2 className="text-2xl font-bold">
            Disease:
          </h2>

          <p>{result.disease}</p>

          <h2 className="text-2xl mt-5 font-bold">
            Recommended Products
          </h2>

          {result.products.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-xl mt-4"
            >
              <h3 className="font-bold">
                {item.name}
              </h3>

              <p>{item.description}</p>

              <button className="bg-green-600 text-white px-5 py-2 rounded mt-3">
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}