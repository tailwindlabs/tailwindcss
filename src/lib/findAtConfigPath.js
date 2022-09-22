import path from 'path'

/**
 * Find the @config at-rule in the given CSS AST and return the relative path to the config file
 *
 * @param {import('postcss').Root} root
 * @param {import('postcss').Result} result
 */
export function findAtConfigPath(root, result) {
  let configPath = null
  let relativeTo = root.source?.input.file ?? result.opts.from ?? null

  root.walkAtRules('config', (rule) => {
    if (relativeTo === undefined) {
      throw rule.error(
        'The `@config` at-rule cannot be used without a `from` option being set on the PostCSS config.'
      )
    }

    if (configPath) {
      throw rule.error('Only `@config` at-rule is allowed per file.')
    }

    let matches = rule.params.match(/(['"])(.*?)\1/)
    if (!matches) {
      throw rule.error(
        'The `@config` at-rule must be followed by a string containing the path to the config file.'
      )
    }

    configPath = matches[2]
    if (path.isAbsolute(configPath)) {
      throw rule.error('The `@config` at-rule cannot be used with an absolute path.')
    }

    rule.remove()
  })

  return configPath ? path.resolve(path.dirname(relativeTo), configPath) : null
}
