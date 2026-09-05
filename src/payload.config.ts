import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { SiteSettings } from './globals/SiteSettings'
import { About } from './globals/About'
import { Skills } from './collections/Skills'
import { Theme } from './globals/Theme'
import { HeroProfile } from '@/blocks/HeroProfile'
import { themeToCssVars } from '@/lib/theme-to-css-vars'
import { fontClassNames } from '@/lib/fonts'
import { Header } from './globals/Header'
import { Pages } from './collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, Skills, Pages],   // ← Projects added here
  globals: [SiteSettings, About, Theme, Header],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})