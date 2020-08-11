import dlv from 'dlv'
import { memo } from 'react'
import { defaultConfig } from '@/utils/defaultConfig'
import { isObject } from '@/utils/isObject'
import { castArray } from '@/utils/castArray'
import clsx from 'clsx'
import { Heading } from '@/components/Heading'

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
  plugin()({
    addUtilities: (utils) => {
      utils = Array.isArray(utils) ? utils : [utils]
      for (let i = 0; i < utils.length; i++) {
        for (let prop in utils[i]) {
          utilities[prop] = normalizeProperties(utils[i][prop])
        }
      }
    },
    theme: (path, defaultValue) => dlv(defaultConfig.theme, path, defaultValue),
    variants: () => [],
    e: (x) => x.replace(/([:.])/g, '\\$1'),
    target: () => 'modern',
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
    transformSelector = (x) => x,
    transformProperties = ({ properties }) => properties,
    transformValue,
    custom,
  }) => {
    const utilities = {}
    castArray(plugin).forEach((p) => {
      Object.assign(utilities, getUtilities(p))
    })

    return (
      <div className="mt-0 border-t border-b border-gray-300 overflow-hidden relative">
        <Heading
          level={2}
          id="class-reference"
          toc={true}
          className="relative"
          style={{ top: '-100vh' }}
        >
          <span className="sr-only">Class reference</span>
        </Heading>
        <div
          className={clsx(
            'overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch',
            { 'lg:max-h-sm': Object.keys(utilities).length > 12 }
          )}
        >
          {custom || (
            <table className="w-full text-left table-collapse">
              <thead>
                <tr>
                  <th className="z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0">
                    <div className="p-2 border-b border-gray-300">Class</div>
                  </th>
                  <th
                    className={clsx(
                      'z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0',
                      { 'hidden sm:table-cell': preview }
                    )}
                  >
                    <div className="p-2 border-b border-gray-300">Properties</div>
                  </th>
                  {preview && (
                    <th className="z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0">
                      <div className="p-2 border-b border-gray-300">
                        <span className="sr-only">Preview</span>&nbsp;
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="align-baseline">
                {Object.keys(utilities).map((utility, i) => {
                  let selector = utility
                  let properties = utilities[selector]

                  return (
                    <tr key={utility}>
                      <td
                        className={clsx(
                          'p-2 font-mono text-xs text-purple-700 whitespace-no-wrap',
                          {
                            'border-t border-gray-200': i !== 0,
                          }
                        )}
                      >
                        {transformSelector(selector)}
                      </td>
                      <td
                        className={clsx('p-2 font-mono text-xs text-blue-700 whitespace-pre', {
                          'border-t border-gray-200': i !== 0,
                          'hidden sm:table-cell': preview,
                        })}
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
