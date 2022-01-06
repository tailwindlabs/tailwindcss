import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { Button } from '@/components/Button'
import clsx from 'clsx'
import { BasicLayout } from '@/layouts/BasicLayout'
import { ReactComponent as DiscordIcon } from '@/img/icons/discord.svg'
import { ReactComponent as GitHubIcon } from '@/img/icons/github.svg'

function CardGroup({ children, className }) {
  return (
    <ul className={clsx('grid grid-cols-1 xl:grid-cols-3 gap-y-10 gap-x-6 items-start', className)}>
      {children}
    </ul>
  )
}

function Card({ title, superTitle, href, color, body, image, button }) {
  return (
    <li className="relative flex flex-col sm:flex-row xl:flex-col items-start">
      <div className="order-1 sm:ml-6 xl:ml-0">
        <h3 className="mb-1 text-gray-900 font-semibold dark:text-gray-200">
          {button ? (
            <>
              <span className={clsx('mb-1 block text-sm leading-6', color)}>{superTitle}</span>
              {title}
            </>
          ) : (
            <a
              href={href}
              className={clsx(
                'before:absolute before:inset-0',
                !button && 'hover:text-gray-600 dark:hover:text-white'
              )}
            >
              <span className={clsx('mb-1 block text-sm leading-6', color)}>{superTitle}</span>
              {title}
            </a>
          )}
        </h3>
        <div className="prose prose-sm text-gray-600 dark:prose-dark">{body}</div>
        {button && (
          <Button href={href} className="mt-6">
            {button}
          </Button>
        )}
      </div>
      <img
        src={image}
        alt=""
        className="mb-6 shadow-md rounded-lg bg-gray-50 w-full sm:w-[17rem] sm:mb-0 xl:mb-6 xl:w-full"
        width="1216"
        height="640"
      />
    </li>
  )
}

