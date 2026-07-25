export const products = [
  {
    id: "expel-r",
    name: "expel-r",
    price: 499,
    image: "/images/products/expel-r.png",
    category: "Pesticide",
    dosage:"250ml per acre"
  },
  {
    id: "dodger",
    name: "dodger",
    price: 599,
    image: "/images/products/dodger.png",
    category: "Fungicide",
    dosage:"330ml per acre"
  },
  {
    id: "pixel-sensa",
    name: "pixel-sensa",
    price: 650,
    image: "/images/products/pixel-sensa.png",
    category: "Antibacterial",
    dosage:"250ml per acre"
  }
];

export function getRecommendedProducts(ids = []) {
  const targetIds = Array.isArray(ids) ? ids : [];
  return products.filter(p => targetIds.includes(p.id));
}