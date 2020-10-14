import { CodeWindow } from '@/components/CodeWindow'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { gradients } from '@/utils/gradients'
import { Testimonials } from '@/components/Testimonials'
import { Responsive } from '@/components/home/Responsive'
import { DarkMode } from '@/components/home/DarkMode'
import { Paragraph, Icon, Caption, BigText, Link } from '@/components/home/common'

export default function Home() {
  return (
    <div className="space-y-44">
      <header className="relative z-10 max-w-screen-xl mx-auto">
        <div className="px-8">
          <div className="border-b border-gray-200 py-6 flex items-center justify-between mb-20">
            <button type="button" className="leading-6 font-medium flex items-center space-x-4">
              <svg width="24" height="24" fill="none" className="text-gray-400">
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Quick search for anything</span>
              <span className="text-gray-400 text-sm leading-5 py-0.5 px-1.5 border border-gray-300 rounded-md">
                <span className="sr-only">Press </span>
                <kbd className="font-sans">
                  <abbr title="Cmd" className="no-underline">
                    ⌘
                  </abbr>
                </kbd>
                <span className="sr-only"> and </span>
                <kbd className="font-sans">K</kbd>
                <span className="sr-only"> to search</span>
              </span>
            </button>
            <a href="https://github.com/tailwindlabs/tailwindcss" className="text-gray-400">
              <span className="sr-only">Tailwind CSS on GitHub</span>
              <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
            </a>
          </div>
          <svg width="247" height="31">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.381 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.483-3.329-1.883-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z"
              fill="#14B4C6"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M76.546 12.825h-4.453v8.567c0 2.285 1.508 2.249 4.453 2.106v3.463c-5.962.714-8.332-.928-8.332-5.569v-8.567H64.91V9.112h3.304V4.318l3.879-1.143v5.937h4.453v3.713zM93.52 9.112h3.878v17.849h-3.878v-2.57c-1.365 1.891-3.484 3.034-6.285 3.034-4.884 0-8.942-4.105-8.942-9.389 0-5.318 4.058-9.388 8.942-9.388 2.801 0 4.92 1.142 6.285 2.999V9.112zm-5.674 14.636c3.232 0 5.674-2.392 5.674-5.712s-2.442-5.711-5.674-5.711-5.674 2.392-5.674 5.711c0 3.32 2.442 5.712 5.674 5.712zm16.016-17.313c-1.364 0-2.477-1.142-2.477-2.463a2.475 2.475 0 012.477-2.463 2.475 2.475 0 012.478 2.463c0 1.32-1.113 2.463-2.478 2.463zm-1.939 20.526V9.112h3.879v17.849h-3.879zm8.368 0V.9h3.878v26.06h-3.878zm29.053-17.849h4.094l-5.638 17.849h-3.807l-3.735-12.03-3.771 12.03h-3.806l-5.639-17.849h4.094l3.484 12.315 3.771-12.315h3.699l3.734 12.315 3.52-12.315zm8.906-2.677c-1.365 0-2.478-1.142-2.478-2.463a2.475 2.475 0 012.478-2.463 2.475 2.475 0 012.478 2.463c0 1.32-1.113 2.463-2.478 2.463zm-1.939 20.526V9.112h3.878v17.849h-3.878zm17.812-18.313c4.022 0 6.895 2.713 6.895 7.354V26.96h-3.878V16.394c0-2.713-1.58-4.14-4.022-4.14-2.55 0-4.561 1.499-4.561 5.14v9.567h-3.879V9.112h3.879v2.285c1.185-1.856 3.124-2.749 5.566-2.749zm25.282-6.675h3.879V26.96h-3.879v-2.57c-1.364 1.892-3.483 3.034-6.284 3.034-4.884 0-8.942-4.105-8.942-9.389 0-5.318 4.058-9.388 8.942-9.388 2.801 0 4.92 1.142 6.284 2.999V1.973zm-5.674 21.775c3.232 0 5.674-2.392 5.674-5.712s-2.442-5.711-5.674-5.711-5.674 2.392-5.674 5.711c0 3.32 2.442 5.712 5.674 5.712zm22.553 3.677c-5.423 0-9.481-4.105-9.481-9.389 0-5.318 4.058-9.388 9.481-9.388 3.519 0 6.572 1.82 8.008 4.605l-3.34 1.928c-.79-1.678-2.549-2.749-4.704-2.749-3.16 0-5.566 2.392-5.566 5.604 0 3.213 2.406 5.605 5.566 5.605 2.155 0 3.914-1.107 4.776-2.749l3.34 1.892c-1.508 2.82-4.561 4.64-8.08 4.64zm14.472-13.387c0 3.249 9.661 1.285 9.661 7.89 0 3.57-3.125 5.497-7.003 5.497-3.591 0-6.177-1.607-7.326-4.177l3.34-1.927c.574 1.606 2.011 2.57 3.986 2.57 1.724 0 3.052-.571 3.052-2 0-3.176-9.66-1.391-9.66-7.781 0-3.356 2.909-5.462 6.572-5.462 2.945 0 5.387 1.357 6.644 3.713l-3.268 1.82c-.647-1.392-1.904-2.035-3.376-2.035-1.401 0-2.622.607-2.622 1.892zm16.556 0c0 3.249 9.66 1.285 9.66 7.89 0 3.57-3.124 5.497-7.003 5.497-3.591 0-6.176-1.607-7.326-4.177l3.34-1.927c.575 1.606 2.011 2.57 3.986 2.57 1.724 0 3.053-.571 3.053-2 0-3.176-9.66-1.391-9.66-7.781 0-3.356 2.908-5.462 6.572-5.462 2.944 0 5.386 1.357 6.643 3.713l-3.268 1.82c-.646-1.392-1.903-2.035-3.375-2.035-1.401 0-2.622.607-2.622 1.892z"
              fill="#000"
            />
          </svg>
          <h1 className="text-7xl leading-none font-extrabold text-black mt-14 mb-10">
            Rapidly build modern websites without ever leaving your HTML.
          </h1>
          <p className="max-w-screen-lg text-2xl leading-10 font-medium mb-11">
            A utility-first CSS framework packed with classes like flex, pt-4, text-center and
            rotate-90 that can be composed to build any design, directly in your markup.
          </p>
          <div className="flex space-x-4 mb-8">
            <a
              href="#"
              className="bg-black text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-lg"
            >
              Get started
            </a>
            <button
              type="button"
              className="bg-gray-100 text-black font-mono leading-6 py-3 px-6 border border-transparent rounded-lg flex items-center space-x-4"
            >
              <span>
                <span className="text-gray-500">$</span> npm install tailwindcss
              </span>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M8 16c0 1.886 0 2.828.586 3.414C9.172 20 10.114 20 12 20h4c1.886 0 2.828 0 3.414-.586C20 18.828 20 17.886 20 16v-4c0-1.886 0-2.828-.586-3.414C18.828 8 17.886 8 16 8m-8 8h4c1.886 0 2.828 0 3.414-.586C16 14.828 16 13.886 16 12V8m-8 8c-1.886 0-2.828 0-3.414-.586C4 14.828 4 13.886 4 12V8c0-1.886 0-2.828.586-3.414C5.172 4 6.114 4 8 4h4c1.886 0 2.828 0 3.414.586C16 5.172 16 6.114 16 8" />
              </svg>
            </button>
          </div>
        </div>
        <GradientLockup
          color="lightblue"
          rotate={-2}
          left={
            <div
              className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
              style={{ height: 304 }}
            />
          }
          right={<CodeWindow className="bg-lightBlue-500" />}
        />
      </header>
      <Testimonials />
      <div className="max-w-screen-xl mx-auto space-y-44">
        <section>
          <div className="px-8 mb-20">
            <Icon className={`${gradients.purple} mb-8`} />
            <Caption as="h2" className="text-purple-600 mb-3">
              Constraint-based
            </Caption>
            <BigText className="mb-8">An API for your design system.</BigText>
            <Paragraph className="mb-6">
              Utility classes help you work within the constraints of a system instead of littering
              your stylesheets with arbitrary values. They make it easy to be consistent with color
              choices, spacing, typography, shadows, and everything else that makes up a
              well-engineered design system.
            </Paragraph>
            <Link href="#" className="text-purple-600">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            color="purple"
            rotate={-1}
            header={
              <div className="-ml-4">
                <Tabs tabs={['Color', 'Typography', 'Shadows', 'Sizing']} />
              </div>
            }
            left={
              <div
                className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
                style={{ height: 370 }}
              />
            }
            right={<CodeWindow className="bg-pink-600" />}
          />
        </section>
        <section>
          <div className="px-8 mb-20">
            <Icon className={`${gradients.orange} mb-8`} />
            <Caption as="h2" className="text-orange-600 mb-3">
              Build anything
            </Caption>
            <BigText className="mb-8">Build whatever you want, seriously.</BigText>
            <Paragraph className="mb-6">
              Because Tailwind is so low-level, it never encourages you to design the same site
              twice. Even with the same color palette and sizing scale, it's easy to build the same
              component with a completely different look in the next project.
            </Paragraph>
            <Link href="#" className="text-orange-600">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            color="orange"
            rotate={-2}
            header={
              <div className="-ml-4">
                <Tabs tabs={['Simple', 'Playful', 'Elegant', 'Brutalist']} />
              </div>
            }
            left={
              <div
                className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
                style={{ height: 256 }}
              />
            }
            right={<CodeWindow className="bg-pink-600" />}
          />
        </section>
        <section>
          <div className="px-8 mb-20">
            <Icon className={`${gradients.teal} mb-8`} />
            <Caption as="h2" className="text-teal-500 mb-3">
              Performance
            </Caption>
            <BigText className="mb-8">It’s tiny in production.</BigText>
            <Paragraph className="mb-6">
              Tailwind automatically removes all unused CSS when building for production, which
              means your final CSS bundle is the smallest it could possibly be. In fact, most
              Tailwind projects ship less than 10KB of CSS to the client.
            </Paragraph>
            <Link href="#" className="text-teal-500">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            color="teal"
            rotate={1}
            left={
              <div className="relative z-10 rounded-xl shadow-lg -mr-8 tabular-nums">
                <div className="bg-white rounded-t-xl">
                  <div className="absolute top-6 left-6 w-15 h-15 bg-green-500 rounded-full flex items-center justify-center">
                    <svg width="32" height="32" fill="none">
                      <path
                        d="M6.668 17.333l5.333 5.334L25.335 9.333"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <dl className="p-6 pb-0">
                    <div className="flex-none w-full pl-15">
                      <dt className="ml-4 text-sm leading-5 font-medium">Production build</dt>
                      <dd className="ml-4 text-4xl leading-10 font-extrabold text-black">8.7KB</dd>
                    </div>
                    <div className="flex items-center border-t border-gray-100 -mx-6 mt-6 px-6 py-3 font-mono text-xs leading-5">
                      <dt className="whitespace-pre">Purged </dt>
                      <dd className="flex-auto">20,144 unused classes</dd>
                      <dd className="text-rose-700 flex items-center">
                        -160,215 lines
                        <svg viewBox="0 0 82 12" width="82" height="12" className="flex-none ml-2">
                          <rect width="12" height="12" fill="#f43f5e" />
                          <rect width="12" height="12" x="14" fill="#f43f5e" />
                          <rect width="12" height="12" x="28" fill="#f43f5e" />
                          <rect width="12" height="12" x="42" fill="#f43f5e" />
                          <rect width="12" height="12" x="56" fill="#e4e4e7" />
                          <rect width="12" height="12" x="70" fill="#e4e4e7" />
                        </svg>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div
                  className="relative bg-teal-700 rounded-b-xl overflow-hidden"
                  style={{ height: 250 }}
                >
                  <div className="bg-black bg-opacity-75 absolute inset-0" />
                </div>
              </div>
            }
            right={<CodeWindow className="bg-turquoise-500" />}
          />
        </section>
        <Responsive />
        <section>
          <div className="px-8 mb-20">
            <Icon className={`${gradients.lightblue} mb-8`} />
            <Caption as="h2" className="text-lightBlue-600 mb-3">
              State variants
            </Caption>
            <BigText className="mb-8">Hover and focus states? We got ’em.</BigText>
            <Paragraph className="mb-6">
              Want to style something on hover? Stick hover: at the beginning of the class you want
              to add. Works for focus, active, disabled, focus-within, focus-visible, and even fancy
              states we invented ourselves like group-hover.
            </Paragraph>
            <Link href="#" className="text-lightBlue-600">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            color="lightblue"
            rotate={1}
            left={
              <div
                className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
                style={{ height: 404 }}
              />
            }
            right={<CodeWindow className="bg-lightBlue-500" />}
          />
        </section>
        <section>
          <div className="px-8 mb-20">
            <Icon className={`${gradients.amber} mb-8`} />
            <Caption as="h2" className="text-amber-500 mb-3">
              Component-driven
            </Caption>
            <BigText className="mb-8">Worried about duplication? Don’t be.</BigText>
            <Paragraph className="mb-6">
              If you're repeating the same utilities over and over and over again, all you have to
              do is extract them into a component or template partial and boom — you've got a single
              source of truth so you can make changes in one place.
            </Paragraph>
            <Link href="#" className="text-amber-500">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            color="amber"
            rotate={-2}
            left={
              <div
                className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
                style={{ height: 380 }}
              />
            }
            right={<CodeWindow className="bg-orange-500" />}
          />
          <div className="px-8 mt-32 mb-8">
            <Paragraph className="mb-6">
              Not into component frameworks and like to keep it old school? Use Tailwind's @apply
              directive to extract repeated utility patterns into custom CSS classes just by copying
              and pasting the list of class names.
            </Paragraph>
            <Link href="#" className="text-orange-500">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            color="orange"
            rotate={1}
            left={
              <div
                className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
                style={{ height: 372 }}
              />
            }
            right={<CodeWindow className="bg-pink-600" />}
          />
        </section>
        <DarkMode />
        <section>
          <div className="px-8 mb-20">
            <Icon className={`${gradients.pink} mb-8`} />
            <Caption as="h2" className="text-rose-400 mb-3">
              Customization
            </Caption>
            <BigText className="mb-8">Extend it, tweak it, change it.</BigText>
            <Paragraph as="div" className="mb-6">
              <p>
                Tailwind includes an expertly crafted set of defaults out-of-the-box, but literally
                everything can be customized — from the color palette to the spacing scale to the
                box shadows to the mouse cursor.
              </p>
              <p>
                Use the tailwind.config.js file to craft your own design system, then let Tailwind
                transform it into your own custom CSS framework.
              </p>
            </Paragraph>
            <Link href="#" className="text-rose-400">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            color="pink"
            rotate={-1}
            header={
              <div className="-ml-4">
                <Tabs tabs={['Simple', 'Playful', 'Elegant', 'Brutalist']} />
              </div>
            }
            left={
              <div
                className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
                style={{ height: 374 }}
              />
            }
            right={<CodeWindow className="bg-rose-500" />}
          />
        </section>
        <section>
          <div className="px-8 mb-20">
            <Icon className={`${gradients.purple} mb-8`} />
            <Caption as="h2" className="text-purple-600 mb-3">
              Browser support
            </Caption>
            <BigText className="mb-8">
              Go bleeding edge or support ancient browsers, it’s your decision.
            </BigText>
            <Paragraph as="div" className="mb-6">
              <p>
                Tailwind includes utilities for all the latest modern browser features, but because
                it's so low-level, you're not forced to use them. Need to support IE11? Build your
                grids with Flexbox instead of CSS Grid. Stuck with IE9? Build them with floats! (And
                wow I'm so sorry.)
              </p>
              <p>
                Use the target option to play it really safe and automatically disable CSS features
                that aren't supported by the browsers you need to support, so there’s no accidents.
              </p>
            </Paragraph>
            <Link href="#" className="text-purple-600">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            color="purple"
            rotate={-2}
            header={
              <div className="-ml-4">
                <Tabs tabs={['Modern Browsers', 'IE11', 'IE9']} />
              </div>
            }
            left={
              <div
                className="relative z-10 mr-6 grid grid-cols-3 grid-rows-2 gap-4 text-4xl font-black text-purple-300"
                style={{ height: 336 }}
              >
                <div className="bg-white rounded-xl shadow-lg flex items-center justify-center">
                  1
                </div>
                <div className="bg-white rounded-xl shadow-lg col-span-2 flex items-center justify-center">
                  2
                </div>
                <div className="bg-white rounded-xl shadow-lg flex items-center justify-center">
                  3
                </div>
                <div className="bg-white rounded-xl shadow-lg flex items-center justify-center">
                  4
                </div>
                <div className="bg-white rounded-xl shadow-lg flex items-center justify-center">
                  5
                </div>
              </div>
            }
            right={<CodeWindow className="bg-fuchsia-500" />}
          />
        </section>
        <section>
          <div className="px-8 mb-20">
            <Icon className={`${gradients.lightblue} mb-8`} />
            <Caption as="h2" className="text-lightBlue-600 mb-3">
              Editor tools
            </Caption>
            <BigText className="mb-8">World-class IDE integration.</BigText>
            <Paragraph as="div" className="mb-6">
              <p>
                Worried about remembering all of these class names? The Tailwind CSS IntelliSense
                extension for VS Code has you covered.
              </p>
              <p>
                Get intelligent autocomplete suggestions, linting, class definitions and more, all
                within your editor and with no configuration required.
              </p>
            </Paragraph>
            <Link href="#" className="text-lightBlue-600">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            color="lightblue"
            rotate={2}
            left={<CodeWindow className="bg-lightBlue-500" height={625} />}
          />
        </section>
        <section>
          <div className="px-8 mb-20">
            <Icon className={`${gradients.violet} mb-8`} />
            <Caption as="h2" className="text-violet-600 mb-3">
              Ready-made components
            </Caption>
            <BigText className="mb-8">Move even faster with Tailwind UI.</BigText>
            <Paragraph className="mb-6">
              Tailwind UI is a collection of beautiful, fully responsive UI components, designed and
              developed by us, the creators of Tailwind CSS. It's got hundreds of ready-to-use
              examples to choose from, and is guaranteed to help you find the perfect starting point
              for what you want to build.
            </Paragraph>
            <Link href="#" className="text-violet-600">
              Learn more -&gt;
            </Link>
          </div>
          <GradientLockup
            fullWidth
            color="violet"
            rotate={-2}
            left={<img src={require('@/img/tailwindui.webp').default} alt="" />}
          />
        </section>
      </div>
    </div>
  )
}
