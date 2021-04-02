const selectorParser = require('postcss-selector-parser')
const postcss = require('postcss')
const { toRgba } = require('../lib/util/withAlphaVariable')
const { nameClass, escapeCommas } = require('./lib/utils')

function updateAllClasses(selectors, updateClass) {
  let parser = selectorParser((selectors) => {
    selectors.walkClasses((sel) => {
      let updatedClass = updateClass(sel.value, {
        withPseudo(className, pseudo) {
          sel.parent.insertAfter(sel, selectorParser.pseudo({ value: `:${pseudo}` }))
          return className
        },
      })
      sel.value = updatedClass
      if (sel.raws && sel.raws.value) {
        sel.raws.value = escapeCommas(sel.raws.value)
      }
    })
  })

  let result = parser.processSync(selectors)

  return result
}

function updateLastClasses(selectors, updateClass) {
  let parser = selectorParser((selectors) => {
    selectors.each((sel) => {
      let lastClass = sel.filter(({ type }) => type === 'class').pop()

      if (lastClass === undefined) {
        return
      }

      let updatedClass = updateClass(lastClass.value, {
        withPseudo(className, pseudo) {
          lastClass.parent.insertAfter(lastClass, selectorParser.pseudo({ value: `:${pseudo}` }))
          return className
        },
      })
      lastClass.value = updatedClass
      if (lastClass.raws && lastClass.raws.value) {
        lastClass.raws.value = escapeCommas(lastClass.raws.value)
      }
    })
  })
  let result = parser.processSync(selectors)

  return result
}

function transformAllSelectors(transformSelector, wrap = null) {
  return ({ container }) => {
    container.walkRules((rule) => {
      let transformed = rule.selector.split(',').map(transformSelector).join(',')
      rule.selector = transformed
      return rule
    })

    if (wrap) {
      let wrapper = wrap()
      wrapper.append(container.nodes)
      container.append(wrapper)
    }
  }
}

function transformAllClasses(transformClass) {
  return ({ container }) => {
    container.walkRules((rule) => {
      let selector = rule.selector
      let variantSelector = updateAllClasses(selector, transformClass)
      rule.selector = variantSelector
      return rule
    })
  }
}

function transformLastClasses(transformClass, wrap = null) {
  return ({ container }) => {
    container.walkRules((rule) => {
      let selector = rule.selector
      let variantSelector = updateLastClasses(selector, transformClass)
      rule.selector = variantSelector
      return rule
    })

    if (wrap) {
      let wrapper = wrap()
      wrapper.append(container.nodes)
      container.append(wrapper)
    }
  }
}

function asValue(modifier, lookup = {}, { validate = () => true, transform = (v) => v } = {}) {
  let value = lookup[modifier]

  if (value !== undefined) {
    return value
  }

  if (modifier[0] !== '[' || modifier[modifier.length - 1] !== ']') {
    return undefined
  }

  value = modifier.slice(1, -1)

  if (!validate(value)) {
    return undefined
  }

  // add spaces around operators inside calc() that do not follow an operator or (
  return transform(value).replace(/(?<=^calc\(.+?)(?<![-+*/(])([-+*/])/g, ' $1 ')
}

function asUnit(modifier, units, lookup = {}) {
  return asValue(modifier, lookup, {
    validate: (value) => {
      let unitsPattern = `(?:${units.join('|')})`
      return (
        new RegExp(`${unitsPattern}$`).test(value) ||
        new RegExp(`^calc\\(.+?${unitsPattern}`).test(value)
      )
    },
    transform: (value) => {
      return value
    },
  })
}

module.exports = {
  nameClass,
  updateAllClasses,
  updateLastClasses,
  transformAllSelectors,
  transformAllClasses,
  transformLastClasses,
  createSimpleStaticUtilityPlugin(styles) {
    return function ({ matchUtilities }) {
      matchUtilities(
        Object.entries(styles).reduce((newStyles, [selector, rules]) => {
          let result = { [selector]: rules }
          newStyles[selector.slice(1)] = [result]
          return newStyles
        }, {})
      )
    }
  },
  asValue,
  asList(modifier, lookup = {}) {
    return asValue(modifier, lookup, {
      transform: (value) => {
        return postcss.list
          .comma(value)
          .map((v) => v.replace(/,/g, ', '))
          .join(' ')
      },
    })
  },
  asColor(modifier, lookup = {}) {
    return asValue(modifier, lookup, {
      validate: (value) => {
        try {
          toRgba(value)
          return true
        } catch (e) {
          return false
        }
      },
    })
  },
  asAngle(modifier, lookup = {}) {
    return asUnit(modifier, ['deg', 'grad', 'rad', 'turn'], lookup)
  },
  asLength(modifier, lookup = {}) {
    return asUnit(
      modifier,
      [
        'cm',
        'mm',
        'Q',
        'in',
        'pc',
        'pt',
        'px',
        'em',
        'ex',
        'ch',
        'rem',
        'lh',
        'vw',
        'vh',
        'vmin',
        'vmax',
        '%',
      ],
      lookup
    )
  },
}
