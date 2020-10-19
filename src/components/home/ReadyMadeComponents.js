import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/ready-made-components.svg'

export function ReadyMadeComponents() {
  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.violet} mb-8`}>
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
        left={<img src={require('@/img/tailwindui.webp').default} alt="" />}
      />
    </section>
  )
}
