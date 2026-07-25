export const translateText = async (
  text,
  target
) => {
  try {
    const response = await fetch(
      "https://libretranslate.com/translate",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: target,
          format: "text",
        }),
      }
    );

    const data = await response.json();

    return data.translatedText;
  } catch (err) {
    console.log(err);
    return text;
  }
};