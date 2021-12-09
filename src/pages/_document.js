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
      <Html
        lang="en"
        className={`text-gray-500 antialiased [--scroll-mt:9.875rem] lg:[--scroll-mt:6.3125rem] ${
          this.props.dangerousAsPath.startsWith('/examples/') ? '' : 'bg-white'
        }`}
      >
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
        </Head>
        <body>
          <Main />
          <NextScript />
          <script> </script>
        </body>
      </Html>
    )
  }
}
