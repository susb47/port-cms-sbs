import { getPayload } from 'payload'
import config from '@payload-config'
import { HeroProfileBlock } from '@/blocks/HeroProfileBlock'
import { themeToCssVars } from '@/lib/theme-to-css-vars'
import { fontClassNames } from '@/lib/fonts'

// Placeholder content matching the heroProfile spec — swap for real
// Pages/blocks data once the Pages collection exists.
const placeholderHero = {
  content: {
    heading: 'Sumit Saha — Software Engineer & Programming Educator',
    headingStyle: 'h1-display',
    introduction:
      "I'm Sumit Saha (Dhaka, Bangladesh) — a Software Engineer and Programming Educator. I build software products and teach modern web development through my work and platforms.",
    sections: [
      { heading: 'Known for', headingStyle: 'h3-subsection', items: [] },
      { heading: 'Research and Professional Profiles', headingStyle: 'h3-subsection', items: [] },
    ],
  },
  media: undefined,
  actions: {
    primary: { label: 'Career Story', link: '#' },
    secondary: { label: 'Latest from Sumit', link: '#' },
  },
  style: {
    layout: 'split' as const,
    imagePosition: 'right' as const,
    container: 'bordered' as const,
    bodyFont: 'mono',
    headingStyle: 'h1-display',
  },
}

export default async function SandboxPage() {
  const payload = await getPayload({ config })
  const theme = await payload.findGlobal({ slug: 'theme' })
  const cssVars = themeToCssVars(theme)

  return (
    <div
      className={fontClassNames}
      style={{ ...cssVars, background: 'var(--color-background)', minHeight: '100vh' }}
    >
      <HeroProfileBlock {...placeholderHero} />
    </div>
  )
}
