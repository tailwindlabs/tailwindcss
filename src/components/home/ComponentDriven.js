import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import tokenize from '../../macros/tokenize.macro'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Token } from '@/components/Code'
import { ReactComponent as Icon } from '@/img/icons/home/component-driven.svg'
import { Tabs } from '@/components/Tabs'
import { ReactComponent as ReactLogo } from '@/img/icons/react.svg'
import { ReactComponent as VueLogo } from '@/img/icons/vue.svg'
import { AnimatePresence, AnimateSharedLayout, motion, useIsPresent } from 'framer-motion'

const recipes = [
  {
    title: 'Hank’s Juciest Beef Burger',
    rating: 4.94,
    time: 20,
    difficulty: 'Easy',
    servings: 4,
    author: 'Hank Douglas',
    image: require('@/img/jucy-beef-burger.jpg').default,
  },
  {
    title: 'Southern Fried Chicken Sandwich',
    rating: 4.94,
    time: 30,
    difficulty: 'Intermediate',
    servings: 4,
    author: 'Nicholas Denver',
    image: require('@/img/chicken-sandwich.jpg').default,
  },
  {
    title: 'Lily’s Healthy Beef Burger',
    rating: 4.94,
    time: 20,
    difficulty: 'Easy',
    servings: 6,
    author: 'Lily Ford',
    image: require('@/img/healthy-beef-burger.jpg').default,
  },
]

const tabs = {
  react: {
    'Recipes.js': tokenize.jsx(
      `import Nav from './Nav.js'
import NavItem from './NavItem.js'
import List from './List.js'
import ListItem from './ListItem.js'

export default function Recipes({ recipes }) {
  return (
    <main className="divide-y divide-gray-100">
      <Nav>
        <NavItem href="/featured" isActive>Featured</NavItem>
        <NavItem href="/popular">Popular</NavItem>
        <NavItem href="/recent">Recent</NavItem>
      </Nav>
      <List>
        {recipes.map((recipe) => (
          <ListItem key={recipe.id} {...recipe} />
        )}
      </List>
    </main>
  )
}`
    ).tokens,
    'Nav.js': tokenize.jsx(`export default function Nav({ children }) {
  return (
    <nav className="p-4">
      <ul className="flex space-x-2">
        {children}
      </ul>
    </nav>
  )
}`).tokens,
    'NavItem.js': tokenize.jsx(`export default function NavItem({ href, isActive, children }) {
  return (
    <li>
      <a
        href={href}
        className={\`block px-4 py-2 rounded-md \${isActive ? 'bg-amber-100 text-amber-700' : ''}\`}
      >
        {children}
      </a>
    </li>
  )
}`).tokens,
    'List.js': tokenize.jsx(`export default function List({ children }) {
  return (
    <ul className="divide-y divide-gray-100">
      {children}
    </ul>
  )
}`).tokens,
    'ListItem.js': tokenize.jsx(`export default function Item({ title, image }) {
  return (
    <article className="p-4 flex space-x-4">
      <img src={image} alt="" className="flex-none w-18 h-18 rounded-lg object-cover" />
      <div className="flex-auto">
        <h2 className="text-lg leading-7 font-semibold text-black mb-0.5">
          {title}
        </h2>
      </div>
    </article>
  )
}`).tokens,
  },
  vue: {
    'Recipes.vue': tokenize.html('<template></template>').tokens,
    'Nav.vue': tokenize.html('<template></template>').tokens,
    'NavItem.vue': tokenize.html('<template></template>').tokens,
    'List.vue': tokenize.html('<template></template>').tokens,
    'ListItem.vue': tokenize.html('<template></template>').tokens,
  },
}

function ComponentLink({ onClick, children }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    function onKey(e) {
      const modifier = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey
      if (!active && modifier) {
        setActive(true)
      } else if (active && !modifier) {
        setActive(false)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
    }
  }, [active])

  return active ? (
    <button type="button" className="hover:underline" onClick={onClick}>
      {children}
    </button>
  ) : (
    children
  )
}

