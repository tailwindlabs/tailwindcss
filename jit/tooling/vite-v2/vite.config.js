// @ts-check

import path from 'path'

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  root: path.join(__dirname, 'src'),
  mode: 'development',

  plugins: [
    {
      name: 'integration',
      enforce: 'post',

      configResolved(config) {
        const cssPostPlugin = config.plugins.find(p => p.name === 'vite:css-post')

        if (! cssPostPlugin) {
          throw new Error("Unable to find vite:css-post plugin")
        }
      },

      transform (css, id, ssr) {
        console.log(css)

        return css
      },
    },
  ],

  server: {
    port: 1337,
    https: false,
    strictPort: true,
  },

  build: {
    outDir: path.join(__dirname, 'dist'),
    assetsDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      }
    }
  },
}

export default config
