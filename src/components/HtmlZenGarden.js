import { AnimateSharedLayout, motion } from 'framer-motion'
import { font as pallyVariable } from '../fonts/generated/Pally-Variable.module.css'
import { font as synonymVariable } from '../fonts/generated/Synonym-Variable.module.css'
import { font as sourceSerifProRegular } from '../fonts/generated/SourceSerifPro-Regular.module.css'
import { font as ibmPlexMonoRegular } from '../fonts/generated/IBMPlexMono-Regular.module.css'
import { font as ibmPlexMonoSemiBold } from '../fonts/generated/IBMPlexMono-SemiBold.module.css'
import { usePrevious } from '@/hooks/usePrevious'
import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'debounce'
import dlv from 'dlv'
import { fit } from '@/utils/fit'
import clsx from 'clsx'
import colors from 'tailwindcss/colors'

const themes = {
  Simple: {
    wrapper: { borderRadius: 12 },
    container: '',
    image: {
      width({ containerWidth, col }, css = false) {
        if (!containerWidth) return 192
        if (css) {
          return col ? '100%' : '192px'
        } else {
          return col ? containerWidth : 192
        }
      },
      height({ containerWidth, col }) {
        if (!containerWidth) return 305
        return col ? 191 : 305
      },
      borderRadius: [
        [8, 8, 0, 0],
        [8, 8, 0, 0],
        [8, 0, 0, 8],
      ],
      src: require('@/img/classic-utility-jacket.jpg').default,
      originalWidth: 1200,
      originalHeight: 1600,
    },
    contentContainer: 'p-6',
    header: '-mt-6 pt-6 pb-6',
    heading: 'flex-auto',
    stock: 'flex-none w-full mt-2',
    button: {
      grid: ['1fr auto', '1fr 1fr auto', 'auto auto 1fr'],
      height: 42,
      borderRadius: 8,
      className: 'px-6',
      primary: {
        class: ['col-span-2', '', ''],
        backgroundColor: colors.gray[900],
        text: 'text-white font-semibold',
      },
      secondary: {
        backgroundColor: colors.white,
        borderColor: colors.gray[200],
        text: 'text-gray-900 font-semibold',
      },
      like: {
        color: colors.gray[300],
      },
    },
    size: {
      container: '',
      list: 'space-x-3',
      button: {
        activeFont: 'font-semibold',
        size: 38,
        borderRadius: 8,
        color: colors.gray[700],
        activeBackgroundColor: colors.gray[900],
        activeColor: colors.white,
      },
    },
    smallprint: {
      container: ['mt-6', 'mt-6', 'mt-6 mb-1'],
      inner: 'text-sm text-gray-700',
    },
  },
  Playful: {
    wrapper: { borderRadius: 12 },
    // container: ['p-6', 'p-6', ''],
    image: {
      width({ containerWidth, col }, css = false) {
        if (!containerWidth) return 224
        if (css) {
          return col ? 'calc(100% + 1rem)' : '224px'
        } else {
          return col ? containerWidth + 16 : 224
        }
      },
      height({ containerWidth, col }) {
        if (!containerWidth) return 305 + 16
        return col ? 191 : 305 + 16
      },
      borderRadius: 8,
      src: require('@/img/kids-jumper.jpg').default,
      originalWidth: 1200,
      originalHeight: 1700,
      className: ['-mt-2 -mx-2', '-mt-2 -mx-2', '-my-2 -ml-2'],
    },
    contentContainer: 'p-6',
    header: ['pb-4', 'pb-4', '-mt-6 pt-6 pb-4'],
    heading: 'flex-auto',
    price: 'mt-2 w-full flex-none order-1',
    stock: 'flex-none ml-3',
    button: {
      grid: ['1fr auto', '1fr 1fr auto', 'auto auto 1fr'],
      height: 46,
      borderRadius: 46 / 2,
      className: 'px-6',
      primary: {
        class: ['col-span-2', '', ''],
        backgroundColor: colors.violet[600],
        text: `text-base text-white font-medium ${pallyVariable}`,
      },
      secondary: {
        backgroundColor: colors.white,
        borderColor: colors.gray[200],
        text: `text-base text-gray-900 font-medium ${pallyVariable}`,
      },
      like: {
        color: colors.violet[600],
        backgroundColor: colors.violet[50],
        borderColor: colors.violet[50],
      },
    },
    size: {
      container: '',
      list: 'space-x-3',
      button: {
        font: `font-bold ${pallyVariable}`,
        size: 38,
        borderRadius: 38 / 2,
        borderColor: colors.white,
        color: colors.violet[400],
        activeBackgroundColor: colors.violet[600],
        activeBorderColor: colors.violet[600],
        activeColor: colors.white,
      },
    },
    smallprint: { container: 'mt-5', inner: `text-sm ${pallyVariable}` },
  },
  Elegant: {
    wrapper: { borderRadius: 0 },
    container: 'p-1.5',
    image: {
      width({ containerWidth, col }, css = false) {
        if (!containerWidth) return 210
        if (css) {
          return col ? '100%' : '210px'
        } else {
          return col ? containerWidth - 12 : 210
        }
      },
      height({ containerWidth, col }) {
        if (!containerWidth) return 305 - 12
        return col ? 177 : 305 - 12
      },
      borderRadius: 0,
      src: require('@/img/fancy-suit-jacket.jpg').default,
      originalWidth: 1200,
      originalHeight: 2128,
    },
    contentContainer: ['p-6 pt-0 -mx-1.5 -mb-1.5', 'p-6 pt-0 -mx-1.5 -mb-1.5', 'p-6 pt-0 -my-1.5'],
    header: 'py-6',
    heading: 'w-full flex-none mb-3',
    stock: 'flex-none ml-auto',
    button: {
      grid: ['1fr auto', '1fr 1fr auto', '1fr 1fr auto'],
      height: 46,
      borderRadius: 0,
      primary: {
        class: ['col-span-2', '', ''],
        backgroundColor: colors.gray[900],
        text: `text-white font-medium tracking-wide uppercase ${synonymVariable}`,
      },
      secondary: {
        backgroundColor: colors.white,
        borderColor: colors.gray[200],
        text: `text-gray-900 font-medium tracking-wide uppercase ${synonymVariable}`,
      },
      like: {
        color: colors.gray[300],
      },
    },
    size: {
      container: '',
      button: {
        font: `font-medium ${synonymVariable}`,
        size: 32,
        borderRadius: 32 / 2,
        color: colors.gray[500],
        activeBackgroundColor: colors.gray[100],
        activeColor: colors.gray[900],
      },
    },
    smallprint: {
      container: 'mt-[1.375rem]',
      inner: `text-sm ${synonymVariable}`,
    },
  },
  Brutalist: {
    wrapper: { borderRadius: 0 },
    container: ['p-4 pb-6', 'p-4 pb-6', 'p-6 pb-[1.0625rem]'],
    image: {
      width({ containerWidth, col }, css = false) {
        if (!containerWidth) return 184
        if (css) {
          return col ? '100%' : '184px'
        } else {
          return col ? containerWidth - 32 : 184
        }
      },
      height({ containerWidth, col }) {
        if (!containerWidth) return 224
        return col ? 160 : 224
      },
      borderRadius: 0,
      src: require('@/img/retro-shoe.jpg').default,
      originalWidth: 1200,
      originalHeight: 1772,
    },
    contentContainer: ['px-2', 'px-2', 'pl-8'],
    header: ['py-6', 'py-6', '-mt-6 py-6'],
    heading: 'w-full flex-none mb-2',
    stock: 'flex-auto ml-3',
    button: {
      grid: ['1fr auto', '1fr 1fr auto', 'auto auto 1fr'],
      width: 30,
      height: 46,
      borderRadius: 0,
      className: 'px-6',
      primary: {
        class: ['col-span-2', '', ''],
        backgroundColor: colors.teal[400],
        borderColor: colors.black,
        text: `text-base text-black uppercase ${ibmPlexMonoSemiBold}`,
      },
      secondary: {
        backgroundColor: colors.white,
        borderColor: colors.gray[200],
        text: `text-base text-black uppercase ${ibmPlexMonoSemiBold}`,
      },
      like: {
        container: ' ',
        className: 'justify-center',
        color: colors.black,
        borderColor: colors.white,
      },
    },
    size: {
      container: 'my-6',
      list: 'space-x-3',
      button: {
        font: ibmPlexMonoRegular,
        size: 42,
        borderRadius: 0,
        color: colors.black,
        activeBackgroundColor: colors.black,
        activeColor: colors.white,
      },
    },
    smallprint: {
      container: 'mt-4',
      inner: `${ibmPlexMonoRegular} text-xs leading-6`,
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
  const [{ width: containerWidth, col, above }, setContainerState] = useState({
    width: 0,
    col: false,
  })
  const containerRef = useRef()

  const updateWidth = useCallback(
    debounce(() => {
      if (!containerRef.current) return
      const newWidth = Math.round(containerRef.current.getBoundingClientRect().width)
      const newCol =
        window.innerWidth < 640
          ? 'sm'
          : window.innerWidth >= 1024 && window.innerWidth < 1280
          ? 'lg'
          : false
      const newAbove = window.innerWidth < 1024
      if (newWidth !== containerWidth || newCol !== col || newAbove !== above) {
        setContainerState({ width: newWidth, col: newCol, above: newAbove })
      }
    }, 300)
  )

  useEffect(() => {
    const observer = new window.ResizeObserver(updateWidth)
    observer.observe(containerRef.current)
    updateWidth()
    return () => {
      observer.disconnect()
    }
  }, [containerWidth, col, updateWidth])

  const getThemeValue = (key, defaultValue) => {
    const value = dlv(themes[theme], key, defaultValue)
    return Array.isArray(value) ? value[col === 'sm' ? 0 : col === 'lg' ? 1 : 2] : value
  }

  const getImageRadius = (key) => {
    let radius = themes[theme].image.borderRadius
    if (!Array.isArray(radius)) {
      return {
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
        borderBottomLeftRadius: radius,
      }
    }
    if (Array.isArray(radius[0])) {
      radius = radius[col === 'sm' ? 0 : col === 'lg' ? 1 : 2]
    }
    if (!Array.isArray(radius)) {
      return {
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
        borderBottomLeftRadius: radius,
      }
    }
    return {
      borderTopLeftRadius: radius[0],
      borderTopRightRadius: radius[1],
      borderBottomRightRadius: radius[2],
      borderBottomLeftRadius: radius[3],
    }
  }

  return (
    <AnimateSharedLayout>
      <div ref={containerRef} className="relative z-10 my-auto">
        {!containerWidth ? (
          <div className="bg-white rounded-tl-xl sm:rounded-t-xl lg:rounded-xl shadow-xl h-[498px] sm:h-[256px] lg:h-[448px] xl:h-[256px]" />
        ) : (
          <motion.div
            layout
            className="relative shadow-xl flex leading-none"
            initial={false}
            animate={{ borderRadius: getThemeValue('wrapper.borderRadius') }}
          >
            <motion.div
              layout
              className={`bg-white flex w-full ${col ? 'flex-col' : ''} ${getThemeValue(
                'container'
              )}`}
              initial={false}
              animate={{ borderRadius: getThemeValue('wrapper.borderRadius') }}
            >
              <div className="relative flex-none sm:self-start lg:self-auto xl:self-start">
                <motion.div
                  layout
                  className={clsx(
                    'relative z-20 overflow-hidden flex-none',
                    getThemeValue('image.className')
                  )}
                  style={{
                    width: themes[theme].image.width({ containerWidth, col }, true),
                    height: themes[theme].image.height({ containerWidth, col }),
                  }}
                  initial={false}
                  animate={getImageRadius(theme)}
                >
                  {Object.keys(themes).map((name, i) => (
                    <motion.img
                      layout
                      key={name}
                      src={themes[name].image.src}
                      alt=""
                      className="absolute max-w-none"
                      style={fit(
                        themes[theme].image.width({ containerWidth, col }),
                        themes[theme].image.height({ containerWidth, col }),
                        themes[name].image.originalWidth,
                        themes[name].image.originalHeight
                      )}
                      initial={i === 0 ? 'visible' : 'hidden'}
                      animate={theme === name ? 'visible' : prevTheme === name ? 'prev' : 'hidden'}
                      variants={imageAnimationVariants}
                    />
                  ))}
                </motion.div>
                <motion.div
                  layout
                  className={clsx(
                    'absolute z-10 bg-teal-400',
                    theme === 'Brutalist' ? 'top-1 left-1 -right-1 -bottom-1' : 'inset-px'
                  )}
                  initial={false}
                  animate={getImageRadius(theme)}
                />
              </div>
              <div
                className={`self-start flex-auto flex flex-wrap items-baseline ${getThemeValue(
                  'contentContainer'
                )}`}
              >
                <div
                  className={`w-full relative flex flex-wrap items-baseline ${
                    getThemeValue('header') || ''
                  }`}
                >
                  <motion.div
                    layout
                    className="absolute -top-44 sm:-top-0 lg:-top-44 xl:top-0 bottom-0 -left-6 -right-6 sm:-left-60 sm:-right-6 lg:-left-6 lg:-right-6 xl:-left-60 xl:-right-6 bg-black"
                    initial={false}
                    animate={{ opacity: theme === 'Brutalist' ? 1 : 0 }}
                  />
                  <div className={`relative ${themes[theme].heading}`}>
                    <motion.h2
                      layout
                      className={clsx(
                        'inline-flex text-gray-900 text-lg font-semibold',
                        theme === 'Simple' ? '' : 'absolute bottom-0 left-0'
                      )}
                      initial={false}
                      animate={{ opacity: theme === 'Simple' ? 1 : 0 }}
                    >
                      <span className="hidden sm:inline whitespace-pre">Classic </span>Utility
                      Jacket
                    </motion.h2>
                    <motion.h2
                      layout
                      className={clsx(
                        'inline-flex text-gray-900 text-base font-medium',
                        pallyVariable,
                        theme === 'Playful' ? '' : 'absolute bottom-0 left-0'
                      )}
                      initial={false}
                      animate={{ opacity: theme === 'Playful' ? 1 : 0 }}
                    >
                      Kids Jumpsuit
                    </motion.h2>
                    <motion.h2
                      layout
                      className={clsx(
                        'inline-flex text-gray-900 text-2xl leading-none',
                        sourceSerifProRegular,
                        theme === 'Elegant' ? '' : 'absolute bottom-0 left-0'
                      )}
                      initial={false}
                      animate={{ opacity: theme === 'Elegant' ? 1 : 0 }}
                    >
                      Dogtooth Style Jacket
                    </motion.h2>
                    <motion.h2
                      layout
                      className={clsx(
                        'inline-flex text-white text-2xl',
                        ibmPlexMonoSemiBold,
                        theme === 'Brutalist' ? '' : 'absolute bottom-0 left-0'
                      )}
                      initial={false}
                      animate={{ opacity: theme === 'Brutalist' ? 1 : 0 }}
                    >
                      Retro Shoe
                    </motion.h2>
                  </div>
                  <div className={clsx('relative', themes[theme].price)}>
                    <motion.div
                      className={`inline-flex text-lg font-semibold ${
                        theme === 'Simple' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'Simple' ? 1 : 0 }}
                    >
                      $110.00
                    </motion.div>
                    <motion.div
                      className={`inline-flex text-3xl font-bold text-violet-600 ${pallyVariable} ${
                        theme === 'Playful' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'Playful' ? 1 : 0 }}
                    >
                      $39.00
                    </motion.div>
                    <motion.div
                      className={clsx(
                        'inline-flex text-lg text-gray-500 font-medium',
                        synonymVariable,
                        theme === 'Elegant' ? '' : 'absolute bottom-0 left-0'
                      )}
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'Elegant' ? 1 : 0 }}
                    >
                      $350.00
                    </motion.div>
                    <motion.div
                      className={clsx(
                        'inline-flex text-white text-base',
                        ibmPlexMonoSemiBold,
                        theme === 'Brutalist' ? '' : 'absolute bottom-0 left-0'
                      )}
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'Brutalist' ? 1 : 0 }}
                    >
                      $89.00
                    </motion.div>
                  </div>
                  <div className={clsx('relative whitespace-nowrap', themes[theme].stock)}>
                    <motion.div
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'Simple' ? 1 : 0 }}
                      className={`inline-flex text-sm font-medium text-gray-700 ${
                        theme === 'Simple' ? '' : 'absolute bottom-0 left-0'
                      }`}
                    >
                      In stock
                    </motion.div>
                    <motion.div
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'Playful' ? 1 : 0 }}
                      className={`inline-flex text-base font-medium text-gray-400 ${pallyVariable} ${
                        theme === 'Playful' ? '' : 'absolute bottom-0 left-0'
                      }`}
                    >
                      In stock
                    </motion.div>
                    <motion.div
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'Elegant' ? 1 : 0 }}
                      className={`inline-flex text-xs leading-6 text-gray-500 font-medium uppercase ${synonymVariable} ${
                        theme === 'Elegant' ? '' : 'absolute bottom-0 left-0'
                      }`}
                    >
                      In stock
                    </motion.div>
                    <motion.div
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'Brutalist' ? 1 : 0 }}
                      className={clsx(
                        'inline-flex text-teal-400 text-base uppercase',
                        ibmPlexMonoRegular,
                        theme === 'Brutalist' ? '' : 'absolute bottom-0 left-0'
                      )}
                    >
                      In stock
                    </motion.div>
                  </div>
                </div>
                <div
                  className={clsx(
                    'w-full flex-none flex items-center',
                    getThemeValue('size.container')
                  )}
                >
                  <motion.ul className={clsx('flex text-sm', themes[theme].size.list)}>
                    {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                      <motion.li
                        layout
                        key={size}
                        className="relative flex-none flex items-center justify-center cursor-pointer"
                        style={{
                          width: themes[theme].size.button.size,
                          height: themes[theme].size.button.size,
                        }}
                        initial={false}
                        animate={{
                          color:
                            size === 'XS'
                              ? themes[theme].size.button.activeColor
                              : themes[theme].size.button.color,
                        }}
                      >
                        {size === 'XS' && (
                          <motion.div
                            layout
                            initial={false}
                            className={clsx(
                              'absolute bg-teal-400',
                              theme === 'Brutalist'
                                ? 'top-0.5 left-0.5 -right-0.5 -bottom-0.5'
                                : 'inset-px'
                            )}
                            animate={{
                              borderRadius: themes[theme].size.button.borderRadius,
                            }}
                          />
                        )}
                        <motion.div
                          layout
                          initial={false}
                          className="absolute inset-0 border-2"
                          animate={{
                            borderRadius: themes[theme].size.button.borderRadius,
                            borderColor:
                              (size === 'XS'
                                ? themes[theme].size.button.activeBorderColor
                                : themes[theme].size.button.borderColor) ||
                              (size === 'XS'
                                ? themes[theme].size.button.activeBackgroundColor
                                : '#fff'),
                            ...(size === 'XS'
                              ? {
                                  backgroundColor: themes[theme].size.button.activeBackgroundColor,
                                }
                              : {}),
                          }}
                        />
                        {Object.keys(themes).map((name) => (
                          <motion.span
                            key={name}
                            className={`absolute inset-0 flex items-center justify-center ${
                              size === 'XS'
                                ? themes[name].size.button.activeFont ||
                                  themes[name].size.button.font
                                : themes[name].size.button.font
                            } ${theme === name ? '' : 'pointer-events-none'}`}
                            initial={false}
                            animate={{ opacity: theme === name ? 1 : 0 }}
                          >
                            {size === 'XS' && name === 'Brutalist' ? (
                              <>
                                {/* <span className="absolute w-0.5 bg-teal-400 left-full ml-0.5 top-0 -bottom-1" />
                                <span className="absolute h-0.5 bg-teal-400 top-full mt-0.5 left-0 -right-1" /> */}
                                {size}
                              </>
                            ) : (
                              size
                            )}
                          </motion.span>
                        ))}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                <motion.div
                  layout
                  className={clsx(
                    'w-full h-px bg-gray-200',
                    theme === 'Brutalist' ? '-mt-px' : 'my-6'
                  )}
                  initial={false}
                  animate={{ opacity: theme === 'Brutalist' ? 0 : 1 }}
                />
                <div
                  className="flex-none w-full grid gap-4 text-center"
                  style={{ gridTemplateColumns: getThemeValue('button.grid') }}
                >
                  <div className={`relative ${getThemeValue('button.primary.class')}`}>
                    <motion.div
                      layout
                      className={clsx(
                        'relative text-sm border-2 cursor-pointer flex items-center justify-center whitespace-nowrap',
                        themes[theme].button.primary.className || themes[theme].button.className
                      )}
                      style={{ height: getThemeValue('button.height') }}
                      initial={false}
                      animate={{
                        backgroundColor: themes[theme].button.primary.backgroundColor,
                        borderColor:
                          themes[theme].button.primary.borderColor ||
                          themes[theme].button.primary.backgroundColor,
                        borderRadius: themes[theme].button.borderRadius,
                      }}
                    >
                      {Object.keys(themes).map((name, i) => (
                        <motion.span
                          key={name}
                          className={clsx(
                            'flex items-center justify-center',
                            themes[name].button.primary.text,
                            theme === name ? '' : 'absolute'
                          )}
                          initial={false}
                          animate={{ opacity: theme === name ? 1 : 0 }}
                        >
                          <motion.span layout>Buy now</motion.span>
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                  <div className="relative">
                    <motion.div
                      layout
                      className={clsx(
                        'relative text-sm border cursor-pointer flex items-center justify-center whitespace-nowrap',
                        themes[theme].button.secondary.className || themes[theme].button.className
                      )}
                      style={{ height: getThemeValue('button.height') }}
                      initial={false}
                      animate={{
                        backgroundColor: themes[theme].button.secondary.backgroundColor,
                        borderColor:
                          themes[theme].button.secondary.borderColor ||
                          themes[theme].button.secondary.backgroundColor,
                        borderRadius: themes[theme].button.borderRadius,
                      }}
                    >
                      {Object.keys(themes).map((name, i) => (
                        <motion.span
                          key={name}
                          className={clsx(
                            'w-full flex-none flex items-center justify-center',
                            themes[name].button.secondary.text,
                            theme === name ? '' : 'absolute'
                          )}
                          initial={false}
                          animate={{ opacity: theme === name ? 1 : 0 }}
                        >
                          <motion.span layout>Add to bag</motion.span>
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                  <div
                    className={clsx('flex', themes[theme].button.like.container || 'justify-end')}
                  >
                    <motion.div
                      layout
                      className={`flex items-center border cursor-pointer ${
                        themes[theme].button.like.className || 'justify-center'
                      }`}
                      style={{
                        width: getThemeValue('button.width', getThemeValue('button.height')),
                        height: getThemeValue('button.height'),
                      }}
                      initial={false}
                      animate={{
                        backgroundColor:
                          themes[theme].button.like.backgroundColor ||
                          themes[theme].button.secondary.backgroundColor,
                        borderColor:
                          themes[theme].button.like.borderColor ||
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
                </div>
                <div className={`relative w-full ${getThemeValue('smallprint.container') || ''}`}>
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
                      <span>
                        Free shipping on all
                        <span className="hidden sm:inline"> continental US</span> orders.
                      </span>
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimateSharedLayout>
  )
}
