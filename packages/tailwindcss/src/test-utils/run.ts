import { compile, optimizeCss } from '..'

export function compileCss(css: string, candidates: string[] = []) {
  return optimizeCss(compile(css, candidates)).trim()
}

export function run(candidates: string[]) {
  return optimizeCss(compile('@tailwind utilities;', candidates)).trim()
}
