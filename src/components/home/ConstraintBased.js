import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/constraint-based.svg'
import { siteConfig } from '@/utils/siteConfig'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import tokenize from '../../macros/tokenize.macro'
import styles from './ConstraintBased.module.css'

const tokens = {
  sizing: tokenize.html(`<ul class="space-y-4">
  <li>
    w-64
    <div class="w-64 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    w-56
    <div class="w-56 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    w-48
    <div class="w-48 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    w-40
    <div class="w-40 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    w-32
    <div class="w-32 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    w-24
    <div class="w-24 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    w-20
    <div class="w-20 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    w-16
    <div class="w-16 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    w-12
    <div class="w-12 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
  <li>
    w-10
    <div class="w-10 h-3 bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
  </li>
</ul>`).tokens,
  color: tokenize.html(`<ul class="space-y-2">
  <li>
    <ul class="-space-x-1">
      <li class="bg-red-900 w-8 h-8 rounded-full"></li>
      <li class="bg-red-800 w-8 h-8 rounded-full"></li>
      <li class="bg-red-700 w-8 h-8 rounded-full"></li>
      <li class="bg-red-600 w-8 h-8 rounded-full"></li>
      <li class="bg-red-500 w-8 h-8 rounded-full"></li>
      <li class="bg-red-400 w-8 h-8 rounded-full"></li>
      <li class="bg-red-300 w-8 h-8 rounded-full"></li>
      <li class="bg-red-200 w-8 h-8 rounded-full"></li>
      <li class="bg-red-100 w-8 h-8 rounded-full"></li>
      <li class="bg-red-50  w-8 h-8 rounded-full"></li>
    </ul>
  </li>
  <li>
    <ul class="-space-x-1">
      <li class="bg-orange-900 w-8 h-8 rounded-full"></li>
      <li class="bg-orange-800 w-8 h-8 rounded-full"></li>
      <li class="bg-orange-700 w-8 h-8 rounded-full"></li>
      <li class="bg-orange-600 w-8 h-8 rounded-full"></li>
      <li class="bg-orange-500 w-8 h-8 rounded-full"></li>
      <li class="bg-orange-400 w-8 h-8 rounded-full"></li>
      <li class="bg-orange-300 w-8 h-8 rounded-full"></li>
      <li class="bg-orange-200 w-8 h-8 rounded-full"></li>
      <li class="bg-orange-100 w-8 h-8 rounded-full"></li>
      <li class="bg-orange-50  w-8 h-8 rounded-full"></li>
    </ul>
  </li>
  <li>
    <ul class="-space-x-1">
      <li class="bg-yellow-900 w-8 h-8 rounded-full"></li>
      <li class="bg-yellow-800 w-8 h-8 rounded-full"></li>
      <li class="bg-yellow-700 w-8 h-8 rounded-full"></li>
      <li class="bg-yellow-600 w-8 h-8 rounded-full"></li>
      <li class="bg-yellow-500 w-8 h-8 rounded-full"></li>
      <li class="bg-yellow-400 w-8 h-8 rounded-full"></li>
      <li class="bg-yellow-300 w-8 h-8 rounded-full"></li>
      <li class="bg-yellow-200 w-8 h-8 rounded-full"></li>
      <li class="bg-yellow-100 w-8 h-8 rounded-full"></li>
      <li class="bg-yellow-50  w-8 h-8 rounded-full"></li>
    </ul>
  </li>
</ul>`).tokens,
  typography: tokenize.html(`<ul class="space-y-6">
  <li>
    font-sans
    <p class="font-sans">
      ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>
      abcdefghijklmnopqrstuvwxyz<br>
      1234567890
    </p>
  </li>
  <li>
    font-serif
    <p class="font-serif">
      ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>
      abcdefghijklmnopqrstuvwxyz<br>
      1234567890
    </p>
  </li>
  <li>
    font-mono
    <p class="font-mono">
      ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>
      abcdefghijklmnopqrstuvwxyz<br>
      1234567890
    </p>
  </li>
</ul>`).tokens,
  shadows: tokenize.html(`<ul class="space-y-4">
  <li class="shadow-sm  bg-white h-8 rounded-lg"></li>
  <li class="shadow     bg-white h-8 rounded-lg"></li>
  <li class="shadow-md  bg-white h-8 rounded-lg"></li>
  <li class="shadow-lg  bg-white h-8 rounded-lg"></li>
  <li class="shadow-xl  bg-white h-8 rounded-lg"></li>
  <li class="shadow-2xl bg-white h-8 rounded-lg"></li>
</ul>`).tokens,
}

