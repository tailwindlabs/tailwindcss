import _ from 'lodash'
import postcss from 'postcss'
import wrapWithVariants from '../util/wrapWithVariants'

export default function(modules, moduleOptions, generatorOptions = {}) {
  modules.forEach(module => {
    if (!_.has(moduleOptions, module.name)) {
      throw new Error(`Module \`${module.name}\` is missing from moduleOptions.`)
    }
  })

  return postcss.root({
    nodes: _(modules)
      .reject(module => moduleOptions[module.name] === false)
      .flatMap(module =>
        wrapWithVariants(module.generator(generatorOptions), moduleOptions[module.name])
      )
      .value(),
  })
}