function Icon({ children, className }) {
  return (
    <div
      className={clsx('relative pt-full rounded-full ring-1 ring-inset ring-gray-900/5', className)}
    >
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

export default function Resources() {
  return (
    <BasicLayout>
      <header className="mb-20 max-w-xl">
        <p className="mb-4 text-sm leading-6 font-semibold text-sky-500 dark:text-sky-400">
          Resources
        </p>
        <h1 className="mb-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200">
          Everything else you need to build awesome Tailwind CSS websites
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-400">
          We think Tailwind is an amazing CSS framework, but you need more than just a CSS framework
          to produce visually awesome work.
        </p>
      </header>

      <div className="space-y-16">
        <section>
          <h2 className="mb-2 text-2xl leading-7 tracking-tight text-gray-900 font-bold dark:text-gray-200">
            Design resources
          </h2>
          <div className="mb-10 prose text-gray-600 max-w-3xl dark:prose-dark">
            <p>
              Design is hard so we made a few resources to help you with it. These resources are a
              great way to help you with your designs and a great way to support the development of
              the framework.
            </p>
          </div>

          <ul className="sm:space-y-6">
            {[
              {
                title: 'Refactoring UI',
                description: 'Learn UI Design',
                images: [
                  require('@/img/resources/refactoringui-small@75.jpg').default,
                  require('@/img/resources/refactoringui@75.jpg').default,
                ],
                color: 'text-blue-500',
                href: 'https://refactoringui.com',
                body: (
                  <>
                    <p>
                      Refactoring UI is a design-for-developers book + video series put together by
                      Adam Wathan and Steve Schoger. It covers literally everything we know about
                      making things look awesome.
                    </p>
                    <p>
                      Almost 10,000 people have picked it up so far and have all sorts of awesome
                      things to say about how it helped them improve their work.
                    </p>
                  </>
                ),
              },
              {
                title: 'Tailwind UI',
                description: 'Beautiful UI components, crafted by the creators of Tailwind CSS',
                images: [
                  require('@/img/resources/tailwindui-small@75.jpg').default,
                  require('@/img/resources/tailwindui@75.jpg').default,
                ],
                color: 'text-sky-500',
                href: 'https://tailwindui.com',
                body: (
                  <>
                    <p>
                      Tailwind UI is a collection of professionally designed, pre-built, fully
                      responsive HTML snippets you can drop into your Tailwind projects.
                    </p>
                    <p>
                      There are currently over 550 components available in three different
                      categories (Marketing, Application UI and E-commerce) and we’re always adding
                      more.
                    </p>
                  </>
                ),
              },
            ].map(({ title, description, images, color, body, href }) => (
              <li
                key={title}
                className="-mx-4 p-4 pb-10 bg-gray-50 flex flex-col-reverse items-start sm:mx-0 sm:p-10 sm:rounded-2xl xl:flex-row dark:bg-gray-800/50"
              >
                <div className="flex-auto">
                  <h3 className={clsx('mb-4 text-sm leading-6 font-semibold', color)}>{title}</h3>
                  <p className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-200">
                    {description}
                  </p>
                  <div className="mb-6 text-sm leading-6 text-gray-600 space-y-4 dark:text-gray-400">
                    {body}
                  </div>
                  <Button
                    href={href}
                    color={[
                      'bg-gray-700 text-white hover:bg-gray-800 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-400 dark:focus:ring-offset-0',
                      'text-gray-300 group-hover:text-gray-200',
                    ]}
                    darkColor="gray"
                  >
                    Learn more<span className="sr-only">, {title}</span>
                  </Button>
                </div>
                <div className="w-full flex-none mb-10 xl:mb-0 xl:ml-8 xl:w-[29rem]">
                  <div className="aspect-w-[1216] aspect-h-[606] sm:aspect-w-[1376] sm:aspect-h-[664] shadow-lg rounded-lg bg-gray-100 overflow-hidden dark:bg-gray-800">
                    <picture>
                      <source type="image/jpeg" srcSet={images[1]} media="(min-width: 640px)" />
                      <img src={images[0]} alt="" />
                    </picture>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-2xl leading-7 tracking-tight text-gray-900 font-bold dark:text-gray-200">
            Additional resources
          </h2>
          <div className="mb-10 prose text-gray-600 max-w-3xl dark:prose-dark">
            <p>
              Tailwind isn’t the only open-source project we maintain. We’ve made a few other
              resources to help you with your design and development workflow.
            </p>
          </div>

          <CardGroup>
            {[
              {
                superTitle: 'Headless UI',
                title: 'Completely unstyled, fully accessible UI components',
                body: (
                  <p>
                    Completely unstyled, fully accessible UI components, designed to integrate
                    beautifully with Tailwind CSS.
                  </p>
                ),
                href: 'https://headlessui.dev',
                image: require('@/img/resources/headlessui@75.jpg').default,
                color: 'text-indigo-500',
              },
              {
                superTitle: 'Heroicons',
                title: 'Beautiful hand-crafted SVG icons, by the makers of Tailwind CSS.',
                body: (
                  <p>
                    A set of 450+ free MIT-licensed SVG icons. Available as basic SVG icons and via
                    first-party React and Vue libraries.
                  </p>
                ),
                href: 'https://heroicons.com',
                image: require('@/img/resources/heroicons@75.jpg').default,
                color: 'text-purple-500',
              },
              {
                superTitle: 'Hero Patterns',
                title: 'Seamless SVG background patterns by the makers of Tailwind CSS.',
                body: (
                  <p>
                    A collection of over 100 free MIT-licensed high-quality SVG patterns for you to
                    use in your web projects.
                  </p>
                ),
                href: 'https://heropatterns.com',
                image: require('@/img/resources/heropatterns@75.jpg').default,
                color: 'text-cyan-500',
              },
            ].map((card) => (
              <Card
                key={card.title}
                button={
                  <>
                    Learn more<span className="sr-only">, {card.title}</span>
                  </>
                }
                {...card}
              />
            ))}
          </CardGroup>
        </section>

        <section className="border-t border-gray-100 pt-16 dark:border-gray-200/5">
          <h2 className="mb-2 text-xl tracking-tight text-gray-900 font-bold dark:text-gray-200">
            Screencasts
          </h2>
          <div className="mb-10 prose text-gray-600 max-w-3xl dark:prose-dark">
            <p>
              Head over to our official YouTube channel and dive into dozens of videos that will
              teach you everything from Tailwind basics to advanced concepts.
            </p>
          </div>

          <CardGroup className="mb-10">
            {[
              {
                superTitle: 'Fundamentals',
                title: 'Translating a Custom Design System to Tailwind CSS',
                body: (
                  <p>
                    Learn how to configure Tailwind to create your own utility framework tuned
                    specifically for your project.
                  </p>
                ),
                href: 'https://www.youtube.com/watch?v=cZc4Jn5nK3k',
                image: require('@/img/resources/translating-design-system@75.jpg').default,
                color: 'text-sky-500',
              },
              {
                superTitle: 'Fundamentals',
                title: 'Adding Tailwind CSS to an Existing Project',
                body: (
                  <p>
                    Learn how to add Tailwind CSS to an existing project without running into naming
                    collisions or specificity issues.
                  </p>
                ),
                href: 'https://www.youtube.com/watch?v=oG6XPy1t1KA',
                image: require('@/img/resources/existing-project@75.jpg').default,
                color: 'text-pink-500',
              },
              {
                superTitle: 'How we’d build it',
                title:
                  'Building a Headless Ecommerce Store with Tailwind CSS, Shopify, and Next.js',
                body: (
                  <p>
                    Fetch products from a Shopify store using the GraphQL API and assemble the pages
                    using Tailwind UI.
                  </p>
                ),
                href: 'https://www.youtube.com/watch?v=xNMYz74zNHM',
                image: require('@/img/resources/ecommerce-store@75.jpg').default,
                color: 'text-indigo-500',
              },
            ].map((card) => (
              <Card key={card.title} {...card} />
            ))}
          </CardGroup>

          <Button href="https://www.youtube.com/tailwindlabs">See all our screencasts</Button>
        </section>

        <section className="border-t border-gray-100 pt-16 dark:border-gray-200/5">
          <h2 className="mb-2 text-xl tracking-tight text-gray-900 font-bold dark:text-gray-200">
            Connect and contribute
          </h2>
          <div className="mb-10 prose text-gray-600 max-w-3xl dark:prose-dark">
            <p>
              Whether you're a beginner or an advanced user, getting involved in the Tailwind
              community is a great way to connect with like-minded folks who are building awesome
              things with the framework.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2">
            {[
              {
                title: 'Discord',
                href: '/discord',
                description:
                  'Join over 10,000 members on the Discord group to chat about Tailwind and other related topics.',
                icon: (
                  <Icon className="bg-[#838CF1]/[0.15] dark:bg-indigo-700">
                    <DiscordIcon className="w-6 h-auto dark:fill-indigo-200" />
                  </Icon>
                ),
                className:
                  'ring-1 ring-gray-900/10 dark:bg-indigo-500 dark:ring-0 dark:highlight-white/20',
              },
              {
                title: 'GitHub Discussions',
                href: 'https://github.com/tailwindlabs/tailwindcss/discussions',
                description:
                  'Have an issue with your project? Connect with other members of the Tailwind community to get some assistance.',
                icon: (
                  <Icon className="bg-gray-100 dark:bg-gray-800">
                    <GitHubIcon className="w-7 h-auto dark:fill-gray-400" />
                  </Icon>
                ),
                className:
                  'ring-1 ring-gray-900/10 dark:bg-gray-600 dark:ring-0 dark:highlight-white/20',
              },
            ].map(({ title, href, description, icon, className }) => (
              <li key={title} className="relative flex flex-row-reverse">
                <div className="peer group flex-auto ml-6">
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-200">
                    <a
                      href={href}
                      className="before:absolute before:-inset-3 before:rounded-2xl sm:before:-inset-4"
                    >
                      {title}
                      <svg
                        viewBox="0 0 3 6"
                        className="ml-3 w-auto h-1.5 overflow-visible inline -mt-px text-gray-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                      >
                        <path
                          d="M0 0L3 3L0 6"
                          fill="none"
                          strokeWidth="2"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </h3>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                </div>
                <div
                  className={clsx(
                    'flex-none w-16 h-16 p-[0.1875rem] rounded-full shadow overflow-hidden pointer-events-none',
                    className
                  )}
                >
                  {icon}
                </div>
                <div className="absolute -z-10 -inset-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 opacity-0 peer-hover:opacity-100 sm:-inset-4" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </BasicLayout>
  )
}

Resources.layoutProps = {
  meta: {
    title: 'Resources',
  },
  Layout: DocumentationLayout,
}
