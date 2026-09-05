import { getPayload } from 'payload'
import config from '@payload-config'
import { themeToCssVars } from '@/lib/theme-to-css-vars'
import { fontClassNames } from '@/lib/fonts'
import SandboxClient from '@/app/(frontend)/sandbox/SandboxClient'

export default async function AdminSandboxPage() {
  const payload = await getPayload({ config })
  const theme = await payload.findGlobal({ slug: 'theme' })
  const cssVars = themeToCssVars(theme as any)

  return (
    <div
      className={fontClassNames}
      style={{ ...cssVars, background: 'var(--color-background)', minHeight: '100vh' }}
    >
      <SandboxClient />
    </div>
  )
}
