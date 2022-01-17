import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Steps } from '@/components/Steps'
import pkg from 'tailwindcss/package.json?fields=version'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new Phoenix project if you don't have one set up already. You can follow
        their <a href="https://hexdocs.pm/phoenix/installation.html">installation guide</a> to get up
        and running.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'mix phx.new myproject\ncd myproject',
    },
  },
  {
    title: 'Install the Tailwind plugin',
    body: () => (
      <p>
        Add the Tailwind plugin to your dependencies and run <code>mix deps.get</code> to install it.
      </p>
    ),
    code: {
      name: 'mix.exs',
      lang: 'elixir',
      code: `  defp deps do
    [
>     {:tailwind, "~> 0.1", runtime: Mix.env() == :dev}
    ]
  end`,
    },
  },
  {
    title: 'Configure the Tailwind plugin',
    body: () => (
      <p>
        In your <code>config.exs</code> file you can set which version of Tailwind CSS you want to use, the path to your Tailwind config,
        and customize your asset paths.
      </p>
    ),
    code: {
      name: 'config.exs',
      lang: 'elixir',
      code: `config :tailwind, version: "${pkg.version}", default: [
  args: ~w(
    --config=tailwind.config.js
    --input=css/app.css
    --output=../priv/static/assets/app.css
  ),
  cd: Path.expand("../assets", __DIR__)
]`,
    },
  },
  {
    title: 'Update your deployment script',
    body: () => (
      <p>
        Configure an alias to build your CSS on deployment.
      </p>
    ),
    code: {
      name: 'mix.exs',
      lang: 'elixir',
      code: `  defp aliases do
    [
>     "assets.deploy": ["tailwind default --minify", "esbuild default --minify", "phx.digest"]
    ]
  ]`,
    },
  },
  {
    title: 'Enable watcher in development',
    body: () => (
      <p>
        Add Tailwind to your list of watchers in your <code>./config/dev.exs</code> file.
      </p>
    ),
    code: {
      name: 'dev.exs',
      lang: 'elixir',
      code: `  watchers: [
>   tailwind: {Tailwind, :install_and_run, [:default, ~w(--watch)]}
  ]`,
    },
  },
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <p>
        Run the install command to download the standalone Tailwind CLI and generate a <code>tailwind.config.js</code> file in the <code>./assets</code> directory.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: `mix tailwind.install`,
    },
  },
  {
    title: 'Configure your template paths',
    body: () => (
      <p>
        Add the paths to all of your template files in your <code>./assets/tailwind.config.js</code> file.
      </p>
    ),
    code: {
      name: 'tailwind.config.js',
      lang: 'js',
      code: `  module.exports = {
>   content: [
>     './js/**/*.js',
>     '../lib/*_web.ex',
>     '../lib/*_web/**/*.*ex',
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
        Add the <code>@tailwind</code>{' '}
        directives for each of Tailwind’s layers to <code>./assets/css/app.css</code>
      </p>
    ),
    code: {
      name: 'app.css',
      lang: 'css',
      code: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
    },
  },
  {
    title: 'Remove the default CSS import',
    body: () => (
      <p>
        Remove the CSS import from <code>./assets/js/app.js</code>, as Tailwind is now handling this for you.
      </p>
    ),
    code: {
      name: 'app.js',
      lang: 'diff-js',
      code: `- // Remove this line if you add a your own CSS build pipeline (e.g postcss).
- import "../css/app.css"`,
    },
  },
  {
    title: 'Start your build process',
    body: () => (
      <p>
        Run your build process with <code>mix phx.server</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'mix phx.server',
    },
  },
  {
    title: 'Start using Tailwind in your project',
    body: () => <p>Start using Tailwind’s utility classes to style your content.</p>,
    code: {
      name: 'index.html.heex',
      lang: 'html',
      code: `<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>`,
    },
  },
]

export default function UsingPhoenix({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with Phoenix"
      description="Setting up Tailwind CSS in a Phoenix project."
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

UsingPhoenix.layoutProps = {
  meta: {
    title: 'Install Tailwind CSS with Phoenix',
    section: 'Installation',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
