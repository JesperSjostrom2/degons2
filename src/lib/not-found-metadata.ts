import type { Metadata } from 'next'

/**
 * What a 404 says about itself, in one place.
 *
 * There are two ways to arrive at the site's not-found page and they resolve their metadata
 * separately: an address matching no route at all, which takes `app/not-found.tsx`'s own export,
 * and `/work/<unknown-slug>`, which renders that same page but whose `<head>` is still produced
 * by the project route's `generateMetadata`. Left to themselves the two drifted — one page under
 * two different titles, which is the same split this whole change exists to close, just moved
 * into the tab bar. Both import this instead.
 */
export const notFoundMetadata: Metadata = {
  title: 'Page not found',
  /* Follow, don't index. The links out of here are worth crawling; a page that exists at every
     wrong address is not. */
  robots: { index: false, follow: true },
  /* The root layout points its canonical at the home page. Inherited unchanged, every 404 on the
     site would claim to be that page. */
  alternates: { canonical: null },
}
