import { IconContainer, Caption, BigText, Paragraph, Link, Widont } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/customization.svg'
import { useEffect, useRef, useState } from 'react'
import tailwindColors from 'tailwindcss/colors'
import { AnimatePresence, motion } from 'framer-motion'
import { font as poppinsRegular } from '../../fonts/generated/Poppins-Regular.module.css'
import { font as poppinsExtraBold } from '../../fonts/generated/Poppins-ExtraBold.module.css'
import { font as tenorSansRegular } from '../../fonts/generated/TenorSans-Regular.module.css'
import { font as robotoMonoRegular } from '../../fonts/generated/RobotoMono-Regular.module.css'
import styles from './Customization.module.css'
import tokenize from '../../macros/tokenize.macro'
import { Token } from '../Code'
import clsx from 'clsx'

const themes = {
  simple: {
    font: 'Inter',
    fontStacks: [
      ['Inter', 'system-ui', 'sans-serif'],
      ['Inter', 'system-ui', 'sans-serif'],
    ],
    classNameDisplay: 'font-semibold',
    primaryColor: 'indigo',
    secondaryColorName: 'gray',
    secondaryColor: 'gray',
  },
  playful: {
    font: 'Poppins',
    fontStacks: [
      ['Poppins', 'system-ui', 'sans-serif'],
      ['Poppins', 'system-ui', 'sans-serif'],
    ],
    classNameDisplay: poppinsExtraBold,
    classNameBody: `${poppinsRegular} text-sm`,
    primaryColor: 'purple',
    secondaryColorName: 'secondary',
    secondaryColor: 'pink',
  },
  elegant: {
    font: 'Tenor Sans',
    fontStacks: [
      ['Tenor Sans', 'Georgia', 'serif'],
      ['Inter', 'system-ui', 'sans-serif'],
    ],
    classNameDisplay: tenorSansRegular,
    primaryColor: 'gray',
    secondaryColorName: 'accent',
    secondaryColor: 'amber',
  },
  brutalist: {
    font: 'Roboto Mono',
    fontStacks: [
      ['Roboto Mono', 'Menlo', 'monospace'],
      ['Roboto Mono', 'Menlo', 'monospace'],
    ],
    classNameDisplay: robotoMonoRegular,
    classNameBody: `${robotoMonoRegular} text-xs leading-5`,
    primaryColor: 'lime',
    secondaryColorName: 'gray',
    secondaryColor: 'gray',
  },
}

const { tokens } = tokenize.javascript(`module.exports = {
  theme: {
    fontFamily: {
      display: ['font-0-0', 'font-0-1', 'font-0-2'],
      body: ['font-1-0', 'font-1-1', 'font-1-2'],
    },
    colors: {
      primary: {
        50: 'color-primary-50',
        100: 'color-primary-100',
        200: 'color-primary-200',
        300: 'color-primary-300',
        400: 'color-primary-400',
        500: 'color-primary-500',
        600: 'color-primary-600',
        700: 'color-primary-700',
        800: 'color-primary-800',
        900: 'color-primary-900',
      },
      __SECONDARY_COLOR__: {
        50: 'color-secondary-50',
        100: 'color-secondary-100',
        200: 'color-secondary-200',
        300: 'color-secondary-300',
        400: 'color-secondary-400',
        500: 'color-secondary-500',
        600: 'color-secondary-600',
        700: 'color-secondary-700',
        800: 'color-secondary-800',
        900: 'color-secondary-900',
      },
    },
  },
}
`)

