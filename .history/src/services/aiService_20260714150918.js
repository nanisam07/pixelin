export function understandFarmerQuery(
  query
) {
  const q =
    query.toLowerCase();

  // Paddy

  if (
    q.includes("వరి")
  ) {

    if (
      q.includes("తెల్ల దోమ") ||
      q.includes("బ్రౌన్ ప్లాంట్ హాపర్")
    ) {

      return {
        crop: "Paddy",
        problem:
          "Brown Plant Hopper"
      };

    }

    if (
      q.includes("తొలిచే పురుగు")
    ) {

      return {
        crop: "Paddy",
        problem:
          "Stem Borer"
      };

    }

    if (
      q.includes("ఆకు మచ్చ")
    ) {

      return {
        crop: "Paddy",
        problem:
          "Rice Blast"
      };

    }
  }

  // Cotton

  if (
    q.includes("పత్తి")
  ) {

    if (
      q.includes("తెల్ల పురుగు") ||
      q.includes("whitefly")
    ) {

      return {
        crop:"Cotton",
        problem:"Whitefly"
      };

    }

    if (
      q.includes("పేను పురుగు")
    ) {

      return {
        crop:"Cotton",
        problem:"Aphid"
      };

    }
  }

  return {
    crop:"Unknown",
    problem:"Unknown"
  };
}