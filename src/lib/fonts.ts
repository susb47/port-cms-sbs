import { Playfair_Display, Merriweather, Inter, Poppins, Space_Grotesk } from 'next/font/google'

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
})

export const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

// Apply this className on <html> or the sandbox root so every
// Google Font's --font-* variable is in scope.
export const fontClassNames = [
  playfairDisplay.variable,
  merriweather.variable,
  inter.variable,
  poppins.variable,
  spaceGrotesk.variable,
].join(' ')

// Cambria and Georgia are system fonts — no next/font loader needed
// (and Cambria isn't freely licensed for self-hosted @font-face embedding).
// Declared directly as CSS vars instead.
export const systemFontVars = {
  '--font-cambria': 'Cambria, Georgia, serif',
  '--font-georgia': 'Georgia, serif',
  '--font-mono': 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
} as const
