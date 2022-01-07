import path from 'path'
import postcss from 'postcss'
import tailwind from '../../src'

export * from './strings'
export * from './defaults'

export function run(input, config, plugin = tailwind) {
  let { currentTestName } = expect.getState()

  return postcss(plugin(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}
