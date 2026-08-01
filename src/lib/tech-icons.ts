import type { IconType } from 'react-icons'
import {
  SiBackbonedotjs,
  SiCloudflare,
  SiCss3,
  SiCypress,
  SiExpress,
  SiFigma,
  SiFramer,
  SiGit,
  SiGithub,
  SiGreensock,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiReactrouter,
  SiSanity,
  SiShopify,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiWebflow,
  SiWordpress,
} from 'react-icons/si'

/**
 * Brand marks for the "Built with" row on a project page and the tool chips in
 * the About section's experience entries — the one map for what each tech's
 * mark is.
 *
 * Keys are the exact strings used in `Project.tech` and `experience[].tools`,
 * so a typo shows up as a missing logo rather than a wrong one. Colours come
 * from `skillIconColors` (lib/skill-colors.ts), which the tech stack section
 * already uses — one source of truth for what each brand's colour is.
 *
 * Anything not in here falls back to its plain name, so an unmapped entry
 * degrades to a wordmark instead of vanishing.
 */
export const techIcons: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  React: SiReact,
  'React Router': SiReactrouter,
  TypeScript: SiTypescript,
  'Tailwind CSS': SiTailwindcss,
  Tailwind: SiTailwindcss,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  Vercel: SiVercel,
  // The house marks, not the product ones: SiCloudflarepages is a page-with-a-bolt and
  // SiGithubpages a small lockup, and neither is recognisable at this size or beside the
  // others. The full name still goes to screen readers through the row's `sr-only` span.
  'Cloudflare Pages': SiCloudflare,
  'GitHub Pages': SiGithub,
  Figma: SiFigma,
  GSAP: SiGreensock,
  'Framer Motion': SiFramer,
  Supabase: SiSupabase,
  Sanity: SiSanity,
  Shopify: SiShopify,
  Stripe: SiStripe,
  'Three.js': SiThreedotjs,
  Webflow: SiWebflow,
  WordPress: SiWordpress,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  CSS: SiCss3,
  Git: SiGit,
  GitHub: SiGithub,
  'Backbone.js': SiBackbonedotjs,
  Postman: SiPostman,
  Cypress: SiCypress,
}
