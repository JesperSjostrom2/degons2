import { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { SITE_URL } from '@/lib/site-config';

/* Bump when the home page's content genuinely changes — see the note on
   `Project.lastUpdated` for why this is not `new Date()`. */
const HOME_LAST_UPDATED = '2026-07-31';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(HOME_LAST_UPDATED),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      lastModified: new Date(project.lastUpdated),
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}
