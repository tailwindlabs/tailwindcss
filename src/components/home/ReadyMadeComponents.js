import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/ready-made-components.svg'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

function AnimatedImage({ initial = {}, ...props }) {
  const { inView, ref } = useInView({ threshold: 0.5, triggerOnce: false })

  return (
    <motion.img
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...initial }}
      transition={{ duration: 1 }}
      {...props}
    />
  )
}

export function ReadyMadeComponents() {
  return (
    <section>
      <div className="px-4 sm:px-6 md:px-8 mb-20">
        <IconContainer className={`${gradients.violet[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-violet-600 mb-3">
          Ready-made components
        </Caption>
        <BigText className="mb-8">Move even faster with Tailwind UI.</BigText>
        <Paragraph className="mb-6">
          Tailwind UI is a collection of beautiful, fully responsive UI components, designed and
          developed by us, the creators of Tailwind CSS. It's got hundreds of ready-to-use examples
          to choose from, and is guaranteed to help you find the perfect starting point for what you
          want to build.
        </Paragraph>
        <Link href="#" className="text-violet-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="violet"
        rotate={-2}
        left={
          <div className="-mx-8">
            <div className="relative" style={{ paddingTop: `${(1811 / 3771) * 100}%` }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 3771 1811" fill="none">
                <defs>
                  <clipPath id="foo">
                    <rect x="2028" y="1214" width="256" height="500" rx="8" />
                    <rect x="1716" y="1030" width="280" height="535" rx="8" />
                    <rect x="1716" y="934" width="1276" height="64" rx="8" />
                    <rect x="2028" y="1030" width="380" height="152" rx="8" />
                    <rect x="2428" y="1030" width="380" height="152" rx="8" />
                    <rect x="2828" y="1030" width="380" height="152" rx="8" />
                    <rect x="799" y="307" width="885" height="595" rx="8" />
                    <rect x="244" y="934" width="1440" height="778" rx="8" />
                    <rect x="2808" y="1214" width="880" height="361" rx="8" />
                    <rect x="1716" y="449" width="1440" height="453" rx="8" />
                  </clipPath>
                </defs>
                <image
                  clipPath="url(#foo)"
                  xlinkHref={require('@/img/tailwindui.jpg').default}
                  width="3771"
                  height="1811"
                />
              </svg>
              <AnimatedImage
                src={require('@/img/tailwindui-table.png').default}
                alt=""
                className="absolute shadow-2xl rounded-md"
                style={{
                  top: 0,
                  left: `${(1356 / 3771) * 100}%`,
                  width: `${(1410 / 3771) * 100}%`,
                }}
                initial={{ y: '-20%' }}
              />
              <AnimatedImage
                src={require('@/img/tailwindui-workcation.png').default}
                alt=""
                className="absolute shadow-2xl rounded-md"
                style={{
                  right: 0,
                  top: `${(377 / 1811) * 100}%`,
                  width: `${(819 / 3771) * 100}%`,
                }}
                initial={{ x: '10%' }}
              />
              <AnimatedImage
                src={require('@/img/tailwindui-form.png').default}
                alt=""
                className="absolute shadow-2xl rounded-md"
                style={{
                  bottom: 0,
                  left: `${(2300 / 3771) * 100}%`,
                  width: `${(690 / 3771) * 100}%`,
                }}
                initial={{ y: '15%' }}
              />
              <AnimatedImage
                src={require('@/img/tailwindui-projects.png').default}
                alt=""
                className="absolute shadow-2xl rounded-md"
                style={{
                  left: 0,
                  top: `${(462 / 1811) * 100}%`,
                  width: `${(1057 / 3771) * 100}%`,
                }}
                initial={{ x: '-10%' }}
              />
            </div>
          </div>
        }
      />
    </section>
  )
}
