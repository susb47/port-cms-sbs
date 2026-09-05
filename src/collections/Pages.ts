import type { CollectionConfig, CustomComponent } from 'payload'
import { HeroProfile } from '../blocks/HeroProfile'
import AdminSandboxLink from '../app/(payload)/admin/sandbox/AdminSandboxLink'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    components: {
      beforeList: [AdminSandboxLink as unknown as CustomComponent],
    },
  },
  access: {
    // Public sees only published pages; logged-in admin sees everything —
    // same pattern as your Projects collection.
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            return data?.title
              ? data.title
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '')
              : value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page Sections',
      // Add each new block config here as we build it — this array is
      // both the admin's default block-picker AND what the visual
      // canvas builder's left-panel palette will read from.
      blocks: [HeroProfile],
      admin: {
        description: "Sections on this page — this is the array the canvas builder reads and writes.",
      },
    },
  ],
}
