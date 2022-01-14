import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { InstallationLayout } from '@/layouts/InstallationLayout'
import { Cta } from '@/components/Cta'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <p>
        Install <code>tailwindcss</code> via npm, and create your <code>tailwind.config.js</code>{' '}
        file.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm install -D tailwindcss\nnpx tailwindcss init',
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
>   content: ["./src/**/*.{html,js}"],
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
        Add the <code>@tailwind</code> directives for each of Tailwind’s layers to your main CSS
        file.
      </p>
    ),
    code: {
      name: 'src/input.css',
      lang: 'css',
      code: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
    },
  },
  {
    title: 'Start the Tailwind CLI build process',
    body: () => <p>Run the CLI tool to scan your template files for classes and build your CSS.</p>,
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch',
    },
  },
  {
    title: 'Start using Tailwind in your HTML',
    body: () => (
      <p>
        Add your compiled CSS file to the <code>{'<head>'}</code> and start using Tailwind’s utility
        classes to style your content.
      </p>
    ),
    code: {
      name: 'src/index.html',
      lang: 'html',
      code: `  <!doctype html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
>   <link href="/dist/output.css" rel="stylesheet">
  </head>
  <body>
>   <h1 class="text-3xl font-bold underline">
>     Hello world!
>   </h1>
  </body>
  </html>`,
    },
  },
]

export default function TailwindCli({ code }) {
  return (
    <InstallationLayout>
      <div id="content" className="relative z-10 prose prose-slate mb-16 max-w-3xl dark:prose-dark">
        <h3 className="sr-only">Installing Tailwind CLI</h3>
        <p>
          The simplest and fastest way to get up and running with Tailwind CSS from scratch is with
          the Tailwind CLI tool.
        </p>
      </div>
      <Steps level={4} steps={steps} code={code} />
      {/*
        <Cta
          label="Read the documentation"
          href="/docs/tailwind-cli"
          description={
            <>
              <strong className="text-slate-900 font-semibold">
                This is only the beginning of what’s possible with the Tailwind CLI.
              </strong>{' '}
              To learn more about everything it can do, check out the Tailwind CLI documentation.
            </>
          }
        />
      */}
    </InstallationLayout>
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

TailwindCli.layoutProps = {
  meta: {
    title: 'Installation: Tailwind CLI',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
