import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_PASSWORD,
      },
    });

    const products = body.products
      .map((p) => `${p.name} x ${p.quantity}`)
      .join("\n");

    const message = `
🌾 NEW FARMER ORDER

Products:
${products}

Address:
${body.address}

Google Maps:
https://maps.google.com/?q=${body.latitude},${body.longitude}
`;

    await transporter.sendMail({
      from: process.env.COMPANY_EMAIL,
      to: process.env.COMPANY_EMAIL,
      subject: "New Farmer Order",
      text: message,
    });

    return Response.json({
      success: true,
    });
  } catch (err) {
    console.log("MAIL ERROR:", err);

    return Response.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}