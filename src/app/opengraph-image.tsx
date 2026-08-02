import { ImageResponse } from 'next/og'

/**
 * The link preview card: the wordmark on the site's black, and nothing else.
 *
 * It used to be a composed layout — name, role, an accent rule, the domain in the corner — which
 * is a poster, not an avatar. A preview card is rendered at a few hundred pixels wide inside a
 * chat bubble and is usually the second thing seen after the link itself, so the job is to be
 * recognisable at a glance rather than to be read. One mark on one field does that; four
 * elements at that size collapse into grey texture.
 *
 * Dropping the text also drops the font problem with it. There is no type to set, so Outfit is
 * no longer loaded here and none of the WOFF-not-WOFF2 care that went with it applies any more.
 * (`src/assets/fonts` is now unreferenced — left on disk rather than deleted, in case this card
 * ever wants words again.)
 *
 * Next serves this at /opengraph-image and injects both og:image and twitter:image
 * automatically, which is why layout.tsx sets neither. Do not add `images` back to the metadata
 * object — an explicit value there wins over the file convention and this route goes unused.
 *
 * Rendering is Satori, not a browser: flexbox only (no grid, no float), and any element with
 * more than one child needs an explicit `display: flex`.
 */

/* Edge, specifically so the asset loading below works. `new URL(..., import.meta.url)` is a
   build-time signal the edge bundler resolves by inlining the file into the bundle. Under the
   Node runtime the same expression stays a real file:// URL, and Node's fetch refuses that
   scheme — the route 500s with an empty body, which is exactly as fun to debug as it sounds. */
export const runtime = 'edge'

export const alt = 'Jesper Sjöström — Frontend Developer, Helsinki'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* The site's sky, copied from globals.css — Satori resolves no custom properties. Black to the
   eye, and the same black the site is actually painted in rather than a second, purer one that
   would make the card and the page it links to disagree. */
const SKY = '#0b0b0a'

/**
 * The wordmark, at about four fifths of the card's width.
 *
 * It is committed pre-trimmed and pre-sized as `src/assets/logo-og.png` (960×309, 36 KB) rather
 * than read from `public/assets/logotransparent.png`. That public copy is 1751×898 and mostly
 * empty — roughly a third of its width and half its height is transparent margin, so centring it
 * would produce a small logo swimming in air, and it carries 230 KB into the bundle to do it.
 * This is the same artwork with the margin cut off, committed at the size it is drawn at so the
 * card never upscales it. If the source logo is ever redrawn, regenerate this from it rather
 * than hand-editing — trim on a fully transparent background, resize to 960 wide, 16-colour PNG.
 */
const LOGO_WIDTH = 940
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 309) / 960)

export default async function OpengraphImage() {
  /* Written out in full, like the fonts before it: `new URL()` is only rewritten into an inlined
     asset when the bundler can read the path statically, so folding it behind a helper or a
     variable leaves a live file:// URL behind and the route dies with a bare "fetch failed". */
  const logo = await fetch(new URL('../assets/logo-og.png', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: SKY,
        }}
      >
        {/* Satori takes the decoded bytes directly for a local image; its `src` is typed for the
            string form a browser would use, hence the cast. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo as unknown as string}
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          alt=""
        />
      </div>
    ),
    size,
  )
}
