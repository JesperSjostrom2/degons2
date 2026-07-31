/**
 * Project data for the `#projects` index and the `/work/[slug]` pages.
 *
 * Deliberately free of React imports so the `/work/[slug]` server component can read it
 * without pulling component code into the RSC graph.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * UNCONFIRMED VALUES — anything with an `// unconfirmed` comment is my assumption,
 * not something read off the sites. It is written as finished copy because the
 * page is read by people, not by me; the marker lives in the source instead.
 * Correct them and the marker goes with them.
 *
 *   · `facts`  — year / client / scope on every project
 *   · `role`   — the index panel's scope label
 *   · `tech`   — every project
 *
 * `roleSummary` is written to be read, but it is my account of the work rather
 * than yours. Rewrite freely.
 *
 * `typography` names are read off the live sites with computed styles, not guessed —
 * so they carry no `// unconfirmed` marker. Read by walking every text-bearing leaf
 * node and grouping by family, weight and size: sampling the first handful of nodes
 * only reaches the nav and misses the display weight entirely.
 *
 * `visuals` renders whatever length the array has, so a project with one real
 * asset shows one rather than padding with a duplicate.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * VISUAL FORMAT — the standard every project moves to, as built for Andcreative:
 *
 *   01  mac      macmockup.webp with a scroll capture playing in the screen cutout
 *   02  phones   three phone plates side by side — landing, a list view, a detail
 *
 * Both frames want assets on a transparent background, exported at the same plate
 * size so they register with each other. Kerma and Portfolio v1 are still on
 * `frame: 'browser'` — the older raw screenshots — until their plates exist.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface ProjectShot {
  /** The still. Always present, and doubles as the video's poster. */
  src: string
  /** Optional enhancement. Its absence must never change the layout. */
  videoSrc?: string
  alt: string
  objectPosition?: string
  /**
   * Wraps the shot in a browser title bar with the real URL, so a flat screenshot reads as a
   * running site. Off for assets that already carry their own framing — a mockup plate or a
   * photograph of a tablet inside a browser window reads as a mistake.
   */
  chrome?: boolean
  /**
   * Overrides the default crop (19/10 desktop, 16/10 mobile) with the asset's own ratio, so
   * nothing is cropped at any width.
   *
   * Required on mockup plates. Their device sits inside deliberate margins, and a fixed crop
   * eats exactly those margins — which is the whole reason the plate reads as a plate. Write
   * it as the export's real pixel dimensions, e.g. '2477 / 1100'.
   */
  aspectRatio?: string
}

/**
 * One composition on a project page.
 *
 * A union rather than one widened shape, because a phone row carries three assets and a mac
 * frame carries a video with no still — neither fits `ProjectShot`'s single `src`.
 */
export type ProjectVisual =
  /** A flat screenshot, optionally in the browser title bar. */
  | ({ frame: 'browser' } & ProjectShot)
  /**
   * `macmockup.webp` with something playing in the screen cutout. The screen is a genuine
   * transparent hole in the plate, so the video is positioned into it and the frame sits on
   * top — no masking, and the bezel's rounded corners come free.
   */
  | { frame: 'mac'; videoSrc: string; posterSrc?: string; alt: string }
  /** Three phone plates side by side, print3.png style. */
  | { frame: 'phones'; phones: { src: string; alt: string }[] }

export interface ProjectPaletteColor {
  name: string
  value: string
}

export interface ProjectTypeface {
  /** What it does on that site — 'Headings', 'Body', 'Display'. This leads the row. */
  usage: string
  /**
   * The typeface's real name. Left unset until it is actually known: an empty slot reads
   * as a spec sheet still being filled in, where a placeholder string reads as neglect.
   */
  name?: string
  /**
   * The weight as it is named and numbered — 'SemiBold 600'. What separates two rows that
   * carry the same family, and the reason a one-face site lists one row instead of two.
   */
  weight?: string
  /**
   * Set only when the family is actually available to the browser, so the specimen is
   * rendered truthfully. Licensed faces we cannot load use `specimenSrc` instead; when
   * neither is set the specimen falls back to the portfolio's own display font, which is
   * honest about being an approximation.
   */
  cssFamily?: string
  /** The numeric weight to set the specimen in, so 'Light 300' is not drawn at 600. */
  cssWeight?: number
  /** Image specimen for licensed faces. Takes precedence over `cssFamily`. */
  specimenSrc?: string
}

export interface ProjectFact {
  label: string
  value: string
}

