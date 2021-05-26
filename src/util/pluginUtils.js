import selectorParser from 'postcss-selector-parser'
import postcss from 'postcss'
import createColor from 'color'
import escapeCommas from './escapeCommas'
import { withAlphaValue } from './withAlphaVariable'

export function updateAllClasses(selectors, updateClass) {
  let parser = selectorParser((selectors) => {
    selectors.walkClasses((sel) => {
      let updatedClass = updateClass(sel.value, {
        withPseudo(className, pseudo) {
          sel.parent.insertAfter(sel, selectorParser.pseudo({ value: `${pseudo}` }))
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

export function updateLastClasses(selectors, updateClass) {
  let parser = selectorParser((selectors) => {
    selectors.each((sel) => {
      let lastClass = sel.filter(({ type }) => type === 'class').pop()

      if (lastClass === undefined) {
        return
      }

      let updatedClass = updateClass(lastClass.value, {
        withPseudo(className, pseudo) {
          lastClass.parent.insertAfter(lastClass, selectorParser.pseudo({ value: `${pseudo}` }))
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

export function transformAllSelectors(transformSelector, { wrap, withRule } = {}) {
  return ({ container }) => {
    container.walkRules((rule) => {
      let transformed = rule.selector.split(',').map(transformSelector).join(',')
      rule.selector = transformed
      if (withRule) {
        withRule(rule)
      }
      return rule
    })

    if (wrap) {
      let wrapper = wrap()
      wrapper.append(container.nodes)
      container.append(wrapper)
    }
  }
}

export function transformAllClasses(transformClass, { wrap, withRule } = {}) {
  return ({ container }) => {
    container.walkRules((rule) => {
      let selector = rule.selector
      let variantSelector = updateAllClasses(selector, transformClass)
      rule.selector = variantSelector
      if (withRule) {
        withRule(rule)
      }
      return rule
    })

    if (wrap) {
      let wrapper = wrap()
      wrapper.append(container.nodes)
      container.append(wrapper)
    }
  }
}

export function transformLastClasses(transformClass, { wrap, withRule } = {}) {
  return ({ container }) => {
    container.walkRules((rule) => {
      let selector = rule.selector
      let variantSelector = updateLastClasses(selector, transformClass)
      rule.selector = variantSelector
      if (withRule) {
        withRule(rule)
      }
      return rule
    })

    if (wrap) {
      let wrapper = wrap()
      wrapper.append(container.nodes)
      container.append(wrapper)
    }
  }
}

export function asValue(
  modifier,
  lookup = {},
  { validate = () => true, transform = (v) => v } = {}
) {
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
  return transform(value).replace(
    /(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,
    '$1 $2 '
  )
}

export function asUnit(modifier, units, lookup = {}) {
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

export function asList(modifier, lookup = {}) {
  return asValue(modifier, lookup, {
    transform: (value) => {
      return postcss.list
        .comma(value)
        .map((v) => v.replace(/,/g, ', '))
        .join(' ')
    },
  })
}

function isArbitraryValue(input) {
  return input.startsWith('[') && input.endsWith(']')
}

function splitAlpha(modifier) {
  let slashIdx = modifier.lastIndexOf('/')

  if (slashIdx === -1 || slashIdx === modifier.length - 1) {
    return [modifier]
  }

  return [modifier.slice(0, slashIdx), modifier.slice(slashIdx + 1)]
}

function isColor(value) {
  try {
    createColor(value)
    return true
  } catch (e) {
    return false
  }
}

export function asColor(modifier, lookup = {}, tailwindConfig = {}) {
  if (lookup[modifier] !== undefined) {
    return lookup[modifier]
  }

  let [color, alpha] = splitAlpha(modifier)

  if (lookup[color] !== undefined) {
    if (isArbitraryValue(alpha)) {
      return withAlphaValue(lookup[color], alpha.slice(1, -1))
    }

    if (tailwindConfig.theme?.opacity?.[alpha] === undefined) {
      return undefined
    }

    return withAlphaValue(lookup[color], tailwindConfig.theme.opacity[alpha])
  }

  return asValue(modifier, lookup, {
    validate: isColor,
  })
}

export function asAngle(modifier, lookup = {}) {
  return asUnit(modifier, ['deg', 'grad', 'rad', 'turn'], lookup)
}

export function asLength(modifier, lookup = {}) {
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
}

export function asLookupValue(modifier, lookup = {}) {
  return lookup[modifier]
}

let typeMap = {
  any: asValue,
  list: asList,
  color: asColor,
  angle: asAngle,
  length: asLength,
  lookup: asLookupValue,
}

function splitAtFirst(input, delim) {
  return (([first, ...rest]) => [first, rest.join(delim)])(input.split(delim))
}

export function coerceValue(type, modifier, values, tailwindConfig) {
  let [scaleType, arbitraryType = scaleType] = [].concat(type)

  if (isArbitraryValue(modifier)) {
    let [explicitType, value] = splitAtFirst(modifier.slice(1, -1), ':')

    if (value.length > 0 && Object.keys(typeMap).includes(explicitType)) {
      return [asValue(`[${value}]`, values, tailwindConfig), explicitType]
    }

    return [typeMap[arbitraryType](modifier, values, tailwindConfig), arbitraryType]
  }

  return [typeMap[scaleType](modifier, values, tailwindConfig), scaleType]
}
