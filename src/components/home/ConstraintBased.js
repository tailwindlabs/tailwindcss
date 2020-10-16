import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/constraint-based.svg'
import { siteConfig } from '@/utils/siteConfig'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

export function ConstraintBased() {
  const [tab, setTab] = useState('sizing')

  return (
    <section>
      <div className="px-8 mb-20">
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
          <div className="-ml-4">
            <Tabs
              tabs={{
                sizing: 'Sizing',
                color: 'Color',
                typography: 'Typography',
                shadows: 'Shadows',
              }}
              selected={tab}
              onChange={setTab}
            />
          </div>
        }
        left={
          <div className="relative z-10 rounded-xl shadow-lg flex lg:-mr-8" style={{ height: 370 }}>
            <h3 className="flex-none w-48 bg-purple-50 rounded-l-xl text-lg leading-6 font-semibold text-purple-800 p-8">
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

            <div className="relative flex-auto bg-white rounded-r-xl p-8 overflow-hidden flex">
              <AnimatePresence initial={false} exitBeforeEnter>
                {tab === 'sizing' && (
                  <motion.ul
                    key="sizing"
                    exit={{ opacity: 0 }}
                    className="w-full font-mono text-xs leading-5 text-gray-600 space-y-4"
                  >
                    {[64, 56, 48, 40, 32, 24, 20, 16, 12, 10].map((key, i) => (
                      <li className="flex items-center">
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
        right={<CodeWindow className="bg-pink-600" />}
      />
    </section>
  )
}
