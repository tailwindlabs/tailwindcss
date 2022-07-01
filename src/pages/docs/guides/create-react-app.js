import Link from 'next/link'
import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new React project with{' '}
        <a href="https://create-react-app.dev/docs/getting-started">Create React App v5.0+</a> if
        you don't have one already set up.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npx create-react-app my-project\ncd my-project',
    },
  },
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <p>
        Install <code>tailwindcss</code> and its peer dependencies via npm, and then run the init
        command to generate both <code>tailwind.config.js</code> and <code>postcss.config.js</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p',
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
        Add the <code>@tailwind</code> directives for each of Tailwind’s layers to your{' '}
        <code>./src/index.css</code> file.
      </p>
    ),
    code: {
      name: 'index.css',
      lang: 'css',
      code: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
    },
  },
  {
    title: 'Start your build process',
    body: () => (
      <p>
        Run your build process with <code>npm run start</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm run start',
    },
  },
  {
    title: 'Start using Tailwind in your project',
    body: () => <p>Start using Tailwind’s utility classes to style your content.</p>,
    code: {
      name: 'App.js',
      lang: 'jsx',
      code: `  export default function App() {
    return (
>     <h1 className="text-3xl font-bold underline">
>       Hello world!
>     </h1>
    )
  }`,
    },
  },
]

export default function UsingCRA({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with Create React App"
      description="Setting up Tailwind CSS in a Create React App project."
    >
      <div className="relative z-10 prose prose-slate mb-16 max-w-3xl dark:prose-dark">
        <p>
          Note that for new React projects, we highly recommend using{' '}
          <Link href="https://vitejs.dev">
            <a>Vite</a>
          </Link>
          ,{' '}
          <Link href="https://nextjs.org">
            <a>Next.js</a>
          </Link>
          , or{' '}
          <Link href="https://parceljs.org">
            <a>Parcel</a>
          </Link>{' '}
          instead of Create React App. They provide an equivalent or better developer experience but
          with more flexibility, giving you more control over how Tailwind and PostCSS are
          configured.
        </p>
      </div>
      <Steps steps={steps} code={code} />
    </FrameworkGuideLayout>
  )
}

export function getStaticProps() {
  let { highlightCode } = require('../../../../remark/utils')

  return {
    props: {
      code: steps.map(({ code }) => {
        if (code.lang && code.lang !== 'terminal') {
          return highlightCode(code.code, code.lang)
        }
        return code.code
      }),
    },
  }
}

UsingCRA.layoutProps = {
  meta: {
    title: 'Install Tailwind CSS with Create React App',
    section: 'Installation',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
