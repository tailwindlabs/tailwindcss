import Head from 'next/head'

export function Title({ suffix, children }) {
  let title = children + (suffix ? ` - ${suffix}` : '')

  return (
    <Head>
      <title key="title">{title}</title>
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta key="og:title" property="og:title" content={title} />
    </Head>
  )
}
