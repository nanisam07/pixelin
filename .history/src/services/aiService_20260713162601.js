import { validateImage }
from "./imageValidator";

export async function analyzeCropImage(
  imageFile
) {
  await new Promise(
    (resolve) =>
      setTimeout(resolve, 2500)
  );

  const image =
    new Image();

  image.src =
    URL.createObjectURL(
      imageFile
    );

  await new Promise(
    (resolve) => {
      image.onload = resolve;
    }
  );

  const predictions =
    await validateImage(
      image
    );

  console.log(predictions);