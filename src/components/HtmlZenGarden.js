import { AnimateSharedLayout, motion } from 'framer-motion'
import { font as poppinsRegular } from '../fonts/generated/Poppins-Regular.module.css'
import { font as poppinsSemiBold } from '../fonts/generated/Poppins-SemiBold.module.css'
import { font as poppinsBold } from '../fonts/generated/Poppins-Bold.module.css'
import { font as poppinsMedium } from '../fonts/generated/Poppins-Medium.module.css'
import { font as tenorSansRegular } from '../fonts/generated/TenorSans-Regular.module.css'
import { usePrevious } from '@/hooks/usePrevious'

function fit(
  parentWidth,
  parentHeight,
  childWidth,
  childHeight,
  scale = 1,
  offsetX = 0.5,
  offsetY = 0.5
) {
  const childRatio = childWidth / childHeight
  const parentRatio = parentWidth / parentHeight
  let width = parentWidth * scale
  let height = parentHeight * scale

  if (childRatio < parentRatio) {
    height = width / childRatio
  } else {
    width = height * childRatio
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
    left: Math.round((parentWidth - width) * offsetX),
    top: Math.round((parentHeight - height) * offsetY),
  }
}

const themes = {
  simple: {
    wrapper: { borderRadius: 12 },
    container: '',
    image: {
      width: 192,
      height: 256,
      borderRadius: 0,
    },
    contentContainer: 'p-6',
    heading: 'flex-auto',
    stock: 'flex-none w-full mt-2',
    button: {
      height: 38,
      borderRadius: 6,
      primary: {
        backgroundColor: '#000',
        color: '#fff',
      },
      secondary: {
        backgroundColor: '#fff',
        borderColor: '#d4d4d8',
        color: '#000',
      },
      like: {
        color: '#a1a1aa',
      },
    },
    size: {
      container: 'mt-4 mb-6',
      button: {
        font: 'font-medium',
        size: 38,
        borderRadius: 8,
        color: 'rgba(0, 0, 0, 0.5)',
        activeBackgroundColor: '#f4f4f5',
        activeColor: '#000',
      },
      guide: {
        container: 'ml-auto',
        inner: 'text-sm underline',
        color: '#71717a',
      },
    },
    smallprint: {
      container: 'mt-4',
      inner: 'text-sm leading-5',
    },
  },
  playful: {
    wrapper: { borderRadius: 12 },
    container: 'p-6',
    image: { width: 168, height: 238, borderRadius: 8 },
    contentContainer: 'pl-6',
    heading: 'w-full flex-none mb-1.5',
    stock: 'ml-3',
    button: {
      height: 38,
      borderRadius: 19,
      primary: {
        backgroundColor: '#7e22ce',
        color: '#fff',
      },
      secondary: {
        backgroundColor: '#faf5ff',
        color: '#7e22ce',
      },
      like: {
        color: '#9333ea',
      },
    },
    size: {
      container: 'mt-8 mb-8',
      button: {
        font: poppinsMedium,
        size: 38,
        borderRadius: 19,
        borderColor: '#f4f4f5',
        color: 'rgba(0, 0, 0, 0.5)',
        activeBackgroundColor: '#7e22ce',
        activeColor: '#fff',
      },
      guide: {
        container: 'ml-3',
        inner: `text-sm underline ${poppinsRegular}`,
        color: '#71717a',
      },
    },
    smallprint: { container: 'mt-4', inner: `text-sm leading-5 ${poppinsRegular}` },
  },
  elegant: {
    wrapper: { borderRadius: 0 },
    container: 'p-1',
    image: { width: 172, height: 305, borderRadius: 0 },
    contentContainer: 'p-8 -my-1',
    heading: 'w-full flex-none mb-1.5',
    stock: 'ml-3',
    button: {
      height: 50,
      borderRadius: 0,
      primary: {
        backgroundColor: '#000',
        color: '#fff',
      },
      secondary: {
        backgroundColor: '#fff',
        color: '#000',
        borderColor: '#e4e4e7',
      },
      like: {
        color: '#18181b',
      },
    },
    size: {
      container: 'mt-8 mb-4 pt-4 border-t border-gray-100',
      button: {
        font: 'font-light',
        size: 38,
        borderRadius: 19,
        color: '#000',
        activeBackgroundColor: '#000',
        activeColor: '#fff',
      },
      guide: {
        container: 'ml-auto',
        inner: 'text-sm font-light',
        color: '#71717a',
      },
    },
    smallprint: {
      container: 'mt-3',
      inner: 'text-xs leading-4',
    },
  },
}

