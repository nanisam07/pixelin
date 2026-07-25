export async function POST(req) {

  return Response.json({
    disease: "Aphids Attack",

    products: [
      {
        id: 1,
        name: "Pixelin Bio Shield",
        description:
          "Controls aphids and sucking pests.",
      },

      {
        id: 2,
        name: "Pixelin Growth Plus",
        description:
          "Improves crop immunity.",
      },
    ],
  });
}