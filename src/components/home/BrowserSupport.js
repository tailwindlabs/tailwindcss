import { IconContainer, Caption, BigText, Paragraph, Link, Widont } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/browser-support.svg'
import { useState } from 'react'
import { AnimateSharedLayout, motion, useInvertedScale } from 'framer-motion'
import { usePrevious } from '@/hooks/usePrevious'

export function BrowserSupport() {
  const [feature, setFeature] = useState('grid')
  const [selectedGradient, setSelectedGradient] = useState(gradients.purple)
  const prevFeature = usePrevious(feature)

  const augment = (style, x, y, rotate = false) => {
    let augmented = {}
    for (let k in style) {
      if (k === 'x') augmented[k] = [style[k] + 50 * x, style[k]]
      else if (k === 'y') augmented[k] = [style[k] + 50 * y, style[k]]
      else if (k === 'rotate' && rotate) augmented[k] = [style[k] + 10 * x, style[k]]
      else augmented[k] = [style[k], style[k]]
    }
    return augmented
  }

  const animate = (transforms, grid, x, y) => {
    if (feature === 'transforms') {
      return {
        animate: prevFeature === 'gradients' ? augment(transforms, x, y, true) : transforms,
        transition:
          prevFeature === 'gradients' ? { delay: 0.3, duration: 0.25, ease: [0, 0, 0.2, 1] } : {},
      }
    }
    if (feature === 'grid') {
      return {
        animate: prevFeature === 'gradients' ? augment(grid, x, y) : grid,
        transition:
          prevFeature === 'gradients' ? { delay: 0.3, duration: 0.25, ease: [0, 0, 0.2, 1] } : {},
      }
    }
    if (feature === 'gradients' && prevFeature === 'grid') {
      return {
        animate: { ...grid, x: grid.x + 50 * x, y: grid.y + 50 * y },
        transition: { duration: 0.25, ease: [0, 0, 0.2, 1] },
      }
    }
    if (feature === 'gradients' && prevFeature === 'transforms') {
      return {
        animate: {
          ...transforms,
          x: transforms.x + 50 * x,
          y: transforms.y + 50 * y,
          rotate: (transforms.rotate || 0) + 10 * x,
        },
        transition: { duration: 0.25, ease: [0, 0, 0.2, 1] },
      }
    }
  }

  return (
    <section id="browser-support">
      <div className="px-4 sm:px-6 md:px-8 mb-20">
        <IconContainer className={`${gradients.purple[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-purple-600 mb-3">
          Modern features
        </Caption>
        <BigText className="mb-8">
          <Widont>Cutting-edge is our comfort zone.</Widont>
        </BigText>
        <Paragraph as="div" className="mb-6">
          <p>
            Tailwind is unapologetically modern, and takes advantage of all the latest and greatest
            CSS features to make the developer experience as enjoyable as possible.
          </p>
          <p>
            We've got first-class CSS grid support, composable transforms and gradients powered by
            CSS variables, support for modern state selectors like <code>:focus-visible</code>, and
            tons more.
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
          <div className="flex pl-4 pb-6 sm:pl-0 lg:pb-0 lg:mr-6 text-4xl leading-10 font-black text-purple-300">
            <motion.div
              key="blocks"
              initial={false}
              animate={{ opacity: feature === 'grid' || feature === 'transforms' ? 1 : 0 }}
              transition={{
                duration: 0.3,
                delay: feature === 'grid' || feature === 'transforms' ? 0.3 : 0,
              }}
              className={`w-full flex-none grid grid-cols-3 grid-rows-2 gap-4 ${
                feature === 'gradients' ? 'pointer-events-none' : ''
              }`}
            >
              <motion.div
                className="relative"
                initial={false}
                {...animate(
                  { scaleX: 1.156, scaleY: 1.156, rotate: -7, x: 0, y: 0 },
                  { scaleX: 1, scaleY: 1, rotate: 0, x: 0, y: 0 },
                  -1,
                  -1
                )}
              >
                <div className="pt-full bg-white rounded-xl shadow-lg flex items-center justify-center" />
                <Number>1</Number>
              </motion.div>
              <motion.div
                className="relative col-start-3 col-end-4 row-start-2 row-end-3"
                initial={false}
                {...animate(
                  {
                    scaleX: 0.8375,
                    scaleY: 0.8375,
                    rotate: 8.6,
                    y: 58,
                    x: 7,
                  },
                  { scaleX: 1, scaleY: 1, rotate: 0, y: 0, x: 0 },
                  1,
                  1
                )}
              >
                <div className="pt-full bg-white rounded-xl shadow-lg flex items-center justify-center" />
                <Number>2</Number>
              </motion.div>
              <motion.div
                className="relative origin-right"
                initial={false}
                {...animate(
                  { scaleX: 1.475, x: 0, y: 44, rotate: 0 },
                  { scaleX: 1, x: 0, y: 0, rotate: 0 },
                  -1,
                  1
                )}
              >
                <div className="pt-full bg-white rounded-xl shadow-lg flex items-center justify-center" />
                <Number>3</Number>
              </motion.div>
              <motion.div
                className="relative"
                initial={false}
                {...animate({ x: 0, y: 105, rotate: 0 }, { x: 0, y: 0, rotate: 0 }, 0, 1)}
              >
                <div className="pt-full bg-white rounded-xl shadow-lg flex items-center justify-center" />
                <Number>4</Number>
              </motion.div>
              <motion.div
                className="relative bg-white rounded-xl shadow-lg flex items-center justify-center col-start-2 col-end-4 row-start-1 row-end-2"
                initial={false}
                {...animate(
                  { opacity: 1, x: 87, y: 15, rotate: 0 },
                  { opacity: 1, x: 0, y: 0, rotate: 0 },
                  1,
                  -1
                )}
              >
                <Number>5</Number>
              </motion.div>
            </motion.div>

            <AnimateSharedLayout>
              <motion.ul
                key="gradients"
                className={`self-center bg-white shadow-lg rounded-3xl w-full flex-none -ml-full p-2 grid grid-cols-6 ${
                  feature === 'gradients' ? '' : 'pointer-events-none'
                }`}
                initial={false}
                animate={{ opacity: feature === 'gradients' ? 1 : 0 }}
                transition={{ duration: 0.3, delay: feature === 'gradients' ? 0.3 : 0 }}
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
                    initial={false}
                    animate={feature === 'gradients' ? { opacity: [0, 1] } : { opacity: 0 }}
                    transition={{ delay: feature === 'gradients' ? 0.3 + 0.06 * i : 0 }}
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
                        className={`absolute z-10 inset-1 sm:inset-2 lg:inset-1 xl:inset-2 rounded-full bg-gradient-to-br ${gradient[0]}`}
                      />
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimateSharedLayout>
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

function Number({ children }) {
  const { scaleX, scaleY } = useInvertedScale()
  return (
    <motion.div
      className="absolute top-1/2 left-0 w-full -mt-5 text-center"
      style={{ scaleX, scaleY }}
    >
      {children}
    </motion.div>
  )
}
