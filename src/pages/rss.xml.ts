/**
 * /rss.xml — RSS feed for /notes (spec §4.5).
 *
 * Built once at SSG time from the notes content collection. Drafts excluded.
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const notes = await getCollection('notes', ({ data }) => !data.isDraft);
  const sorted = notes.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  return rss({
    title: 'suryaavala.com — Notes',
    description:
      'Long-form essays on MLOps, GenAI architecture, causal inference, and platform engineering.',
    site: context.site ?? 'https://www.suryaavala.com',
    items: sorted.map((note) => ({
      title: note.data.title,
      pubDate: note.data.publishDate,
      description: note.data.description,
      link: `/notes/${note.slug}/`,
      categories: [note.data.category, ...note.data.tags]
    })),
    customData: '<language>en-au</language>',
    stylesheet: false
  });
}
