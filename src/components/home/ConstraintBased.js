import { IconContainer, Caption, BigText, Paragraph, Link, Widont } from '@/components/home/common'
import { Tabs } from '@/components/Tabs'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import iconUrl from '@/img/icons/home/constraint-based.png'
import defaultConfig from 'defaultConfig'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { GridLockup } from '../GridLockup'
import clsx from 'clsx'
import { lines as sizingSample } from '../../samples/sizing.html?highlight'
import { lines as colorsSample } from '../../samples/colors.html?highlight'
import { lines as typographySample } from '../../samples/typography.html?highlight'
import { lines as shadowsSample } from '../../samples/shadows.html?highlight'

const tokens = {
  Sizing: sizingSample,
  Colors: colorsSample,
  Typography: typographySample,
  Shadows: shadowsSample,
}

let tabs = {
  Sizing: (selected) => (
    <>
      <rect
        x="5"
        y="5"
        width="28"
        height="28"
        rx="4"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 41h28M33 39v4M5 39v4M39 5h4M39 33h4M41 33V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  Colors: (selected) => (
    <>
      <path
        d="M17.687 42.22 40.57 29.219a4 4 0 0 0 1.554-5.36L39 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27.477 7.121a1 1 0 1 0-.954 1.758l.954-1.758Zm5.209 3.966.477-.879-.477.88Zm1.555 5.515-.866-.5-.003.006.87.494ZM26.523 8.88l5.686 3.087.954-1.758-5.686-3.087-.954 1.758Zm6.849 7.23-12.616 22.21 1.738.987 12.617-22.21-1.74-.988Zm-1.163-4.143a3 3 0 0 1 1.166 4.136l1.732 1a5 5 0 0 0-1.944-6.894l-.954 1.758Z"
        fill="currentColor"
      />
      <path
        d="M5 9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v25a9 9 0 1 1-18 0V9Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="14"
        cy="34"
        r="3"
        fill={selected ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  Typography: (selected) => (
    <>
      <path
        d="M5 13a8 8 0 0 1 8-8h22a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H13a8 8 0 0 1-8-8V13Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15.5 25h9M13 31l5.145-12.748c.674-1.67 3.036-1.67 3.71 0L27 31"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31 13s2 0 2 1.833v18.334C33 35 31 35 31 35M35 13s-2 0-2 1.833v18.334C33 35 35 35 35 35M31 24h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  Shadows: (selected) => (
    <>
      <path
        d="M24 43c10.493 0 19-8.507 19-19S34.493 5 24 5m-4 .422C11.427 7.259 5 14.879 5 24c0 9.121 6.427 16.741 15 18.578"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 42.819V5.181c0-.1.081-.181.181-.181C34.574 5 43 13.607 43 24c0 10.394-8.426 19-18.819 19a.181.181 0 0 1-.181-.181Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M28 10h3M28 14h7M28 18h10M28 22h11M28 26h10M28 30h9M28 34h7M28 38h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
}

function Bars({ sizes, className }) {
  return (
    <motion.ul
      exit={{ opacity: 0 }}
      className={clsx('font-mono text-xs pt-6 space-y-4', className)}
    >
      {sizes.map((key, i) => (
        <li key={key}>
          <motion.div
            className="h-6 origin-left bg-white shadow ring-1 ring-gray-700/5 px-1 flex items-center"
            style={{ width: defaultConfig.theme.width[key], borderRadius: 4 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1, damping: 100 }}
          >
            <div className="flex-none w-0.5 h-1 bg-gray-300" />
            <span className="flex-auto text-center">w-{key}</span>
            <div className="flex-none w-0.5 h-1 bg-gray-300" />
          </motion.div>
        </li>
      ))}
    </motion.ul>
  )
}

function Sizing() {
  return (
    <>
      <Bars
        sizes={[96, 80, 72, 64, 60, 56, 52, 48]}
        className="hidden sm:block lg:hidden xl:block"
      />
      <Bars sizes={[64, 60, 56, 52, 48, 44, 40, 36]} className="sm:hidden lg:block xl:hidden" />
    </>
  )
}

function Colors() {
  return (
    <motion.ul
      exit={{ opacity: 0 }}
      className="space-y-6 font-mono text-[0.625rem] leading-5 pt-5 px-5"
    >
      {['sky', 'blue', 'indigo', 'purple'].map((color, i) => (
        <motion.li
          key={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-lg shadow ring-1 ring-gray-700/5 p-2"
        >
          <ul className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 xl:grid-cols-10 gap-2">
            {Object.keys(defaultConfig.theme.colors[color]).map((key) => (
              <li
                key={key}
                className="pt-full rounded-sm ring-1 ring-inset ring-gray-900/5"
                style={{
                  backgroundColor: defaultConfig.theme.colors[color][key],
                }}
              />
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between">
            <span className="flex-1">{color}-50</span>
            <svg width="47" height="4" viewBox="0 0 47 4" fill="none">
              <circle cx="1.5" cy="2" r="1.5" fill={defaultConfig.theme.colors.slate[200]} />
              <circle cx="12.5" cy="2" r="1.5" fill={defaultConfig.theme.colors.slate[300]} />
              <circle cx="23.5" cy="2" r="1.5" fill={defaultConfig.theme.colors.slate[400]} />
              <circle cx="34.5" cy="2" r="1.5" fill={defaultConfig.theme.colors.slate[300]} />
              <circle cx="45.5" cy="2" r="1.5" fill={defaultConfig.theme.colors.slate[200]} />
            </svg>
            <span className="flex-1 text-right">{color}-900</span>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  )
}

function Typography() {
  return (
    <motion.div
      key="typography"
      exit={{ opacity: 0 }}
      className="h-full flex flex-col justify-center space-y-8 sm:space-y-5 lg:space-y-8 xl:space-y-5 xl:px-5"
    >
      {[
        [
          'font-sans',
          'text-sm leading-6 sm:text-base sm:leading-6 lg:text-sm lg:leading-6 xl:text-base xl:leading-6',
        ],
        ['font-serif', 'text-sm leading-6 sm:text-lg lg:text-sm lg:leading-6 xl:text-lg'],
        ['font-mono', 'text-sm leading-6 sm:leading-7 lg:leading-6 xl:leading-7'],
      ].map((font, i) => (
        <motion.div
          className="sm:bg-white sm:rounded-lg sm:ring-1 sm:ring-gray-700/5 sm:shadow sm:p-3 lg:bg-transparent lg:rounded-none lg:ring-0 lg:shadow-none lg:p-0 xl:bg-white xl:rounded-lg xl:ring-1 xl:ring-gray-700/5 xl:shadow xl:p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <h4 className="text-xs leading-5 font-mono pb-2 border-b border-gray-100">{font[0]}</h4>
          <div className={clsx('mt-2 sm:mt-3 lg:mt-2 xl:mt-3 text-gray-700', ...font)}>
            The quick brown fox jumps over the lazy&nbsp;dog.
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

function Shadows() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="h-full flex flex-col font-mono text-xs leading-5 pt-5 sm:pt-0 lg:pt-5 xl:pt-0 px-5 sm:px-8 lg:px-5 xl:px-8"
    >
      <ul className="my-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 -mr-0.5">
        {['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'].map(
          (shadow, i) => (
            <motion.li
              key={shadow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: [0.1, 0.1, 0.2, 0.2, 0.3, 0.3][i] }}
              className="bg-white rounded-lg p-3 pt-10"
              style={{
                boxShadow:
                  defaultConfig.theme.boxShadow[
                    shadow.replace(/^shadow-/, '').replace('shadow', 'DEFAULT')
                  ],
              }}
            >
              {shadow}
            </motion.li>
          )
        )}
      </ul>
    </motion.div>
  )
}

export function ConstraintBased() {
  const [tab, setTab] = useState('Sizing')

  return (
    <section id="constraint-based" className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer>
          <img src={iconUrl} alt="" />
        </IconContainer>
        <Caption className="text-indigo-500">Constraint-based</Caption>
        <BigText>
          <Widont>An API for your design system.</Widont>
        </BigText>
        <Paragraph>
          Utility classes help you work within the constraints of a system instead of littering your
          stylesheets with arbitrary values. They make it easy to be consistent with color choices,
          spacing, typography, shadows, and everything else that makes up a well-engineered design
          system.
        </Paragraph>
        <Link href="/docs/utility-first" color="indigo">
          Learn more<span className="sr-only">, utility-first fundamentals</span>
        </Link>
        <div className="mt-10">
          <Tabs
            tabs={tabs}
            selected={tab}
            onChange={(tab) => setTab(tab)}
            className="text-indigo-600"
            iconClassName="text-indigo-500"
          />
        </div>
      </div>
      <GridLockup
        className="mt-10 xl:mt-2"
        left={
          <div className="relative z-10 bg-white ring-1 ring-gray-900/5 rounded-lg shadow-xl px-6 py-5 my-auto xl:mt-18">
            <div className="absolute inset-x-0 inset-y-5 border-t border-b border-gray-100 pointer-events-none" />
            <div className="absolute inset-x-6 inset-y-0 border-l border-r border-gray-100 pointer-events-none" />
            <div className="bg-gray-50 flex overflow-hidden h-88">
              <div
                className="bg-white/40 w-64 sm:w-[28rem] lg:w-64 xl:w-[28rem] mx-auto border-r border-gray-100"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 6'%3E%3Crect x='32' width='1' height='1' fill='%23cbd5e1'/%3E%3Crect width='1' height='6' fill='%23f1f5f9'/%3E%3C/svg%3E")`,
                  backgroundSize: '4rem 0.375rem',
                }}
              >
                <AnimatePresence initial={false} exitBeforeEnter>
                  {tab === 'Sizing' && <Sizing key="sizing" />}
                  {tab === 'Colors' && <Colors key="colors" />}
                  {tab === 'Typography' && <Typography key="typography" />}
                  {tab === 'Shadows' && <Shadows key="shadows" />}
                </AnimatePresence>
              </div>
            </div>
          </div>
        }
        right={
          <CodeWindow>
            <AnimatePresence initial={false} exitBeforeEnter>
              <motion.div
                key={tab}
                className="w-full flex-auto flex min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CodeWindow.Code2 lines={tokens[tab].length}>
                  {tokens[tab].map((tokens, lineIndex) => (
                    <div key={lineIndex}>
                      {tokens.map((token, tokenIndex) => {
                        if (token.types[token.types.length - 1] === 'attr-value') {
                          return (
                            <span key={tokenIndex} className={getClassNameForToken(token)}>
                              {token.content.split(/\[([^\]]+)\]/).map((part, i) =>
                                i % 2 === 0 ? (
                                  part
                                ) : (
                                  <span key={i} className="code-highlight bg-code-highlight">
                                    {part}
                                  </span>
                                )
                              )}
                            </span>
                          )
                        }
                        return (
                          <span key={tokenIndex} className={getClassNameForToken(token)}>
                            {token.content}
                          </span>
                        )
                      })}
                    </div>
                  ))}
                </CodeWindow.Code2>
              </motion.div>
            </AnimatePresence>
          </CodeWindow>
        }
      />
    </section>
  )
}
