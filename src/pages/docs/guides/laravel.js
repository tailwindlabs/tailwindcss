import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new Laravel project if you don’t have one set up already. The most
        common approach is to use{' '}
        <a href="https://laravel.com/docs/8.x#the-laravel-installer">the Laravel Installer</a>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'laravel new my-project\ncd my-project',
    },
  },
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <p>
        Install <code>tailwindcss</code> and its peer dependencies via npm, and create your{' '}
        <code>tailwind.config.js</code> file.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init',
    },
  },
  {
    title: 'Add Tailwind to your Laravel Mix configuration',
    body: () => (
      <p>
        In your <code>webpack.mix.js</code> file, add <code>tailwindcss</code> as a PostCSS plugin.
      </p>
    ),
    code: {
      name: 'webpack.mix.js',
      lang: 'js',
      code: `  mix.js("resources/js/app.js", "public/js")
    .postCss("resources/css/app.css", "public/css", [
>     require("tailwindcss"),
    ]);`,
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
>     "./resources/**/*.blade.php",
>     "./resources/**/*.js",
>     "./resources/**/*.vue",
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
        <code>./resources/css/app.css</code> file.
      </p>
    ),
    code: {
      name: 'app.css',
      lang: 'css',
      code: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
    },
  },
  {
    title: 'Start your build process',
    body: () => (
      <p>
        Run your build process with <code>npm run watch</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm run watch',
    },
  },
  {
    title: 'Start using Tailwind in your project',
    body: () => (
      <p>
        Make sure your compiled CSS is included in the <code>{'<head>'}</code> then start using
        Tailwind’s utility classes to style your content.
      </p>
    ),
    code: {
      name: 'app.blade.php',
      lang: 'html',
      code: `  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
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

export default function UsingLaravel({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with Laravel"
      description="Setting up Tailwind CSS in a Laravel project."
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
        if (code.lang && code.lang !== 'terminal') {
          return highlightCode(code.code, code.lang)
        }
        return code.code
      }),
    },
  }
}

UsingLaravel.layoutProps = {
  meta: {
    title: 'Install Tailwind CSS with Laravel',
    section: 'Installation',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
