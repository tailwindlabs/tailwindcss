import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Cta } from '@/components/Cta'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new Gatsby project if you don’t have one set up already. The most common
        approach is to use{' '}
        <a href="https://www.gatsbyjs.com/docs/reference/gatsby-cli/#how-to-use-gatsby-cli">
          Gatsby CLI
        </a>
        .
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'gatsby new my-project\ncd my-project',
    },
  },
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <p>
        Using npm, install <code>tailwindcss</code> and its peer dependencies, as well as{' '}
        <code>gatsby-plugin-postcss</code>, and then run the init command to generate both{' '}
        <code>tailwind.config.js</code> and <code>postcss.config.js</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm install -D tailwindcss postcss autoprefixer gatsby-plugin-postcss\nnpx tailwindcss init -p',
    },
  },
  {
    title: 'Enable the Gatsby PostCSS plugin',
    body: () => (
      <p>
        In your <code>gatsby-config.js</code> file, enable the <code>gatsby-plugin-postcss</code>.
        See{' '}
        <a href="https://www.gatsbyjs.com/plugins/gatsby-plugin-postcss/">
          the plugin's documentation
        </a>{' '}
        for more information.
      </p>
    ),
    code: {
      name: 'gatsby-config.js',
      lang: 'js',
      code: `  module.exports = {
    plugins: [
>     'gatsby-plugin-postcss',
      // ...
    ],
  }`,
    },
  },
  {
    title: 'Configure your template paths',
    body: () => (
      <p>
        Add the paths to all of your template files in your <code>tailwind.config.js</code> file.
      </p>
    ),
    code: {
      name: 'tailwind.config.js',
      lang: 'js',
      code: `  module.exports = {
>   content: [
>     "./src/**/*.{js,jsx,ts,tsx}",
>   ],
    theme: {
      extend: {},
    },
    plugins: [],
  }`,
    },
  },
  {
    title: 'Add the Tailwind directives to your CSS',
    body: () => (
      <p>
        Create a <code>./src/styles/global.css</code> file and add the <code>@tailwind</code>{' '}
        directives for each of Tailwind’s layers.
      </p>
    ),
    code: {
      name: 'global.css',
      lang: 'css',
      code: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
    },
  },
  {
    title: 'Import the CSS file',
    body: () => (
      <p>
        Create a <code>gatsby-browser.js</code> file at the root of your project if it doesn’t
        already exist, and import your newly-created <code>./src/styles/global.css</code> file.
      </p>
    ),
    code: {
      name: 'gatsby-browser.js',
      lang: 'css',
      code: `> import './src/styles/global.css'`,
    },
  },
  {
    title: 'Start your build process',
    body: () => (
      <p>
        Run your build process with <code>gatsby develop</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'gatsby develop',
    },
  },
  {
    title: 'Start using Tailwind in your project',
    body: () => <p>Start using Tailwind’s utility classes to style your content.</p>,
    code: {
      name: 'index.js',
      lang: 'jsx',
      code: `  export default function IndexPage() {
    return (
      <Layout>
>       <h1 className="text-3xl font-bold underline">
>         Hello world!
>       </h1>
      </Layout>
    )
  }`,
    },
  },
]

export default function UsingGatsby({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with Gatsby"
      description="Setting up Tailwind CSS in a Gatsby project."
    >
      <Steps steps={steps} code={code} />
    </FrameworkGuideLayout>
  )
}

export function getStaticProps() {
  let { highlightCode } = require('../../../../remark/utils')

  return {
    props: {
      code: steps.map(({ code }) => {
        let isArray = Array.isArray(code)
        code = isArray ? code : [code]
        code = code.map((code) => {
          if (code.lang && code.lang !== 'terminal') {
            return highlightCode(code.code, code.lang)
          }
          return code.code
        })
        return isArray ? code : code[0]
      }),
    },
  }
}

UsingGatsby.layoutProps = {
  meta: {
    title: 'Install Tailwind CSS with Gatsby',
    section: 'Installation',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
