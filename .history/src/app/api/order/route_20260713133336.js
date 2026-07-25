localStorage.setItem(
  "latestOrder",
  JSON.stringify(orderData)
);
await fetch("/api/order", {
  method: "POST",
  body: JSON.stringify(orderData),
});