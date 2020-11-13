import { Community } from '@/components/Community'
import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { gradients } from '@/utils/gradients'
import Link from 'next/link'

export default function Resources() {
  return (
    <div className="px-4 sm:px-6 md:px-8 pt-10">
      <h1 className="text-3xl text-gray-900 font-extrabold mb-4">Resources</h1>
      <div className="max-w-3xl">
        <div className="text-lg mb-5 space-y-5">
          <p>
            We think Tailwind is an amazing CSS framework, but you need more than just a CSS
            framework to produce visually awesome work.
          </p>
          <p>
            Here are some resources that can help you take your Tailwind projects to the next level.
          </p>
        </div>
        <p>
          For Tailwind CSS brand assets and usage guidelines, please visit our{' '}
          <Link href="/brand">
            <a className="text-cyan-700 font-medium shadow-link">Brand page</a>
          </Link>
          .
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 my-8 sm:my-12">
        <section>
          <h2 className="text-xl text-gray-900 font-bold mb-4">Learn UI Design</h2>
          <div
            className="h-64 bg-gray-900 bg-cover rounded-3xl mb-6"
            style={{
              backgroundImage: `url(${
                require('@/img/resources/refactoring-ui-background.png').default
              })`,
            }}
          ></div>
          <div className="space-y-5">
            <p>
              Refactoring UI is a design-for-developers book + video series put together by Adam
              Wathan and Steve Schoger. It covers literally everything we know about making things
              look awesome.
            </p>
            <p>
              Almost 10,000 people have picked it up so far and have all sorts of awesome things to
              say about how it helped them improve their work.
            </p>
          </div>
        </section>
        <section>
          <h2 className="text-xl text-gray-900 font-bold mb-4">Official Tailwind CSS Components</h2>
          <div className="h-64 bg-gray-900 bg-cover rounded-3xl mb-6"></div>
          <div className="space-y-5">
            <p>
              Tailwind UI is a collection of professionally designed, pre-built, fully responsive
              HTML snippets you can drop into your Tailwind projects.
            </p>
            <p>
              There are currently over 350 components available in two different categories
              (Marketing and Application UI) and we’re always adding more.
            </p>
          </div>
        </section>
      </div>
      <div className="grid sm:grid-cols-3 gap-8 pb-10 border-b border-gray-200">
        <section>
          <h2 className="text-xl text-gray-900 font-bold mb-4">JavaScript</h2>
          <div className="h-48 rounded-3xl bg-gray-900 mb-6"></div>
          <p>
            Completely unstyled, fully accessible UI components, designed to integrate beautifully
            with Tailwind CSS.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-gray-900 font-bold mb-4">Icons</h2>
          <div className="h-48 rounded-3xl bg-gray-900 mb-6"></div>
          <p>
            A set of free MIT-licensed high-quality SVG icons for you to use in your web projects.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-gray-900 font-bold mb-4">Patterns</h2>
          <div className="h-48 rounded-3xl bg-gray-900 mb-6"></div>
          <p>
            A set of free MIT-licensed high-quality SVG patterns for you to use in your web
            projects.
          </p>
        </section>
      </div>
      <section>
        <h2 className="text-2xl tracking-tight font-extrabold text-gray-900 mt-10 mb-8">
          Get involved
        </h2>
        <Community />
      </section>
    </div>
  )
}

Resources.layoutProps = {
  meta: {},
  Layout: DocumentationLayout,
}
