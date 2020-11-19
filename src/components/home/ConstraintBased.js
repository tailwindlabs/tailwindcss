import { IconContainer, Caption, BigText, Paragraph, Link, Widont } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/constraint-based.svg'
import { ReactComponent as ArrowIcon } from '@/img/icons/arrow.svg'
import { defaultConfig } from '@/utils/defaultConfig'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { tokenizeWithLines } from '../../macros/tokenize.macro'
import styles from './ConstraintBased.module.css'

const tokens = {
  sizing: tokenizeWithLines.html(`<ul class="space-y-4">
  <li>
    <div class="[w-64] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    <div class="[w-56] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    <div class="[w-48] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    <div class="[w-40] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    <div class="[w-32] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    <div class="[w-24] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    <div class="[w-20] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    <div class="[w-16] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    <div class="[w-12] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    <div class="[w-10] h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
</ul>
`).lines,
  color: tokenizeWithLines.html(`<ul class="space-y-2">
  <li>
    <ul class="grid grid-cols-10 h-7">
      <li class="[bg-red-50]"></li>
      <li class="[bg-red-100]"></li>
      <li class="[bg-red-200]"></li>
      <li class="[bg-red-300]"></li>
      <li class="[bg-red-400]"></li>
      <li class="[bg-red-500]"></li>
      <li class="[bg-red-600]"></li>
      <li class="[bg-red-700]"></li>
      <li class="[bg-red-800]"></li>
      <li class="[bg-red-900]"></li>
    </ul>
  </li>
  <li>
    <ul class="grid grid-cols-10 h-7">
      <li class="[bg-yellow-50]"></li>
      <li class="[bg-yellow-100]"></li>
      <li class="[bg-yellow-200]"></li>
      <li class="[bg-yellow-300]"></li>
      <li class="[bg-yellow-400]"></li>
      <li class="[bg-yellow-500]"></li>
      <li class="[bg-yellow-600]"></li>
      <li class="[bg-yellow-700]"></li>
      <li class="[bg-yellow-800]"></li>
      <li class="[bg-yellow-900]"></li>
    </ul>
  </li>
  <li>
    <ul class="grid grid-cols-10 h-7">
      <li class="[bg-green-50]"></li>
      <li class="[bg-green-100]"></li>
      <li class="[bg-green-200]"></li>
      <li class="[bg-green-300]"></li>
      <li class="[bg-green-400]"></li>
      <li class="[bg-green-500]"></li>
      <li class="[bg-green-600]"></li>
      <li class="[bg-green-700]"></li>
      <li class="[bg-green-800]"></li>
      <li class="[bg-green-900]"></li>
    </ul>
  </li>
  <li>
    <ul class="grid grid-cols-10 h-7">
      <li class="[bg-blue-50]"></li>
      <li class="[bg-blue-100]"></li>
      <li class="[bg-blue-200]"></li>
      <li class="[bg-blue-300]"></li>
      <li class="[bg-blue-400]"></li>
      <li class="[bg-blue-500]"></li>
      <li class="[bg-blue-600]"></li>
      <li class="[bg-blue-700]"></li>
      <li class="[bg-blue-800]"></li>
      <li class="[bg-blue-900]"></li>
    </ul>
  </li>
  <li>
    <ul class="grid grid-cols-10 h-7">
      <li class="[bg-purple-50]"></li>
      <li class="[bg-purple-100]"></li>
      <li class="[bg-purple-200]"></li>
      <li class="[bg-purple-300]"></li>
      <li class="[bg-purple-400]"></li>
      <li class="[bg-purple-500]"></li>
      <li class="[bg-purple-600]"></li>
      <li class="[bg-purple-700]"></li>
      <li class="[bg-purple-800]"></li>
      <li class="[bg-purple-900]"></li>
    </ul>
  </li>
  <li>
    <ul class="grid grid-cols-10 h-7">
      <li class="[bg-pink-50]"></li>
      <li class="[bg-pink-100]"></li>
      <li class="[bg-pink-200]"></li>
      <li class="[bg-pink-300]"></li>
      <li class="[bg-pink-400]"></li>
      <li class="[bg-pink-500]"></li>
      <li class="[bg-pink-600]"></li>
      <li class="[bg-pink-700]"></li>
      <li class="[bg-pink-800]"></li>
      <li class="[bg-pink-900]"></li>
    </ul>
  </li>
</ul>
`).lines,
  typography: tokenizeWithLines.html(`<ul class="space-y-6">
  <li>
    <p class="[font-sans]">
      ABCDEFGHIJKLMNOPQRSTUVWXYZ
      abcdefghijklmnopqrstuvwxyz
      1234567890
    </p>
  </li>
  <li>
    <p class="[font-serif]">
      ABCDEFGHIJKLMNOPQRSTUVWXYZ
      abcdefghijklmnopqrstuvwxyz
      1234567890
    </p>
  </li>
  <li>
    <p class="[font-mono]">
      ABCDEFGHIJKLMNOPQRSTUVWXYZ
      abcdefghijklmnopqrstuvwxyz
      1234567890
    </p>
  </li>
</ul>
`).lines,
  shadows: tokenizeWithLines.html(`<ul class="grid grid-cols-2 gap-4">
  <li>
    <div class="[shadow-sm] bg-white rounded-lg h-18"></div>
  </li>
  <li>
    <div class="[shadow] bg-white rounded-lg h-18"></div>
  </li>
  <li>
    <div class="[shadow-md] bg-white rounded-lg h-18"></div>
  </li>
  <li>
    <div class="[shadow-lg] bg-white rounded-lg h-18"></div>
  </li>
  <li>
    <div class="[shadow-xl] bg-white rounded-lg h-18"></div>
  </li>
  <li>
    <div class="[shadow-2xl] bg-white rounded-lg h-18"></div>
  </li>
</ul>
`).lines,
}

