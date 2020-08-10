import { defaultConfig } from '@/utils/defaultConfig'
import { kebabToTitleCase } from '@/utils/kebabToTitleCase'
import dlv from 'dlv'
import clsx from 'clsx'

function chunkArray(array, size) {
  let result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

function Color({ name, value }) {
  return (
    <div className="flex items-center mt-5">
      <div
        className="h-12 w-12 rounded-lg shadow-inner"
        style={{
          backgroundColor: value,
        }}
      />
      <div className="ml-2 text-gray-800 text-xs leading-none pl-1">
        <div className="font-semibold">{name}</div>
        <div className="mt-1 font-normal opacity-75">
          {value.replace(/^#[a-f0-9]+/gi, (m) => m.toUpperCase())}
        </div>
      </div>
    </div>
  )
}

export function ColorPalette({ colors }) {
  return (
    <div className="flex flex-wrap -mx-2 mt-0">
      {colors.map((color, i) => {
        let title = Array.isArray(color) ? color[0] : kebabToTitleCase(color)
        let value = Array.isArray(color) ? color[1] : color

        let palette =
          typeof value === 'string'
            ? [100, 200, 300, 400, 500, 600, 700, 800, 900].map((variant) => ({
                name: variant,
                value: dlv(defaultConfig, ['theme', 'colors', value, variant]),
              }))
            : Object.keys(value).map((name) => ({ name, value: value[name] }))

        if (palette.length < 3) {
          return (
            <div
              key={i}
              className={clsx('px-2 w-full relative', {
                'mt-4': i !== 0,
              })}
            >
              <h3 className="markdown no-toc mb-4 mt-8">{title}</h3>
              <div className="-mx-2 -mt-5 flex flex-wrap">
                {palette.map((variant, j) => (
                  <div key={j} className="w-1/2 md:w-1/3 px-2">
                    <Color {...variant} />
                  </div>
                ))}
              </div>
            </div>
          )
        }

        return (
          <div
            key={i}
            className={clsx('w-1/2 px-2 md:w-full relative', {
              'mt-4': i !== 0,
            })}
          >
            <h3 className="markdown no-toc mb-4 mt-8">{title}</h3>
            <div className="md:-mx-2 md:-mt-5 md:flex md:flex-wrap">
              {chunkArray(palette, 3).map((chunk, j) => (
                <div key={j} className="md:w-1/3 md:px-2">
                  {chunk.map((variant, k) => (
                    <Color key={k} {...variant} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
