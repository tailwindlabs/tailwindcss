import path from 'path'
import postcss from 'postcss'
import tailwind from '../../src'

export * from './strings'
export * from './defaults'

export let map = JSON.stringify({
  version: 3,
  file: null,
  sources: [],
  names: [],
  mappings: '',
})

export function run(input, config, plugin = tailwind) {
  let { currentTestName, testPath } = expect.getState()

  return postcss(plugin(config)).process(input, {
    from: `${path.resolve(testPath)}?test=${currentTestName}`,
  })
}

export function runWithSourceMaps(input, config, plugin = tailwind) {
  let { currentTestName, testPath } = expect.getState()

  return postcss(plugin(config)).process(input, {
    from: `${path.resolve(testPath)}?test=${currentTestName}`,
    map: {
      prev: map,
    },
  })
}
