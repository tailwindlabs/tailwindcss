import type { BunPlugin } from 'bun'

export const resolution: BunPlugin = {
  name: 'Custom loader',
  target: 'bun',
  setup(build) {
    // onLoad
    // build.onLoad({ filter: /./ }, async (file) => {
    //   console.log({ file })
    //   return {
    //     loader: 'object',
    //     exports: {},
    //   }
    // })

    // Replace resolve.ts with the local resolve.standalone.ts
    build.onResolve({ filter: /./ }, (file) => {
      console.log('on resolve', { file })

      return undefined

      // return {
      //   path: require.resolve(file.path),
      // }

      // return Object.assign(file, {
      //   path: require.resolve('./resolve.standalone.ts'),
      // })
    })
  },
}
