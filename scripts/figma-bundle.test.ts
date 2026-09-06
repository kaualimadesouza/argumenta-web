// @vitest-environment node
import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { OUTFILE, bundleText } from './figma-bundle'

describe('the committed Figma bundle', () => {
  it('is the build of figma-plugin/src, so the plugin never ships stale code', async () => {
    expect(readFileSync(OUTFILE, 'utf8')).toBe(await bundleText())
  })
})
