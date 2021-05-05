import selectorParser from 'postcss-selector-parser'
import postcss from 'postcss'
import createColor from 'color'
import escapeCommas from './escapeCommas'

export function updateAllClasses(selectors, updateClass) {
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

export function updateLastClasses(selectors, updateClass) {
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

export function transformAllSelectors(transformSelector, wrap = null) {
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

export function transformAllClasses(transformClass) {
  return ({ container }) => {
    container.walkRules((rule) => {
      let selector = rule.selector
      let variantSelector = updateAllClasses(selector, transformClass)
      rule.selector = variantSelector
      return rule
    })
  }
}

export function transformLastClasses(transformClass, wrap = null) {
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

export function asColor(modifier, lookup = {}) {
  return asValue(modifier, lookup, {
    validate: (value) => {
      try {
        createColor(value)
        return true
      } catch (e) {
        return false
      }
    },
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

export function coerceValue(type, modifier, values) {
  return typeMap[type](modifier, values)
}
