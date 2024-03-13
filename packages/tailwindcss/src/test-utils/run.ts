import { optimizeCss } from '@tailwindcss/optimize'
import { compile } from '..'

export function compileCss(css: string, candidates: string[] = []) {
  return optimizeCss(compile(css).build(candidates)).trim()
}

export function run(candidates: string[]) {
  return optimizeCss(compile('@tailwind utilities;').build(candidates)).trim()
}
