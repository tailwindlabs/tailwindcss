import { SourceMapGenerator } from 'source-map-js'
import type { DecodedSource, DecodedSourceMap } from '../../tailwindcss/src/source-maps/source-map'
import { DefaultMap } from '../../tailwindcss/src/utils/default-map'

export type { DecodedSource, DecodedSourceMap }
export interface SourceMap {
  readonly raw: string
  readonly inline: string
}

function serializeSourceMap(map: DecodedSourceMap): string {
  let generator = new SourceMapGenerator()

  let id = 1
  let sourceTable = new DefaultMap<
    DecodedSource | null,
    {
      url: string
      content: string
    }
  >((src) => {
    return {
      url: src?.url ?? `<unknown ${id++}>`,
      content: src?.content ?? '<none>',
    }
  })

  for (let mapping of map.mappings) {
    let original = sourceTable.get(mapping.originalPosition?.source ?? null)

    generator.addMapping({
      generated: mapping.generatedPosition,
      original: mapping.originalPosition,
      source: original.url,
      name: mapping.name,
    })

    generator.setSourceContent(original.url, original.content)
  }

  return generator.toString()
}

export function toSourceMap(map: DecodedSourceMap | string): SourceMap {
  let raw = typeof map === 'string' ? map : serializeSourceMap(map)

  return {
    raw,
    get inline() {
      let tmp = ''

      tmp += '/*# sourceMappingURL=data:application/json;base64,'
      tmp += Buffer.from(raw, 'utf-8').toString('base64')
      tmp += ' */\n'

      return tmp
    },
  }
}
