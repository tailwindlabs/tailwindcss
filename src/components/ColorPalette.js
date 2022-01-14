import defaultConfig from 'defaultConfig'
import { kebabToTitleCase } from '@/utils/kebabToTitleCase'
import dlv from 'dlv'

export function ColorPalette({ colors }) {
  return colors.map((color, i) => {
    let title = Array.isArray(color) ? color[0] : kebabToTitleCase(color)
    let value = Array.isArray(color) ? color[1] : color

    let palette =
      typeof value === 'string'
        ? [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((variant) => ({
            name: variant,
            value: dlv(defaultConfig, ['theme', 'colors', value, variant]),
          }))
        : Object.keys(value).map((name) => ({ name, value: value[name] }))

    return (
      <div key={i}>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="flex flex-wrap -mt-6 -mx-3 text-sm">
          {palette.map(({ name, value }, j) => (
            <div key={j} className="flex-none w-1/5 px-3 mt-6">
              <div className="h-12 rounded-lg mb-2" style={{ backgroundColor: value }} />
              <div className="font-medium text-slate-900">{name}</div>
              {value.replace(/^#[a-f0-9]+/gi, (m) => m.toUpperCase())}
            </div>
          ))}
        </div>
      </div>
    )
  })
}
