import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new Remix project if you don’t have one set up already. The most common
        approach is to use <a href="https://remix.run/docs/en/v1">Create Remix</a>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npx create-remix@latest my-project\ncd my-project',
    },
  },
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <p>
        Install <code>tailwindcss</code>, its peer dependencies, and <code>concurrently</code> via npm, and then run the init
        command to generate both <code>tailwind.config.js</code> and <code>postcss.config.js</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm install -D tailwindcss postcss autoprefixer concurrently\nnpx tailwindcss init -p',
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
>     "./app/**/*.{js,ts,jsx,tsx}",
>   ],
    theme: {
      extend: {},
    },
    plugins: [],
  }`,
    },
  },
  {
    title: 'Update your package.json scripts',
    body: () => (
      <p>
        Update the scripts in your <code>package.json</code> file to build both your development and production CSS.
      </p>
    ),
    code: {
      name: 'package.json',
      lang: 'json5',
      code: `  {
    "scripts": {
>     "build": "npm run build:css && remix build",
>     "build:css": "tailwindcss -m -i ./styles/app.css -o app/styles/app.css",
>     "dev": "concurrently \\\"npm run dev:css\\\" \\\"remix dev\\\"",
>     "dev:css": "tailwindcss -w -i ./styles/app.css -o app/styles/app.css",
    }
  }`,
    },
  },
  {
    title: 'Add the Tailwind directives to your CSS',
    body: () => (
      <p>
        Create a <code>./styles/app.css</code> file and add the <code>@tailwind</code> directives
        for each of Tailwind’s layers.
      </p>
    ),
    code: {
      name: 'app.css',
      lang: 'css',
      code: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
    },
  },
  {
    title: 'Import the CSS file',
    body: () => (
      <p>
        Import the compiled <code>./app/styles/app.css</code> file in your <code>./app/root.jsx</code> file.
      </p>
    ),
    code: {
      name: 'root.jsx',
      lang: 'js',
      code: `import styles from "./styles/app.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}`,
    },
  },
  {
    title: 'Start your build process',
    body: () => (
      <p>
        Run your build process with <code>npm run dev</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm run dev',
    },
  },
  {
    title: 'Start using Tailwind in your project',
    body: () => <p>Start using Tailwind’s utility classes to style your content.</p>,
    code: {
      name: 'index.jsx',
      lang: 'jsx',
      code: `  export default function Index() {
    return (
>     <h1 className="text-3xl font-bold underline">
>       Hello world!
>     </h1>
    )
  }`,
    },
  },
]

export default function UsingRemix({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with Remix"
      description="Setting up Tailwind CSS in a Remix project."
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

UsingRemix.layoutProps = {
  meta: {
    title: 'Install Tailwind CSS with Remix',
    section: 'Installation',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
