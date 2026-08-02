import { ArrowRight } from 'lucide-react'

import TransitionLink from '@/components/transition/transition-link'

/**
 * The site's CTA pill: a dark glass pill with a cream circle that expands across it on hover,
 * arrows swapping out right and in from the left.
 *
 * Markup matches the hero's button (`hero.tsx:162-173`) exactly, including the blur glow and
 * the hover scale — this is the site's one call-to-action language, and a project page's
 * primary action should not invent a second one.
 *
 * Two wrappers, one interior. An external href is a plain `<a>` opening a new tab; an internal
 * one is a `TransitionLink`, so the pill leaves under the route curtain like every other link
 * on the site rather than being the one control that jumps.
 *
 * Server-safe: no state, no effects, pure CSS hover.
 */
const SiteLinkPill = ({
  href,
  label,
  external = false,
}: {
  href: string
  label: string
  external?: boolean
}) => {
  const interior = (
    <>
      <div className="absolute inset-0 rounded-full bg-[#dac5a7]/5 opacity-20 blur-xl transition-all duration-500 group-hover/cta:opacity-40" />

      <div className="relative flex h-[48px] items-center overflow-hidden rounded-full border border-[#dac5a7]/20 bg-[#141413]/40 pl-8 pr-1.5 text-base font-medium text-[#f5efe4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group-hover/cta:border-[#f5efe4]/70">
        <span className="absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-[#f5efe4] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:right-0 group-hover/cta:h-full group-hover/cta:w-full" />
        <span className="relative z-10 mr-5 tracking-tight transition-colors duration-300 group-hover/cta:text-[#141413]">
          {label}
        </span>
        <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[#141413]">
          <ArrowRight className="absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-5 group-hover/cta:opacity-0" />
          <ArrowRight className="absolute h-4 w-4 -translate-x-5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-0 group-hover/cta:opacity-100" />
        </span>
      </div>
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group/cta relative inline-flex"
      >
        {interior}
      </a>
    )
  }

  return (
    <TransitionLink href={href} className="group/cta relative inline-flex">
      {interior}
    </TransitionLink>
  )
}

export default SiteLinkPill