export function ConstraintBased() {
  const [tab, setTab] = useState('sizing')

  return (
    <section id="constraint-based">
      <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
        <IconContainer className={`${gradients.purple[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-purple-600 mb-3">
          Constraint-based
        </Caption>
        <BigText className="mb-8">
          <Widont>An API for your design system.</Widont>
        </BigText>
        <Paragraph className="mb-6">
          Utility classes help you work within the constraints of a system instead of littering your
          stylesheets with arbitrary values. They make it easy to be consistent with color choices,
          spacing, typography, shadows, and everything else that makes up a well-engineered design
          system.
        </Paragraph>
        <Link href="/docs/utility-first" className="text-purple-600 hover:text-purple-800">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="purple"
        rotate={-1}
        header={
          <div className="flex overflow-auto py-0.5 -my-0.5 -mx-4 sm:-mx-6 md:-mx-8 xl:-ml-4 xl:mr-0 pl-0.5">
            <Tabs
              tabs={{
                sizing: 'Sizing',
                color: 'Color',
                typography: 'Typography',
                shadows: 'Shadows',
              }}
              selected={tab}
              onChange={setTab}
              className="mx-auto xl:mx-0 px-4 sm:px-6 md:px-8 xl:px-0"
            />
          </div>
        }
        left={
          <div
            className={`relative z-10 rounded-tr-xl sm:rounded-t-xl lg:rounded-xl shadow-lg flex flex-col sm:flex-row lg:flex-col xl:flex-row lg:-mr-8 ${styles.container}`}
          >
            <h3 className="flex-none w-full sm:w-48 lg:w-full xl:w-48 bg-purple-50 rounded-tr-xl sm:rounded-tr-none sm:rounded-tl-xl lg:rounded-t-xl xl:rounded-tr-none xl:rounded-l-xl text-lg leading-6 font-semibold text-purple-800 px-4 py-3 sm:p-8 lg:px-6 lg:py-4 xl:p-8">
              <AnimatePresence initial={false} exitBeforeEnter>
                <motion.span
                  key={tab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {
                    {
                      sizing: 'Width',
                      color: 'Color',
                      typography: 'Typography',
                      shadows: 'Shadows',
                    }[tab]
                  }
                </motion.span>
              </AnimatePresence>
            </h3>

            <div className="relative flex-auto bg-white sm:rounded-tr-xl lg:rounded-b-xl lg:rounded-tr-none xl:rounded-bl-none xl:rounded-r-xl overflow-hidden">
              <AnimatePresence initial={false} exitBeforeEnter>
                {tab === 'sizing' && (
                  <motion.ul
                    key="sizing"
                    exit={{ opacity: 0 }}
                    className="w-full font-mono text-xs leading-5 text-gray-600 space-y-4 px-4 py-6 sm:p-8 lg:p-6 xl:p-8"
                  >
                    {[64, 56, 48, 40, 32, 24, 20, 16, 12, 10].map((key, i) => (
                      <li key={key} className="flex items-center flex-wrap sm:flex-nowrap">
                        <motion.span
                          className="flex-none w-full sm:w-11"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          w-{key}
                        </motion.span>
                        <motion.span
                          className={`flex-none h-3 origin-left bg-gradient-to-br ${gradients.purple[0]}`}
                          style={{ width: defaultConfig.theme.width[key] }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: i * 0.1, damping: 100 }}
                        />
                      </li>
                    ))}
                  </motion.ul>
                )}
                {tab === 'color' && (
                  <motion.ul
                    key="color"
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4 font-mono text-xs px-4 py-6 sm:p-8 lg:p-6 xl:p-8"
                  >
                    {['red', 'yellow', 'green', 'blue', 'purple', 'pink'].map((color, i) => (
                      <motion.li
                        key={color}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <h4
                          className="grid items-center"
                          style={{ gridTemplateColumns: '1fr auto 1fr' }}
                        >
                          {`bg-${color}-50`}
                          <ArrowIcon />
                          <span className="text-right">{`bg-${color}-900`}</span>
                        </h4>
                        <ul className="flex-none w-full flex rounded-lg overflow-hidden mt-1">
                          {Object.keys(defaultConfig.theme.colors[color]).map((key, j) => (
                            <li
                              key={key}
                              className="h-7 flex-auto"
                              style={{
                                background: defaultConfig.theme.colors[color][key],
                                zIndex: j,
                              }}
                            />
                          ))}
                        </ul>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
                {tab === 'typography' && (
                  <motion.ul
                    key="typography"
                    exit={{ opacity: 0 }}
                    className="w-full space-y-6 px-4 py-6 sm:p-8 lg:p-6 xl:p-8"
                  >
                    {['font-sans', 'font-serif', 'font-mono'].map((style, i) => (
                      <motion.li
                        key={style}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <h4 className="font-mono text-xs leading-5 text-gray-600">{style}</h4>
                        <p className={`text-sm sm:text-lg sm:leading-6 text-purple-900 ${style}`}>
                          ABCDEFGHIJKLMNOPQRSTUVWXYZ
                          <br />
                          abcdefghijklmnopqrstuvwxyz
                          <br />
                          1234567890
                        </p>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
                {tab === 'shadows' && (
                  <motion.div
                    key="shadows"
                    exit={{ opacity: 0 }}
                    className="w-full flex-auto flex font-mono text-xs px-4 py-6 sm:p-8 lg:p-6 xl:p-8"
                  >
                    <motion.div
                      className="absolute z-10 inset-2 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                    <ul className="relative z-20 w-full flex-none grid grid-cols-2 gap-4">
                      {['sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl'].map((shadow, i) => (
                        <motion.li
                          key={shadow}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: [0.1, 0.1, 0.2, 0.2, 0.3, 0.3][i] }}
                        >
                          <div>{`shadow${shadow === 'DEFAULT' ? '' : `-${shadow}`}`}</div>
                          <div
                            className="bg-white rounded-lg h-18 mt-1"
                            style={{ boxShadow: defaultConfig.theme.boxShadow[shadow] }}
                          />
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute z-10 bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white pointer-events-none" />
            </div>
          </div>
        }
        right={
          <CodeWindow className="bg-pink-600">
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
