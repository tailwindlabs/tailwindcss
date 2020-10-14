import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/state-variants.svg'

export function StateVariants() {
  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.lightblue} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-lightBlue-600 mb-3">
          State variants
        </Caption>
        <BigText className="mb-8">Hover and focus states? We got ’em.</BigText>
        <Paragraph className="mb-6">
          Want to style something on hover? Stick hover: at the beginning of the class you want to
          add. Works for focus, active, disabled, focus-within, focus-visible, and even fancy states
          we invented ourselves like group-hover.
        </Paragraph>
        <Link href="#" className="text-lightBlue-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="lightblue"
        rotate={1}
        left={
          <div
            className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
            style={{ height: 404 }}
          />
        }
        right={<CodeWindow className="bg-lightBlue-500" />}
      />
    </section>
  )
}
