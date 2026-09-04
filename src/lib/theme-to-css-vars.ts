import type { CSSProperties } from 'react'
import { systemFontVars } from './fonts'

const fontFamilyVar: Record<string, string> = {
  cambria: 'var(--font-cambria)',
  georgia: 'var(--font-georgia)',
  'playfair-display': 'var(--font-playfair-display)',
  merriweather: 'var(--font-merriweather)',
  inter: 'var(--font-inter)',
  poppins: 'var(--font-poppins)',
  'space-grotesk': 'var(--font-space-grotesk)',
}

// Minimal shape of what we read off the Theme global — loosen/tighten
// once you generate real Payload types (`payload generate:types`).
type ThemeGlobal = {
  typography?: { bodyFont?: string; headingFont?: string }
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    text?: string
  }
}

export function themeToCssVars(theme: ThemeGlobal | null | undefined): CSSProperties {
  const vars: Record<string, string> = { ...systemFontVars }

  vars['--color-primary'] = theme?.colors?.primary || '#0f172a'
  vars['--color-secondary'] = theme?.colors?.secondary || '#64748b'
  vars['--color-accent'] = theme?.colors?.accent || '#f97316'
  vars['--color-background'] = theme?.colors?.background || '#ffffff'
  vars['--color-text'] = theme?.colors?.text || '#0f172a'

  vars['--font-heading'] = fontFamilyVar[theme?.typography?.headingFont || 'cambria']
  // Note: --font-body here is the *site default*. HeroProfileBlock
  // overrides it per-instance via its own style.bodyFont ("mono").
  vars['--font-body'] = fontFamilyVar[theme?.typography?.bodyFont || 'cambria']

  return vars as CSSProperties
}
