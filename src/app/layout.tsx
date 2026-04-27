import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { Outfit } from "next/font/google";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});


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
        className={`${outfit.variable} ${newsreader.variable} ${sourceSans3.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
