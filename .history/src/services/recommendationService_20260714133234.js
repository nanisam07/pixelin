import cotton from
"@/knowledge/cotton.json";

import { products }
from "@/constants/products";

export function
getRecommendations(
crop,
problem
){

  const item =
  cotton[problem];

  if(!item)
    return [];

  return products.filter(
    p =>
      item.products.includes(
        p.id
      )
  );
}