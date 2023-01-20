import { crosscheck } from './run'

crosscheck(({ stable, oxide, engine }) => {
  stable.test('should run on stable', () => {
    expect(engine.stable).toBe(true)
    expect(engine.oxide).toBe(false)
  })
  oxide.test('should run on oxide', () => {
    expect(engine.stable).toBe(false)
    expect(engine.oxide).toBe(true)
  })
  test('should run on both', () => {
    oxide.expect(engine.oxide).toBe(true)
    oxide.expect(engine.stable).toBe(false)
    stable.expect(engine.oxide).toBe(false)
    stable.expect(engine.stable).toBe(true)
  })
})
