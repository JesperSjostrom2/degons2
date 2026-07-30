import { MetadataRoute } from 'next';
import { projectSlugs } from '@/data/projects';

const SITE_URL = 'https://jespersjostrom.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...projectSlugs.map((slug) => ({
      url: `${SITE_URL}/work/${slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}
