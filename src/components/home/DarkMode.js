import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { motion } from 'framer-motion'
import { gradients } from '@/utils/gradients'
import {
  Paragraph,
  IconContainer,
  Caption,
  BigText,
  Link,
  Widont,
  InlineCode,
} from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'
import { ReactComponent as Icon } from '@/img/icons/home/dark-mode.svg'
import { addClassTokens } from '@/utils/addClassTokens'
import tokenize from '../../macros/tokenize.macro'
import { Token } from '@/components/Code'
import clsx from 'clsx'

const { code, tokens } = tokenize.html(
  `<div class="(light)bg-white dark:bg-gray-800 rounded-tl-xl sm:rounded-t-xl p-4 pb-6 sm:p-8 lg:p-4 lg:pb-6 xl:p-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
  <div class="flex items-center space-x-3.5 sm:space-x-5 lg:space-x-3.5 xl:space-x-5">
    <img src="/full-stack-radio.png" alt="" width="160" height="160" class="flex-none w-20 h-20 rounded-lg bg-gray-100" />
    <div class="min-w-0 flex-auto space-y-0.5">
      <p class="(light)text-lime-600 dark:text-lime-400 text-sm sm:text-base lg:text-sm xl:text-base font-semibold uppercase">
        <abbr title="Episode">Ep.</abbr> 128
      </p>
      <h2 class="(light)text-black dark:text-white text-base sm:text-xl lg:text-base xl:text-xl font-semibold truncate">
        Scaling CSS at Heroku with Utility Classes
      </h2>
      <p class="(light)text-gray-500 dark:text-gray-400 text-base sm:text-lg lg:text-base xl:text-lg font-medium">
        Full Stack Radio
      </p>
    </div>
  </div>
  <div class="space-y-2">
    <div class="(light)bg-gray-200 dark:bg-black rounded-full overflow-hidden">
      <div class="(light)bg-lime-500 dark:bg-lime-400 w-1/2 h-1.5" role="progressbar" aria-valuenow="1456" aria-valuemin="0" aria-valuemax="4550"></div>
    </div>
    <div class="(light)text-gray-500 dark:text-gray-400 flex justify-between text-sm font-medium tabular-nums">
      <div>24:16</div>
      <div>75:50</div>
    </div>
  </div>
</div>
<div class="(light)bg-gray-50 (light)text-black dark:bg-gray-900 dark:text-white lg:rounded-b-xl py-4 px-1 sm:px-3 lg:px-1 xl:px-3 grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-5 xl:grid-cols-7 items-center">
  <button type="button" class="mx-auto">
    <svg width="24" height="24" fill="none">
      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </button>
  <button type="button" class="hidden sm:block lg:hidden xl:block mx-auto">
    <svg width="17" height="18">
      <path d="M0 0h2v18H0V0zM4 9l13-9v18L4 9z" fill="currentColor" />
    </svg>
  </button>
  <button type="button" class="mx-auto">
    <svg width="34" height="39" fill="none">
      <path d="M12.878 26.12c1.781 0 3.09-1.066 3.085-2.515.004-1.104-.665-1.896-1.824-2.075v-.068c.912-.235 1.505-.95 1.5-1.93.005-1.283-1.048-2.379-2.727-2.379-1.602 0-2.89.968-2.932 2.387h1.274c.03-.801.784-1.287 1.64-1.287.892 0 1.475.541 1.471 1.346.004.844-.673 1.398-1.64 1.398h-.738v1.074h.737c1.21 0 1.91.614 1.91 1.491 0 .848-.738 1.424-1.765 1.424-.946 0-1.683-.486-1.734-1.262H9.797c.055 1.424 1.317 2.395 3.08 2.395zm7.734.025c2.016 0 3.196-1.645 3.196-4.504 0-2.838-1.197-4.488-3.196-4.488-2.003 0-3.196 1.645-3.2 4.488 0 2.855 1.18 4.5 3.2 4.504zm0-1.138c-1.18 0-1.892-1.185-1.892-3.366.004-2.174.716-3.371 1.892-3.371 1.172 0 1.888 1.197 1.888 3.37 0 2.182-.712 3.367-1.888 3.367z" fill="currentColor" />
      <path d="M1 22c0 8.837 7.163 16 16 16s16-7.163 16-16S25.837 6 17 6" stroke="currentColor" stroke-width="1.5" />
      <path d="M17 0L9 6l8 6V0z" fill="currentColor" />
    </svg>
  </button>
  <button type="button" class="mx-auto">
    <svg width="50" height="50" fill="none">
      <circle class="(light)text-gray-300 dark:text-gray-500" cx="25" cy="25" r="24" stroke="currentColor" stroke-width="1.5" />
      <path d="M18 16h4v18h-4V16zM28 16h4v18h-4z" fill="currentColor" />
    </svg>
  </button>
  <button type="button" class="mx-auto">
    <svg width="34" height="39" fill="none">
      <path d="M12.878 26.12c1.781 0 3.09-1.066 3.085-2.515.004-1.104-.665-1.896-1.824-2.075v-.068c.912-.235 1.505-.95 1.5-1.93.005-1.283-1.048-2.379-2.727-2.379-1.602 0-2.89.968-2.932 2.387h1.274c.03-.801.784-1.287 1.64-1.287.892 0 1.475.541 1.471 1.346.004.844-.673 1.398-1.64 1.398h-.738v1.074h.737c1.21 0 1.91.614 1.91 1.491 0 .848-.738 1.424-1.765 1.424-.946 0-1.683-.486-1.734-1.262H9.797c.055 1.424 1.317 2.395 3.08 2.395zm7.734.025c2.016 0 3.196-1.645 3.196-4.504 0-2.838-1.197-4.488-3.196-4.488-2.003 0-3.196 1.645-3.2 4.488 0 2.855 1.18 4.5 3.2 4.504zm0-1.138c-1.18 0-1.892-1.185-1.892-3.366.004-2.174.716-3.371 1.892-3.371 1.172 0 1.888 1.197 1.888 3.37 0 2.182-.712 3.367-1.888 3.367z" fill="currentColor" />
      <path d="M33 22c0 8.837-7.163 16-16 16S1 30.837 1 22 8.163 6 17 6" stroke="currentColor" stroke-width="1.5" />
      <path d="M17 0l8 6-8 6V0z" fill="currentColor" />
    </svg>
  </button>
  <button type="button" class="hidden sm:block lg:hidden xl:block mx-auto">
    <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
      <path d="M17 0H15V18H17V0Z" fill="currentColor" />
      <path d="M13 9L0 0V18L13 9Z" fill="currentColor" />
    </svg>
  </button>
  <button type="button" class="mx-auto border border-gray-300 rounded-md text-sm font-medium py-0.5 px-2 text-gray-500 dark:border-gray-600 dark:text-gray-400">
    1.0x
  </button>
</div>
`,
  true
)

