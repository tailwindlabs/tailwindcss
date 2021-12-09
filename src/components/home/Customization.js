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
import { CodeWindow } from '@/components/CodeWindow'
import iconUrl from '@/img/icons/home/customization.png'
import { useEffect, useRef, useState } from 'react'
import tailwindColors from 'tailwindcss/colors'
import { AnimatePresence, motion } from 'framer-motion'
import { font as pallyVariable } from '../../fonts/generated/Pally-Variable.module.css'
import { font as sourceSerifProRegular } from '../../fonts/generated/SourceSerifPro-Regular.module.css'
import { font as ibmPlexMonoRegular } from '../../fonts/generated/IBMPlexMono-Regular.module.css'
import { font as synonymVariable } from '../../fonts/generated/Synonym-Variable.module.css'
import { Token } from '../Code'
import clsx from 'clsx'
import { GridLockup } from '../GridLockup'
import { tokens } from '../../samples/customization.js?highlight'

const defaultSampleBody =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut augue gravida cras quis ac duis pretium ullamcorper consequat. Integer pellentesque eu.'

const themes = {
  Simple: {
    font: 'Inter',
    fontStacks: [
      ['Inter', 'system-ui', 'sans-serif'],
      ['Inter', 'system-ui', 'sans-serif'],
    ],
    bodySize: '14pt',
    colors: {
      primary: 'blue',
      secondary: 'gray',
    },
  },
  Playful: {
    font: 'Pally',
    fontStacks: [
      ['Pally', 'Comic Sans MS', 'sans-serif'],
      ['Pally', 'Comic Sans MS', 'sans-serif'],
    ],
    bodySize: '14pt',
    classNameDisplay: `${pallyVariable} font-medium`,
    classNameBody: pallyVariable,
    colors: {
      primary: 'rose',
      secondary: 'violet',
    },
  },
  Elegant: {
    font: 'Source Serif Pro',
    fontStacks: [
      ['Source Serif Pro', 'Georgia', 'serif'],
      ['Synonym', 'system-ui', 'sans-serif'],
    ],
    bodySize: '14pt',
    classNameDisplay: sourceSerifProRegular,
    classNameBody: synonymVariable,
    colors: {
      primary: 'gray',
      secondary: 'emerald',
    },
  },
  Brutalist: {
    font: 'IBM Plex Mono',
    fontStacks: [
      ['IBM Plex Mono', 'Menlo', 'monospace'],
      ['IBM Plex Mono', 'Menlo', 'monospace'],
    ],
    bodySize: '14pt',
    classNameDisplay: ibmPlexMonoRegular,
    classNameBody: ibmPlexMonoRegular,
    sampleBody:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut augue gravida cras quis ac duis pretium ullamcorper consequat.',
    colors: {
      primary: 'gray',
      secondary: 'teal',
    },
  },
}

