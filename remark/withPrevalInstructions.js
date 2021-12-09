const fs = require('fs')
const fm = require('front-matter')
const redent = require('redent')
const visit = require('unist-util-visit')

const unified = require('unified')
const markdown = unified().use(require('remark-parse'))

const stubs = {
  tailwind: fs.readFileSync(require.resolve('tailwindcss/stubs/simpleConfig.stub'), 'utf8'),
  postcss: fs.readFileSync(require.resolve('tailwindcss/stubs/defaultPostCssConfig.stub'), 'utf8'),
}

// Abusing the front-matter plugin to parse the Yaml, so that we don't have to
// load another yaml tool. Shush, don't tell anyone!
function yaml(input) {
  return fm(['---', input, '---'].join('\n')).attributes
}

function md(input) {
  // The regex replace will deduce two or more \n to a single \n
  return markdown.parse(redent(input).replace(/^\n+/gm, '\n')).children
}

function joinAsSpeech(words, separator = ' and ') {
  let all = words.slice()
  let last = all.pop()

  return [all.join(', '), last].filter(Boolean).join(separator)
}

function escapeRegex(input) {
  return input.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function diff(blob, changes) {
  // Re-indent with 2 spaces, so that we have breathing room for the - and + signs.
  let next = blob
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')

  for (let [needle, replacement] of changes) {
    next = next
      .replace(
        new RegExp(`([  ]*)${escapeRegex(needle)}`),
        [
          needle
            .split('\n')
            .map((line) => `- $1${line}`)
            .join('\n'),
          replacement
            .split('\n')
            .map((line) => `+ $1${line}`)
            .join('\n'),
        ].join('\n')
      )
      // $1 contained 2 spaces to many
      .replace(/^([-+])\s{3}/gm, '$1 ')
  }

  return next
}

function quote(char = "'") {
  return (line) => char + line + char
}

function indent(amount = 2) {
  return (line) => ' '.repeat(amount) + line
}

function error(input) {
  return `<div class="fixed top-0 left-0 right-0 p-4 z-50 bg-red-500 text-white text-2xl">Pages contains issues!</div><span class="font-bold bg-red-100 bg-opacity-50 ring-4 ring-red-600 ring-opacity-75 rounded-2xl px-2">${input}</span>`
}

function code(language, contents, { file = null, indent = 8 } = {}) {
  let diffIndentation = language.includes('diff-') ? '  ' : ''
  let comment = {
    js: (data) => `// ${data}`,
    css: (data) => `/* ${data} */`,
    html: (data) => `<!-- ${data} -->`,
    php: (data) => (file && file.endsWith('.blade.php') ? `{{-- ${data} --}}` : `// ${data}`),
  }

  return [
    '```' + language,
    file && diffIndentation + comment[language.replace('diff-', '')](file),
    contents.trimEnd(),
    '```',
  ]
    .filter(Boolean)
    .join('\n')
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : `${' '.repeat(indent)}${line}`))
    .join('\n')
}

