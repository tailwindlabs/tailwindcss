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
        <div className="hidden absolute top-3 bottom-0 right-full mr-7 md:mr-[3.25rem] w-px bg-slate-200 dark:bg-slate-800 sm:block" />
        <div className="space-y-16">
          {posts.map(({ slug, module: { default: Component, meta } }) => (
            <article key={slug} className="relative">
              <svg
                viewBox="0 0 9 9"
                className={clsx(
                  'hidden absolute right-full mr-6 md:mr-12 w-[calc(0.5rem+1px)] h-[calc(0.5rem+1px)] overflow-visible sm:block',
                  meta.isUpdate
                    ? 'top-5 md:top-7 text-slate-300 dark:text-slate-600'
                    : 'top-2.5 text-sky-400'
                )}
              >
                {!meta.isUpdate && (
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
                  className={meta.isUpdate ? 'fill-white dark:fill-slate-900' : 'fill-current'}
                  strokeWidth={2}
                />
              </svg>
              {meta.isUpdate ? (
                <Link href={`/blog/${slug}`}>
                  <a className="relative block leading-8 -mx-4 md:-mx-6 -my-2 md:-my-4 px-4 md:px-6 py-2 md:py-4 sm:rounded-2xl hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
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
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
                    <Link href={`/blog/${slug}`}>
                      <a>{meta.title}</a>
                    </Link>
                  </h3>
                  <div className="mt-4 mb-6 prose prose-slate dark:prose-dark">
                    <Component />
                  </div>
                </>
              )}
              <div className="flex flex-row-reverse justify-end items-center">
                <dl
                  className={clsx(
                    'lg:absolute lg:right-full lg:mr-[calc(6.5rem+1px)]',
                    meta.isUpdate ? 'top-4' : 'top-0'
                  )}
                >
                  <dt className="sr-only">Date</dt>
                  <dd
                    className={clsx(
                      'whitespace-nowrap text-sm dark:text-slate-400',
                      meta.isUpdate ? 'leading-8' : 'leading-7'
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
                {!meta.isUpdate && (
                  <Button href={`/blog/${slug}`}>
                    Read more<span className="sr-only">, {meta.title}</span>
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

Blog.layoutProps = {
  meta: {
    title: 'Blog',
  },
}
