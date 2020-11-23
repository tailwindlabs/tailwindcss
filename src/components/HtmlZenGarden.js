import { AnimateSharedLayout, motion } from 'framer-motion'
import { font as poppinsRegular } from '../fonts/generated/Poppins-Regular.module.css'
import { font as poppinsSemiBold } from '../fonts/generated/Poppins-SemiBold.module.css'
import { font as poppinsBold } from '../fonts/generated/Poppins-Bold.module.css'
import { font as poppinsMedium } from '../fonts/generated/Poppins-Medium.module.css'
import { font as tenorSansRegular } from '../fonts/generated/TenorSans-Regular.module.css'
import { font as robotoMonoRegular } from '../fonts/generated/RobotoMono-Regular.module.css'
import { font as robotoMonoBold } from '../fonts/generated/RobotoMono-Bold.module.css'
import { font as robotoMonoMedium } from '../fonts/generated/RobotoMono-Medium.module.css'
import { usePrevious } from '@/hooks/usePrevious'
import styles from './HtmlZenGarden.module.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'debounce'
import dlv from 'dlv'
import { fit } from '@/utils/fit'
import clsx from 'clsx'

const themes = {
  simple: {
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
        if (!containerWidth) return 256
        return col ? 192 : 256
      },
      borderRadius: 0,
      src: require('@/img/classic-utility-jacket.jpg').default,
      originalWidth: 1200,
      originalHeight: 1600,
    },
    contentContainer: ['pt-6 pb-4 px-4', 'pt-6 pb-4 px-4', 'p-6'],
    header: ['-mt-6 py-6', '-mt-6 py-6', '-mt-6 pt-6 pb-4'],
    heading: 'flex-auto',
    stock: 'flex-none w-full mt-2',
    button: {
      grid: ['1fr auto', '1fr 1fr auto', '1fr 1fr auto'],
      height: 38,
      borderRadius: 6,
      primary: {
        class: ['col-span-2', '', ''],
        backgroundColor: '#000',
        text: 'text-white font-medium',
      },
      secondary: {
        backgroundColor: '#fff',
        borderColor: '#d4d4d8',
        text: 'text-black font-medium',
      },
      like: {
        color: '#a1a1aa',
      },
    },
    size: {
      container: 'mb-6',
      button: {
        font: 'font-medium',
        size: 38,
        borderRadius: 8,
        color: '#71717a',
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
      inner: 'text-sm',
    },
  },
  playful: {
    wrapper: { borderRadius: 12 },
    container: ['p-6 pb-2.5', 'p-6', 'p-6'],
    image: {
      width({ containerWidth, col }, css = false) {
        if (!containerWidth) return 168
        if (css) {
          return col ? '100%' : '168px'
        } else {
          return col ? containerWidth - 48 : 168
        }
      },
      height({ containerWidth, col }) {
        if (!containerWidth) return 238
        return col ? 168 : 238
      },
      borderRadius: 8,
      src: require('@/img/kids-jumper.jpg').default,
      originalWidth: 1200,
      originalHeight: 1700,
    },
    contentContainer: ['', '', 'pl-6'],
    header: ['pt-6 pb-5', 'pt-6 pb-5', '-mt-6 py-6'],
    heading: 'w-full flex-none mb-2.5',
    stock: 'ml-3',
    button: {
      grid: ['1fr auto', '1fr 1fr auto', '1fr 1fr auto'],
      height: 38,
      borderRadius: 19,
      primary: {
        class: ['col-span-2', '', ''],
        backgroundColor: '#7e22ce',
        text: `text-white ${poppinsSemiBold}`,
      },
      secondary: {
        backgroundColor: '#faf5ff',
        text: `text-purple-700 ${poppinsSemiBold}`,
      },
      like: {
        color: '#9333ea',
      },
    },
    size: {
      container: ['mb-6', 'mb-6', 'mt-2 mb-8'],
      button: {
        font: poppinsMedium,
        size: 38,
        borderRadius: 19,
        borderColor: '#f4f4f5',
        color: 'rgba(0, 0, 0, 0.5)',
        activeBackgroundColor: '#7e22ce',
        activeBorderColor: '#7e22ce',
        activeColor: '#fff',
      },
      guide: {
        container: 'ml-3',
        inner: `text-sm underline ${poppinsRegular}`,
        color: '#71717a',
      },
    },
    smallprint: { container: ['mt-4 mb-0.5', 'mt-4', 'mt-4'], inner: `text-sm ${poppinsRegular}` },
  },
  elegant: {
    wrapper: { borderRadius: 0 },
    container: 'p-1',
    image: {
      width({ containerWidth, col }, css = false) {
        if (!containerWidth) return 172
        if (css) {
          return col ? '100%' : '172px'
        } else {
          return col ? containerWidth - 8 : 172
        }
      },
      height({ containerWidth, col }) {
        if (!containerWidth) return 305
        return col ? 188 : 305
      },
      borderRadius: 0,
      src: require('@/img/fancy-suit-jacket.jpg').default,
      originalWidth: 1200,
      originalHeight: 2128,
    },
    contentContainer: [
      'px-6 pt-0 pb-3 -mx-1 -mb-1',
      'px-6 pt-0 pb-3 -mx-1 -mb-1',
      'p-8 pt-0 -my-1',
    ],
    header: ['pt-6 pb-4', 'pt-6 pb-4', 'py-8'],
    heading: 'w-full flex-none mb-1.5',
    stock: 'ml-3',
    button: {
      grid: ['1fr auto', '1fr 1fr auto', '1fr 1fr auto'],
      height: [38, 38, 50],
      borderRadius: 0,
      primary: {
        class: ['col-span-2', '', ''],
        backgroundColor: '#000',
        text: 'text-white font-semibold tracking-wide uppercase',
      },
      secondary: {
        backgroundColor: '#fff',
        borderColor: '#e4e4e7',
        text: 'text-black font-semibold tracking-wide uppercase',
      },
      like: {
        color: '#18181b',
      },
    },
    size: {
      container: 'mb-4 pt-4 border-t border-gray-100',
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
      container: ['mt-4 border-b border-transparent', 'mt-4 border-b border-transparent', 'mt-3'],
      inner: 'text-xs leading-4',
    },
  },
  brutalist: {
    wrapper: { borderRadius: 0 },
    container: ['p-6', 'p-6', 'py-6 pl-8 pr-4'],
    image: {
      width({ containerWidth, col }, css = false) {
        if (!containerWidth) return 168
        if (css) {
          return col ? '100%' : '168px'
        } else {
          return col ? containerWidth - 48 : 168
        }
      },
      height({ containerWidth, col }) {
        if (!containerWidth) return 248
        return col ? 160 : 248
      },
      borderRadius: 0,
      src: require('@/img/retro-shoe.jpg').default,
      originalWidth: 1200,
      originalHeight: 1772,
    },
    contentContainer: ['', '', 'pl-8'],
    header: ['py-4', 'py-4', '-mt-6 py-6'],
    heading: 'w-full flex-none mb-2',
    stock: 'ml-3',
    button: {
      grid: ['1fr auto', '1fr 1fr auto', '1fr 1fr auto'],
      height: 38,
      borderRadius: 0,
      primary: {
        class: ['col-span-2', '', ''],
        backgroundColor: '#bef264',
        borderColor: '#000',
        text: `text-black tracking-wide uppercase ${robotoMonoBold}`,
      },
      secondary: {
        backgroundColor: '#fff',
        borderColor: '#000',
        text: `text-black tracking-wide uppercase ${robotoMonoBold}`,
      },
      like: {
        className: 'justify-end -ml-2.5',
        color: '#000',
        borderColor: '#fff',
      },
    },
    size: {
      container: ['my-15px', 'my-15px', 'my-23px'],
      button: {
        font: robotoMonoRegular,
        activeFont: robotoMonoBold,
        size: 38,
        borderRadius: 19,
        color: '#71717a',
        activeBackgroundColor: '#fff',
        activeColor: '#000',
      },
      guide: {
        container: 'ml-5',
        inner: `text-xs underline ${robotoMonoRegular}`,
        color: '#000',
      },
    },
    smallprint: {
      container: [
        'mt-4 border-b-2 border-transparent',
        'mt-4 border-b-2 border-transparent',
        'mt-4',
      ],
      inner: `${robotoMonoRegular} text-xs leading-5`,
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

  const getThemeValue = (key) => {
    const value = dlv(themes[theme], key)
    return Array.isArray(value) ? value[col === 'sm' ? 0 : col === 'lg' ? 1 : 2] : value
  }

  return (
    <AnimateSharedLayout>
      <div ref={containerRef} className="relative z-10 lg:-mr-8">
        {!containerWidth ? (
          <div
            className={`${styles.placeholder} bg-white rounded-tl-xl sm:rounded-t-xl lg:rounded-xl shadow-lg`}
          />
        ) : (
          <motion.div
            layout
            className="relative shadow-lg flex leading-none"
            initial={false}
            animate={{
              borderTopLeftRadius: getThemeValue('wrapper.borderRadius'),
              borderTopRightRadius: col === 'sm' ? 0 : getThemeValue('wrapper.borderRadius'),
              borderBottomLeftRadius: above ? 0 : getThemeValue('wrapper.borderRadius'),
              borderBottomRightRadius: above ? 0 : getThemeValue('wrapper.borderRadius'),
            }}
          >
            <motion.div
              layout
              className={`bg-white overflow-hidden flex w-full ${
                col ? 'flex-col' : ''
              } ${getThemeValue('container')}`}
              initial={false}
              animate={{
                borderTopLeftRadius: getThemeValue('wrapper.borderRadius'),
                borderTopRightRadius: col === 'sm' ? 0 : getThemeValue('wrapper.borderRadius'),
                borderBottomLeftRadius: above ? 0 : getThemeValue('wrapper.borderRadius'),
                borderBottomRightRadius: above ? 0 : getThemeValue('wrapper.borderRadius'),
              }}
            >
              <motion.div
                layout
                className="relative z-20 overflow-hidden flex-none"
                style={{
                  width: themes[theme].image.width({ containerWidth, col }, true),
                  height: themes[theme].image.height({ containerWidth, col }),
                }}
                initial={false}
                animate={{ borderRadius: themes[theme].image.borderRadius }}
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
                className="relative z-10 flex-none bg-lime-300 border border-lime-200"
                style={{
                  width: themes[theme].image.width({ containerWidth, col }, true),
                  height: themes[theme].image.height({ containerWidth, col }),
                  top: theme === 'brutalist' ? '0.1875rem' : 0,
                  left: theme === 'brutalist' ? '0.1875rem' : 0,
                  ...(containerWidth
                    ? col
                      ? { marginTop: -themes[theme].image.height({ containerWidth, col }) }
                      : {
                          marginLeft: `-${themes[theme].image.width(
                            { containerWidth, col },
                            true
                          )}`,
                        }
                    : {}),
                }}
                initial={false}
                animate={{ borderRadius: Math.max(0, getThemeValue('image.borderRadius') - 1) }}
              />
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
                    className="absolute -top-96 bottom-0 -left-96 -right-96 bg-black"
                    initial={false}
                    animate={{ opacity: theme === 'brutalist' ? 1 : 0 }}
                  />
                  <div className={`relative ${themes[theme].heading}`}>
                    <motion.h2
                      layout
                      className={`inline-flex text-black text-xl font-semibold ${
                        theme === 'simple' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      initial={false}
                      animate={{ opacity: theme === 'simple' ? 1 : 0 }}
                    >
                      <span className="hidden sm:inline whitespace-pre">Classic </span>Utility
                      Jacket
                    </motion.h2>
                    <motion.h2
                      layout
                      className={`inline-flex text-black text-base font-semibold ${poppinsSemiBold} ${
                        theme === 'playful' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      initial={false}
                      animate={{ opacity: theme === 'playful' ? 1 : 0 }}
                    >
                      Kids Jumpsuit
                    </motion.h2>
                    <motion.h2
                      layout
                      className={`inline-flex text-black ${
                        col ? 'text-2xl' : 'text-3xl'
                      } ${tenorSansRegular} ${
                        theme === 'elegant' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      initial={false}
                      animate={{ opacity: theme === 'elegant' ? 1 : 0 }}
                    >
                      Fancy Suit Jacket
                    </motion.h2>
                    <motion.h2
                      layout
                      className={`inline-flex text-white text-2xl leading-7 ${robotoMonoBold} ${
                        theme === 'brutalist' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      initial={false}
                      animate={{ opacity: theme === 'brutalist' ? 1 : 0 }}
                    >
                      Retro Shoe
                    </motion.h2>
                  </div>
                  <div className="relative">
                    <motion.div
                      className={`inline-flex text-xl font-semibold ${
                        theme === 'simple' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'simple' ? 1 : 0 }}
                    >
                      $110.00
                    </motion.div>
                    <motion.div
                      className={`inline-flex text-4xl leading-7 font-bold text-purple-600 ${poppinsBold} ${
                        theme === 'playful' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'playful' ? 1 : 0 }}
                    >
                      $39.00
                    </motion.div>
                    <motion.div
                      className={`inline-flex text-lg leading-6 text-black ${tenorSansRegular} ${
                        theme === 'elegant' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'elegant' ? 1 : 0 }}
                    >
                      $600.00
                    </motion.div>
                    <motion.div
                      className={`inline-flex text-2xl leading-7 text-white ${robotoMonoBold} ${
                        theme === 'brutalist' ? '' : 'absolute bottom-0 left-0'
                      }`}
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'brutalist' ? 1 : 0 }}
                    >
                      $89.00
                    </motion.div>
                  </div>
                  <div className={`relative flex-auto ${themes[theme].stock}`}>
                    <motion.div
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'simple' ? 1 : 0 }}
                      className={`inline-flex text-sm font-medium text-gray-500 ${
                        theme === 'simple' ? '' : 'absolute bottom-0 left-0'
                      }`}
                    >
                      In stock
                    </motion.div>
                    <motion.div
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'playful' ? 1 : 0 }}
                      className={`inline-flex text-sm font-medium text-gray-400 ${poppinsMedium} ${
                        theme === 'playful' ? '' : 'absolute bottom-0 left-0'
                      }`}
                    >
                      In stock
                    </motion.div>
                    <motion.div
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'elegant' ? 1 : 0 }}
                      className={`inline-flex text-sm text-gray-500 ${tenorSansRegular} ${
                        theme === 'elegant' ? '' : 'absolute bottom-0 left-0'
                      }`}
                    >
                      In stock
                    </motion.div>
                    <motion.div
                      layout
                      initial={false}
                      animate={{ opacity: theme === 'brutalist' ? 1 : 0 }}
                      className={`inline-flex text-sm text-lime-300 ${robotoMonoMedium} ${
                        theme === 'brutalist' ? '' : 'absolute bottom-0 left-0'
                      }`}
                    >
                      In stock
                    </motion.div>
                  </div>
                </div>
                <div
                  className={`w-full flex-none flex items-center ${getThemeValue(
                    'size.container'
                  )}`}
                >
                  <motion.ul layout className="flex text-sm space-x-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                      <motion.li
                        key={size}
                        className={clsx(
                          'relative flex-none items-center justify-center border-2 cursor-pointer',
                          {
                            'hidden sm:flex': size === 'S' || size === 'XL',
                            flex: size !== 'S' && size !== 'XL',
                          }
                        )}
                        style={{
                          width: themes[theme].size.button.size,
                          height: themes[theme].size.button.size,
                        }}
                        initial={false}
                        animate={{
                          borderRadius: themes[theme].size.button.borderRadius,
                          borderColor:
                            (size === 'XS'
                              ? themes[theme].size.button.activeBorderColor
                              : themes[theme].size.button.borderColor) ||
                            (size === 'XS'
                              ? themes[theme].size.button.activeBackgroundColor
                              : '#fff'),
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
                              size === 'XS'
                                ? themes[name].size.button.activeFont ||
                                  themes[name].size.button.font
                                : themes[name].size.button.font
                            } ${theme === name ? '' : 'pointer-events-none'}`}
                            initial={false}
                            animate={{ opacity: theme === name ? 1 : 0 }}
                          >
                            {size === 'XS' && name === 'brutalist' ? (
                              <>
                                <span className="absolute w-6 h-1 bg-lime-300 left-1/2 -ml-3 bottom-2.5" />
                                <span className="relative hidden sm:inline">XS</span>
                                <span className="relative sm:hidden">S</span>
                              </>
                            ) : size === 'XS' ? (
                              <>
                                <span className="hidden sm:inline">XS</span>
                                <span className="sm:hidden">S</span>
                              </>
                            ) : (
                              size
                            )}
                          </motion.span>
                        ))}
                      </motion.li>
                    ))}
                  </motion.ul>
                  <div
                    className={`relative whitespace-nowrap ${
                      themes[theme].size.guide.container || ''
                    }`}
                  >
                    {Object.keys(themes).map((name) => (
                      <motion.div
                        layout
                        key={name}
                        className={`inline-flex leading-5 cursor-pointer ${
                          themes[name].size.guide.inner || ''
                        } ${theme === name ? '' : 'absolute bottom-0 left-0'}`}
                        initial={false}
                        animate={{
                          opacity: theme === name ? 1 : 0,
                          color: themes[name].size.guide.color || '#71717a',
                        }}
                      >
                        Size Guide
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div
                  className="flex-none w-full grid gap-3 text-center"
                  style={{ gridTemplateColumns: getThemeValue('button.grid') }}
                >
                  <div className={`relative ${getThemeValue('button.primary.class')}`}>
                    <motion.div
                      layout
                      className={`absolute bg-black ${
                        theme === 'brutalist'
                          ? 'top-0.5 -right-0.5 -bottom-0.5 left-0.5'
                          : 'inset-px'
                      }`}
                      initial={false}
                      animate={{
                        borderRadius: themes[theme].button.borderRadius,
                      }}
                    />
                    <motion.div
                      layout
                      className="relative text-sm border cursor-pointer"
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
                      {Object.keys(themes).map((name) => (
                        <motion.span
                          key={name}
                          className={`absolute inset-0 flex items-center justify-center ${themes[name].button.primary.text}`}
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
                      className={`absolute bg-black ${
                        theme === 'brutalist'
                          ? 'top-0.5 -right-0.5 -bottom-0.5 left-0.5'
                          : 'inset-px'
                      }`}
                      initial={false}
                      animate={{
                        borderRadius: themes[theme].button.borderRadius,
                      }}
                    />
                    <motion.div
                      layout
                      className="relative text-sm border cursor-pointer"
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
                      {Object.keys(themes).map((name) => (
                        <motion.span
                          key={name}
                          className={`absolute inset-0 flex items-center justify-center ${themes[name].button.secondary.text}`}
                          initial={false}
                          animate={{ opacity: theme === name ? 1 : 0 }}
                        >
                          <motion.span layout>Add to bag</motion.span>
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                  <motion.div
                    layout
                    className={`flex items-center border cursor-pointer ${
                      themes[theme].button.like.className || 'justify-center'
                    }`}
                    style={{
                      width: getThemeValue('button.height'),
                      height: getThemeValue('button.height'),
                    }}
                    initial={false}
                    animate={{
                      backgroundColor: themes[theme].button.secondary.backgroundColor,
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
