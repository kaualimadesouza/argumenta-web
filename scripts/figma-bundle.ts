import { writeFileSync } from 'node:fs'
import { argv, exit } from 'node:process'
import { pathToFileURL } from 'node:url'

import { build, type BuildOptions } from 'esbuild'

/** Figma loads a single script, so the plugin's TypeScript sources are bundled
 *  into figma-plugin/code.js, which is the file the manifest points at. */
export const BANNER = '// Built from figma-plugin/src by `npm run figma:build`. Do not edit by hand.'

export const ENTRY = 'figma-plugin/src/main.ts'
export const OUTFILE = 'figma-plugin/code.js'

export const bundleOptions: BuildOptions = {
  entryPoints: [ENTRY],
  bundle: true,
  format: 'iife',
  target: 'es2017',
  charset: 'utf8',
  banner: { js: BANNER },
  write: false,
}

/** The bundle as text, so the build and its freshness test share one source. */
export async function bundleText(): Promise<string> {
  const result = await build(bundleOptions)
  const file = result.outputFiles?.[0]
  if (file === undefined) throw new Error('esbuild produced no output')
  return file.text
}

if (import.meta.url === pathToFileURL(argv[1] ?? '').href) {
  bundleText()
    .then((text) => {
      writeFileSync(OUTFILE, text)
      console.log(`${OUTFILE} built from ${ENTRY}`)
    })
    .catch((failure: unknown) => {
      console.error(failure)
      exit(1)
    })
}
