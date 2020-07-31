import { importAll } from '@/utils/importAll'
import { collectPages } from '@/utils/collectPages'
import { SidebarLayout } from '@/layouts/SidebarLayout'
import twitterCardScreencasts from '@/img/twitter-card-screencasts.png'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { removeOrderPrefix } from '@/utils/removeOrderPrefix'
import { Title } from '@/components/Title'

const pages = collectPages(
  importAll(require.context('../pages/screencasts/?meta=title,published', true, /\.mdx$/))
)

export function ScreencastsLayout(props) {
  const router = useRouter()

  return (
    <>
      <Title
        suffix={router.pathname === '/screencasts' ? undefined : 'Designing with Tailwind CSS'}
      >
        {props.layoutProps.meta.metaTitle || props.layoutProps.meta.title}
      </Title>
      <Head>
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`https://tailwindcss.com${twitterCardScreencasts}`}
        />
        <meta
          key="og:image"
          property="og:image"
          content={`https://tailwindcss.com${twitterCardScreencasts}`}
        />
        <meta
          key="og:url"
          property="og:url"
          content={`https://tailwindcss.com/screencasts/${removeOrderPrefix(
            router.pathname.split('/').pop()
          )}`}
        />
      </Head>
      <SidebarLayout
        base="screencasts"
        pages={pages}
        fallbackLink={{ href: '/screencasts/coming-soon' }}
        {...props}
      />
    </>
  )
}
