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
  metadataBase: new URL("https://jepps.dev"),
  title: {
    default: "Jesper Sjöström | Full-Stack Developer",
    template: "%s | Jesper Sjöström",
  },
  description: "I'm Jesper Sjöström, a proactive full-stack developer from Finland specializing in dynamic, high-performance web experiences using React, Next.js, and Node.js. Available for global remote work.",
  keywords: [
    "Jesper Sjöström",
    "Jesper Sjostrom",
    "Full-Stack Developer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "Web Design",
    "Finland Web Developer",
    "jepps.dev"
  ],
  authors: [{ name: "Jesper Sjöström", url: "https://jepps.dev" }],
  creator: "Jesper Sjöström",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jepps.dev",
    title: "Jesper Sjöström | Full-Stack Developer",
    description: "Proactive full-stack developer from Finland specializing in dynamic, high-performance web experiences using React, Next.js, and Node.js.",
    siteName: "Jesper Sjöström Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jesper Sjöström - Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesper Sjöström | Full-Stack Developer",
    description: "Proactive full-stack developer from Finland specializing in dynamic, high-performance web experiences using React, Next.js, and Node.js.",
    creator: "@jespersjostrom",
  },
  alternates: {
    canonical: "https://jepps.dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    try {
      const theme = localStorage.getItem('theme') || 'dark';
      document.documentElement.classList.toggle('dark', theme !== 'light');
    } catch (_) {
      document.documentElement.classList.add('dark');
    }
  `;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${outfit.variable} ${newsreader.variable} ${sourceSans3.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
