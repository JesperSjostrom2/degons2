import type { IconType } from 'react-icons'
import {
  SiExpress,
  SiFigma,
  SiFramer,
  SiGreensock,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
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
 * Brand marks for the "Built with" row on a project page.
 *
 * Keys are the exact strings used in `Project.tech`, so a typo shows up as a missing logo
 * rather than a wrong one. Colours come from `skillIconColors` (lib/skill-colors.ts), which
 * the tech stack section already uses — one source of truth for what each brand's colour is.
 *
 * Anything not in here falls back to its plain name, so an unmapped entry degrades to a
 * wordmark instead of vanishing.
 */
export const techIcons: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  React: SiReact,
  TypeScript: SiTypescript,
  'Tailwind CSS': SiTailwindcss,
  Tailwind: SiTailwindcss,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  Vercel: SiVercel,
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
}
