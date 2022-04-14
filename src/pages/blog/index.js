import { NewsletterForm } from '@/components/NewsletterForm'
import PostItem from '@/components/PostItem'
import { Widont } from '@/components/Widont'
import { getAllPostPreviews } from '@/utils/getAllPosts'

let posts = getAllPostPreviews()

export default function Blog() {
  return (
    <main className="max-w-5xl mx-auto px-4 pb-28 sm:px-6 md:px-8 xl:px-12 xl:max-w-6xl">
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
      <div className="space-y-16">
        {posts.map(({ slug, module: { default: Component, meta } }, index) => (
          <PostItem
            key={index}
            title={meta.title}
            category={meta.category}
            date={meta.date}
            slug={slug}
            wide
          >
            <Component />
          </PostItem>
        ))}
      </div>
    </main>
  )
}

Blog.layoutProps = {
  meta: {
    title: 'Blog',
  },
}
