import clsx from 'clsx'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

const FAVICON_VERSION = 3

function v(href) {
  return `${href}?v=${FAVICON_VERSION}`
}

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en" className="dark [--scroll-mt:9.875rem] lg:[--scroll-mt:6.3125rem]">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href={v('/favicons/apple-touch-icon.png')} />
          <link rel="icon" type="image/png" sizes="32x32" href={v('/favicons/favicon-32x32.png')} />
          <link rel="icon" type="image/png" sizes="16x16" href={v('/favicons/favicon-16x16.png')} />
          <link rel="manifest" href={v('/favicons/site.webmanifest')} />
          <link rel="mask-icon" href={v('/favicons/safari-pinned-tab.svg')} color="#38bdf8" />
          <link rel="shortcut icon" href={v('/favicons/favicon.ico')} />
          <meta name="apple-mobile-web-app-title" content="Tailwind CSS" />
          <meta name="application-name" content="Tailwind CSS" />
          <meta name="msapplication-TileColor" content="#38bdf8" />
          <meta name="msapplication-config" content={v('/favicons/browserconfig.xml')} />
          <meta name="theme-color" content="#ffffff" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark')
                  } else {
                    document.documentElement.classList.remove('dark')
                  }
                } catch (_) {}
              `,
            }}
          />
        </Head>
        <body
          className={clsx('antialiased text-gray-500 dark:text-gray-400', {
            'bg-white dark:bg-gray-900': !this.props.dangerousAsPath.startsWith('/examples/'),
          })}
        >
          <Main />
          <NextScript />
          <script> </script>
        </body>
      </Html>
    )
  }
}
