import { Fragment, useEffect, useRef, useState } from 'react'
import {
  IconContainer,
  Caption,
  BigText,
  Paragraph,
  Link,
  Widont,
  themeTabs,
} from '@/components/home/common'
import { Tabs } from '@/components/Tabs'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import iconUrl from '@/img/icons/home/build-anything.png'
import { HtmlZenGarden } from '@/components/HtmlZenGarden'
import clsx from 'clsx'
import { GridLockup } from '../GridLockup'
import { lines } from '../../samples/build-anything.html?highlight'

const code = {
  Simple: `<div class="flex font-sans">
  <div class="flex-none w-48 relative">
    <img src="/classic-utility-jacket.jpg" alt="" class="absolute inset-0 w-full h-full object-cover" />
  </div>
  <form class="flex-auto p-6">
    <div class="flex flex-wrap">
      <h1 class="flex-auto text-lg font-semibold text-gray-900">Classic Utility Jacket</h1>
      <div class="text-lg font-semibold text-gray-500">$110.00</div>
      <div class="w-full flex-none text-sm font-medium text-gray-700 mt-2">In stock</div>
    </div>
    <div class="flex items-baseline mt-4 mb-6 pb-6 border-b border-gray-200">
      <div class="space-x-2 flex text-sm">
        <label>
          <input class="sr-only peer" name="size" type="radio" value="xs" checked />
          <div class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 peer-checked:font-semibold peer-checked:bg-gray-900 peer-checked:text-white">XS</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="s" />
          <div class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 peer-checked:font-semibold peer-checked:bg-gray-900 peer-checked:text-white">S</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="m" />
          <div class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 peer-checked:font-semibold peer-checked:bg-gray-900 peer-checked:text-white">M</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="l" />
          <div class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 peer-checked:font-semibold peer-checked:bg-gray-900 peer-checked:text-white">L</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="xl" />
          <div class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 peer-checked:font-semibold peer-checked:bg-gray-900 peer-checked:text-white">XL</div>
        </label>
      </div>
    </div>
    <div class="flex space-x-4 mb-6 text-sm font-medium">
      <div class="flex-auto flex space-x-4">
        <button class="h-10 px-6 font-semibold rounded-md bg-black text-white" type="submit">Buy now</button>
        <button class="h-10 px-6 font-semibold rounded-md border border-gray-200 text-gray-900" type="button">Add to bag</button>
      </div>
      <button class="flex-none flex items-center justify-center w-9 h-9 rounded-md text-gray-300 border border-gray-200" type="button" aria-label="Like">
        <svg width="20" height="20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </button>
    </div>
    <p class="text-sm text-gray-700">Free shipping on all continental US orders.</p>
  </form>
</div>`,
  Playful: `<div class="flex font-sans">
  <div class="flex-none w-56 relative">
    <img src="/classic-utility-jacket.jpg" alt="" class="absolute inset-0 w-full h-full object-cover rounded-lg" />
  </div>
  <form class="flex-auto p-6">
    <div class="flex flex-wrap">
      <h1 class="flex-auto font-medium text-gray-900">Classic Utility Jacket</h1>
      <div class="w-full flex-none mt-2 order-1 text-3xl font-bold text-violet-600">$110.00</div>
      <div class="text-sm font-medium text-gray-400">In stock</div>
    </div>
    <div class="flex items-baseline mt-4 mb-6 pb-6 border-b border-gray-200">
      <div class="space-x-2 flex text-sm font-bold">
        <label>
          <input class="sr-only peer" name="size" type="radio" value="xs" checked />
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-violet-400 peer-checked:bg-violet-600 peer-checked:text-white">XS</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="s" />
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-violet-400 peer-checked:bg-violet-600 peer-checked:text-white">S</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="m" />
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-violet-400 peer-checked:bg-violet-600 peer-checked:text-white">M</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="l" />
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-violet-400 peer-checked:bg-violet-600 peer-checked:text-white">L</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="xl" />
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-violet-400 peer-checked:bg-violet-600 peer-checked:text-white">XL</div>
        </label>
      </div>
    </div>
    <div class="flex space-x-4 mb-5 text-sm font-medium">
      <div class="flex-auto flex space-x-4">
        <button class="h-10 px-6 font-semibold rounded-full bg-violet-600 text-white" type="submit">Buy now</button>
        <button class="h-10 px-6 font-semibold rounded-full border border-gray-200 text-gray-900" type="button">Add to bag</button>
      </div>
      <button class="flex-none flex items-center justify-center w-9 h-9 rounded-full text-violet-600 bg-violet-50" type="button" aria-label="Like">
        <svg width="20" height="20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </button>
    </div>
    <p class="text-sm text-gray-500">Free shipping on all continental US orders.</p>
  </form>
</div>`,
  Elegant: `<div class="flex font-serif">
  <div class="flex-none w-52 relative">
    <img src="/classic-utility-jacket.jpg" alt="" class="absolute inset-0 w-full h-full object-cover rounded-lg" />
  </div>
  <form class="flex-auto p-6">
    <div class="flex flex-wrap items-baseline">
      <h1 class="w-full flex-none mb-3 text-2xl leading-none text-gray-900">Classic Utility Jacket</h1>
      <div class="flex-auto text-lg font-medium text-gray-500">$350.00</div>
      <div class="text-xs leading-6 font-medium uppercase text-gray-500">In stock</div>
    </div>
    <div class="flex items-baseline mt-4 mb-6 pb-6 border-b border-gray-200">
      <div class="space-x-1 flex text-sm font-medium">
        <label>
          <input class="sr-only peer" name="size" type="radio" value="xs" checked />
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 peer-checked:bg-gray-100 peer-checked:text-gray-900">XS</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="s" />
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 peer-checked:bg-gray-100 peer-checked:text-gray-900">S</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="m" />
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 peer-checked:bg-gray-100 peer-checked:text-gray-900">M</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="l" />
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 peer-checked:bg-gray-100 peer-checked:text-gray-900">L</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="xl" />
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 peer-checked:bg-gray-100 peer-checked:text-gray-900">XL</div>
        </label>
      </div>
    </div>
    <div class="flex space-x-4 mb-5 text-sm font-medium">
      <div class="flex-auto flex space-x-4 pr-4">
        <button class="flex-none w-1/2 h-12 uppercase font-medium tracking-wider bg-gray-900 text-white" type="submit">Buy now</button>
        <button class="flex-none w-1/2 h-12 uppercase font-medium tracking-wider border border-gray-200 text-gray-900" type="button">Add to bag</button>
      </div>
      <button class="flex-none flex items-center justify-center w-12 h-12 text-gray-300 border border-gray-200" type="button" aria-label="Like">
        <svg width="20" height="20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </button>
    </div>
    <p class="text-sm text-gray-500">Free shipping on all continental US orders.</p>
  </form>
</div>`,
  Brutalist: `<div class="flex p-6 font-mono">
  <div class="flex-none w-48 mb-10 relative z-10 before:absolute before:top-1 before:left-1 before:w-full before:h-full before:bg-teal-400">
    <img src="/classic-utility-jacket.jpg" alt="" class="absolute z-10 inset-0 w-full h-full object-cover rounded-lg" />
  </div>
  <form class="flex-auto pl-6">
    <div class="relative flex flex-wrap items-baseline pb-6 before:bg-black before:absolute before:-top-6 before:bottom-0 before:-left-60 before:-right-6">
      <h1 class="relative w-full flex-none mb-2 text-2xl font-semibold text-white">Retro Shoe</h1>
      <div class="relative text-lg text-white">$89.00</div>
      <div class="relative uppercase text-teal-400 ml-3">In stock</div>
    </div>
    <div class="flex items-baseline my-6">
      <div class="space-x-3 flex text-sm font-medium">
        <label>
          <input class="sr-only peer" name="size" type="radio" value="xs" checked />
          <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">XS</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="s" />
          <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">S</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="m" />
          <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">M</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="l" />
          <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">L</div>
        </label>
        <label>
          <input class="sr-only peer" name="size" type="radio" value="xl" />
          <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">XL</div>
        </label>
      </div>
    </div>
    <div class="flex space-x-2 mb-4 text-sm font-medium">
      <div class="flex space-x-4">
        <button class="px-6 h-12 uppercase font-semibold tracking-wider border-2 border-black bg-teal-400 text-black" type="submit">Buy now</button>
        <button class="px-6 h-12 uppercase font-semibold tracking-wider border border-gray-200 text-gray-900" type="button">Add to bag</button>
      </div>
      <button class="flex-none flex items-center justify-center w-12 h-12 text-black" type="button" aria-label="Like">
        <svg width="20" height="20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </button>
    </div>
    <p class="text-xs leading-6 text-gray-500">Free shipping on all continental US orders.</p>
  </form>
</div>`,
}

