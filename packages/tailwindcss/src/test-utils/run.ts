import { compile } from '..'
import { optimize } from '../../../@tailwindcss-node/src/optimize'

export async function compileCss(
  css: string,
  candidates: string[] = [],
  options: Parameters<typeof compile>[1] = {},
) {
  let { build } = await compile(css, options)
  return pretty(optimize(build(candidates)).code)
}

export async function run(candidates: string[]) {
  let { build } = await compile('@tailwind utilities;')
  return pretty(optimize(build(candidates)).code)
}

export function optimizeCss(input: string) {
  return pretty(optimize(input).code)
}

export function pretty(input: string) {
  input = input.trim()
  if (input === '') return ''
  return `\n${input}\n`
}
