import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/browser-support.svg'
import { useState } from 'react'
import { AnimatePresence, AnimateSharedLayout, motion, useInvertedScale } from 'framer-motion'

export function BrowserSupport() {
  const [feature, setFeature] = useState('grid')
  const [selectedGradient, setSelectedGradient] = useState(gradients.purple)

  return (
    <section id="browser-support">
      <div className="px-4 sm:px-6 md:px-8 mb-20">
        <IconContainer className={`${gradients.purple[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-purple-600 mb-3">
          Browser support
        </Caption>
        <BigText className="mb-8">
          Go bleeding edge or support ancient browsers, it’s your decision.
        </BigText>
        <Paragraph as="div" className="mb-6">
          <p>
            Tailwind includes utilities for all the latest modern browser features, but because it's
            so low-level, you're not forced to use them. Need to support IE11? Build your grids with
            Flexbox instead of CSS Grid. Stuck with IE9? Build them with floats! (And wow I'm so
            sorry.)
          </p>
          <p>
            Use the target option to play it really safe and automatically disable CSS features that
            aren't supported by the browsers you need to support, so there’s no accidents.
          </p>
        </Paragraph>
        <Link href="#" className="text-purple-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="purple"
        rotate={-2}
        gradientProps={{
          initial: false,
          animate: {
            backgroundImage: `linear-gradient(to bottom right, ${selectedGradient[1]}, ${selectedGradient[2]})`,
          },
        }}
        header={
          <div className="flex overflow-auto -mx-4 sm:-mx-6 md:-mx-8 xl:-ml-4 xl:mr-0">
            <Tabs
              tabs={{ grid: 'CSS Grid', transforms: 'Transforms', gradients: 'Gradients' }}
              selected={feature}
              onChange={setFeature}
              className="mx-auto xl:mx-0 px-4 sm:px-6 md:px-8 xl:px-0"
            />
          </div>
        }
        left={
          <div className="flex lg:mr-6 text-4xl font-black text-purple-300" style={{ height: 336 }}>
            <AnimatePresence initial={false} exitBeforeEnter>
              {feature === 'grid' || feature === 'transforms' ? (
                <div key="blocks" className="w-full flex-none grid grid-cols-3 grid-rows-2 gap-4">
                  <motion.div
                    initial={
                      feature === 'transforms'
                        ? { opacity: 0, scaleX: 1.156, scaleY: 1.156, rotate: -7, x: -50, y: -50 }
                        : { opacity: 0, x: -50, y: -50 }
                    }
                    animate={
                      feature === 'transforms'
                        ? { opacity: 1, scaleX: 1.156, scaleY: 1.156, rotate: -7, x: 0, y: 0 }
                        : { opacity: 1, scaleX: 1, scaleY: 1, rotate: 0, x: 0, y: 0 }
                    }
                    exit={{
                      opacity: 0,
                      // transition: { duration: 0.3 },
                      // ...(feature === 'transforms' ? {} : { x: -50, y: -50 }),
                    }}
                    className="bg-white rounded-xl shadow-lg flex items-center justify-center"
                  >
                    <InverseScale>1</InverseScale>
                  </motion.div>
                  <motion.div
                    initial={{
                      opacity: 0,
                      ...(feature === 'transforms'
                        ? { scaleX: 0.8375, scaleY: 0.8375, rotate: 8.6, y: 58 + 50, x: 7 + 50 }
                        : { scaleX: 1, scaleY: 1, rotate: 0, y: 50, x: 50 }),
                    }}
                    animate={
                      feature === 'transforms'
                        ? { opacity: 1, scaleX: 0.8375, scaleY: 0.8375, rotate: 8.6, y: 58, x: 7 }
                        : { opacity: 1, scaleX: 1, scaleY: 1, rotate: 0, y: 0, x: 0 }
                    }
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl shadow-lg col-span-2 flex items-center justify-center col-start-3 col-end-4 row-start-2 row-end-3"
                  >
                    <InverseScale>2</InverseScale>
                  </motion.div>
                  <motion.div
                    initial={{
                      opacity: 0,
                      ...(feature === 'transforms'
                        ? { scaleX: 1.475, x: -50, y: 44 + 50 }
                        : { scaleX: 1, x: -50, y: 50 }),
                    }}
                    animate={
                      feature === 'transforms'
                        ? { opacity: 1, scaleX: 1.475, x: 0, y: 44 }
                        : { opacity: 1, scaleX: 1, x: 0, y: 0 }
                    }
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl shadow-lg flex items-center justify-center origin-right"
                  >
                    <InverseScale>3</InverseScale>
                  </motion.div>
                  <motion.div
                    initial={{
                      opacity: 0,
                      ...(feature === 'transforms' ? { x: 0, y: 105 + 50 } : { x: 0, y: 50 }),
                    }}
                    animate={
                      feature === 'transforms'
                        ? { opacity: 1, x: 0, y: 105 }
                        : { opacity: 1, x: 0, y: 0 }
                    }
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl shadow-lg flex items-center justify-center"
                  >
                    <InverseScale>4</InverseScale>
                  </motion.div>
                  <motion.div
                    initial={{
                      opacity: 0,
                      ...(feature === 'transforms'
                        ? { x: 87 + 50, y: 15 - 50 }
                        : { x: 50, y: -50 }),
                    }}
                    animate={
                      feature === 'transforms'
                        ? { opacity: 1, x: 87, y: 15 }
                        : { opacity: 1, x: 0, y: 0 }
                    }
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl shadow-lg flex items-center justify-center col-start-2 col-end-4 row-start-1 row-end-2"
                  >
                    <InverseScale>5</InverseScale>
                  </motion.div>
                </div>
              ) : (
                <AnimateSharedLayout>
                  <motion.ul
                    key="gradients"
                    className="self-center bg-white shadow-lg rounded-3xl w-full p-2 grid grid-cols-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[
                      gradients.purple,
                      gradients.blue,
                      gradients.lightblue,
                      gradients.teal,
                      gradients.amber,
                      gradients.pink,
                    ].map((gradient, i) => (
                      <motion.li
                        key={gradient}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.06 * i }}
                      >
                        <button
                          type="button"
                          className="relative flex w-full pt-full rounded-full focus:outline-none"
                          onClick={() => setSelectedGradient(gradient)}
                        >
                          <span className="sr-only"></span>
                          {selectedGradient === gradient && (
                            <motion.div
                              layoutId="highlight"
                              className="absolute inset-0 rounded-full bg-gray-200"
                            />
                          )}
                          <div
                            className={`absolute z-10 inset-2 rounded-full bg-gradient-to-br ${gradient[0]}`}
                          />
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                </AnimateSharedLayout>
              )}
            </AnimatePresence>
          </div>
        }
        right={
          <CodeWindow className="bg-fuchsia-500">
            <CodeWindow.Code />
          </CodeWindow>
        }
      />
    </section>
  )
}

function InverseScale({ children }) {
  const { scaleX, scaleY } = useInvertedScale()
  return <motion.div style={{ scaleX, scaleY }}>{children}</motion.div>
}
