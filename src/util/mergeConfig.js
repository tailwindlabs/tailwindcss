import _ from 'lodash'

const configTemplate = {
  breakpoints: null,
  colors: null,
  text: {
    fonts: null,
    sizes: null,
    weights: null,
    leading: null,
    tracking: null,
    colors: null
  },
  backgrounds: {
    colors: null,
  },
  borders: {
    defaults: null,
    widths: null,
    rounded: {
      default: null,
      modifiers: null
    },
    colors: null
  },
  sizing: {
    common: null,
    width: null,
    height: null
  },
  spacing: {
    common: null,
    padding: null,
    margin: null,
    pull: null
  },
  constrain: null,
  shadows: null,
  zIndex: null
}

function replaceDefaults(template, defaults, replacements) {
  return Object.keys(template).reduce((merged, key) => {
    const value = template[key]

    if (_.isPlainObject(value)) {
      merged[key] = replaceDefaults(value, _.get(defaults, key), _.get(replacements, key))
    } else {
      merged[key] = _.get(replacements, key, _.get(defaults, key))
    }

    return merged
  }, {})
}

function appendConfig(base, appends) {
  return _.mergeWith({}, base, appends, (baseValue, appendsValue) => {
    if (_.isArray(baseValue)) {
      return baseValue.concat(appendsValue);
    }
  })
}

export default function mergeConfig(base, other) {
  const replaced = replaceDefaults(configTemplate, base, other)
  return appendConfig(replaced, _.get(other, 'extend', {}))
}
