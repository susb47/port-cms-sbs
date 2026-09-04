import React from 'react'
import styles from './HeroProfileBlock.module.css'

// Maps a named heading style to the semantic tag it should render as.
// Keep this list in sync with the headingStyleOptions in HeroProfile.ts.
const headingTag: Record<string, keyof JSX.IntrinsicElements> = {
  'h1-display': 'h1',
  'h2-section': 'h2',
  'h3-subsection': 'h3',
}

// bodyFont values map to CSS var() names set globally from the Theme
// global (see planning doc §2). "mono" and "inherit" are handled here
// since they're not part of the curated font list.
const fontVar: Record<string, string> = {
  inherit: 'inherit',
  mono: 'var(--font-mono, ui-monospace, monospace)',
  cambria: 'var(--font-cambria, Cambria, Georgia, serif)',
  georgia: 'var(--font-georgia, Georgia, serif)',
  'playfair-display': 'var(--font-playfair-display)',
  merriweather: 'var(--font-merriweather)',
  inter: 'var(--font-inter)',
  poppins: 'var(--font-poppins)',
  'space-grotesk': 'var(--font-space-grotesk)',
}

type Item = { label: string; url?: string }
type Section = { heading: string; headingStyle: string; items?: Item[] }

type HeroProfileProps = {
  content: {
    heading: string
    headingStyle: string
    introduction: string
    sections?: Section[]
  }
  media?: { image?: { url: string; alt?: string } }
  actions?: {
    primary?: { label?: string; link?: string }
    secondary?: { label?: string; link?: string }
  }
  style?: {
    layout?: 'split' | 'stacked'
    imagePosition?: 'left' | 'right'
    container?: 'bordered' | 'plain'
    bodyFont?: string
    headingStyle?: string
  }
}

export function HeroProfileBlock({ content, media, actions, style }: HeroProfileProps) {
  const layout = style?.layout ?? 'split'
  const imagePosition = style?.imagePosition ?? 'right'
  const container = style?.container ?? 'bordered'
  const bodyFont = fontVar[style?.bodyFont ?? 'inherit'] ?? 'inherit'
  const HeadingTag = headingTag[content.headingStyle] ?? 'h1'

  const wrapperClass = [
    styles.wrapper,
    styles[layout],
    container === 'bordered' ? styles.bordered : '',
    layout === 'split' && imagePosition === 'left' ? styles.imageLeft : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={wrapperClass} style={{ ['--font-body' as string]: bodyFont }}>
      <div className={styles.body}>
        <HeadingTag className={styles.heading}>{content.heading}</HeadingTag>
        <p className={styles.introduction}>{content.introduction}</p>

        {content.sections?.map((section, i) => {
          const SectionTag = headingTag[section.headingStyle] ?? 'h3'
          return (
            <div className={styles.section} key={i}>
              <SectionTag className={styles.sectionHeading}>{section.heading}</SectionTag>
              {section.items && section.items.length > 0 && (
                <ul className={styles.itemList}>
                  {section.items.map((item, j) => (
                    <li className={styles.item} key={j}>
                      {item.url ? <a href={item.url}>{item.label}</a> : item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}

        {(actions?.primary?.label || actions?.secondary?.label) && (
          <div className={styles.actions}>
            {actions?.primary?.label && (
              <a className={styles.actionPrimary} href={actions.primary.link || '#'}>
                {actions.primary.label}
              </a>
            )}
            {actions?.secondary?.label && (
              <a className={styles.actionSecondary} href={actions.secondary.link || '#'}>
                {actions.secondary.label}
              </a>
            )}
          </div>
        )}
      </div>

      {media?.image?.url && (
        <div className={styles.media}>
          <img src={media.image.url} alt={media.image.alt || content.heading} />
        </div>
      )}
    </section>
  )
}