function EditorToken(props) {
  const { token, tokens, tokenIndex, setActiveTab } = props

  if (
    token[0] === 'class-name' &&
    tokens[tokenIndex - 1][0] === 'punctuation' &&
    (tokens[tokenIndex - 1][1] === '<' || tokens[tokenIndex - 1][1] === '</')
  ) {
    return (
      <Token {...props}>
        <ComponentLink onClick={() => setActiveTab(`${token[1]}.js`)}>{token[1]}</ComponentLink>
      </Token>
    )
  }

  if (token[0] === 'string' && /^(['"`])\.\/.*?\.js\1$/.test(token[1])) {
    const tab = token[1].substr(3, token[1].length - 4)
    return (
      <Token {...props}>
        {token[1].substr(0, 1)}
        <button type="button" className="underline" onClick={() => setActiveTab(tab)}>
          ./{tab}
        </button>
        {token[1].substr(0, 1)}
      </Token>
    )
  }

  return <Token {...props} />
}

function TabBar({ children }) {
  const isPresent = useIsPresent()
  return (
    <motion.ul
      initial={{ y: '100%' }}
      animate={{ y: '0%' }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', mass: 0.4 }}
      className={`${
        isPresent ? '' : 'absolute top-0 left-0 w-full'
      } flex text-sm leading-5 text-orange-300 overflow-hidden`}
    >
      {children}
    </motion.ul>
  )
}

function ComponentExample({ framework }) {
  const [activeTab, setActiveTab] = useState(0)

  useLayoutEffect(() => {
    setActiveTab(0)
  }, [framework])

  return (
    <CodeWindow className="bg-orange-500">
      <div className="relative bg-orange-900 bg-opacity-20 overflow-hidden">
        <AnimateSharedLayout>
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 flex text-sm leading-5 font-medium text-transparent pointer-events-none select-none"
          >
            {Object.keys(tabs[framework]).map((tab, tabIndex) => (
              <div key={tabIndex} className="relative py-2 px-4 border border-transparent">
                {tabIndex === activeTab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-px bg-white bg-opacity-10"
                  />
                )}
                {tab}
              </div>
            ))}
          </div>
        </AnimateSharedLayout>
        <AnimatePresence initial={false}>
          <TabBar key={framework}>
            {Object.keys(tabs[framework]).map((tab, tabIndex) => (
              <li key={tab}>
                <button
                  type="button"
                  className={`border border-transparent py-2 px-4 font-medium focus:outline-none hover:text-orange-200 ${
                    tabIndex === activeTab ? 'text-orange-200' : ''
                  }`}
                  onClick={() => setActiveTab(tabIndex)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </TabBar>
        </AnimatePresence>
      </div>
      <CodeWindow.Code
        tokens={tabs[framework][Object.keys(tabs[framework])[activeTab]]}
        tokenComponent={EditorToken}
        tokenProps={{
          setActiveTab: (name) => setActiveTab(Object.keys(tabs[framework]).indexOf(name)),
        }}
      />
    </CodeWindow>
  )
}

const css = tokenize.css('.btn {\n  @apply font-bold;\n}').tokens

function ApplyExample() {
  return (
    <CodeWindow className="bg-pink-600">
      <div className="flex text-sm leading-5 bg-pink-900 bg-opacity-20 text-pink-200">
        <h3 className="border border-transparent py-2 px-4 font-medium bg-white bg-opacity-10">
          styles.css
        </h3>
      </div>
      <CodeWindow.Code tokens={css} />
      <div className="flex text-sm leading-5 bg-pink-900 bg-opacity-20 text-pink-200">
        <h3 className="border border-transparent py-2 px-4 font-medium bg-white bg-opacity-10">
          index.html
        </h3>
      </div>
      <CodeWindow.Code tokens={css} />
    </CodeWindow>
  )
}

export function ComponentDriven() {
  const [framework, setFramework] = useState('react')

  return (
    <section id="component-driven">
      <div className="px-4 sm:px-6 md:px-8 mb-20">
        <IconContainer className={`${gradients.amber[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-amber-500 mb-3">
          Component-driven
        </Caption>
        <BigText className="mb-8">Worried about duplication? Don’t be.</BigText>
        <Paragraph className="mb-6">
          If you're repeating the same utilities over and over and over again, all you have to do is
          extract them into a component or template partial and boom — you've got a single source of
          truth so you can make changes in one place.
        </Paragraph>
        <Link href="#" className="text-amber-500">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="amber"
        rotate={-2}
        pin="right"
        header={
          <div className="flex overflow-auto -mx-4 sm:-mx-6 md:-mx-8 xl:-ml-4 xl:mr-0">
            <Tabs
              tabs={{
                react: (
                  <div className="flex flex-col items-center py-1">
                    <ReactLogo className="mb-2" />
                    React
                  </div>
                ),
                vue: (
                  <div className="flex flex-col items-center py-1">
                    <VueLogo className="mb-2" />
                    Vue
                  </div>
                ),
              }}
              selected={framework}
              onChange={setFramework}
              className="mx-auto xl:mx-0 px-4 sm:px-6 md:px-8 xl:px-0"
            />
          </div>
        }
        left={
          <div className="relative z-10 bg-white rounded-tl-xl sm:rounded-t-xl lg:rounded-xl shadow-lg lg:-mr-8 divide-y divide-gray-100">
            <nav className="p-4 text-sm leading-5 font-medium">
              <ul className="flex space-x-2">
                <li>
                  <a href="#" className="block px-4 py-2 rounded-md bg-amber-100 text-amber-700">
                    Featured
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2">
                    Popular
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2">
                    Recent
                  </a>
                </li>
              </ul>
            </nav>
            {recipes.map(({ title, rating, time, difficulty, servings, author, image }, i) => (
              <article key={i} className="flex p-4 space-x-4">
                <img
                  src={image}
                  loading="lazy"
                  alt=""
                  width="144"
                  height="144"
                  className="flex-none w-18 h-18 rounded-lg object-cover"
                />
                <div className="min-w-0 relative flex-auto sm:pr-20 lg:pr-0 xl:pr-20">
                  <h2 className="text-base leading-6 sm:text-lg sm:leading-7 lg:text-base lg:leading-6 xl:text-lg xl:leading-7 font-semibold text-black mb-0.5 truncate">
                    {title}
                  </h2>
                  <dl className="flex flex-wrap text-sm leading-5 font-medium whitespace-pre">
                    <div className="absolute top-0 right-0 rounded-full bg-amber-50 text-amber-900 px-2 py-0.5 hidden sm:flex lg:hidden xl:flex items-center space-x-1">
                      <dt className="text-amber-500">
                        <span className="sr-only">Rating</span>
                        <svg width="16" height="20" fill="currentColor">
                          <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                        </svg>
                      </dt>
                      <dd>{rating}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Time</dt>
                      <dd>
                        <abbr title={`${time} minutes`}>{time}m</abbr>
                      </dd>
                    </div>
                    <div>
                      <dt className="sr-only">Difficulty</dt>
                      <dd> · {difficulty}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Servings</dt>
                      <dd> · {servings} servings</dd>
                    </div>
                    <div className="flex-none w-full mt-0.5 font-normal">
                      <dt className="inline">By</dt> <dd className="inline text-black">{author}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        }
        right={<ComponentExample framework={framework} />}
      />
      <div className="px-4 sm:px-6 md:px-8 mt-32 mb-8">
        <Paragraph className="mb-6">
          Not into component frameworks and like to keep it old school? Use Tailwind's @apply
          directive to extract repeated utility patterns into custom CSS classes just by copying and
          pasting the list of class names.
        </Paragraph>
        <Link href="#" className="text-orange-500">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="orange"
        rotate={1}
        left={
          <div className="relative z-10 bg-white rounded-tr-xl sm:rounded-t-xl lg:rounded-xl shadow-lg lg:-mr-8 xl:mr-4">
            <article className="text-gray-600 leading-6">
              <h2 className="opacity-25 text-2xl leading-8 font-semibold text-black p-6 pb-1">
                Weekly one-on-one
              </h2>
              <dl className="opacity-25 flex flex-wrap divide-y divide-gray-200 border-b border-gray-200">
                <div className="px-6 pb-6">
                  <dt className="sr-only">Date and time</dt>
                  <dd>
                    <time dateTime="2020-11-15T10:00:00-05:00">Thu Nov 15, 2020 10:00am</time> -{' '}
                    <time dateTime="2020-11-15T11:00:00-05:00">11:00am EST</time>
                  </dd>
                </div>
                <div className="w-full flex-none flex items-center px-6 py-4">
                  <dt className="w-1/3 flex-none uppercase text-sm leading-5 font-semibold">
                    Location
                  </dt>
                  <dd className="text-black">
                    Kitchener, <abbr title="Ontario">ON</abbr>
                  </dd>
                </div>
                <div className="w-full flex-none flex items-center px-6 py-4">
                  <dt className="w-1/3 flex-none uppercase text-sm leading-5 font-semibold">
                    Description
                  </dt>
                  <dd className="italic">No meeting description</dd>
                </div>
                <div className="w-full flex-none flex items-center px-6 py-4">
                  <dt className="w-1/3 flex-none uppercase text-sm leading-5 font-semibold">
                    Attendees
                  </dt>
                  <dd className="font-medium text-gray-700 bg-gray-100 rounded-full py-1 pl-2 pr-4 flex items-center">
                    <svg width="20" height="20" fill="currentColor" className="text-gray-500 mr-2">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      />
                    </svg>
                    Andrew Parsons
                  </dd>
                </div>
              </dl>
              <div className="grid grid-cols-2 gap-x-6 px-6 py-4">
                <button
                  type="button"
                  className="text-base leading-6 font-medium rounded-lg bg-gray-100 text-black py-3"
                >
                  Decline
                </button>
                <button
                  type="button"
                  className="text-base leading-6 font-medium rounded-lg bg-rose-500 text-white py-3"
                >
                  Accept
                </button>
              </div>
            </article>
          </div>
        }
        right={<ApplyExample />}
      />
    </section>
  )
}
