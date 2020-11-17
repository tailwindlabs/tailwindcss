import colorPalette from 'tailwindcss/colors'
import { kebabToTitleCase } from '@/utils/kebabToTitleCase'
import dlv from 'dlv'

export function ColorPaletteReference({ colors }) {
  return (
    <div className="grid grid-cols-1 gap-8">
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
            <div className="flex flex-col space-y-3 sm:flex-row text-xs sm:space-y-0 sm:space-x-4">
              <div className="w-32 flex-shrink-0">
                <div className="h-10 flex flex-col justify-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {title
                      .split('')
                      .flatMap((l, i) => {
                        return i !== 0 && l.toUpperCase() === l ? [' ', l] : [l]
                      })
                      .join('')}
                  </div>
                  <div>
                    <code className="text-xs text-gray-500">
                      colors.
                      {value
                        .split('')
                        .map((l, i) => {
                          return i === 0 ? l.toLowerCase() : l
                        })
                        .join('')}
                    </code>
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1 grid grid-cols-5 2xl:grid-cols-10 gap-x-4 gap-y-3 2xl:gap-x-2">
                {palette.map(({ name, value }, j) => {
                  return (
                    <div key={j} className="space-y-1.5">
                      <div
                        className="h-10 w-full rounded ring-1 ring-inset ring-black ring-opacity-0"
                        style={{ backgroundColor: value }}
                      />
                      <div className="px-0.5 md:flex md:justify-between md:space-x-2 2xl:space-x-0 2xl:block">
                        <div className="w-6 font-medium text-gray-900">{name}</div>
                        <div>{value.replace(/^#[a-f0-9]+/gi, (m) => m.toUpperCase())}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
