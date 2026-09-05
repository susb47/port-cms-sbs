'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function publishSandbox(data: {
  title: string
  blocks: any[]
}) {
  const payload = await getPayload({ config })

  const page = await payload.create({
    collection: 'pages',
    data: {
      title: data.title,
      slug: data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      status: 'published',
      layout: data.blocks,
    },
  })

  return { success: true, id: page.id, slug: page.slug }
}
