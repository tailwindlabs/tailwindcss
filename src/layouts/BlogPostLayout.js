import { Widont } from '@/components/home/common'
import PostItem from '@/components/PostItem'
import Link from 'next/link'
import tinytime from 'tinytime'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'
import { mdxComponents } from '@/utils/mdxComponents'
import { getAllPosts } from '@/utils/getAllPosts'
import clsx from 'clsx'

let postDateTemplate = tinytime('{dddd}, {MMMM} {DD}, {YYYY}')

let grid = 'max-w-3xl mx-auto xl:max-w-none xl:grid xl:grid-cols-[1fr_50rem] xl:gap-x-8'

export function BlogPostLayout({ children, meta, slug, latestPosts }) {
  return (
    <div className="mx-auto mt-10 px-4 pb-28 sm:mt-16 sm:px-6 md:px-8 xl:px-12 xl:max-w-6xl">
      <main>
        <article className={clsx('relative pt-10', grid)}>
          <Metadata meta={meta} />
          <h1 className="col-span-full text-3xl sm:text-4xl sm:text-center xl:mb-16 font-extrabold tracking-tight text-slate-900 dark:text-slate-200">
            <Widont>{meta.title}</Widont>
          </h1>
          <div className="text-sm leading-6 mb-16 xl:mb-0">
            <div className="hidden mb-5 pb-5 border-b border-slate-200 xl:block dark:border-slate-200/5">
              <Link href="/blog">
                <a className="group flex font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                  <svg
                    viewBox="0 -9 3 24"
                    className="overflow-visible mr-3 text-slate-400 w-auto h-6 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  >
                    <path
                      d="M3 0L0 3L3 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Go back to blog
                </a>
              </Link>
            </div>
            <dl>
              <dt className="sr-only">Date</dt>
              <dd className="absolute top-0 inset-x-0 text-slate-700 sm:text-center dark:text-slate-400">
                <time dateTime={meta.date}>{postDateTemplate.render(new Date(meta.date))}</time>
              </dd>
              <div className="sm:flex sm:flex-wrap sm:justify-center xl:block">
                <dt className="sr-only">Author{meta.authors.length > 1 && 's'}</dt>
                {meta.authors.map((author) => (
                  <dd
                    key={author.twitter}
                    className="flex items-center font-medium mt-6 sm:mx-3 xl:mx-0"
                  >
                    <img
                      src={author.avatar}
                      alt=""
                      className="mr-3 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800"
                    />
                    <div>
                      <div className="text-slate-900 dark:text-slate-200">{author.name}</div>
                      <a
                        href={`https://twitter.com/${author.twitter}`}
                        className="text-sky-500 hover:text-sky-600 dark:text-sky-400"
                      >
                        @{author.twitter}
                      </a>
                    </div>
                  </dd>
                ))}
              </div>
            </dl>
          </div>
          <div className="prose prose-slate dark:prose-dark">
            <MDXProvider components={mdxComponents}>{children}</MDXProvider>
          </div>
        </article>
      </main>
      <footer className={clsx('mt-14 sm:mt-16', grid)}>
        <div className="col-start-2 pt-14 sm:pt-16 border-t border-slate-200 dark:border-slate-200/5">
          <h2 className="mb-10 font-semibold text-slate-900 dark:text-slate-200">
            Latest articles
          </h2>
          <div className="grid grid-cols-1 gap-y-10 gap-x-8 md:grid-cols-2">
            {latestPosts
              .filter((post) => post.slug !== slug)
              .slice(0, 2)
              .map((post) => (
                <PostItem key={post.slug} {...post}>
                  <p>{post.description}</p>
                </PostItem>
              ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export function getStaticProps() {
  return {
    props: {
      latestPosts: getAllPosts()
        .slice(0, 3)
        .map(({ slug, module: { meta } }) => {
          return { slug, title: meta.title, description: meta.description, date: meta.date }
        }),
    },
  }
}

function Metadata({ meta }) {
  let router = useRouter()

  return (
    <Head>
      <title>{meta.title} – Tailwind CSS</title>
      <meta name="twitter:site" content="@tailwindcss" />
      <meta name="twitter:creator" content="@tailwindcss" />
      <meta name="twitter:title" content={`${meta.title} – Tailwind CSS`} />
      <meta name="twitter:description" content={meta.description} />
      {meta.image ? (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={`https://tailwindcss.com${meta.image}`} />
        </>
      ) : (
        <>
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:image"
            content={`https://tailwindcss.com${require('@/img/social-square.jpg').default}`}
          />
        </>
      )}
      <meta property="og:url" content={`https://tailwindcss.com${router.pathname}`} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={`${meta.title} – Tailwind CSS`} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={`https://tailwindcss.com${meta.image}`} />
      <meta name="description" content={meta.description}></meta>
    </Head>
  )
}
