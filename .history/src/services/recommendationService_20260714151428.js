export function getRecommendations(
  crop,
  problem,
  cropProducts
) {
  const aliases = {
    "Brown Plant Hopper": [
      "BPH",
      "Brown Plant Hopper"
    ],

    "Rice Blast": [
      "Blast",
      "Rice Blast"
    ],

    "Whitefly": [
      "Whitefly",
      "White Fly"
    ],

    "Pink Bollworm": [
      "Pink Bollworm",
      "Pink"
    ]
  };

  const searchTerms =
    aliases[problem] ||
    [problem];

  const allProducts = [
    ...cropProducts.paddy.items,
    ...cropProducts.cotton.items,
    ...cropProducts.vegetables.items
  ];

  return allProducts.filter(
    (product) =>
      product.targets?.some(
        (target) =>
          searchTerms.some(
            (term) =>
              target
                .toLowerCase()
                .includes(
                  term.toLowerCase()
                )
          )
      )
  );
}