function DarkModeSwitch({ enabled, onChange }) {
  return (
    <div className="flex items-center space-x-4">
      <svg width="32" height="32" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 2a1.4 1.4 0 011.4 1.4v1.4a1.4 1.4 0 11-2.8 0V3.4A1.4 1.4 0 0116 2zM6.1 6.1a1.4 1.4 0 011.98 0l.99.99a1.4 1.4 0 11-1.98 1.98l-.99-.99a1.4 1.4 0 010-1.98zm19.8 0a1.4 1.4 0 010 1.98l-.99.99a1.4 1.4 0 01-1.98-1.98l.99-.99a1.4 1.4 0 011.98 0zM9 16a7 7 0 1114 0 7 7 0 01-14 0zm-7 0a1.4 1.4 0 011.4-1.4h1.4a1.4 1.4 0 110 2.8H3.4A1.4 1.4 0 012 16zm23.8 0a1.4 1.4 0 011.4-1.4h1.4a1.4 1.4 0 110 2.8h-1.4a1.4 1.4 0 01-1.4-1.4zm-2.87 6.93a1.4 1.4 0 011.98 0l.99.99a1.4 1.4 0 01-1.98 1.98l-.99-.99a1.4 1.4 0 010-1.98zm-15.84 0a1.4 1.4 0 011.98 1.98l-.99.99a1.4 1.4 0 01-1.98-1.98l.99-.99zM16 25.8a1.4 1.4 0 011.4 1.4v1.4a1.4 1.4 0 11-2.8 0v-1.4a1.4 1.4 0 011.4-1.4z"
          fill="url(#paint0_linear)"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="2"
            y1="2"
            x2="30"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              className="transition-all duration-200"
              stopColor={enabled ? '#d4d4d8' : '#FACC15'}
            />
            <stop
              className="transition-all duration-200"
              offset="1"
              stopColor={enabled ? '#d4d4d8' : '#FA9D16'}
            />
          </linearGradient>
        </defs>
      </svg>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={clsx(
          'inline-flex items-center px-0.5 rounded-full w-18 h-9 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-gray-500 focus:outline-none',
          {
            'justify-end': enabled,
          }
        )}
        style={{ backgroundColor: enabled ? '#111827' : '#60D360' }}
      >
        <span className="sr-only">Enable dark mode</span>
        <motion.span
          layout
          className="bg-white rounded-full w-8 h-8"
          style={{ boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.1)' }}
        />
      </Switch>
      <svg
        width="24"
        height="24"
        fill="currentColor"
        className={clsx('transition-colors duration-200', {
          'text-gray-900': enabled,
          'text-gray-300': !enabled,
        })}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.353 2.939a1 1 0 01.22 1.08 8 8 0 0010.408 10.408 1 1 0 011.301 1.3A10.003 10.003 0 0112 22C6.477 22 2 17.523 2 12c0-4.207 2.598-7.805 6.273-9.282a1 1 0 011.08.22z"
        />
      </svg>
    </div>
  )
}

export function DarkMode() {
  const [enabled, setEnabled] = useState(false)

  return (
    <section id="dark-mode">
      <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
        <IconContainer className={`${gradients.green[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-green-600 mb-3">
          Dark mode
        </Caption>
        <BigText className="mb-8">
          <Widont>Now with Dark Mode.</Widont>
        </BigText>
        <Paragraph className="mb-6">
          Don’t want to be one of those websites that blinds people when they open it on their phone
          at 2am? Enable dark mode in your configuration file then throw{' '}
          <InlineCode>dark:</InlineCode> in front of any color utility to apply it when dark mode is
          active. Works for background colors, text colors, border colors, and even gradients.
        </Paragraph>
        <Link href="/docs/dark-mode" className="text-green-600 hover:text-green-800">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="green"
        rotate={-2}
        pin="right"
        header={
          <div className="flex justify-center">
            <DarkModeSwitch enabled={enabled} onChange={setEnabled} />
          </div>
        }
        left={
          <div
            className={`relative z-10 rounded-tl-xl sm:rounded-t-xl lg:rounded-xl shadow-lg lg:-mr-8 ${
              enabled ? 'dark' : ''
            }`}
            dangerouslySetInnerHTML={{
              __html: code
                .replace(/\(light\)/g, '')
                .replace(/dark:/g, 'transition-colors duration-500 dark:')
                .replace(
                  'src="/full-stack-radio.png"',
                  `src="${require('@/img/full-stack-radio.png').default}" loading="lazy"`
                )
                .replace(/<button type="button" class="/g, '<div class="cursor-pointer ')
                .replace(/<\/button>/g, '</div>'),
            }}
          />
        }
        right={
          <CodeWindow className="bg-green-500">
            <CodeWindow.Code
              tokens={tokens}
              tokenComponent={DarkModeToken}
              tokenProps={{ enabled }}
              transformTokens={addClassTokens}
            />
          </CodeWindow>
        }
      />
    </section>
  )
}

function DarkModeToken({ token, parentTypes, enabled, children }) {
  if (token[0] === 'class') {
    if (token[1].startsWith('dark:')) {
      return (
        <span
          className={clsx('code-highlight transition-colors duration-500', {
            'bg-code-highlight': enabled,
          })}
        >
          {children}
        </span>
      )
    }
    if (token[1].startsWith('(light)')) {
      return (
        <span className={clsx('transition-opacity duration-500', { 'opacity-50': enabled })}>
          {token[1].replace(/^\(light\)/, '')}
        </span>
      )
    }
  }

  return (
    <Token token={token} parentTypes={parentTypes}>
      {children}
    </Token>
  )
}
