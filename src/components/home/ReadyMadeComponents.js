import { IconContainer, Caption, BigText, Paragraph, Link, Widont } from '@/components/home/common'
import iconUrl from '@/img/icons/home/ready-made-components.png'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { GridLockup } from '../GridLockup'

function AnimatedImage({ animate = false, delay = 0, ...props }) {
  return (
    <motion.img
      initial={false}
      animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay }}
      alt=""
      {...props}
    />
  )
}

const w = 1213
const h = 675

const getStyle = (x, y, width) => ({
  top: `${(y / h) * 100}%`,
  left: `${(x / w) * 100}%`,
  width: `${(width / w) * 100}%`,
})

const images = [
  { src: require('@/img/tailwindui/0.png').default, x: 27, y: 24, width: 236 },
  { src: require('@/img/tailwindui/1.png').default, x: 287, y: 0, width: 567 },
  { src: require('@/img/tailwindui/2.png').default, x: 878, y: 47, width: 308 },
  { src: require('@/img/tailwindui/3.jpg').default, x: 0, y: 289, width: 472 },
  { src: require('@/img/tailwindui/4.jpg').default, x: 496, y: 289, width: 441 },
  { src: require('@/img/tailwindui/5.png').default, x: 961, y: 289, width: 252 },
]

export function ReadyMadeComponents() {
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5, triggerOnce: true })

  return (
    <section id="ready-made-components">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer>
          <img src={iconUrl} alt="" />
        </IconContainer>
        <Caption className="text-indigo-500">Ready-made components</Caption>
        <BigText>
          <Widont>Move even faster with Tailwind UI.</Widont>
        </BigText>
        <Paragraph>
          Tailwind UI is a collection of beautiful, fully responsive UI components, designed and
          developed by us, the creators of Tailwind CSS. It's got hundreds of ready-to-use examples
          to choose from, and is guaranteed to help you find the perfect starting point for what you
          want to build.
        </Paragraph>
        <Link href="https://tailwindui.com/" color="indigo">
          Learn more
        </Link>
      </div>
      <GridLockup
        className="mt-10"
        beams={0}
        overhang="lg"
        leftProps={{
          style: {
            maskImage: 'linear-gradient(to bottom, white, white, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, white, white, transparent)',
          },
        }}
        left={
          <div ref={inViewRef} className="flex justify-center">
            <div className="w-[216%] ml-[28%] flex-none sm:w-[76rem] sm:ml-0">
              <div className="relative" style={{ paddingTop: `${(h / w) * 100}%` }}>
                {images.map(({ src, x, y, width }, index) => (
                  <AnimatedImage
                    key={src}
                    animate={inView}
                    delay={index * 0.2}
                    src={src}
                    className="absolute shadow-xl rounded-lg"
                    style={getStyle(x, y, width)}
                  />
                ))}
              </div>
            </div>
          </div>
        }
      />
    </section>
  )
}
