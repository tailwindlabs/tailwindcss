import path from 'path'
import postcss from 'postcss'
import tailwind from '../../src'

export function run(input, config, plugin = tailwind) {
  let { currentTestName } = expect.getState()

  return postcss(plugin(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

function syntax(templates) {
  return templates.join('')
}

export let css = syntax
export let html = syntax
export let javascript = syntax
