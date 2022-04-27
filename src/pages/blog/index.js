import { Button } from '@/components/Button'
import { NewsletterForm } from '@/components/NewsletterForm'
import { Widont } from '@/components/Widont'
import { getAllPostPreviews } from '@/utils/getAllPosts'
import Link from 'next/link'
import clsx from 'clsx'
import tinytime from 'tinytime'

let posts = getAllPostPreviews()
let postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}')

export default function Blog() {
  return (
    <main className="max-w-[52rem] mx-auto px-4 pb-28 sm:px-6 md:px-8 xl:px-12 lg:max-w-6xl">
      <header className="py-16 sm:text-center">
        <h1 className="mb-4 text-3xl sm:text-4xl tracking-tight text-slate-900 font-extrabold dark:text-slate-200">
          Blog
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-400">
          <Widont>All the latest Tailwind CSS news, straight from the team.</Widont>
        </p>
        <section className="mt-3 max-w-sm sm:mx-auto sm:px-4">
          <h2 className="sr-only">Sign up for our newsletter</h2>
          <NewsletterForm action="https://app.convertkit.com/forms/3181837/subscriptions" />
        </section>
      </header>
      <div className="relative sm:pb-12 sm:ml-[calc(2rem+1px)] md:ml-[calc(3.5rem+1px)] lg:ml-[max(calc(14.5rem+1px),calc(100%-48rem))]">
        <div
          className={clsx(
            'hidden absolute bottom-0 right-full mr-7 md:mr-[3.25rem] w-px bg-slate-200 dark:bg-slate-800 sm:block',
            posts[0].module.meta.type === 'update' ? 'top-6 md:top-8' : 'top-3'
          )}
        />
        {posts.map(({ slug, module: { default: Component, meta } }, index) => {
          let isUpdate = meta.type === 'update'
          let prev = posts[index - 1]?.module.meta
          let prevIsUpdate = prev?.type === 'update'

          return (
            <article
              key={slug}
              className={clsx(
                'relative',
                prev && isUpdate && prevIsUpdate && 'mt-10 md:mt-8',
                prev && isUpdate && !prevIsUpdate && 'mt-[3.25rem] md:mt-12',
                prev && !isUpdate && prevIsUpdate && 'mt-[3.25rem] md:mt-12',
                prev && !isUpdate && !prevIsUpdate && 'mt-16'
              )}
            >
              <svg
                viewBox="0 0 9 9"
                className={clsx(
                  'hidden absolute right-full mr-6 md:mr-12 w-[calc(0.5rem+1px)] h-[calc(0.5rem+1px)] overflow-visible sm:block',
                  isUpdate
                    ? 'top-5 md:top-6 lg:top-7 text-slate-300 dark:text-slate-600'
                    : 'top-2 lg:top-2.5 text-sky-400'
                )}
              >
                {!isUpdate && (
                  <circle
                    cx="4.5"
                    cy="4.5"
                    r="9.5"
                    className="fill-white dark:fill-slate-900"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeOpacity={0.5}
                  />
                )}
                <circle
                  cx="4.5"
                  cy="4.5"
                  r="4.5"
                  stroke="currentColor"
                  className={isUpdate ? 'fill-white dark:fill-slate-900' : 'fill-current'}
                  strokeWidth={2}
                />
              </svg>
              {isUpdate ? (
                <Link href={`/blog/${slug}`}>
                  <a className="relative block leading-8 -mx-4 md:-mx-6 px-4 md:px-6 pt-10 pb-3 md:pb-4 md:pt-12 lg:pt-4 sm:rounded-2xl hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                    <div className="line-clamp-2">
                      <h3 className="inline font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                        {meta.title}
                      </h3>
                      <p className="inline text-slate-600 dark:text-slate-400">
                        &nbsp;&nbsp;—&nbsp;&nbsp;{meta.description}
                      </p>
                    </div>
                  </a>
                </Link>
              ) : (
                <>
                  <h3
                    className={clsx(
                      'text-xl font-bold tracking-tight text-slate-900 dark:text-slate-200',
                      isUpdate ? '' : 'pt-8 lg:pt-0'
                    )}
                  >
                    <Link href={`/blog/${slug}`}>
                      <a>{meta.title}</a>
                    </Link>
                  </h3>
                  <div className="mt-4 mb-6 prose prose-slate dark:prose-dark">
                    <Component />
                  </div>
                </>
              )}
              <dl
                className={clsx(
                  'absolute left-0 lg:left-auto lg:right-full lg:mr-[calc(6.5rem+1px)]',
                  isUpdate ? 'top-3 pointer-events-none md:top-4' : 'top-0'
                )}
              >
                <dt className="sr-only">Date</dt>
                <dd
                  className={clsx(
                    'whitespace-nowrap text-sm leading-6 dark:text-slate-400',
                    isUpdate ? 'lg:leading-8' : 'lg:leading-7'
                  )}
                >
                  <time dateTime={meta.date}>{postDateTemplate.render(new Date(meta.date))}</time>
                </dd>
              </dl>
              <svg
                width="2"
                height="2"
                fill="currentColor"
                className="mx-4 text-slate-700 lg:hidden"
              >
                <circle cx="1" cy="1" r="1" />
              </svg>
              {!isUpdate && (
                <Button href={`/blog/${slug}`}>
                  Read more<span className="sr-only">, {meta.title}</span>
                </Button>
              )}
            </article>
          )
        })}
      </div>
    </main>
  )
}

Blog.layoutProps = {
  meta: {
    title: 'Blog',
  },
}
