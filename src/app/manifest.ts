import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jesper Sjöström — Frontend Developer',
    short_name: 'Jesper Sjöström',
    description:
      'Freelance frontend developer in Helsinki. I design and build landing pages, portfolios, and websites for people who want a stronger presence online.',
    start_url: '/',
    display: 'browser',
    background_color: '#0b0b0a',
    theme_color: '#0b0b0a',
    icons: [
      { src: '/assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
