import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new Nuxt.js project if you don’t have one set up already. The most common approach is to use <a href="https://nuxtjs.org/guides/get-started/installation">Create Nuxt App</a>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npx create-nuxt-app my-project\ncd my-project',
    },
  },
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <>
        <p>
          Using npm, install <code>tailwindcss</code> and its peer dependencies, as well as <code>@nuxt/postcss8</code>, and then run the init command to generate the <code>tailwind.config.js</code> file.
        </p>
        <p className="mt-3 text-xs italic">Using <code>@latest</code> is required because Nuxt installs PostCSS v7 and Autoprefixer v9 by default.</p>
      </>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm install -D tailwindcss postcss@latest autoprefixer@latest @nuxt/postcss8\nnpx tailwindcss init',
    },
  },
  {
    title: 'Enable the Nuxt.js PostCSS plugin',
    body: () => (
      <p>
        In your <code>nuxt.config.js</code> file, enable the <code>@nuxt/postcss8</code> plugin.
      </p>
    ),
    code: {
      name: 'nuxt.config.js',
      lang: 'js',
      code: `  export default {
    buildModules: [
>     '@nuxt/postcss8',
      // ...
    ],
  }`,
    },
  },
  {
    title: 'Add Tailwind to your PostCSS configuration',
    body: () => (
      <p>
        Add <code>tailwindcss</code> and <code>autoprefixer</code> to the <code>build.postcss.plugins</code> object of your <code>nuxt.config.js</code> file.
      </p>
    ),
    code: {
      name: 'nuxt.config.js',
      lang: 'js',
      code: `  export default {
    build: {
>     postcss: {
>       plugins: {
>         tailwindcss: {},
>         autoprefixer: {},
>       },
>     },
    }
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
>     "./components/**/*.{js,vue,ts}",
>     "./layouts/**/*.vue",
>     "./pages/**/*.vue",
>     "./plugins/**/*.{js,ts}",
>     "./nuxt.config.{js,ts}",
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
        Create an <code>./assets/css/main.css</code> file and add the <code>@tailwind</code> directives for each of Tailwind’s layers.
      </p>
    ),
    code: {
      name: 'main.css',
      lang: 'css',
      code: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
    },
  },
  {
    title: 'Import the CSS file',
    body: () => (
      <p>
        Add the newly-created <code>./assets/css/main.css</code> file to the <code>css</code> array in the <code>nuxt.config.js</code> file.
      </p>
    ),
    code: {
      name: 'nuxt.config.js',
      lang: 'js',
      code: `  export default {
    css: [
>     '@/assets/css/main.css',
    ],
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
    body: () => (
      <p>
        Start using Tailwind’s utility classes to style your content.
      </p>
    ),
    code: {
      name: 'App.vue',
      lang: 'html',
      code: `  <template>
>   <h1 class="text-3xl font-bold underline">
>     Hello world!
>   </h1>
  </template>`,
    },
  },
]

export default function UsingNextJS({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with Nuxt.js"
      description="Setting up Tailwind CSS in a Nuxt.js project."
    >
      <div className="relative z-10 prose mb-16 max-w-3xl">
        <p></p>
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

UsingNextJS.layoutProps = {
  meta: {
    title: 'Installation: Tailwind CSS with Nuxt.js',
    section: 'Getting Started',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