export function ConstraintBased() {
  const [tab, setTab] = useState('sizing')

  return (
    <section>
      <div className="px-4 sm:px-6 md:px-8 mb-20">
        <IconContainer className={`${gradients.purple} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-purple-600 mb-3">
          Constraint-based
        </Caption>
        <BigText className="mb-8">An API for your design system.</BigText>
        <Paragraph className="mb-6">
          Utility classes help you work within the constraints of a system instead of littering your
          stylesheets with arbitrary values. They make it easy to be consistent with color choices,
          spacing, typography, shadows, and everything else that makes up a well-engineered design
          system.
        </Paragraph>
        <Link href="#" className="text-purple-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="purple"
        rotate={-1}
        header={
          <div className="flex overflow-auto -mx-4 sm:-mx-6 md:-mx-8 xl:-ml-4 xl:mr-0">
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
            <h3 className="flex-none w-full sm:w-48 lg:w-full xl:w-48 bg-purple-50 rounded-tr-xl sm:rounded-tr-none sm:rounded-tl-xl lg:rounded-t-xl xl:rounded-tr-none xl:rounded-l-xl text-lg leading-6 font-semibold text-purple-800 p-6 sm:p-8 lg:p-6 xl:p-8">
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

            <div className="relative flex-auto bg-white sm:rounded-tr-xl lg:rounded-b-xl lg:rounded-tr-none xl:rounded-bl-none xl:rounded-r-xl overflow-hidden flex p-6 sm:p-8 lg:p-6 xl:p-8">
              <AnimatePresence initial={false} exitBeforeEnter>
                {tab === 'sizing' && (
                  <motion.ul
                    key="sizing"
                    exit={{ opacity: 0 }}
                    className="w-full font-mono text-xs leading-5 text-gray-600 space-y-4"
                  >
                    {[64, 56, 48, 40, 32, 24, 20, 16, 12, 10].map((key, i) => (
                      <li key={key} className="flex items-center">
                        <motion.span
                          className="flex-none w-11"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          w-{key}
                        </motion.span>
                        <motion.span
                          className={`flex-none h-3 origin-left bg-gradient-to-br ${gradients.purple}`}
                          style={{ width: siteConfig.theme.width[key] }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: i * 0.1, damping: 100 }}
                        />
                      </li>
                    ))}
                  </motion.ul>
                )}
                {tab === 'color' && (
                  <motion.ul key="color" exit={{ opacity: 0 }} className="w-full space-y-2">
                    {[
                      'red',
                      'orange',
                      'yellow',
                      'lime',
                      'emerald',
                      'cyan',
                      'lightBlue',
                      'blue',
                      'violet',
                    ].map((color, i) => (
                      <li key={color}>
                        <ul className="flex flex-row-reverse justify-center -space-x-1 space-x-reverse">
                          {Object.keys(siteConfig.theme.colors[color]).map((key, j) => (
                            <motion.li
                              key={key}
                              className="w-8 h-8 rounded-full"
                              style={{ background: siteConfig.theme.colors[color][key], zIndex: j }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                delay:
                                  i * 0.05 +
                                  (Object.keys(siteConfig.theme.colors[color]).length - 1 - j) *
                                    0.05,
                              }}
                            />
                          ))}
                        </ul>
                      </li>
                    ))}
                  </motion.ul>
                )}
                {tab === 'typography' && (
                  <motion.ul key="typography" exit={{ opacity: 0 }} className="w-full space-y-6">
                    {['font-sans', 'font-serif', 'font-mono'].map((style, i) => (
                      <li key={style}>
                        <motion.h4
                          className="font-mono text-xs leading-5 text-gray-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.2 }}
                          data-delay={i * 0.2}
                        >
                          {style}
                        </motion.h4>
                        <motion.p
                          className={`text-lg leading-6 text-purple-900 ${style}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.2 + 0.1 }}
                          data-delay={i * 0.2 + 0.1}
                        >
                          ABCDEFGHIJKLMNOPQRSTUVWXYZ
                          <br />
                          abcdefghijklmnopqrstuvwxyz
                          <br />
                          1234567890
                        </motion.p>
                      </li>
                    ))}
                  </motion.ul>
                )}
                {tab === 'shadows' && (
                  <motion.div
                    key="shadows"
                    exit={{ opacity: 0 }}
                    className="relative w-full flex-auto -m-4 flex"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gray-50 rounded-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                    <ul className="relative w-full flex-none p-8 flex flex-col justify-between">
                      {['sm', 'default', 'md', 'lg', 'xl', '2xl'].map((shadow, i) => (
                        <motion.li
                          key={shadow}
                          className="bg-white rounded-lg h-8"
                          style={{ boxShadow: siteConfig.theme.boxShadow[shadow] }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        />
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
                className="w-full flex-auto flex overflow-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CodeWindow.Code tokens={tokens[tab]} />
              </motion.div>
            </AnimatePresence>
          </CodeWindow>
        }
      />
    </section>
  )
}
