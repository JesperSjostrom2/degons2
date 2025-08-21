import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

// const nyghtsherif = localFont({
//   src: [
//     {
//       path: "./fonts/nyghtsherif.woff2",
//       weight: "400",
//       style: "normal",
//     },
//   ],
//   variable: "--font-nyghtsherif",
//   fallback: ["serif"],
// });

export const metadata: Metadata = {
  title: "Frontend Developer Portfolio",
  description: "Interactive portfolio showcasing modern web development skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
