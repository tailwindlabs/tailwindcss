import path from 'path'
import postcss from 'postcss'
import tailwind from '../../src'
import { DEFAULTS_LAYER } from '../../src/lib/expandTailwindAtRules'

export function run(input, config, plugin = tailwind) {
  let { currentTestName } = expect.getState()

  if (typeof config === 'object' && Object.keys(config).length > 0) {
    config[DEFAULTS_LAYER] = config[DEFAULTS_LAYER] ?? input.includes('@tailwind base')
  }

  return postcss(plugin(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

export let css = String.raw
export let html = String.raw
export let javascript = String.raw
