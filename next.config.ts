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
    ]
  },
};

export default nextConfig;
