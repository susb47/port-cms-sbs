import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'e.g. Full Stack Developer',
      },
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload your CV / Resume (PDF)',
      },
    },
  ],
}