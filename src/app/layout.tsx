import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import { Outfit } from "next/font/google";
import { Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteShell from "@/components/site-shell";
import { serializeJsonLd } from "@/lib/json-ld";
import { SITE_URL, siteSocialLinks } from "@/lib/site-config";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jesper Sjöström | Frontend Developer",
    template: "%s | Jesper Sjöström",
  },
  /* One sentence, in the same voice as the hero and the About section. The
     previous copy was written for a crawler rather than a person — "proactive",
     "dynamic, high-performance web experiences", a stack list — and it also
     described the wrong job: the site says frontend and design-led freelance,
     not full-stack Node. A link preview is read by a human deciding whether to
     click, so it says what he does and where. */
  description: "Freelance frontend developer in Helsinki. I design and build landing pages, portfolios, and websites for people who want a stronger presence online.",
  /* No `icons` entry — app/icon.png, apple-icon.png, and favicon.ico file
     conventions supply the full set; an explicit value here would override
     them. */
  /* No `keywords`. Google dropped <meta keywords> as a ranking signal in 2009
     and the other majors followed, so the list here was doing nothing except
     asserting a job title the rest of the site contradicts. The one part that
     was pulling weight — "Jesper Sjostrom" without the diacritics, for people
     who search it that way — is handled properly below, by `authors` and the
     JSON-LD Person, which search engines do read. */
  authors: [{ name: "Jesper Sjöström", url: SITE_URL }],
  creator: "Jesper Sjöström",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Jesper Sjöström — Frontend Developer",
    description: "Freelance frontend developer in Helsinki. I design and build landing pages, portfolios, and websites for people who want a stronger presence online.",
    siteName: "Jesper Sjöström",
    /* No `images` here on purpose — app/opengraph-image.tsx supplies both
       og:image and twitter:image. An explicit value in this object silently
       wins over the file convention, so adding one back orphans that route. */
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesper Sjöström — Frontend Developer",
    description: "Freelance frontend developer in Helsinki. I design and build landing pages, portfolios, and websites for people who want a stronger presence online.",
    creator: "@jespersjostrom",
  },
  alternates: {
    canonical: SITE_URL,
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

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
};

/**
 * Structured data for the person, which is the part search engines actually
 * read — unlike the <meta keywords> list this replaces.
 *
 * `alternateName` is the load-bearing field: it is how "Jesper Sjostrom"
 * without the diacritics gets associated with the page, which was the only
 * genuinely useful entry in the old keyword stuffing. `sameAs` links the
 * profiles together so the accounts and the site are understood as one
 * identity rather than three unrelated pages.
 */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jesper Sjöström',
  alternateName: 'Jesper Sjostrom',
  url: SITE_URL,
  jobTitle: 'Frontend Developer',
  description:
    'Freelance frontend developer in Helsinki. I design and build landing pages, portfolios, and websites for people who want a stronger presence online.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Helsinki',
    addressCountry: 'FI',
  },
  sameAs: siteSocialLinks
    .map((link) => link.href)
    .filter((href) => href.startsWith('http')),
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
        {/* First stop in the tab order, on every route. Parked off-screen by
            `.skip-link` and slides in only on :focus-visible. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
        />
        {/* Without JS the curtain can never lift and the backdrop can never be
            thrown away, so neither may appear: crawlers that don't execute
            scripts and JS-disabled visitors get the full page instead of a
            permanent blank field. */}
        <noscript>
          <style>{`.route-curtain,.route-curtain-backdrop{display:none}`}</style>
        </noscript>
        <div className="cinematic-grain-overlay" />
        <SiteShell>{children}</SiteShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