function createPrevals({ tool: pageTool = error('UNKNOWN') } = {}) {
  return {
    installation({
      tool = pageTool,
      reference = null,
      script,
      npmInstall = false,
      disclaimer = null,
    }) {
      return md(`
        ## Creating your project

        Start by creating a new ${tool} project if you don't have one set up already.
        ${
          reference !== null
            ? `The most common approach is to use [${reference.name}](${reference.link}):`
            : ''
        }


        ${disclaimer !== null ? code('shell', `${script} my-project`) : ''}
        ${disclaimer !== null ? disclaimer : ''}

        ${disclaimer !== null ? 'Next, change directories to your new project:' : ''}
        ${disclaimer !== null ? code('shell', 'cd my-project') : ''}

        ${
          disclaimer === null
            ? code('shell', [`${script} my-project`, 'cd my-project'].join('\n'))
            : ''
        }

        ${npmInstall ? `Next, install ${tool}'s front-end dependencies using \`npm\`:` : ''}
        ${npmInstall ? code('shell', 'npm install') : ''}
      `)
    },
    configuration({
      purge = [],
      version = 'latest',
      types = ['pages', 'components'],
      postcss = true,
    }) {
      let files = ['tailwind.config.js', postcss && 'postcss.config.js']
        .filter(Boolean)
        .map(quote('`'))
      let multipleFiles = files.length > 1

      return md(`
        ### Create your configuration ${multipleFiles ? 'files' : 'file'}

        Next, generate your ${joinAsSpeech(files)} ${multipleFiles ? 'files' : 'file'}:

        ${code(
          'shell',
          `npx tailwindcss${version === 'compat-7' ? '-cli@latest' : ''} init ${
            postcss ? '-p' : ''
          }`
        )}

        This will create a minimal \`tailwind.config.js\` file at the root of your project:

        ${code('js', stubs.tailwind, { file: 'tailwind.config.js' })}

        Learn more about configuring Tailwind in the [configuration documentation](/docs/configuration).

        ${
          postcss
            ? 'It will also create a `postcss.config.js` file that includes `tailwindcss` and `autoprefixer` already configured:'
            : ''
        }
        ${postcss ? code('js', stubs.postcss, { file: 'postcss.config.js' }) : ''}
        ${
          postcss
            ? "If you're planning to use any other PostCSS plugins, you should read our documentation on [using PostCSS as your preprocessor](/docs/using-with-preprocessors) for more details about the best way to order them alongside Tailwind."
            : ''
        }

        ### Configure Tailwind to remove unused styles in production

        In your \`tailwind.config.js\` file, configure the \`content\` option with the paths to all of your ${joinAsSpeech(
          types
        )} so Tailwind can tree-shake unused styles in production builds:

        ${code(
          'diff-js',
          diff(stubs.tailwind, [
            [
              'purge: [],',
              `purge: [${
                purge.length > 2
                  ? // Use multiple lines once we hit 3 lines of purging
                    '\n' + purge.map(quote("'")).map(indent(2)).join(',\n') + ',\n'
                  : // Keep it all inline
                    purge.map(quote("'")).join(', ')
              }],`,
            ],
          ]),
          { file: 'tailwind.config.js' }
        )}

        Read our separate guide on [optimizing for production](/docs/optimizing-for-production) to learn more about tree-shaking unused styles for best performance.
      `)
    },
    setup({
      dependencies = [],
      uninstall = [],
      soon = false,
      tool = pageTool,
      version = 'latest',
    }) {
      let knownDependencies = {
        latest: ['tailwindcss@latest', 'postcss@latest', 'autoprefixer@latest'],
        'compat-7': [
          'tailwindcss@npm:@tailwindcss/postcss7-compat',
          'postcss@^7',
          'autoprefixer@^9',
        ],
      }

      if (typeof version === 'string') {
        version = { [tool]: version }
      }

      let hasMultipleVersion = Object.keys(version).length > 1
      let installCode = Object.entries(version)
        .map(([name, mode]) => {
          if (knownDependencies[mode] === undefined) {
            throw new Error(
              `Unknown version "${mode}". Only valid versions are: ${joinAsSpeech(
                Object.values(knownDependencies).map(quote('`'))
              )}`
            )
          }

          return [
            hasMultipleVersion && `# If you're on ${name}`,
            `npm install -D ${[...dependencies, ...knownDependencies[mode]].join(' ')}`,
          ]
            .filter(Boolean)
            .join('\n')
        })
        .join('\n\n')

      let outdatedVersions = Object.keys(version)
        .filter((name) => version[name] === 'compat-7')
        .flatMap((version) => version.split(/\s(?:and|or)\s/)) // "Next.js or older" -> ["Next.js", "older"]
        .filter(Boolean)
      let information =
        outdatedVersions.length > 0
          ? `${joinAsSpeech(outdatedVersions)} ${
              outdatedVersions.length === 1 ? "doesn't" : "don't"
            } support PostCSS 8 yet${
              soon ? " _(but it's coming soon)_" : ''
            } so you need to install [the Tailwind CSS v2.0 PostCSS 7 compatibility build](/docs/installation#post-css-7-compatibility-build) for now as we've shown above.`
          : ''

      return md(`
        ## Setting up Tailwind CSS

        *Tailwind CSS requires Node.js 12.13.0 or higher.*

        ### Install Tailwind via npm

        ${
          uninstall.length > 0
            ? `If you already have the ${joinAsSpeech(uninstall.map(quote('`')))} ${
                uninstall.length === 1 ? 'module' : 'modules'
              } installed for any reason, it's important that you uninstall it before installing Tailwind itself:`
            : ''
        }
        ${uninstall.length > 0 ? code('shell', `npm uninstall ${uninstall.join(' ')}`) : ''}

        ${uninstall.length > 0 ? 'Next, install' : 'Install'} ${joinAsSpeech(
        [...dependencies.map(quote('`')), 'Tailwind'],
        ' as well as '
      )} and its peer-dependencies using \`npm\`:

        ${code('shell', installCode)}

        ${information}
      `)
    },
    include({ file, create = false, tool = pageTool, withChromiumBug = false, level = 3 }) {
      return md(`
        ${'#'.repeat(level)} Include Tailwind in your CSS

        ${
          create
            ? `Create the \`${file}\` file`
            : `Open the \`${file}\` file that ${tool} generates for you by default`
        }
        and use the \`@tailwind\` directive to include Tailwind's \`base\`, \`components\`, and \`utilities\` styles, replacing the original file contents:

        ${code(
          'css',
          [
            ...(withChromiumBug ? ['', '/*! @import */'] : []),
            '@tailwind base;',
            '@tailwind components;',
            '@tailwind utilities;',
          ].join('\n'),
          { file }
        )}

        ${
          withChromiumBug
            ? "_Due to [a bug in Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1131113), it's important that you include the weird `/*! @import */` comment to avoid performance issues in Chrome DevTools during development. This is already fixed in Canary but hasn't been released generally yet._"
            : ''
        }

        Tailwind will swap these directives out at build-time with all of the styles it generates based on your configured design system.

        Read our documentation on [adding base styles](/docs/adding-base-styles), [extracting components](/docs/extracting-components), and [adding new utilities](/docs/adding-new-utilities) for best practices on extending Tailwind with your own custom CSS.
      `)
    },
    finish({ scripts = [], tool = pageTool }) {
      return md(`
        You're finished! Now when you run ${joinAsSpeech(
          scripts.map(quote('`')),
          ' or '
        )}, Tailwind CSS will be ready to use in your ${tool} project.

        [Next learn about the utility-first workflow &rarr;](/docs/utility-first)
      `)
    },
  }
}

module.exports.withPrevalInstructions = () => {
  return (tree, VFile) => {
    let context = VFile.contents.match(/export const meta = ([{[])(.*)/)
    if (context !== null) {
      try {
        context = JSON.parse(context[1] + context[2])
      } catch (err) {
        context = {}
      }
    } else {
      context = {}
    }

    let prevals = createPrevals(context)

    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'preval') return
      if (prevals[node.meta] === undefined)
        throw new Error(
          `Preval instruction "${node.meta}" is not handled properly!\n\n\tSee: ./remark/withPrevalInstructions.js`
        )

      parent.children.splice(index, 1, ...[].concat(prevals[node.meta](yaml(node.value), node)))
    })
  }
}
