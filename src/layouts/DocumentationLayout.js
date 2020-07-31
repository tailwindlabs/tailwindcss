import { importAll } from '@/utils/importAll'
import { collectPages } from '@/utils/collectPages'
import { SidebarLayout } from '@/layouts/SidebarLayout'
import Head from 'next/head'
import { removeOrderPrefix } from '@/utils/removeOrderPrefix'
import { useRouter } from 'next/router'
import twitterSquare from '@/img/twitter-square.png'
import { Title } from '@/components/Title'

const pages = collectPages(
  importAll(require.context('../pages/docs/?meta=title,published', true, /\.mdx$/))
)

export function DocumentationLayout(props) {
  const router = useRouter()

  return (
    <>
      <Title suffix={router.pathname === '/' ? undefined : 'Tailwind CSS'}>
        {props.layoutProps.meta.metaTitle || props.layoutProps.meta.title}
      </Title>
      <Head>
        <meta key="twitter:card" name="twitter:card" content="summary" />
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`https://tailwindcss.com${twitterSquare}`}
        />
        <meta
          key="og:url"
          property="og:url"
          content={`https://tailwindcss.com/docs/${removeOrderPrefix(
            router.pathname.split('/').pop()
          )}`}
        />
      </Head>
      <SidebarLayout base="docs" pages={pages} {...props} />
    </>
  )
}
