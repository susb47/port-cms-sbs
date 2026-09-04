import type { Block } from 'payload'

// Shared select — keeps every block referencing the same named
// heading styles defined in the Theme global, instead of raw CSS.
const headingStyleOptions = [
  { label: 'H1 / Display', value: 'h1-display' },
  { label: 'H2 / Section', value: 'h2-section' },
  { label: 'H3 / Subsection', value: 'h3-subsection' },
]

export const HeroProfile: Block = {
  slug: 'heroProfile',
  labels: {
    singular: 'Hero: Profile',
    plural: 'Hero: Profile Blocks',
  },
  fields: [
    {
      type: 'group',
      name: 'content',
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'headingStyle',
          type: 'select',
          options: headingStyleOptions,
          defaultValue: 'h1-display',
        },
        { name: 'introduction', type: 'textarea', required: true },
        {
          name: 'sections',
          type: 'array',
          labels: { singular: 'Section', plural: 'Sections' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            {
              name: 'headingStyle',
              type: 'select',
              options: headingStyleOptions,
              defaultValue: 'h3-subsection',
            },
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Item', plural: 'Items' },
              fields: [
                { name: 'label', type: 'text', required: true },
                // Optional — used for "Research and Professional Profiles"
                // links, left blank for plain badge-style items like "Known for".
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'media',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      type: 'group',
      name: 'actions',
      fields: [
        {
          type: 'group',
          name: 'primary',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'link', type: 'text' },
          ],
        },
        {
          type: 'group',
          name: 'secondary',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'link', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'style',
      fields: [
        {
          name: 'layout',
          type: 'select',
          options: ['split', 'stacked'],
          defaultValue: 'split',
        },
        {
          name: 'imagePosition',
          type: 'select',
          options: ['left', 'right'],
          defaultValue: 'right',
          admin: {
            condition: (_, siblingData) => siblingData?.layout === 'split',
          },
        },
        {
          name: 'container',
          type: 'select',
          options: ['bordered', 'plain'],
          defaultValue: 'bordered',
        },
        {
          name: 'bodyFont',
          type: 'select',
          // Pulls from Theme.typography.availableFonts in the real
          // implementation — hardcoded here to match the current set.
          options: ['inherit', 'cambria', 'georgia', 'playfair-display', 'merriweather', 'inter', 'poppins', 'space-grotesk', 'mono'],
          defaultValue: 'inherit',
        },
        {
          name: 'headingStyle',
          type: 'select',
          options: headingStyleOptions,
          defaultValue: 'h1-display',
        },
      ],
    },
  ],
}
