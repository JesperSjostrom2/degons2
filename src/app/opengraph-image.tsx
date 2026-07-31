import { ImageResponse } from 'next/og'

/**
 * The link preview card, generated rather than stored.
 *
 * This replaces /assets/og-image.png, which was 1.4 MB — over WhatsApp's
 * ~300KB ceiling, so that client was already dropping it — and carried a
 * headline ("I build websites people quickly trust.") that no longer matched
 * anything on the site. A file on disk drifts; this reads from the same
 * strings as the page, so the preview and the site cannot disagree.
 *
 * Next serves this at /opengraph-image and injects both og:image and
 * twitter:image automatically, which is why layout.tsx no longer sets either.
 * Do not add `images` back to the metadata object — an explicit value there
 * wins over the file convention and this route goes unused.
 *
 * Rendering is Satori, not a browser: flexbox only (no grid, no float), and
 * any element with more than one child needs an explicit `display: flex`.
 *
 * Outfit is committed under src/assets/fonts as WOFF rather than pulled from
 * Google at render time — a network call here would put the card's font on
 * someone else's uptime, and Satori reads woff/ttf/otf but NOT woff2, which is
 * what a browser-shaped request to Google returns. Loaded via
 * `fetch(new URL(..., import.meta.url))` because that is the form the bundler
 * can see, so the files get traced into the deployment; a runtime path built
 * from `process.cwd()` looks fine locally and 500s once deployed.
 */

/* Edge, specifically so the font loading below works. `new URL(..., import
   .meta.url)` is a build-time signal the edge bundler resolves by inlining the
   file into the bundle. Under the Node runtime the same expression stays a
   real file:// URL, and Node's fetch refuses that scheme — the route 500s with
   an empty body, which is exactly as fun to debug as it sounds. */
export const runtime = 'edge'

export const alt = 'Jesper Sjöström — Frontend Developer, Helsinki'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The sky, the ivory and the accent, copied from globals.css. Satori resolves
// no custom properties, so these are the one place the palette is duplicated.
const SKY = '#0b0b0a'
const IVORY = '#f5efe4'
const MUTED = '#b0aea5'
const ACCENT = '#dac5a7'

export default async function OpengraphImage() {
  /* Both paths must stay written out in full. `new URL()` is only rewritten
     into an inlined asset when the bundler can read the path statically, so
     folding these into a loadFont(name) helper — the obvious tidy-up — leaves
     a live file:// URL behind and the route dies with a bare "fetch failed". */
  const [regular, semibold] = await Promise.all([
    fetch(new URL('../assets/fonts/Outfit-400.woff', import.meta.url)).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(new URL('../assets/fonts/Outfit-600.woff', import.meta.url)).then((res) =>
      res.arrayBuffer(),
    ),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: SKY,
          padding: '88px 96px',
          fontFamily: 'Outfit',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 600,
              color: IVORY,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
            }}
          >
            Jesper Sjöström
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 38,
              color: MUTED,
              letterSpacing: '-0.01em',
            }}
          >
            Frontend Developer · Helsinki
          </div>
          <div
            style={{
              marginTop: 44,
              width: 132,
              height: 3,
              backgroundColor: ACCENT,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: 28,
            color: MUTED,
            letterSpacing: '0.02em',
          }}
        >
          jespersjostrom.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Outfit', data: regular, weight: 400, style: 'normal' },
        { name: 'Outfit', data: semibold, weight: 600, style: 'normal' },
      ],
    },
  )
}
