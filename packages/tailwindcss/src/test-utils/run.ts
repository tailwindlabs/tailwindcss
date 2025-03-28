import { compile } from '..'
import { optimize } from '../../../@tailwindcss-node/src/optimize'

export async function compileCss(
  css: string,
  candidates: string[] = [],
  options: Parameters<typeof compile>[1] = {},
) {
  let { build } = await compile(css, options)
  return optimize(build(candidates)).trim()
}

export async function run(candidates: string[]) {
  let { build } = await compile('@tailwind utilities;')
  return optimize(build(candidates)).trim()
}

export const optimizeCss = optimize
