import colorPalette from 'tailwindcss/colors'
import { kebabToTitleCase } from '@/utils/kebabToTitleCase'
import dlv from 'dlv'

export function ColorPalette({ colors }) {
  return (
    <div className="grid grid-cols-1 gap-y-8 gap-x-6">
      {colors.map((color, i) => {
        let title = Array.isArray(color) ? color[0] : kebabToTitleCase(color)
        let value = Array.isArray(color) ? color[1] : color

        let palette =
          typeof value === 'string'
            ? [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((variant) => ({
                name: variant,
                value: dlv(colorPalette, [value, variant]),
              }))
            : Object.keys(value).map((name) => ({ name, value: value[name] }))

        return (
          <div key={i}>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              <code class="text-sm text-black font-semibold">
                {title
                  .split('')
                  .map((l, i) => {
                    return i === 0 ? l.toLowerCase() : l
                  })
                  .join('')}
              </code>
            </h3>
            <div className="grid grid-cols-10 grid-flow-rows gap-x-2 gap-y-2 text-xs">
              {palette.map(({ name, value }, j) => {
                return (
                  <div key={j} className="flex flex-col space-y-2 items-start">
                    <div
                      className="flex-shrink-0 h-10 w-full rounded ring-1 ring-inset ring-black ring-opacity-5"
                      style={{ backgroundColor: value }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{name}</div>
                      {value.replace(/^#[a-f0-9]+/gi, (m) => m.toUpperCase())}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
