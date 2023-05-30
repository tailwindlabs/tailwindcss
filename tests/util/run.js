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
  let path = `${testPath}?test=${currentTestName}`

  return postcss(plugin(config)).process(input, {
    from: path,
    to: path,
  })
}

export function runWithSourceMaps(input, config, plugin = tailwind) {
  let { currentTestName, testPath } = expect.getState()
  let path = `${testPath}?test=${currentTestName}`

  return postcss(plugin(config)).process(input, {
    from: path,
    to: path,
    map: {
      prev: map,
    },
  })
}