const imageAnimationVariants = {
  visible: { opacity: [0, 1], zIndex: 2 },
  prev: { zIndex: 1 },
  hidden: { zIndex: 0 },
}

export function HtmlZenGarden({ theme }) {
  const prevTheme = usePrevious(theme)

  return (
    <AnimateSharedLayout>
      <motion.div
        layout
        className="relative z-10 shadow-lg lg:-mr-8 flex leading-none"
        initial={false}
        animate={{ borderRadius: themes[theme].wrapper.borderRadius }}
      >
        <motion.div
          layout
          className={`bg-white overflow-hidden flex w-full ${themes[theme].container}`}
          initial={false}
          animate={{ borderRadius: themes[theme].wrapper.borderRadius }}
        >
          <motion.div
            layout
            className={`relative overflow-hidden flex-none ${theme === 'simple' ? 'w-44' : 'w-10'}`}
            style={{
              width: themes[theme].image.width,
              height: themes[theme].image.height,
            }}
            initial={false}
            animate={{ borderRadius: themes[theme].image.borderRadius }}
          >
            {Object.keys(themes).map((name, i) => (
              <motion.img
                layout
                key={name}
                src={`https://unsplash.it/300/400?random&amp;i=${i}`}
                alt=""
                className="absolute max-w-none"
                style={fit(themes[theme].image.width, themes[theme].image.height, 300, 400)}
                initial={i === 0 ? 'visible' : 'hidden'}
                animate={theme === name ? 'visible' : prevTheme === name ? 'prev' : 'hidden'}
                variants={imageAnimationVariants}
              />
            ))}
          </motion.div>
          <div
            className={`self-start flex-auto flex flex-wrap items-baseline ${themes[theme].contentContainer}`}
          >
            <div className={`relative ${themes[theme].heading}`}>
              <motion.h2
                layout
                className={`inline-flex text-black text-xl leading-7 font-semibold ${
                  theme === 'simple' ? '' : 'absolute bottom-0 left-0'
                }`}
                animate={{ opacity: theme === 'simple' ? 1 : 0 }}
              >
                Classic Utility Jacket
              </motion.h2>
              <motion.h2
                layout
                className={`inline-flex text-black text-base leading-6 font-semibold ${poppinsSemiBold} ${
                  theme === 'playful' ? '' : 'absolute bottom-0 left-0'
                }`}
                animate={{ opacity: theme === 'playful' ? 1 : 0 }}
              >
                Kids Jumper
              </motion.h2>
              <motion.h2
                layout
                className={`inline-flex text-black text-3xl leading-9 ${tenorSansRegular} ${
                  theme === 'elegant' ? '' : 'absolute bottom-0 left-0'
                }`}
                animate={{ opacity: theme === 'elegant' ? 1 : 0 }}
              >
                Fancy Suit Jacket
              </motion.h2>
            </div>
            <div className="relative">
              <motion.div
                className={`inline-flex text-xl leading-7 font-semibold ${
                  theme === 'simple' ? '' : 'absolute bottom-0 left-0'
                }`}
                layout
                animate={{ opacity: theme === 'simple' ? 1 : 0 }}
              >
                $110.00
              </motion.div>
              <motion.div
                className={`inline-flex text-4xl font-bold text-purple-600 ${poppinsBold} ${
                  theme === 'playful' ? '' : 'absolute bottom-0 left-0'
                }`}
                layout
                animate={{ opacity: theme === 'playful' ? 1 : 0 }}
              >
                $39.00
              </motion.div>
              <motion.div
                className={`inline-flex text-lg leading-6 text-black ${tenorSansRegular} ${
                  theme === 'elegant' ? '' : 'absolute bottom-0 left-0'
                }`}
                layout
                animate={{ opacity: theme === 'elegant' ? 1 : 0 }}
              >
                $600.00
              </motion.div>
            </div>
            <div className={`relative flex-auto ${themes[theme].stock}`}>
              <motion.div
                layout
                animate={{ opacity: theme === 'simple' ? 1 : 0 }}
                className={`inline-flex text-sm leading-5 font-medium text-gray-500 ${
                  theme === 'simple' ? '' : 'absolute bottom-0 left-0'
                }`}
              >
                In stock
              </motion.div>
              <motion.div
                layout
                animate={{ opacity: theme === 'playful' ? 1 : 0 }}
                className={`inline-flex text-sm leading-5 font-medium text-gray-400 ${poppinsMedium} ${
                  theme === 'playful' ? '' : 'absolute bottom-0 left-0'
                }`}
              >
                In stock
              </motion.div>
              <motion.div
                layout
                animate={{ opacity: theme === 'elegant' ? 1 : 0 }}
                className={`inline-flex text-sm leading-5 text-gray-500 ${tenorSansRegular} ${
                  theme === 'elegant' ? '' : 'absolute bottom-0 left-0'
                }`}
              >
                In stock
              </motion.div>
            </div>
            <div className={`w-full flex-none flex items-center ${themes[theme].size.container}`}>
              <motion.ul layout className="flex text-sm space-x-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <motion.li
                    key={size}
                    className="relative flex-none flex items-center justify-center border-2"
                    style={{
                      width: themes[theme].size.button.size,
                      height: themes[theme].size.button.size,
                    }}
                    initial={false}
                    animate={{
                      borderRadius: themes[theme].size.button.borderRadius,
                      borderColor: themes[theme].size.button.borderColor || '#fff',
                      color:
                        size === 'XS'
                          ? themes[theme].size.button.activeColor
                          : themes[theme].size.button.color,
                      ...(size === 'XS'
                        ? {
                            backgroundColor: themes[theme].size.button.activeBackgroundColor,
                          }
                        : {}),
                    }}
                  >
                    {Object.keys(themes).map((name) => (
                      <motion.span
                        key={name}
                        className={`absolute inset-0 flex items-center justify-center ${
                          themes[name].size.button.font
                        } ${theme === name ? '' : 'pointer-events-none'}`}
                        initial={false}
                        animate={{ opacity: theme === name ? 1 : 0 }}
                      >
                        {size}
                      </motion.span>
                    ))}
                  </motion.li>
                ))}
              </motion.ul>
              <div
                className={`relative whitespace-no-wrap ${
                  themes[theme].size.guide.container || ''
                }`}
              >
                {Object.keys(themes).map((name) => (
                  <motion.div
                    layout
                    key={name}
                    className={`inline-flex ${themes[name].size.guide.inner || ''} ${
                      theme === name ? '' : 'absolute bottom-0 left-0'
                    }`}
                    initial={false}
                    animate={{ opacity: theme === name ? 1 : 0 }}
                  >
                    Size Guide
                  </motion.div>
                ))}
              </div>
            </div>
            <div
              className="flex-none w-full grid gap-3 text-center"
              style={{ gridTemplateColumns: '1fr 1fr auto' }}
            >
              <motion.div
                layout
                className={`text-sm leading-5 font-medium flex items-center justify-center`}
                style={{ height: themes[theme].button.height }}
                initial={false}
                animate={{
                  backgroundColor: themes[theme].button.primary.backgroundColor,
                  borderColor: themes[theme].button.primary.borderColor,
                  color: themes[theme].button.primary.color,
                  borderRadius: themes[theme].button.borderRadius,
                }}
              >
                <motion.span layout>Buy now</motion.span>
              </motion.div>
              <motion.div
                layout
                className={`text-sm leading-5 font-medium flex items-center justify-center border`}
                style={{ height: themes[theme].button.height }}
                initial={false}
                animate={{
                  backgroundColor: themes[theme].button.secondary.backgroundColor,
                  borderColor:
                    themes[theme].button.secondary.borderColor ||
                    themes[theme].button.secondary.backgroundColor,
                  color: themes[theme].button.secondary.color,
                  borderRadius: themes[theme].button.borderRadius,
                }}
              >
                <motion.span layout>Add to bag</motion.span>
              </motion.div>
              <motion.div
                layout
                className={`flex items-center justify-center border`}
                style={{ width: themes[theme].button.height, height: themes[theme].button.height }}
                initial={false}
                animate={{
                  backgroundColor: themes[theme].button.secondary.backgroundColor,
                  borderColor:
                    themes[theme].button.secondary.borderColor ||
                    themes[theme].button.secondary.backgroundColor,
                  color: themes[theme].button.secondary.color,
                  borderRadius: themes[theme].button.borderRadius,
                }}
              >
                <motion.svg
                  layout
                  width="20"
                  height="20"
                  initial={false}
                  animate={{ color: themes[theme].button.like.color }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    fill="currentColor"
                  />
                </motion.svg>
              </motion.div>
            </div>
            <div className={`relative w-full ${themes[theme].smallprint.container || ''}`}>
              {Object.keys(themes).map((name) => (
                <motion.p
                  layout
                  key={name}
                  className={`inline-flex align-top ${themes[name].smallprint.inner || ''} ${
                    theme === name ? '' : 'absolute bottom-0 left-0'
                  }`}
                  initial={false}
                  animate={{ opacity: theme === name ? 1 : 0 }}
                >
                  Free shipping on all continental US orders.
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimateSharedLayout>
  )
}
