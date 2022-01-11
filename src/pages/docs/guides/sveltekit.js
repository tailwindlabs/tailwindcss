import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new SvelteKit project if you don't have one set up already. The most
        common approach is outlined in the{' '}
        <a href="https://kit.svelte.dev/docs#introduction-getting-started">
          Getting Started with SvelteKit
        </a>{' '}
        introduction.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm init svelte@next my-app\ncd my-app',
    },
  },
  {
    title: 'Install Tailwind CSS',
    body: () => (
      <p>
        Use the community project{' '}
        <a href="https://github.com/svelte-add/svelte-add#readme">Svelte Add</a> to generate{' '}
        <code>tailwindcss.config.cjs</code>, <code>postcss.config.cjs</code>, and stub files for
        your css and layout. Then install <code>tailwindcss</code> and it's peer dependencies via
        npm.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npx svelte-add@latest tailwindcss\nnpm install',
    },
  },
  {
    title: 'Configure your template paths',
    body: () => (
      <p>
        Add the paths to all of your template files in the generated{' '}
        <code>tailwind.config.cjs</code> file.
      </p>
    ),
    code: {
      name: 'tailwind.config.cjs',
      lang: 'javascript',
      code: `  const config = {
>   content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {}
    },
    plugins: []
  };

  module.exports = config;`,
    },
  },
  {
    title: 'Add the Tailwind directives to your CSS',
    body: () => (
      <p>
        Add the <code>@tailwind</code> directives for each of Tailwind's layers to your{' '}
        <code>./src/app.css</code> file if not.
      </p>
    ),
    code: {
      name: 'app.css',
      lang: 'css',
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
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
      name: 'index.svelte',
      lang: 'html',
      code: `> <h1 class="text-3xl font-bold underline">
>   Hello world!
> </h1>`,
    },
  },
]

export default function UsingSvelteKit({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with SvelteKit"
      description="Setting up Tailwind CSS in a SvelteKit project."
    >
      <div className="relative z-10 max-w-3xl mb-16 prose">
        <p>
          The quickest way to start using Tailwind CSS in your SvelteKit project is to use the{' '}
          <a href="https://kit.svelte.dev/docs#introduction-getting-started">
            {' '}
            SvelteKit Introduction Guide{' '}
          </a>{' '}
          and <a href="https://github.com/svelte-add/tailwindcss">
            Tailwind CSS with svelte-add
          </a>{' '}
          to automatically setup your project. That's it, it is that easy to get Tailwind CSS
          configured in a SvelteKit project!
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

UsingSvelteKit.layoutProps = {
  meta: {
    title: 'Installation: Tailwind CSS with SvelteKit',
    section: 'Getting Started',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
