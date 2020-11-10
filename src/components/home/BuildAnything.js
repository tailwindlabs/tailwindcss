import { Fragment, useEffect, useRef, useState } from 'react'
import { IconContainer, Caption, BigText, Paragraph, Link, Widont } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/build-anything.svg'
import { HtmlZenGarden } from '@/components/HtmlZenGarden'
import tokenize from '../../macros/tokenize.macro'
import clsx from 'clsx'

const { lines } = tokenize.html(`<div class="_">
  <div class="_">
    <img src="https://unsplash.it/200/200" alt="" class="_" />
  </div>
  <div class="_">
    <div class="_">
      <h1 class="_">
        __content__
      </h1>
      <div class="_">
        __content__
      </div>
      <div class="_">
        In stock
      </div>
    </div>
    <div class="_">
      <div class="_">
        <div class="_">XS</div>
        <div class="_">S</div>
        <div class="_">M</div>
        <div class="_">L</div>
        <div class="_">XL</div>
      </div>
      <div class="_">Size Guide</div>
    </div>
    <div class="_">
      <div class="_">
        <div class="_">Buy now</div>
        <div class="_">Add to bag</div>
      </div>
      <div class="_">
        <svg width="20" height="20" fill="currentColor">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </div>
    </div>
    <div class="_">
      Free shipping on all continental US orders.
    </div>
  </div>
</div>
`)

const code = {
  simple: `<div class="flex">
  <div class="flex-none w-48 relative">
    <img src="https://unsplash.it/200/200" alt="" class="absolute inset-0 w-full h-full object-cover" />
  </div>
  <div class="flex-auto p-6">
    <div class="flex flex-wrap">
      <h1 class="flex-auto text-xl font-semibold">Classic Utility Jacket</h1>
      <div class="text-xl font-semibold text-gray-500">$110.00</div>
      <div class="w-full flex-none text-sm font-medium text-gray-500 mt-2">In stock</div>
    </div>
    <div class="flex items-baseline mt-4 mb-6">
      <div class="space-x-2 flex">
        <div class="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg">XS</div>
        <div class="w-9 h-9 flex items-center justify-center">S</div>
        <div class="w-9 h-9 flex items-center justify-center">M</div>
        <div class="w-9 h-9 flex items-center justify-center">L</div>
        <div class="w-9 h-9 flex items-center justify-center">XL</div>
      </div>
      <div class="ml-auto text-sm text-gray-500 underline">Size Guide</div>
    </div>
    <div class="flex space-x-3 mb-4 text-sm font-medium">
      <div class="flex-auto flex space-x-3">
        <div class="w-1/2 flex items-center justify-center rounded-md bg-black text-white">Buy now</div>
        <div class="w-1/2 flex items-center justify-center rounded-md border border-gray-300">Add to bag</div>
      </div>
      <div class="flex-none flex items-center justify-center w-9 h-9 rounded-md text-gray-400 border border-gray-300">
        <svg width="20" height="20" fill="currentColor">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </div>
    </div>
    <div class="text-sm text-gray-500">Free shipping on all continental US orders.</div>
  </div>
</div>`,
  playful: `<div class="flex p-6">
  <div class="flex-none w-44 relative">
    <img src="https://unsplash.it/200/200" alt="" class="absolute inset-0 w-full h-full object-cover rounded-lg" />
  </div>
  <div class="flex-auto pl-6">
    <div class="flex flex-wrap items-baseline">
      <h1 class="w-full flex-none font-semibold mb-2.5">Kids Jumper</h1>
      <div class="text-4xl leading-7 font-bold text-purple-600">$39.00</div>
      <div class="text-sm font-medium text-gray-400 ml-3">In stock</div>
    </div>
    <div class="flex items-baseline my-8">
      <div class="space-x-2 flex text-sm font-medium">
        <div class="w-9 h-9 flex items-center justify-center rounded-full bg-purple-700 text-white">XS</div>
        <div class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-200">S</div>
        <div class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-200">M</div>
        <div class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-200">L</div>
        <div class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-200">XL</div>
      </div>
      <div class="ml-3 text-sm text-gray-500 underline">Size Guide</div>
    </div>
    <div class="flex space-x-3 mb-4 text-sm font-semibold">
      <div class="flex-auto flex space-x-3">
        <div class="w-1/2 flex items-center justify-center rounded-full bg-purple-700 text-white">Buy now</div>
        <div class="w-1/2 flex items-center justify-center rounded-full bg-purple-50 text-purple-700">Add to bag</div>
      </div>
      <div class="flex-none flex items-center justify-center w-9 h-9 rounded-full bg-purple-50 text-purple-700">
        <svg width="20" height="20" fill="currentColor">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </div>
    </div>
    <div class="text-sm text-gray-500">Free shipping on all continental US orders.</div>
  </div>
</div>`,
  elegant: `<div class="flex p-1">
  <div class="flex-none w-44 relative">
    <img src="https://unsplash.it/200/200" alt="" class="absolute inset-0 w-full h-full object-cover" />
  </div>
  <div class="flex-auto py-7 px-8">
    <div class="flex flex-wrap items-baseline">
      <h1 class="w-full flex-none text-3xl text-black mb-1.5">Fancy Suit Jacket</h1>
      <div class="text-lg leading-6 text-black">$600.00</div>
      <div class="text-sm text-gray-500 ml-3">In stock</div>
    </div>
    <div class="flex items-baseline mt-9 py-4 border-t border-gray-100">
      <div class="space-x-2 flex text-sm font-light text-black">
        <div class="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white">XS</div>
        <div class="w-9 h-9 flex items-center justify-center rounded-full">S</div>
        <div class="w-9 h-9 flex items-center justify-center rounded-full">M</div>
        <div class="w-9 h-9 flex items-center justify-center rounded-full">L</div>
        <div class="w-9 h-9 flex items-center justify-center rounded-full">XL</div>
      </div>
      <div class="ml-auto text-sm font-light text-gray-500">Size Guide</div>
    </div>
    <div class="flex space-x-3 mb-3 text-sm font-semibold uppercase">
      <div class="flex-auto flex space-x-3">
        <div class="w-1/2 flex items-center justify-center bg-black text-white">Buy now</div>
        <div class="w-1/2 flex items-center justify-center border border-gray-200">Add to bag</div>
      </div>
      <div class="flex-none flex items-center justify-center w-12 h-12 text-gray-900 border border-gray-200">
        <svg width="20" height="20" fill="currentColor">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </div>
    </div>
    <div class="text-sm text-gray-500">Free shipping on all continental US orders.</div>
  </div>
</div>`,
  brutalist: `<div class="flex p-6 font-mono">
  <div class="flex-none w-40 relative">
    <img src="https://unsplash.it/200/200" alt="" class="absolute inset-0 w-full h-full object-cover border border-black shadow-offset-lime" />
  </div>
  <div class="flex-auto pl-6">
    <div class="flex flex-wrap items-baseline pl-52 -mt-6 -mr-6 -ml-52 py-6 pr-6 bg-black text-white">
      <h1 class="w-full flex-none text-2xl leading-7 mb-2 font-bold">Retro Shoe</h1>
      <div class="text-2xl leading-7 font-bold">$110.00</div>
      <div class="text-sm font-medium ml-3">In stock</div>
    </div>
    <div class="flex items-baseline py-8">
      <div class="space-x-3.5 flex text-center text-sm leading-none font-bold text-gray-500">
        <div class="w-6 text-black shadow-underline">XS</div>
        <div class="w-6">S</div>
        <div class="w-6">M</div>
        <div class="w-6">L</div>
        <div class="w-6">XL</div>
      </div>
      <div class="ml-auto text-xs underline">Size Guide</div>
    </div>
    <div class="flex space-x-3 text-sm font-bold uppercase mb-4">
      <div class="flex-auto flex space-x-3">
        <div class="w-1/2 flex items-center justify-center bg-lime-300 text-black border border-black shadow-offset-black">Buy now</div>
        <div class="w-1/2 flex items-center justify-center border border-black shadow-offset-black">Add to bag</div>
      </div>
      <div class="flex-none flex items-center justify-center w-9 h-9 border border-black">
        <svg width="20" height="20" fill="currentColor">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </div>
    </div>
    <div class="text-xs leading-5 text-gray-500">Free shipping on all continental US orders.</div>
  </div>
</div>`,
}

