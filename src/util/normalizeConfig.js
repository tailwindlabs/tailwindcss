import log from './log'

function validate(config, options) {
  if (!config) return false

  for (let [k, v] of Object.entries(config)) {
    let types = options[k]

    if (!types) return false

    // Property SHOULD exist, this catches unused keys like `options`
    if (!types.includes(undefined) && !options.hasOwnProperty(k)) {
      return false
    }

    if (
      !types.some((type) => {
        if (type === undefined) return true
        return v instanceof type
      })
    ) {
      return false
    }
  }

  for (let [k, types] of Object.entries(options)) {
    let value = config[k]
    if (
      !types.some((type) => {
        if (type === undefined) return true
        return value instanceof type
      })
    ) {
      return false
    }
  }

  return true
}

export function normalizeConfig(config) {
  // Quick structure validation
  let valid = validate(config.content, {
    files: [Array],
    extract: [undefined, Function, Object],
  })

  if (!valid) {
    log.warn('purge-deprecation', [
      'The `purge` option in your tailwind.config.js file has been deprecated.',
      'Please rename this to `content` instead.',
    ])
  }

  // Normalize the `safelist`
  config.safelist = (() => {
    let { content, purge, safelist } = config

    if (Array.isArray(safelist)) return safelist
    if (Array.isArray(content?.safelist)) return content.safelist
    if (Array.isArray(purge?.safelist)) return purge.safelist
    if (Array.isArray(purge?.options?.safelist)) return purge.options.safelist

    return []
  })()

  // Normalize the `content`
  config.content = {
    files: (() => {
      let { content, purge } = config

      if (Array.isArray(purge)) return purge
      if (Array.isArray(purge?.content)) return purge.content
      if (Array.isArray(content)) return content
      if (Array.isArray(content?.content)) return content.content
      if (Array.isArray(content?.files)) return content.files

      return []
    })(),

    extract: (() => {
      let extract = (() => {
        if (config.purge?.extract) return config.purge.extract
        if (config.content?.extract) return config.content.extract

        if (config.purge?.extract?.DEFAULT) return config.purge.extract.DEFAULT
        if (config.content?.extract?.DEFAULT) return config.content.extract.DEFAULT

        if (config.purge?.options?.defaultExtractor) return config.purge.options.defaultExtractor
        if (config.content?.options?.defaultExtractor)
          return config.content.options.defaultExtractor

        if (config.purge?.options?.extractors) return config.purge.options.extractors
        if (config.content?.options?.extractors) return config.content.options.extractors

        return {}
      })()

      let extractors = {}

      // Functions
      if (typeof extract === 'function') {
        extractors.DEFAULT = extract
      }

      // Arrays
      else if (Array.isArray(extract)) {
        for (let { extensions, extractor } of extract ?? []) {
          for (let extension of extensions) {
            extractors[extension] = extractor
          }
        }
      }

      // Objects
      else if (typeof extract === 'object' && extract !== null) {
        Object.assign(extractors, extract)
      }

      return extractors
    })(),

    transform: (() => {
      let transform = (() => {
        if (config.purge?.transform) return config.purge.transform
        if (config.content?.transform) return config.content.transform

        if (config.purge?.transform?.DEFAULT) return config.purge.transform.DEFAULT
        if (config.content?.transform?.DEFAULT) return config.content.transform.DEFAULT

        return {}
      })()

      let transformers = {}

      if (typeof transform === 'function') {
        transformers.DEFAULT = transform
      }

      if (typeof transform === 'object' && transform !== null) {
        Object.assign(transformers, transform)
      }

      return transformers
    })(),
  }

  return config
}
