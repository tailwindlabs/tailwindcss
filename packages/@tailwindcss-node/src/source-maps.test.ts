import { expect, it } from 'vitest'
import { toSourceMap } from './source-maps'

it('should emit source maps', () => {
  let map = toSourceMap('{"version":3,"sources":[],"names":[],"mappings":""}')

  expect(map.comment('app.css.map')).toBe('/*# sourceMappingURL=app.css.map */\n')
})