export interface Project {
  slug: string
  /**
   * Hand-maintained ISO date for the sitemap's `lastModified`. Bump it when the
   * page's content genuinely changes — a `new Date()` there would claim every
   * page changed on every build, which crawlers learn to ignore.
   */
  lastUpdated: string
  /** Full name — used for the accessible heading and alt text. */
  name: string
  /** What the logo tile falls back to, and the visible wordmark when there is no logo. */
  displayName: string
  /** One or two lines. The only copy on the index panel. */
  description: string
  /** The index panel's right-hand label. Short — two or three words. */
  role: string
  year: string
  palette: ProjectPaletteColor[]
  /**
   * The index panel image. Kept separate from `visuals` because the index wants one flat
   * screenshot in a bordered, browser-chromed tile — a transparent MacBook dropped in there
   * would not sit with the other panels.
   *
   * It is also the plate behind the "next project" row at the foot of every project page,
   * where it is asked for on hover rather than on load, so a heavy file shows as a door
   * opening onto nothing until it arrives. Every cover is now webp under 130 KB, so the
   * door opens onto the picture.
   */
  cover: ProjectShot
  /** The project page's compositions, in order. */
  visuals: ProjectVisual[]
  facts: ProjectFact[]
  /** Two to four sentences. What you actually did on this project. */
  roleSummary: string
  typography: ProjectTypeface[]
  /** Neutral chips — never project-coloured (DESIGN.MD §7). */
  tech: string[]
  /**
   * `width`/`height` are the plate's true proportions — they set the box the mark is fitted
   * into, so a wrong ratio leaves dead space beside it.
   *
   * `scale` multiplies the shared height cap. Logos are capped by height, which flatters a
   * wide wordmark and starves a square one, so a squarer mark asks for more height to read
   * at the same weight. Roughly the square root of how much narrower it is; measured, not
   * guessed. Omit it for anything wordmark-shaped.
   */
  logo?: { src: string; alt: string; width: number; height: number; scale?: number }
  liveUrl: string
  liveLabel: string
  /**
   * One colour, softer tints derived with `color-mix` in CSS. Touches the panel's hover rim
   * and the project page's logo tile only — buttons, chips and copy stay neutral
   * (DESIGN.MD §7/§13).
   */
  accent: string
}