export function Customization() {
  const [theme, setTheme] = useState('Simple')

  return (
    <section id="customization">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer>
          <img src={iconUrl} alt="" />
        </IconContainer>
        <Caption className="text-pink-500">Customization</Caption>
        <BigText>
          <Widont>Extend it, tweak it, change it.</Widont>
        </BigText>
        <Paragraph as="div">
          <p>
            Tailwind includes an expertly crafted set of defaults out-of-the-box, but literally
            everything can be customized — from the color palette to the spacing scale to the box
            shadows to the mouse cursor.
          </p>
          <p>
            Use the tailwind.config.js file to craft your own design system, then let Tailwind
            transform it into your own custom CSS framework.
          </p>
        </Paragraph>
        <Link href="/docs/configuration" color="pink">
          Learn more<span className="sr-only">, configuration</span>
        </Link>
        <div className="mt-10">
          <Tabs
            tabs={themeTabs}
            selected={theme}
            onChange={setTheme}
            className="text-pink-500"
            iconClassName="text-pink-500"
          />
        </div>
      </div>
      <GridLockup
        className="mt-10 xl:mt-2"
        beams={6}
        left={
          <div className="relative z-10 bg-white ring-1 ring-gray-900/5 rounded-lg shadow-xl px-6 py-5 my-auto xl:mt-18">
            <div className="absolute inset-x-0 inset-y-5 border-t border-b border-gray-100 pointer-events-none" />
            <div className="absolute inset-x-6 inset-y-0 border-l border-r border-gray-100 pointer-events-none" />
            <div className="bg-gray-50 overflow-hidden py-6 sm:py-9 lg:py-6 xl:py-9 px-6">
              <div className="sm:flex lg:block xl:flex">
                <div className="relative flex-auto flex min-w-0">
                  <div className="w-full flex-none">
                    <h3 className="sr-only">Typography</h3>
                    <ul className="space-y-8">
                      <li>
                        <dl className="grid">
                          <div className="font-mono text-xs leading-5 pb-1 border-b border-gray-200">
                            <dt className="sr-only">CSS class</dt>
                            <dd>font-display</dd>
                          </div>
                          <div className="col-start-2 text-right font-mono text-xs leading-5 text-gray-400 pb-1 border-b border-gray-200">
                            <dt className="sr-only">Font name</dt>
                            <AnimatePresence initial={false} exitBeforeEnter>
                              <motion.dd
                                key={themes[theme].font}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                {themes[theme].font}
                              </motion.dd>
                            </AnimatePresence>
                          </div>
                          <div className="mt-4 col-span-2 text-4xl sm:text-5xl lg:text-4xl xl:text-5xl text-gray-900">
                            <dt className="sr-only">Sample</dt>
                            <AnimatePresence initial={false} exitBeforeEnter>
                              <motion.dd
                                key={theme}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={themes[theme].classNameDisplay}
                              >
                                AaBbCc
                              </motion.dd>
                            </AnimatePresence>
                          </div>
                        </dl>
                      </li>
                      <li>
                        <dl className="grid">
                          <div className="font-mono text-xs leading-5 pb-1 border-b border-gray-200">
                            <dt className="sr-only">CSS class</dt>
                            <dd>font-body</dd>
                          </div>
                          <div className="col-start-2 text-right font-mono text-xs leading-5 text-gray-400 pb-1 border-b border-gray-200">
                            <dt className="sr-only">Font size</dt>
                            <AnimatePresence initial={false} exitBeforeEnter>
                              <motion.dd
                                key={themes[theme].bodySize}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                {themes[theme].bodySize}
                              </motion.dd>
                            </AnimatePresence>
                          </div>
                          <div className="mt-4 col-span-2 text-sm leading-6 text-gray-700">
                            <dt className="sr-only">Sample</dt>
                            <AnimatePresence initial={false} exitBeforeEnter>
                              <motion.dd
                                key={theme}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={themes[theme].classNameBody}
                              >
                                {themes[theme].sampleBody || defaultSampleBody}
                              </motion.dd>
                            </AnimatePresence>
                          </div>
                        </dl>
                      </li>
                    </ul>
                  </div>
                  <div
                    aria-hidden="true"
                    className="w-full flex-none -ml-full pointer-events-none pt-[10.125rem] flex text-sm leading-6 invisible"
                  >
                    {Object.keys(themes).map((theme, i) => (
                      <div
                        key={theme}
                        className={clsx(
                          'w-full flex-none',
                          i > 0 && '-ml-full',
                          themes[theme].classNameBody
                        )}
                      >
                        {themes[theme].sampleBody || defaultSampleBody}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-none mt-6 sm:mt-0 lg:mt-6 xl:mt-0 sm:ml-10 lg:ml-0 xl:ml-10">
                  <h3 className="sr-only">Colors</h3>
                  <ul className="space-y-6">
                    {Object.entries(themes[theme].colors).map(([name, color], index) => (
                      <li
                        key={name}
                        className={index === 0 ? undefined : 'hidden sm:block lg:hidden xl:block'}
                      >
                        <dl className="grid bg-white rounded-lg shadow-md p-3">
                          <div className="font-mono text-xs">
                            <dt className="sr-only">CSS class prefix</dt>
                            <dd>bg-{name}</dd>
                          </div>
                          <div className="col-start-2 font-mono text-xs text-right">
                            <dt className="sr-only">Range</dt>
                            <dd>50-900</dd>
                          </div>
                          <div className="mt-4 col-span-2">
                            <dt className="sr-only">Sample</dt>
                            <dd>
                              <ul className="grid grid-cols-5 gap-2">
                                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((key) => (
                                  <motion.li
                                    key={key}
                                    className="pt-full sm:w-8 lg:w-auto xl:w-8 rounded-sm ring-1 ring-inset ring-gray-900/5"
                                    initial={false}
                                    animate={{
                                      backgroundColor: tailwindColors[color][key],
                                    }}
                                  />
                                ))}
                              </ul>
                            </dd>
                          </div>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        }
        right={
          <CodeWindow>
            <CodeWindow.Code
              tokens={tokens}
              tokenComponent={CustomizationToken}
              tokenProps={{ theme }}
              transformTokens={(token) => {
                if (typeof token === 'string' && token.includes('__SECONDARY_COLOR__')) {
                  return ['__SECONDARY_COLOR__', token]
                }
                return token
              }}
            />
          </CodeWindow>
        }
      />
    </section>
  )
}

function CustomizationToken({ theme, ...props }) {
  const { token } = props
  const initial = useRef(true)

  useEffect(() => {
    initial.current = false
  }, [])

  if (token[0] === 'string' && token[1].startsWith("'font-")) {
    let [i, j] = token[1].match(/[0-9]+/g).map((x) => parseInt(x, 10))

    return (
      <span className="token string">
        {"'"}
        <span
          className={clsx('code-highlight', { 'animate-flash-code': !initial.current })}
          key={themes[theme].fontStacks[i][j]}
        >
          {themes[theme].fontStacks[i][j]}
        </span>
        {"'"}
      </span>
    )
  }

  if (token[0] === 'string' && token[1].startsWith("'color-")) {
    const [, name, shade] = token[1].substr(1, token[1].length - 2).split('-')
    const color = tailwindColors[themes[theme].colors[name]][shade]

    return (
      <span className="token string">
        {"'"}
        <span
          className={clsx('code-highlight', { 'animate-flash-code': !initial.current })}
          key={color}
        >
          {color}
        </span>
        {"'"}
      </span>
    )
  }

  if (token[0] === '__SECONDARY_COLOR__') {
    let name = Object.keys(themes[theme].colors)[1]
    return token[1].split('__SECONDARY_COLOR__').map((part, i) =>
      i % 2 === 0 ? (
        part
      ) : (
        <span
          className={clsx('code-highlight', { 'animate-flash-code': !initial.current })}
          key={name}
        >
          {name}
        </span>
      )
    )
  }

  return <Token {...props} />
}
