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
 * `typography` carries no `name` yet: the specimens fall back to the portfolio's
 * own display face and simply say what each slot is for. A name only appears once
 * there is a real one to print.
 *
 * `visuals` renders whatever length the array has, so a project with one real
 * asset shows one rather than padding with a duplicate.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * VISUAL FORMAT — the standard every project moves to, as built for Andcreative:
 *
 *   01  mac      macmockup.png with a scroll capture playing in the screen cutout
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
   * `macmockup.png` with something playing in the screen cutout. The screen is a genuine
   * transparent hole in the PNG, so the video is positioned into it and the frame sits on
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
   * Set only when the family is actually available to the browser, so the specimen is
   * rendered truthfully. Licensed faces we cannot load use `specimenSrc` instead; when
   * neither is set the specimen falls back to the portfolio's own display font, which is
   * honest about being an approximation.
   */
  cssFamily?: string
  /** Image specimen for licensed faces. Takes precedence over `cssFamily`. */
  specimenSrc?: string
}

export interface ProjectFact {
  label: string
  value: string
}

export interface Project {
  slug: string
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
   * The index panel image, and nothing else. Kept separate from `visuals` because the index
   * wants one flat screenshot in a bordered, browser-chromed tile — a transparent MacBook
   * dropped in there would not sit with the other panels.
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
  logo?: { src: string; alt: string; width: number; height: number }
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
      src: '/assets/projects/andcreative1.png',
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
        videoSrc: '/assets/projects/home1610.mp4',
        alt: 'The Andcreative homepage scrolling',
      },
      {
        frame: 'phones',
        phones: [
          { src: '/assets/projects/phonehome.png', alt: 'Andcreative homepage on a phone' },
          { src: '/assets/projects/phonefilm.png', alt: 'Andcreative film page on a phone' },
          { src: '/assets/projects/phoneimage.png', alt: 'Andcreative photography page on a phone' },
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
    // usage leads the row; add `name` once the real faces are confirmed.
    typography: [{ usage: 'Headings' }, { usage: 'Body' }],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'], // unconfirmed
    logo: { src: '/assets/andcreativewhite.png', alt: 'Andcreative logo', width: 150, height: 90 },
    liveUrl: 'https://andcreative.se',
    liveLabel: 'andcreative.se',
    accent: '#f3f3f3',
  },
  {
    slug: 'kerma',
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
      src: '/assets/projects/kermaipad.webp',
      alt: 'Tahkon Kerma menu on an iPad',
      objectPosition: 'center',
      chrome: true,
    },
    // Still the older raw screenshots — waiting on the mac and phone plates.
    visuals: [
      {
        frame: 'browser',
        src: '/assets/projects/kermaipad.webp',
        alt: 'Tahkon Kerma menu on an iPad',
        objectPosition: 'center',
        chrome: true,
      },
      {
        frame: 'browser',
        src: '/assets/projects/kermaproduct.png',
        alt: 'Tahkon Kerma identity in use',
        objectPosition: 'center',
        chrome: true,
      },
    ],
    facts: [
      { label: 'Year', value: '2024' }, // unconfirmed
      { label: 'Client', value: 'Cafe & bistro, Tahko' }, // unconfirmed
      { label: 'Scope', value: 'Identity, design, build' }, // unconfirmed
    ],
    roleSummary:
      'Drew the logo and set the identity, then designed and built the site around it. A seasonal restaurant lives on being found and on answering the same three questions — what is on the menu, when are you open, where are you. Those came first, and everything else was arranged not to get in their way.',
    typography: [{ usage: 'Headings' }, { usage: 'Body' }],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'], // unconfirmed
    logo: { src: '/assets/kermainverted.png', alt: 'Tahkon Kerma logo', width: 150, height: 90 },
    liveUrl: 'https://tahkonkerma.fi',
    liveLabel: 'tahkonkerma.fi',
    accent: '#d4af37',
  },
  {
    slug: 'portfolio-v1',
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
      src: '/assets/projects/ogportfolionew.webp',
      alt: 'Portfolio v1 homepage',
      objectPosition: 'top',
      chrome: true,
    },
    // One real screenshot so far — waiting on the mac and phone plates.
    visuals: [
      {
        frame: 'browser',
        src: '/assets/projects/ogportfolionew.webp',
        alt: 'Portfolio v1 homepage',
        objectPosition: 'top',
        chrome: true,
      },
    ],
    facts: [
      { label: 'Year', value: '2023' }, // unconfirmed
      { label: 'Client', value: 'Personal' }, // unconfirmed
      { label: 'Scope', value: 'Design, build, CMS' }, // unconfirmed
    ],
    roleSummary:
      'My first full-stack build, made to learn rather than to a brief — which is why there is a real backend and an admin area sitting behind it. Being able to change the content without touching the code was the whole point of it, and that habit has shaped everything I have built since.',
    typography: [{ usage: 'Headings' }, { usage: 'Body' }],
    tech: ['React', 'Node.js', 'Express', 'MongoDB'], // unconfirmed
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
