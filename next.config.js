const path = require('path')
const glob = require('glob')
const querystring = require('querystring')
const { createLoader } = require('simple-functional-loader')
const frontMatter = require('front-matter')
const { withTableOfContents } = require('./remark/withTableOfContents')
const { withSyntaxHighlighting } = require('./remark/withSyntaxHighlighting')
const { withProse } = require('./remark/withProse')
const minimatch = require('minimatch')
const withExamples = require('./remark/withExamples')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const fallbackLayouts = {
  'src/pages/docs/**/*': ['@/layouts/DocumentationLayout', 'DocumentationLayout'],
  'src/pages/screencasts/**/*': ['@/layouts/ScreencastsLayout', 'ScreencastsLayout'],
}

const fallbackDefaultExports = {
  'src/pages/docs/**/*': ['@/layouts/ContentsLayout', 'ContentsLayout'],
  'src/pages/screencasts/**/*': ['@/layouts/VideoLayout', 'VideoLayout'],
}

function getRewrites() {
  return ['docs', 'screencasts'].flatMap((dir) =>
    glob
      .sync('*/*.mdx', { cwd: path.resolve(__dirname, `src/pages/${dir}`) })
      .map((file) => file.replace(/\.mdx$/, ''))
      .map((file) => ({
        source: `/${dir}/${file.replace(/^[^/]+\//, '').replace(/^[0-9]+-/, '')}`,
        destination: `/${dir}/${file}`,
      }))
  )
}

module.exports = withBundleAnalyzer({
  pageExtensions: ['js', 'jsx', 'mdx'],
  experimental: {
    rewrites: getRewrites,
  },
  exportPathMap: async function (defaultPathMap) {
    const rewrites = getRewrites()
    const pathMap = {}
    for (let pathname in defaultPathMap) {
      const rewrite = rewrites.find((rw) => rw.destination === pathname)
      pathMap[rewrite ? rewrite.source : pathname] = defaultPathMap[pathname]
    }
    return pathMap
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mdx$/,
      use: [
        options.defaultLoaders.babel,
        createLoader(function (source) {
          return source + `\nMDXContent.Layout = layoutProps.Layout\n`
        }),
        {
          loader: '@mdx-js/loader',
          options: {
            remarkPlugins: [withExamples, /*withProse,*/ withTableOfContents, withSyntaxHighlighting],
          },
        },
        createLoader(function (source) {
          let { meta: fields } = querystring.parse(this.resourceQuery.substr(1))
          let { attributes: meta, body } = frontMatter(source)
          if (fields) {
            for (let field in meta) {
              if (!fields.split(',').includes(field)) {
                delete meta[field]
              }
            }
          }

          let extra = []
          let resourcePath = path.relative(__dirname, this.resourcePath)

          if (!/^\s*export\s+(var|let|const)\s+Layout\s+=/m.test(source)) {
            for (let glob in fallbackLayouts) {
              if (minimatch(resourcePath, glob)) {
                extra.push(
                  `import { ${fallbackLayouts[glob][1]} as _Layout } from '${fallbackLayouts[glob][0]}'`,
                  'export const Layout = _Layout'
                )
                break
              }
            }
          }

          if (!/^\s*export\s+default\s+/m.test(source)) {
            for (let glob in fallbackDefaultExports) {
              if (minimatch(resourcePath, glob)) {
                extra.push(
                  `import { ${fallbackDefaultExports[glob][1]} as _Default } from '${fallbackDefaultExports[glob][0]}'`,
                  'export default _Default'
                )
                break
              }
            }
          }

          return [
            ...extra,
            typeof fields === 'undefined' ? body : '',
            `export const meta = ${JSON.stringify(meta)}`,
          ].join('\n\n')
        }),
      ],
    })

    return config
  },
})
