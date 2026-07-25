/**
 * Product Service (Mock Product Database)
 * 
 * Contains data for Pixelin Sciences products.
 * This is used to query products recommended after an AI scan.
 */

export const products = [
  {
    id: "expel-r",
    name: "EXPEL-R",
    category: "Systemic Insecticide",
    description: "Broad-spectrum systemic and contact insecticide designed for swift elimination of boring pests.",
    whyRecommended: "Formulated specifically to penetrate stem walls and eliminate hidden Stem Borer larvae rapidly, preventing standard crop lodging.",
    dosage: "2.0 ml per Liter of water",
    price: 450,
    gradient: "from-red-500/20 to-orange-500/20",
    borderGlow: "hover:border-red-500/40 border-red-500/10",
    textGradient: "from-red-400 to-orange-400",
    bgBadge: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: "fa-shield-halved",
    imgColor: "rgba(239, 68, 68, 0.2)"
  },
  {
    id: "pixel-sensa",
    name: "PIXEL SENSA",
    category: "Crop Bio-Stimulant",
    description: "Premium bio-active compound to stimulate natural plant defense mechanisms and cellular recovery.",
    whyRecommended: "Helps the paddy crop recover from physiological stress and tissue damage caused by stem boring, restoring nutrient flow.",
    dosage: "1.5 ml per Liter of water",
    price: 650,
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderGlow: "hover:border-emerald-500/40 border-emerald-500/10",
    textGradient: "from-emerald-400 to-teal-400",
    bgBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "fa-seedling",
    imgColor: "rgba(16, 185, 129, 0.2)"
  },
  {
    id: "dodger",
    name: "DODGER",
    category: "Insect Growth Regulator",
    description: "Advanced growth regulator that disrupts the life cycle of moths and boring larvae.",
    whyRecommended: "Prevents re-infestation by stopping the development of Stem Borer eggs and pupae, providing long-lasting protective cover.",
    dosage: "1.0 g per Liter of water",
    price: 380,
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderGlow: "hover:border-blue-500/40 border-blue-500/10",
    textGradient: "from-blue-400 to-cyan-400",
    bgBadge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "fa-vial",
    imgColor: "rgba(59, 130, 246, 0.2)"
  }
];

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getRecommendedProducts(ids) {
  return products.filter(p => ids.includes(p.id));
}
