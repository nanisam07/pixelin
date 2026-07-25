export const products = [
  {
    id: "expel-r",
    name: "expel-r",
    price: 499,
    image: "/images/products/expel-r.png",
    category: "Pesticide"
  },
  {
    id: "dodger",
    name: "dodger",
    price: 599,
    image: "/images/products/dodger.png",
    category: "Fungicide"
  },
  {
    id: "pixel-sensa",
    name: "pixel-sensa",
    price: 650,
    image: "/images/products/pixel-sensa.png",
    category: "Antibacterial"
  }
];

export function getRecommendedProducts(ids = []) {
  const targetIds = Array.isArray(ids) ? ids : [];
  return products.filter(p => targetIds.includes(p.id));
}