export const projects: Project[] = [
  {
    slug: 'andcreative',
    lastUpdated: '2026-07-31',
    name: 'Andcreative',
    displayName: 'Andcreative',
    description:
      'A photography and film agency in Stockholm. Built for speed across image-heavy pages, with a clear path from the work to a booking.',
    role: 'Design + Build', // unconfirmed
    year: '2024', // unconfirmed
    palette: [
      { name: 'Cream', value: '#f5efe4' },
      { name: 'Graphite', value: '#676a70' },
      { name: 'Mist', value: '#d9d5cb' },
      { name: 'White', value: '#f3f3f3' },
    ],
    // Anchored left so the small remaining crop falls on the site's own nav rather than
    // through the headline.
    cover: {
      src: '/assets/projects/andcreative/andcreative1.webp',
      alt: 'Andcreative homepage',
      objectPosition: 'left top',
      chrome: true,
    },
    visuals: [
      {
        frame: 'mac',
        // 1368x854 — ratio 1.6019 against the screen cutout's 1.5995, so it fills the
        // screen edge to edge. The earlier 1920x958 capture was 2.00 and left a band of
        // dead screen along the bottom.
        videoSrc: '/assets/projects/andcreative/home1610.mp4',
        alt: 'The Andcreative homepage scrolling',
      },
      {
        frame: 'phones',
        phones: [
          { src: '/assets/projects/andcreative/phonehome.webp', alt: 'Andcreative homepage on a phone' },
          { src: '/assets/projects/andcreative/phonefilm.webp', alt: 'Andcreative film page on a phone' },
          {
            src: '/assets/projects/andcreative/phoneimage.webp',
            alt: 'Andcreative photography page on a phone',
          },
        ],
      },
    ],
    facts: [
      { label: 'Year', value: '2024' }, // unconfirmed
      { label: 'Client', value: 'Photography & film agency' }, // unconfirmed
      { label: 'Scope', value: 'Design, build, deploy' }, // unconfirmed
    ],
    roleSummary:
      'Designed and built the site end to end — layout, front end and deployment. It is a portfolio for people whose work is photographs and film, so the images had to stay large without the pages becoming slow to open on a phone. Most of the effort went into the media pipeline, and into keeping the route from a piece of work to an enquiry as short as it could be.',
    /**
     * One family, no webfonts anywhere — Helvetica Neue comes off the system. Two weights,
     * read across the home page and a project page: Bold 700 is held back for the display
     * titles (the ANDCREATIVE masthead, the project title), and everything under them —
     * section headings, body, nav, captions — is Regular 400, separated by size rather than
     * weight. That is why the second row names both roles instead of splitting them.
     *
     * The stack is the site's own, so on a Mac the specimen is the real face and elsewhere
     * it falls to Arial exactly as the site does.
     */
    typography: [
      {
        usage: 'Display',
        name: 'Helvetica Neue',
        weight: 'Bold 700',
        cssFamily: '"Helvetica Neue", Arial, sans-serif',
        cssWeight: 700,
      },
      {
        usage: 'Headings & body',
        name: 'Helvetica Neue',
        weight: 'Regular 400',
        cssFamily: '"Helvetica Neue", Arial, sans-serif',
        cssWeight: 400,
      },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'], // unconfirmed
    // 756x361 plate, ink 2.31 wide — the widest of the three, so it sets the baseline height.
    logo: { src: '/assets/andcreativewhite.png', alt: 'Andcreative logo', width: 150, height: 72 },
    liveUrl: 'https://andcreative.se',
    liveLabel: 'andcreative.se',
    accent: '#f3f3f3',
  },
  {
    slug: 'kerma',
    lastUpdated: '2026-07-31',
    name: 'Cafe & Bistro Kerma',
    displayName: 'Tahkon Kerma',
    description:
      'A cafe and bistro in Tahko. Logo and identity, plus a site built around the menu, the opening hours and actually being found locally.',
    role: 'Identity + Build', // unconfirmed
    year: '2024', // unconfirmed
    palette: [
      { name: 'Ink', value: '#141413' },
      { name: 'Cream', value: '#f7ead8' },
      { name: 'Kerma Gold', value: '#d4af37' },
      { name: 'Bronze', value: '#8b7355' },
      { name: 'Olive', value: '#8fa58a' },
    ],
    cover: {
      src: '/assets/projects/kerma/kermaipad.webp',
      alt: 'Tahkon Kerma menu on an iPad',
      objectPosition: 'center',
      chrome: true,
    },
    // Andcreative's format: the scroll capture in the mac, then the phone trio.
    visuals: [
      {
        // 1368x854 like the Andcreative capture, so it fills the screen cutout edge to edge.
        videoSrc: '/assets/projects/kerma/kermashowcase.mp4',
        frame: 'mac',
        alt: 'The Tahkon Kerma site scrolling',
      },
      {
        frame: 'phones',
        phones: [
          { src: '/assets/projects/kerma/kermaphonehome.webp', alt: 'Tahkon Kerma homepage on a phone' },
          { src: '/assets/projects/kerma/kermamenuphone.webp', alt: 'The Tahkon Kerma menu on a phone' },
          {
            src: '/assets/projects/kerma/kermamoremenuphone.webp',
            alt: 'More of the Tahkon Kerma menu on a phone',
          },
        ],
      },
    ],
    facts: [
      { label: 'Year', value: '2024' }, // unconfirmed
      { label: 'Client', value: 'Cafe & bistro, Tahko' }, // unconfirmed
      { label: 'Scope', value: 'Identity, design, build' }, // unconfirmed
    ],
    roleSummary:
      'Drew the logo and set the identity, then designed and built the site around it. A seasonal restaurant lives on being found and on answering the same three questions — what is on the menu, when are you open, where are you. Those came first, and everything else was arranged not to get in their way.',
    // One family, split by weight. `--font-specimen-poppins` is loaded by ProjectTypography.
    typography: [
      {
        usage: 'Headings',
        name: 'Poppins',
        weight: 'SemiBold 600',
        cssFamily: 'var(--font-specimen-poppins)',
        cssWeight: 600,
      },
      {
        usage: 'Body',
        name: 'Poppins',
        weight: 'Regular 400',
        cssFamily: 'var(--font-specimen-poppins)',
        cssWeight: 400,
      },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'], // unconfirmed
    /**
     * 1325x1151 plate with no blank room to speak of — the ink already runs edge to edge and
     * fills 98% of the height, so it was never padding making this look small. It is a
     * stacked, near-square mark (1.18) against Andcreative's 2.31 wordmark, so at a shared
     * height cap it carried under half the ink. The declared box was 150x90 too, a 1.67 ratio
     * against the plate's real 1.15, which left dead space down its right-hand side.
     */
    logo: {
      src: '/assets/kermainverted.png',
      alt: 'Tahkon Kerma logo',
      width: 150,
      height: 130,
      // Above what matching the ink area alone would ask for (~1.25). This one is a stacked
      // mark — peak, wordmark, then a hairline CAFE · BISTRO — so it needs the extra height
      // for its smallest line to survive, where a single-line wordmark does not.
      scale: 1.6,
    },
    liveUrl: 'https://tahkonkerma.fi',
    liveLabel: 'tahkonkerma.fi',
    accent: '#d4af37',
  },
  {
    slug: 'portfolio-v1',
    lastUpdated: '2026-07-31',
    name: 'Portfolio v1',
    displayName: 'Portfolio v1',
    description:
      'My first portfolio, with a backend and an admin area so the content could be edited without touching the code.',
    role: 'Design + Build', // unconfirmed
    year: '2023', // unconfirmed
    palette: [
      { name: 'Black', value: '#080808' },
      { name: 'Pink', value: '#ff0066' },
      { name: 'Violet', value: '#7c63a6' },
      { name: 'Cream', value: '#f5efe4' },
      { name: 'Blue', value: '#3898ec' },
    ],
    cover: {
      src: '/assets/projects/portfolio-v1/ogportfolionew.webp',
      alt: 'Portfolio v1 homepage',
      objectPosition: 'top',
      chrome: true,
    },
    // Andcreative's format: the scroll capture in the mac, then the phone trio.
    visuals: [
      {
        // 1368x854 like the Andcreative capture, so it fills the screen cutout edge to edge.
        videoSrc: '/assets/projects/portfolio-v1/v1showcase.mp4',
        frame: 'mac',
        alt: 'The Portfolio v1 homepage scrolling',
      },
      {
        frame: 'phones',
        phones: [
          { src: '/assets/projects/portfolio-v1/v1phonehome.webp', alt: 'Portfolio v1 homepage on a phone' },
          {
            src: '/assets/projects/portfolio-v1/v1phoneprojects.webp',
            alt: 'The Portfolio v1 projects page on a phone',
          },
          {
            src: '/assets/projects/portfolio-v1/v1phonecontact.webp',
            alt: 'The Portfolio v1 contact page on a phone',
          },
        ],
      },
    ],
    facts: [
      { label: 'Year', value: '2023' }, // unconfirmed
      { label: 'Client', value: 'Personal' }, // unconfirmed
      { label: 'Scope', value: 'Design, build, CMS' }, // unconfirmed
    ],
    roleSummary:
      'My first full-stack build, made to learn rather than to a brief — which is why there is a real backend and an admin area sitting behind it. Being able to change the content without touching the code was the whole point of it, and that habit has shaped everything I have built since.',
    /**
     * Poppins is used across a wider range here than the two rows below show — 200, 400, 500,
     * 600 and 700 all appear live. Bold 700 and Medium 500 are the two that carry the site,
     * so they are what the specimen names; listing five weights would be a font inventory
     * rather than a spec sheet. The remaining weights are noted here, not hidden.
     *
     * (The site also renders one `<button>` in Arial, which is a control that never inherited
     * the family rather than a second face. Not listed, because it was not a choice.)
     */
    typography: [
      {
        usage: 'Headings',
        name: 'Poppins',
        weight: 'Bold 700',
        cssFamily: 'var(--font-specimen-poppins)',
        cssWeight: 700,
      },
      {
        usage: 'Body',
        name: 'Poppins',
        weight: 'Medium 500',
        cssFamily: 'var(--font-specimen-poppins)',
        cssWeight: 500,
      },
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB'], // unconfirmed
    /**
     * 1500x1500 plate, ink 1473x1187 — near-square at 1.24, and unlike Kerma it does carry
     * real padding (91px above, 222px below), so `object-fit: contain` fits the empty plate
     * and shrinks the mark inside it. Scaled a little harder than Kerma to cover both the
     * shape and that padding. Replaces the text wordmark this project used to fall back to.
     */
    logo: {
      src: '/assets/projects/portfolio-v1/logo.png',
      alt: 'Portfolio v1 logo',
      width: 150,
      height: 150,
      scale: 1.5,
    },
    liveUrl: 'https://jespersjostrom2.github.io',
    liveLabel: 'jespersjostrom2.github.io',
    accent: '#ff0066',
  },
]

export const projectSlugs = projects.map((project) => project.slug)

export const getProjectBySlug = (slug: string) => projects.find((project) => project.slug === slug)

/**
 * The project after `slug`, wrapping past the end so the pages chain into a loop and no
 * project page ever dead-ends. Returns undefined only for an unknown slug.
 */
export const getNextProject = (slug: string) => {
  const index = projects.findIndex((project) => project.slug === slug)
  return index === -1 ? undefined : projects[(index + 1) % projects.length]
}
