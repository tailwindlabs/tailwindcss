import dlv from 'dlv'
import { memo } from 'react'
import { defaultConfig } from '@/utils/defaultConfig'
import { isObject } from '@/utils/isObject'
import { castArray } from '@/utils/castArray'
import clsx from 'clsx'
import { Heading } from '@/components/Heading'
import nameClass from 'tailwindcss/lib/util/nameClass'

let normalizeProperties = function (input) {
  if (typeof input !== 'object') return input
  if (Array.isArray(input)) return input.map(normalizeProperties)
  return Object.keys(input).reduce((newObj, key) => {
    let val = input[key]
    let newVal = typeof val === 'object' ? normalizeProperties(val) : val
    newObj[key.replace(/([a-z])([A-Z])/g, (m, p1, p2) => `${p1}-${p2.toLowerCase()}`)] = newVal
    return newObj
  }, {})
}

function getUtilities(plugin) {
  if (!plugin) return {}
  const utilities = {}

  function addUtilities(utils) {
    utils = Array.isArray(utils) ? utils : [utils]
    for (let i = 0; i < utils.length; i++) {
      for (let prop in utils[i]) {
        utilities[prop] = normalizeProperties(utils[i][prop])
      }
    }
  }

  plugin()({
    addUtilities,
    addBase() {},
    matchUtilities: (matches, { values }) => {
      let modifierValues = Object.entries(values)

      let result = Object.entries(matches).flatMap(([name, utilityFunction]) => {
        return modifierValues
          .map(([modifier, value]) => {
            let declarations = utilityFunction(value, {
              includeRules(rules) {
                addUtilities(rules)
              },
            })

            if (!declarations) {
              return null
            }

            return {
              [nameClass(name, modifier)]: declarations,
            }
          })
          .filter(Boolean)
      })

      for (let obj of result) {
        for (let key in obj) {
          let deleteKey = false
          for (let subkey in obj[key]) {
            if (subkey.includes('&')) {
              result.push({
                [subkey.replace(/&/g, key)]: obj[key][subkey],
              })
              deleteKey = true
            }
          }

          if (deleteKey) delete obj[key]
        }
      }

      addUtilities(result)
    },
    config: () => ({
      mode: 'aot',
      future: 'all',
    }),
    theme: (path, defaultValue) => dlv(defaultConfig.theme, path, defaultValue),
    variants: () => [],
    e: (x) => x.replace(/([:.])/g, '\\$1'),
    corePlugins: () => true,
  })
  return utilities
}

function stringifyProperties(
  properties,
  { filter = () => true, transformValue = (x) => x, indent = 0 } = {}
) {
  let lines = []
  Object.keys(properties).forEach((property) => {
    if (isObject(properties[property])) {
      lines.push(`${property} {`)
      lines.push(
        stringifyProperties(properties[property], { filter, transformValue, indent: indent + 1 })
      )
      lines.push('}')
    } else {
      castArray(properties[property]).forEach((value, i) => {
        if (!filter(property, value, properties)) return
        lines.push(`${'  '.repeat(indent)}${property}: ${transformValue(value)};`)
      })
    }
  })
  return lines.join('\n')
}

export const ClassTable = memo(
  ({
    plugin,
    filterProperties,
    preview,
    sort = (x) => x,
    transformSelector = (x) => (x.length === 1 ? x : x.slice(1).replace(/\\/g, '')),
    transformProperties = ({ properties }) => properties,
    transformValue,
    custom,
  }) => {
    const utilities = {}
    castArray(plugin).forEach((p) => {
      Object.assign(utilities, getUtilities(p))
    })

    return (
      <div className="border-b border-gray-200 overflow-hidden relative">
        <Heading level={2} id="class-reference" toc={true} className="relative">
          <span className="sr-only">Default class reference</span>
        </Heading>
        <div
          className={clsx(
            'overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch',
            { 'lg:max-h-sm': Object.keys(utilities).length > 12 }
          )}
        >
          {custom || (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="z-20 sticky top-0 text-sm font-semibold text-gray-600 bg-white p-0">
                    <div className="pb-2 pr-2 border-b border-gray-200">Class</div>
                  </th>
                  <th
                    className={clsx(
                      'z-20 sticky top-0 text-sm font-semibold text-gray-600 bg-white p-0',
                      {
                        'hidden sm:table-cell': preview,
                      }
                    )}
                  >
                    <div
                      className={clsx('pb-2 pl-2 border-b border-gray-200', { 'pr-2': preview })}
                    >
                      Properties
                    </div>
                  </th>
                  {preview && (
                    <th className="z-20 sticky top-0 text-sm font-semibold text-gray-600 bg-white p-0">
                      <div className="pb-2 pl-2 border-b border-gray-200">
                        <span className="sr-only">Preview</span>&nbsp;
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="align-baseline">
                {sort(Object.keys(utilities)).map((utility, i) => {
                  let selector = utility
                  let properties = utilities[selector]

                  return (
                    <tr key={utility}>
                      <td
                        translate="no"
                        className={clsx(
                          'py-2 pr-2 font-mono text-xs text-violet-600 whitespace-nowrap',
                          {
                            'border-t border-gray-200': i !== 0,
                          }
                        )}
                      >
                        {transformSelector(selector)}
                      </td>
                      <td
                        translate="no"
                        className={clsx(
                          'py-2 pl-2 font-mono text-xs text-light-blue-600 whitespace-pre',
                          {
                            'border-t border-gray-200': i !== 0,
                            'hidden sm:table-cell sm:pr-2': preview,
                          }
                        )}
                      >
                        {stringifyProperties(transformProperties({ selector, properties }), {
                          filter: filterProperties,
                          transformValue,
                        })}
                      </td>
                      {preview &&
                        preview(properties, {
                          className: i === 0 ? '' : 'border-t border-gray-200',
                        })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }
)