function extractClasses(code) {
  return code.match(/class="[^"]+"/g).map((attr) => attr.substring(7, attr.length - 1))
}

const classes = {
  simple: extractClasses(code.simple),
  playful: extractClasses(code.playful),
  elegant: extractClasses(code.elegant),
  brutalist: extractClasses(code.brutalist),
}

const content = {
  simple: ['Classic Utility Jacket', '$110.00'],
  playful: ['Kids Jumper', '$39.00'],
  elegant: ['Fancy Suit Jacket', '$600.00'],
  brutalist: ['Retro Shoe', '$89.00'],
}

export function BuildAnything() {
  const [theme, setTheme] = useState('simple')
  let classIndex = 0
  let contentIndex = 0

  const initial = useRef(true)

  useEffect(() => {
    initial.current = false
  }, [])

  return (
    <section id="build-anything">
      <div className="px-4 sm:px-6 md:px-8 mb-20">
        <IconContainer className={`${gradients.orange[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-orange-600 mb-3">
          Build anything
        </Caption>
        <BigText className="mb-8">
          <Widont>Build whatever you want, seriously.</Widont>
        </BigText>
        <Paragraph className="mb-6">
          Because Tailwind is so low-level, it never encourages you to design the same site twice.
          Even with the same color palette and sizing scale, it's easy to build the same component
          with a completely different look in the next project.
        </Paragraph>
        <Link href="#" className="text-orange-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="orange"
        rotate={-2}
        pin="right"
        header={
          <div className="flex overflow-auto -mx-4 sm:-mx-6 md:-mx-8 xl:-ml-4 xl:mr-0">
            <Tabs
              tabs={{
                simple: 'Simple',
                playful: 'Playful',
                elegant: 'Elegant',
                brutalist: 'Brutalist',
              }}
              selected={theme}
              onChange={setTheme}
              className="mx-auto xl:mx-0 px-4 sm:px-6 md:px-8 xl:px-0"
            />
          </div>
        }
        left={<HtmlZenGarden theme={theme} />}
        right={
          <CodeWindow className="bg-pink-600">
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
