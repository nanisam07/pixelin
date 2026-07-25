
await fetch("/api/order", {
  method: "POST",
  body: JSON.stringify(orderData),
});