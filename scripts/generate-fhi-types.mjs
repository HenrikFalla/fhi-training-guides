import fs from 'node:fs'
import path from 'node:path'
import { generateJsxTypes } from '@wc-toolkit/jsx-types'

const manifestPath = path.resolve(
  'node_modules/@folkehelseinstituttet/designsystem/custom-elements.json',
)
const outdir = path.resolve('src/types')
const fileName = 'fhi-jsx.d.ts'

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

// Clear module exports so @wc-toolkit/jsx-types doesn't emit broken internal imports
// (since @folkehelseinstituttet/designsystem ships empty .d.ts files).
for (const mod of manifest.modules ?? []) {
  mod.exports = []
}

const componentClasses = manifest.modules
  .flatMap((mod) => mod.declarations ?? [])
  .filter((decl) => decl.customElement && decl.name)
  .map((decl) => `type ${decl.name} = HTMLElement & ${decl.name}Props;`)
  .join('\n')

const template = generateJsxTypes(manifest, {
  useCemTypes: true,
  includeDefaultDOMEvents: true,
})

if (template) {
  fs.mkdirSync(outdir, { recursive: true })
  fs.writeFileSync(
    path.join(outdir, fileName),
    `${componentClasses}\n\n${template}`,
    'utf8',
  )
}
