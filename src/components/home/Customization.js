import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/customization.svg'
import { useState } from 'react'
import { siteConfig } from '@/utils/siteConfig'
import { AnimatePresence, motion } from 'framer-motion'
import { font as poppinsRegular } from '../../fonts/generated/Poppins-Regular.module.css'
import { font as poppinsExtraBold } from '../../fonts/generated/Poppins-ExtraBold.module.css'
import { font as tenorSansRegular } from '../../fonts/generated/TenorSans-Regular.module.css'
import { font as robotoMonoRegular } from '../../fonts/generated/RobotoMono-Regular.module.css'

const themes = {
  simple: {
    font: 'Inter',
    classNameDisplay: 'font-semibold',
    primaryColor: 'indigo',
    secondaryColorTitle: 'bg-gray-{50-900}',
    secondaryColor: 'gray',
  },
  playful: {
    font: 'Poppins',
    classNameDisplay: poppinsExtraBold,
    classNameBody: `${poppinsRegular} text-sm leading-5`,
    primaryColor: 'purple',
    secondaryColorTitle: 'bg-secondary-{50-900}',
    secondaryColor: 'pink',
  },
  elegant: {
    font: 'Tenor Sans',
    classNameDisplay: tenorSansRegular,
    primaryColor: 'gray',
    secondaryColorTitle: 'bg-accent-{50-900}',
    secondaryColor: 'amber',
  },
  brutalist: {
    font: 'Roboto Mono',
    classNameDisplay: robotoMonoRegular,
    classNameBody: `${robotoMonoRegular} text-xs leading-5`,
    primaryColor: 'lime',
    secondaryColorTitle: 'bg-gray-{50-900}',
    secondaryColor: 'gray',
  },
}

export function Customization() {
  const [theme, setTheme] = useState('simple')

  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.pink} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-rose-400 mb-3">
          Customization
        </Caption>
        <BigText className="mb-8">Extend it, tweak it, change it.</BigText>
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
        <Link href="#" className="text-rose-400">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="pink"
        rotate={-1}
        header={
          <div className="-ml-4">
            <Tabs
              tabs={{
                simple: 'Simple',
                playful: 'Playful',
                elegant: 'Elegant',
                brutalist: 'Brutalist',
              }}
              selected={theme}
              onChange={setTheme}
              className="justify-center lg:justify-start"
            />
          </div>
        }
        left={
          <div
            className="relative z-10 rounded-xl shadow-lg lg:-mr-8 divide-y-2 divide-rose-100 flex flex-col"
            style={{ height: 374 }}
          >
            <section className="flex">
              <h3 className="flex-none w-48 bg-rose-50 rounded-tl-xl text-lg leading-6 font-semibold text-rose-800 p-8">
                Typography
              </h3>
              <dl className="flex-auto bg-white rounded-tr-xl p-6 space-y-6">
                <div className="space-y-1">
                  <dt className="font-mono text-xs leading-4">font-display</dt>
                  <AnimatePresence initial={false} exitBeforeEnter>
                    <motion.dd
                      key={theme}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-2xl leading-7 text-black ${
                        themes[theme].classNameDisplay || ''
                      }`}
                    >
                      {themes[theme].font}
                    </motion.dd>
                  </AnimatePresence>
                </div>
                <div className="space-y-1">
                  <dt className="font-mono text-xs leading-4">font-body</dt>
                  <AnimatePresence initial={false} exitBeforeEnter>
                    <motion.dd
                      key={theme}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-gray-600 ${
                        themes[theme].classNameBody || 'text-sm leading-5'
                      }`}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mi ultrices non
                      pharetra, eros enim. Habitant suspendisse ultricies.
                    </motion.dd>
                  </AnimatePresence>
                </div>
              </dl>
            </section>
            <section className="flex overflow-hidden">
              <h3 className="flex-none w-48 bg-rose-50 rounded-bl-xl text-lg leading-6 font-semibold text-rose-800 p-8">
                Color
              </h3>
              <div className="relative flex-auto bg-white rounded-br-xl overflow-hidden">
                <dl className="p-6 space-y-6">
                  <div className="space-y-2">
                    <dt className="font-mono text-xs leading-4">{'bg-primary-{50-900}'}</dt>
                    <dd>
                      <ul className="flex -space-x-1">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((key, i, colors) => (
                          <motion.li
                            key={key}
                            className="w-8 h-8 rounded-full"
                            initial={false}
                            animate={{
                              backgroundColor:
                                siteConfig.theme.colors[themes[theme].primaryColor][key],
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
                        className="font-mono text-xs leading-4"
                      >
                        {themes[theme].secondaryColorTitle}
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
                              backgroundColor:
                                siteConfig.theme.colors[themes[theme].secondaryColor][key],
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
                <div className="absolute z-10 bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white pointer-events-none" />
              </div>
            </section>
          </div>
        }
        right={
          <CodeWindow className="bg-rose-500">
            <CodeWindow.Code />
          </CodeWindow>
        }
      />
    </section>
  )
}
