import {
 products
}
from "@/constants/products";

export function
getRecommendations(
 crop:string,
 problem:string
){

 return products.filter(
   (p:any)=>
     p.targets?.includes(
       problem
     )
 );
}