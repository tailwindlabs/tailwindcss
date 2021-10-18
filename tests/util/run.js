import path from 'path'
import postcss from 'postcss'
import tailwind from '../../src'

export function run(input, config, plugin = tailwind) {
  let { currentTestName } = expect.getState()

  return postcss(plugin(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

export let css = String.raw
export let html = String.raw
export let javascript = String.raw
