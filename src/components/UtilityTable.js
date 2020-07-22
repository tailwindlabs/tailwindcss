import dlv from 'dlv'
import preval from 'preval.macro'
import { memo } from 'react'

const config = preval`
  const defaultTheme = require('tailwindcss/defaultTheme')
  const resolveConfig = require('tailwindcss/resolveConfig')
  module.exports = resolveConfig({ theme: defaultTheme })
`

function getUtilities(plugin) {
  const utilities = {}
  plugin()({
    addUtilities: (utils) => {
      utils = Array.isArray(utils) ? utils : [utils]
      for (let i = 0; i < utils.length; i++) {
        Object.assign(utilities, utils[i])
      }
    },
    theme: (path, defaultValue) => dlv(config.theme, path, defaultValue),
    variants: () => [],
    e: (x) => x.replace(/([:.])/g, '\\$1'),
    target: () => 'modern',
    corePlugins: () => true,
  })
  return utilities
}

function castArray(value) {
  return Array.isArray(value) ? value : [value]
}

function stringifyProperties(properties, filter = () => true, transformValue = (x) => x) {
  let lines = []
  Object.keys(properties).forEach((property) => {
    castArray(properties[property]).forEach((value, i) => {
      if (!filter(property, value, properties)) return
      lines.push(`${property}: ${transformValue(value)};`)
    })
  })
  return lines
    .map((line, i) => [i === 0 ? undefined : <br />, line])
    .filter(Boolean)
    .flat()
}

export const UtilityTable = memo(
  ({ plugin, filterProperties, preview, transformSelector = (x) => x, transformValue }) => {
    const utilities = getUtilities(plugin)

    console.log('rdnder')

    return (
      <div className="mt-0 border-t border-b border-gray-300 overflow-hidden relative">
        <div className="lg:max-h-xs overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch">
          <table className="w-full text-left table-collapse">
            <thead>
              <tr>
                <th className="z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0">
                  <div className="p-2 border-b border-gray-300">Class</div>
                </th>
                <th
                  className={`z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0 ${
                    preview && 'hidden sm:table-cell'
                  }`}
                >
                  <div className="p-2 border-b border-gray-300">Properties</div>
                </th>
                {preview && (
                  <th className="z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0">
                    <div className="p-2 border-b border-gray-300">
                      <span className="invisible">Preview</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="align-baseline">
              {Object.keys(utilities).map((utility, i) => (
                <tr key={utility}>
                  <td
                    className={`p-2 font-mono text-xs text-purple-700 whitespace-no-wrap ${
                      i === 0 ? '' : 'border-t border-gray-200'
                    }`}
                  >
                    {transformSelector(utility)}
                  </td>
                  <td
                    className={`p-2 font-mono text-xs text-blue-700 whitespace-pre ${
                      i === 0 ? '' : 'border-t border-gray-200'
                    } ${preview && 'hidden sm:table-cell'}`}
                  >
                    {stringifyProperties(utilities[utility], filterProperties, transformValue)}
                  </td>
                  {preview &&
                    preview(utilities[utility], {
                      className: `p-2 font-mono text-xs whitespace-pre ${
                        i === 0 ? '' : 'border-t border-gray-200'
                      }`,
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
)