function extractClasses(code) {
  return code.match(/class="[^"]+"/g).map((attr) => attr.substring(7, attr.length - 1))
}

const classes = {
  Simple: extractClasses(code.Simple),
  Playful: extractClasses(code.Playful),
  Elegant: extractClasses(code.Elegant),
  Brutalist: extractClasses(code.Brutalist),
}

const content = {
  Simple: ['/classic-utility-jacket.jpg', 'Classic Utility Jacket', '$110.00'],
  Playful: ['/kids-jumpsuit.jpg', 'Kids Jumpsuit', '$39.00'],
  Elegant: ['/dogtooth-style-jacket.jpg', 'DogTooth Style Jacket', '$350.00'],
  Brutalist: ['/retro-shoe.jpg', 'Retro Shoe', '$89.00'],
}

export function BuildAnything() {
  const [theme, setTheme] = useState('Simple')
  let classIndex = 0
  let contentIndex = 0

  const initial = useRef(true)

  useEffect(() => {
    initial.current = false
  }, [])

  return (
    <section id="build-anything">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer>
          <img src={iconUrl} alt="" />
        </IconContainer>
        <Caption className="text-pink-500">Build anything</Caption>
        <BigText>
          <Widont>Build whatever you want, seriously.</Widont>
        </BigText>
        <Paragraph>
          Because Tailwind is so low-level, it never encourages you to design the same site twice.
          Even with the same color palette and sizing scale, it's easy to build the same component
          with a completely different look in the next project.
        </Paragraph>
        <Link href="/docs/installation" color="pink">
          Get started<span className="sr-only">, installation</span>
        </Link>
        <div className="mt-10">
          <Tabs
            className="text-pink-500"
            iconClassName="text-pink-500"
            tabs={themeTabs}
            selected={theme}
            onChange={setTheme}
          />
        </div>
      </div>
      <GridLockup
        className="mt-10 xl:mt-2"
        beams={1}
        left={<HtmlZenGarden theme={theme} />}
        right={
          <CodeWindow>
            <CodeWindow.Code2 lines={lines.length}>
              {lines.map((tokens, lineIndex) => (
                <Fragment key={lineIndex}>
                  {tokens.map((token, tokenIndex) => {
                    if (token.content === '_') {
                      let cls = classes[theme][classIndex++]
                      return (
                        <span
                          key={cls}
                          className={clsx('code-highlight', getClassNameForToken(token), {
                            'animate-flash-code': !initial.current,
                          })}
                        >
                          {cls}
                        </span>
                      )
                    }

                    if (token.content.includes('__content__')) {
                      let text = content[theme][contentIndex++]
                      return (
                        <Fragment key={text}>
                          {token.content.split(/(__content__)/).map((part, i) =>
                            i === 1 ? (
                              <span
                                key={i}
                                className={clsx('code-highlight', getClassNameForToken(token), {
                                  'animate-flash-code': !initial.current,
                                })}
                              >
                                {text}
                              </span>
                            ) : (
                              part
                            )
                          )}
                        </Fragment>
                      )
                    }

                    return (
                      <span key={tokenIndex} className={getClassNameForToken(token)}>
                        {token.content}
                      </span>
                    )
                  })}
                  {'\n'}
                </Fragment>
              ))}
            </CodeWindow.Code2>
          </CodeWindow>
        }
      />
    </section>
  )
}
