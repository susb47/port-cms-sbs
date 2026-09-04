import type { GlobalConfig } from 'payload'

const fontOptions = [
  { label: 'Cambria', value: 'cambria' },
  { label: 'Georgia', value: 'georgia' },
  { label: 'Playfair Display', value: 'playfair-display' },
  { label: 'Merriweather', value: 'merriweather' },
  { label: 'Inter', value: 'inter' },
  { label: 'Poppins', value: 'poppins' },
  { label: 'Space Grotesk', value: 'space-grotesk' },
]

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Theme',
  access: {
    read: () => true, // frontend needs this to render CSS vars
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Typography',
          fields: [
            {
              name: 'availableFonts',
              type: 'select',
              hasMany: true,
              options: fontOptions,
              defaultValue: fontOptions.map((f) => f.value),
              admin: {
                description: 'Fonts end users are allowed to pick from elsewhere in the admin.',
              },
            },
            {
              name: 'bodyFont',
              type: 'select',
              options: fontOptions,
              defaultValue: 'cambria',
            },
            {
              name: 'headingFont',
              type: 'select',
              options: fontOptions,
              defaultValue: 'cambria',
            },
          ],
        },
        {
          label: 'Colors',
          fields: [
            {
              name: 'primary',
              type: 'text',
              defaultValue: '#0f172a',
              admin: { components: { Field: '/fields/ColorWheelField#ColorWheelField' } },
            },
            {
              name: 'secondary',
              type: 'text',
              defaultValue: '#64748b',
              admin: { components: { Field: '/fields/ColorWheelField#ColorWheelField' } },
            },
            {
              name: 'accent',
              type: 'text',
              defaultValue: '#f97316',
              admin: { components: { Field: '/fields/ColorWheelField#ColorWheelField' } },
            },
            {
              name: 'background',
              type: 'text',
              defaultValue: '#ffffff',
              admin: { components: { Field: '/fields/ColorWheelField#ColorWheelField' } },
            },
            {
              name: 'text',
              type: 'text',
              defaultValue: '#0f172a',
              admin: { components: { Field: '/fields/ColorWheelField#ColorWheelField' } },
            },
          ],
        },
        {
          label: 'Heading Styles',
          fields: [
            {
              name: 'headingStyles',
              type: 'array',
              labels: { singular: 'Heading Style', plural: 'Heading Styles' },
              defaultValue: [
                { name: 'H1 / Display', slug: 'h1-display', fontSize: '3rem', fontWeight: '700', letterSpacing: '-0.02em', colorRole: 'primary' },
                { name: 'H2 / Section', slug: 'h2-section', fontSize: '2rem', fontWeight: '600', letterSpacing: '-0.01em', colorRole: 'primary' },
                { name: 'H3 / Subsection', slug: 'h3-subsection', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '0', colorRole: 'primary' },
              ],
              fields: [
                { name: 'name', type: 'text', required: true, admin: { description: 'Shown in dropdowns, e.g. "H1 / Display"' } },
                { name: 'slug', type: 'text', required: true, admin: { description: 'Referenced by blocks, e.g. "h1-display" — keep in sync with block headingStyle option values.' } },
                { name: 'fontSize', type: 'text', required: true },
                { name: 'fontWeight', type: 'select', options: ['400', '500', '600', '700', '800'], defaultValue: '600' },
                { name: 'letterSpacing', type: 'text', defaultValue: '0' },
                { name: 'textTransform', type: 'select', options: ['none', 'uppercase', 'capitalize'], defaultValue: 'none' },
                { name: 'colorRole', type: 'select', options: ['primary', 'secondary', 'accent', 'text'], defaultValue: 'primary' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
