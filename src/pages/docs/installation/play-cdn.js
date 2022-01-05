import NextLink from 'next/link'
import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { InstallationLayout } from '@/layouts/InstallationLayout'
import { Steps } from '@/components/Steps'
import { black } from 'tailwindcss/colors'
import { theme } from 'tailwind.config'

let steps = [
  {
    title: 'Add the Play CDN script to your HTML',
    body: () => (
      <p>
        Add the Play CDN script tag to the <code>&lt;head&gt;</code> of your HTML file, and start
        using Tailwind’s utility classes to style your content.
      </p>
    ),
    code: {
      name: 'index.html',
      lang: 'html',
      code: `  <!doctype html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
>   <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
>   <h1 class="text-3xl font-bold underline">
>     Hello world!
>   </h1>
  </body>
  </html>`,
    },
  },
  {
    title: 'Try customizing your config',
    body: () => (
      <p>
        Edit the <code>tailwind.config</code> object to{' '}
        <NextLink href="/docs/configuration">
          <a>customize your configuration</a>
        </NextLink>{' '}
        with your own design tokens.
      </p>
    ),
    code: {
      name: 'index.html',
      lang: 'html',
      code: `  <!doctype html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
>   <script>
>     tailwind.config = {
>       theme: {
>         extend: {
>           colors: {
>             clifford: '#da373d',
>           }
>         }
>       }
>     }
>   </script>
  </head>
  <body>
    <h1 class="text-3xl font-bold underline **text-clifford**">
      Hello world!
    </h1>
  </body>
  </html>`,
    },
  },
  {
    title: 'Try adding some custom CSS',
    body: () => (
      <p>
        Use <code>type="text/tailwindcss"</code> to add custom CSS that supports all of Tailwind's
        CSS features.
      </p>
    ),
    code: {
      name: 'index.html',
      lang: 'html',
      code: `  <!doctype html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>/* ... */</script>
>   <style type="text/tailwindcss">
>     @layer utilities {
>       .content-auto {
>         content-visibility: auto;
>       }
>     }
>   </style>
  </head>
  <body>
>   <div class="lg:content-auto">
      <!-- ... -->
    </div>
  </body>
  </html>`,
    },
  },
]

export default function PlayCdn({ code }) {
  return (
    <InstallationLayout>
      <div id="content" className="relative z-10 prose mb-16 max-w-3xl dark:prose-dark">
        <h3 className="sr-only">Play CDN</h3>
        <p>
          Use the Play CDN to try Tailwind right in the browser without any build step. The Play CDN
          is designed for development purposes only, and is not the best choice for production.
        </p>
      </div>
      <Steps level={4} steps={steps} code={code} />
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

PlayCdn.layoutProps = {
  meta: {
    title: 'Installation: Play CDN',
    section: 'Getting Started',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
