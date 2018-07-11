import fs from 'fs'
import postcss from 'postcss'

export default function(config, { components: pluginComponents }, generatedUtilities) {
  return function(css) {
    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'preflight') {
        const preflightTree = postcss.parse(
          fs.readFileSync(`${__dirname}/../../css/preflight.css`, 'utf8')
        )

        preflightTree.walk(node => (node.source = atRule.source))

        atRule.before(preflightTree)
        atRule.remove()
      }

      if (atRule.params === 'components') {
        const pluginComponentTree = postcss.root({
          nodes: pluginComponents,
        })

        pluginComponentTree.walk(node => (node.source = atRule.source))

        atRule.before(pluginComponentTree)
        atRule.remove()
      }

      if (atRule.params === 'utilities') {
        // This needs to be cloned here or utilities end up being empty
        // in real projects. No idea why, struggling to reproduce in a
        // test. Hot fixing to publish a patch.
        const clonedUtilities = generatedUtilities.clone()

        clonedUtilities.walk(node => (node.source = atRule.source))
        atRule.before(clonedUtilities)
        atRule.remove()
      }
    })
  }
}
