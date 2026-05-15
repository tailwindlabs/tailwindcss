import { compile } from '..'

const css = String.raw

export async function run(
  candidates: string[],
  input = css`
    @tailwind utilities;
  `,
  options: Parameters<typeof compile>[1] = {},
) {
  let { build } = await compile(input, options)
  return pretty(build(candidates))
}

export async function compileCss(css: string, options: Parameters<typeof compile>[1] = {}) {
  return run([], css, options)
}

export function pretty(input: string) {
  input = input.trim()
  if (input === '') return ''
  return `\n${input}\n`
}
