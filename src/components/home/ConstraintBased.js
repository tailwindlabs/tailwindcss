import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/constraint-based.svg'

export function ConstraintBased() {
  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.purple} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-purple-600 mb-3">
          Constraint-based
        </Caption>
        <BigText className="mb-8">An API for your design system.</BigText>
        <Paragraph className="mb-6">
          Utility classes help you work within the constraints of a system instead of littering your
          stylesheets with arbitrary values. They make it easy to be consistent with color choices,
          spacing, typography, shadows, and everything else that makes up a well-engineered design
          system.
        </Paragraph>
        <Link href="#" className="text-purple-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="purple"
        rotate={-1}
        header={
          <div className="-ml-4">
            <Tabs tabs={['Color', 'Typography', 'Shadows', 'Sizing']} />
          </div>
        }
        left={
          <div
            className="relative z-10 bg-white rounded-xl shadow-lg -mr-8"
            style={{ height: 370 }}
          />
        }
        right={<CodeWindow className="bg-pink-600" />}
      />
    </section>
  )
}
