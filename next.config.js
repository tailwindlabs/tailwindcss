const path = require('path')
const glob = require('glob')
const querystring = require('querystring')
const { createLoader } = require('simple-functional-loader')
const frontMatter = require('front-matter')
const { withTableOfContents } = require('./remark/withTableOfContents')
const { withProse } = require('./remark/withProse')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

function isSubDirectory(parent, child) {
  return path.relative(child, parent).startsWith('..')
}

function getRewrites() {
  return glob
    .sync('*/*.mdx', { cwd: path.resolve(__dirname, 'src/pages/docs') })
    .map((file) => file.replace(/\.mdx$/, ''))
    .map((file) => ({
      source: `/docs/${file.replace(/^[^/]+\//, '')}`,
      destination: `/docs/${file}`,
    }))
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
        {
          loader: '@mdx-js/loader',
          options: {
            remarkPlugins: [withProse, withTableOfContents],
          },
        },
        createLoader(function (source, ...args) {
          let { meta: fields } = querystring.parse(this.resourceQuery.substr(1))
          let { attributes: meta, body } = frontMatter(source)
          if (fields) {
            for (let field in meta) {
              if (!fields.split(',').includes(field)) {
                delete meta[field]
              }
            }
          }

          let layout = []
          if (!/^\s*export default /m.test(source)) {
            if (isSubDirectory(path.resolve(__dirname, 'src/pages/docs'), this.context)) {
              layout = [
                `import { ContentsLayout } from '@/layouts/ContentsLayout'`,
                'export default ContentsLayout',
              ]
            }
          }

          return [
            ...layout,
            typeof fields === 'undefined' ? body : '',
            `export const meta = ${JSON.stringify(meta)}`,
          ].join('\n\n')
        }),
      ],
    })

    return config
  },
})
