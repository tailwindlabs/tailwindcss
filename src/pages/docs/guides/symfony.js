import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new Symfony project if you don’t have one set up already. The most
        common approach is to use <a href="https://symfony.com/download">the Symfony Installer</a>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'symfony new --webapp my-project\ncd my-project',
    },
  },
  {
    title: 'Install Webpack Encore',
    body: () => (
      <p>
        Install Webpack Encore, which handles building your assets. See{' '}
        <a href="https://symfony.com/doc/current/frontend.html">the documentation</a> for more
        information.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'composer require symfony/webpack-encore-bundle',
    },
  },
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <p>
        Using npm, install <code>tailwindcss</code> and its peer dependencies, as well as{' '}
        <code>postcss-loader</code>, and then run the init command to generate both{' '}
        <code>tailwind.config.js</code> and <code>postcss.config.js</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm install -D tailwindcss postcss autoprefixer postcss-loader\nnpx tailwindcss init -p',
    },
  },
  {
    title: 'Enable PostCSS support',
    body: () => (
      <p>
        In your <code>webpack.config.js</code> file, enable PostCSS Loader. See{' '}
        <a href="https://symfony.com/doc/current/frontend/encore/postcss.html">the documentation</a>{' '}
        for more information.
      </p>
    ),
    code: {
      name: 'webpack.config.js',
      lang: 'js',
      code: `  Encore
    // ...
>   .enablePostCssLoader()
  ;`,
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
      code: `  /** @type {import('tailwindcss').Config} */
  module.exports = {
>   content: [
>     "./assets/**/*.js",
>     "./templates/**/*.html.twig",
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
        <code>./assets/styles/app.css</code> file.
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
      name: 'base.html.twig',
      lang: 'html',
      code: `  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {% block stylesheets %}
      {{ encore_entry_link_tags('app') }}
    {% endblock %}
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

export default function UsingSymfony({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with Symfony"
      description="Setting up Tailwind CSS in a Symfony project."
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

UsingSymfony.layoutProps = {
  meta: {
    title: 'Install Tailwind CSS with Symfony',
    section: 'Installation',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
