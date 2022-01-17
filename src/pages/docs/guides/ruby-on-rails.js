import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new Rails project if you don't have one set up already. The most common
        approach is to use the{' '}
        <a href="https://guides.rubyonrails.org/command_line.html">Rails Command Line</a>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'rails new my-app\ncd my-app',
    },
  },
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <p>
        Install the <code>tailwindcss-rails</code> gem, and then run the install command to generate a {' '}
        <code>tailwind.config.js</code> file in the <code>./config</code> directory.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: './bin/bundle add tailwindcss-rails\n./bin/rails tailwindcss:install',
    },
  },
  {
    title: 'Configure your template paths',
    body: () => (
      <p>
        Add the paths to all of your template files to your <code>./config/tailwind.config.js</code>{' '}
        file.
      </p>
    ),
    code: {
      name: 'tailwind.config.js',
      lang: 'js',
      code: `  module.exports = {
>   content: [
>     './app/helpers/**/*.rb',
>     './app/javascript/**/*.js',
>     './app/views/**/*',
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
        Add the <code>@tailwind</code> directives for each of Tailwind's layers to your{' '}
        <code>application.tailwind.css</code> file located in the{' '}
        <code>./app/assets/stylesheets</code> directory.
      </p>
    ),
    code: {
      name: 'application.tailwind.css',
      lang: 'css',
      code: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
    },
  },
  {
    title: 'Start your build process',
    body: () => (
      <p>
        Run your build process with <code>./bin/dev</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: './bin/dev',
    },
  },
  {
    title: 'Start using Tailwind in your project',
    body: () => <p>Start using Tailwind's utility classes to style your content.</p>,
    code: {
      name: 'index.html.erb',
      lang: 'html',
      code: `<h1 class="text-3xl font-bold underline">
    Hello world!
</h1>`,
    },
  },
]

export default function UsingRails({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with Ruby on Rails"
      description="Setting up Tailwind CSS in Ruby on Rails v7+ project."
    >
      <div className="relative z-10 prose prose-slate mb-16 max-w-3xl dark:prose-dark">
        <p>
          The quickest way to start using Tailwind CSS in your Rails project is to use{' '}
          <a href="https://github.com/rails/tailwindcss-rails">Tailwind CSS for Rails</a> by running{' '}
          <code>rails new my-app --css tailwind</code>. This will automatically configure your
          Tailwind setup based on the official Rails example. If you'd like to configure Tailwind
          manually, continue with the rest of this guide.
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

UsingRails.layoutProps = {
  meta: {
    title: 'Install Tailwind CSS with Ruby on Rails',
    section: 'Installation',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
