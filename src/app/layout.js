import { Inter, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Pixelin Sciences Pvt Ltd | Developed with Science. Formulated with Precision.",
  description: "Established in 2023, Pixelin Sciences Pvt Ltd (PSPL) provides innovative agrochemical solutions, eco-friendly fertilizers, pesticides, and crop protection systems across Telangana & Andhra Pradesh.",
  keywords: "PSPL, Pixelin Sciences, Agrochemical Hyderabad, Pesticides Telangana, Bio Fertilizers Andhra Pradesh, Crop Protection, Farming Telangana",
  icons: {
    icon: "/logo.png",
  },
};

import { LanguageProvider } from "../translations/LanguageProvider";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <head>
        {/* Font Awesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          precedence="default"
        />
      </head>
      <body className="bg-white text-gray-800 antialiased overflow-x-hidden">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