export function Customization() {
  const [theme, setTheme] = useState('simple')

  return (
    <section id="customization">
      <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
        <IconContainer className={`${gradients.pink[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-rose-600 mb-3">
          Customization
        </Caption>
        <BigText className="mb-8">
          <Widont>Extend it, tweak it, change it.</Widont>
        </BigText>
        <Paragraph as="div" className="mb-6">
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
        <Link href="/docs/configuration" className="text-rose-600 hover:text-rose-800">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="pink"
        rotate={-1}
        header={
          <div className="flex overflow-auto py-0.5 -my-0.5 pl-0.5 -mx-4 sm:-mx-6 md:-mx-8 xl:-ml-4 xl:mr-0">
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
        left={
          <div
            className={`${styles.card} relative z-10 rounded-tr-xl sm:rounded-t-xl lg:rounded-xl shadow-lg lg:-mr-8 sm:divide-y-2 lg:divide-y-0 xl:divide-y-2 divide-rose-100 flex flex-col`}
          >
            <section className="flex flex-col sm:flex-row lg:flex-col xl:flex-row">
              <h3 className="flex-none w-full sm:w-48 lg:w-full xl:w-48 bg-rose-50 rounded-tr-xl sm:rounded-tr-none sm:rounded-tl-xl lg:rounded-tr-xl xl:rounded-tr-none text-lg leading-6 font-semibold text-rose-800 px-4 py-3 sm:p-8 lg:px-6 lg:py-4 xl:p-8">
                Typography
              </h3>
              <dl className="flex-auto bg-white sm:rounded-tr-xl lg:rounded-tr-none xl:rounded-tr-xl px-4 py-6 sm:p-6 space-y-6">
                <div className="space-y-1">
                  <dt className="font-mono text-xs">font-display</dt>
                  <AnimatePresence initial={false} exitBeforeEnter>
                    <motion.dd
                      key={theme}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-2xl leading-7 text-gray-900 ${
                        themes[theme].classNameDisplay || ''
                      }`}
                    >
                      {themes[theme].font}
                    </motion.dd>
                  </AnimatePresence>
                </div>
                <div className="space-y-1">
                  <dt className="font-mono text-xs">font-body</dt>
                  <AnimatePresence initial={false} exitBeforeEnter>
                    <motion.dd
                      key={theme}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-gray-600 ${themes[theme].classNameBody || 'text-sm'}`}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mi ultrices non
                      pharetra, eros enim. Habitant suspendisse ultricies.
                    </motion.dd>
                  </AnimatePresence>
                </div>
              </dl>
            </section>
            <section className="flex flex-col sm:flex-row lg:flex-col xl:flex-row overflow-hidden">
              <h3 className="flex-none w-full sm:w-48 lg:w-full xl:w-48 bg-rose-50 xl:rounded-bl-xl text-lg leading-6 font-semibold text-rose-800 px-4 py-3 sm:p-8 lg:px-6 lg:py-4 xl:p-8">
                Color
              </h3>
              <div className="relative flex-auto bg-white lg:rounded-b-xl xl:rounded-bl-none overflow-hidden">
                <dl className="px-4 py-6 sm:p-6 space-y-6">
                  <div className="space-y-2">
                    <dt className="font-mono text-xs">{'bg-primary-{50-900}'}</dt>
                    <dd>
                      <ul className="flex -space-x-1">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((key, i, colors) => (
                          <motion.li
                            key={key}
                            className="w-8 h-8 rounded-full"
                            initial={false}
                            animate={{
                              backgroundColor: tailwindColors[themes[theme].primaryColor][key],
                            }}
                            style={{
                              zIndex: colors.length - i,
                            }}
                          />
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence initial={false} exitBeforeEnter>
                      <motion.dt
                        key={theme}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-xs"
                      >
                        {'bg-'}
                        {themes[theme].secondaryColorName}
                        {'-{50-900}'}
                      </motion.dt>
                    </AnimatePresence>
                    <dd>
                      <ul className="flex -space-x-1">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((key, i, colors) => (
                          <motion.li
                            key={key}
                            className="w-8 h-8 rounded-full"
                            initial={false}
                            animate={{
                              backgroundColor: tailwindColors[themes[theme].secondaryColor][key],
                            }}
                            style={{
                              zIndex: colors.length - i,
                            }}
                          />
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
                <div className="hidden sm:block absolute z-10 bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white pointer-events-none" />
              </div>
            </section>
          </div>
        }
        right={
          <CodeWindow className="bg-rose-500">
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
      <span className="text-code-string">
        '
        <span
          className={clsx('code-highlight', { 'animate-flash-code': !initial.current })}
          key={themes[theme].fontStacks[i][j]}
        >
          {themes[theme].fontStacks[i][j]}
        </span>
        '
      </span>
    )
  }

  if (token[0] === 'string' && token[1].startsWith("'color-")) {
    const [, name, shade] = token[1].substr(1, token[1].length - 2).split('-')
    const color = tailwindColors[themes[theme][`${name}Color`]][shade]

    return (
      <span className="text-code-string">
        '
        <span
          className={clsx('code-highlight', { 'animate-flash-code': !initial.current })}
          key={color}
        >
          {color}
        </span>
        '
      </span>
    )
  }

  if (token[0] === '__SECONDARY_COLOR__') {
    return token[1].split('__SECONDARY_COLOR__').map((part, i) =>
      i % 2 === 0 ? (
        part
      ) : (
        <span
          className={clsx('code-highlight', { 'animate-flash-code': !initial.current })}
          key={themes[theme].secondaryColorName}
        >
          {themes[theme].secondaryColorName}
        </span>
      )
    )
  }

  return <Token {...props} />
}
