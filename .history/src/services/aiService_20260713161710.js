export async function analyzeCropImage(file) {
  const fileName = file.name.toLowerCase();

  if (
    fileName.includes("person") ||
    fileName.includes("selfie")
  ) {
    return {
      error:
        "Please upload a crop leaf image.",
    };
  }

  return {
    disease: "Aphids Attack",
    products: [...]
  };
}