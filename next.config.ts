import type { NextConfig } from "next";

/* No nonces: Tailwind v4 and framer-motion both inject inline styles, and the
   styled-jsx block in MagicBento needs inline script/style allowances, so
   'unsafe-inline' is the pragmatic ceiling here. script-src still pins to
   self + the Vercel analytics host, which is the part worth locking down.
   va.vercel-scripts.com serves the Analytics/Speed Insights loader; their
   beacons post to same-origin /_vercel/* endpoints in production. */
/* Dev-only: webpack HMR and react-refresh run through eval; production never
   gets the allowance. */
const scriptEvalAllowance = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${scriptEvalAllowance} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  /* A stray lockfile in the parent directory makes Next guess the wrong
     workspace root otherwise. */
  outputFileTracingRoot: __dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        /* /public is served with `max-age=0` by default, so all 44MB of it
           revalidated on every visit. These are the only files here big enough
           for that to matter — the scroll captures alone are 36MB.

           Not `immutable`: these filenames aren't content-hashed the way
           /_next/static's are, so a replaced video under `immutable` would
           never reach anyone who had already loaded the old one. Thirty days
           fresh plus a week of stale-while-revalidate gets the repeat-visit
           win without that trap; replace a file and it propagates within the
           month. Rename the file if you need it out sooner. */
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
