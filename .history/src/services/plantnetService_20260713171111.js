export async function identifyPlant(
  imageFile
) {
  try {
    const formData =
      new FormData();

    formData.append(
      "images",
      imageFile
    );

    const apiKey =
      process.env
        .NEXT_PUBLIC_PLANTNET_API_KEY;

    const response =
      await fetch(
        `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

    const data =
      await response.json();

    console.log(data);

    return data;
  } catch (err) {
    console.log(err);

    return null;
  }
}