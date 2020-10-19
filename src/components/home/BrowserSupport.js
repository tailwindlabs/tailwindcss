import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/browser-support.svg'

export function BrowserSupport() {
  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.purple} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-purple-600 mb-3">
          Browser support
        </Caption>
        <BigText className="mb-8">
          Go bleeding edge or support ancient browsers, it’s your decision.
        </BigText>
        <Paragraph as="div" className="mb-6">
          <p>
            Tailwind includes utilities for all the latest modern browser features, but because it's
            so low-level, you're not forced to use them. Need to support IE11? Build your grids with
            Flexbox instead of CSS Grid. Stuck with IE9? Build them with floats! (And wow I'm so
            sorry.)
          </p>
          <p>
            Use the target option to play it really safe and automatically disable CSS features that
            aren't supported by the browsers you need to support, so there’s no accidents.
          </p>
        </Paragraph>
        <Link href="#" className="text-purple-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="purple"
        rotate={-2}
        header={
          <div className="-ml-4">
            <Tabs
              tabs={['Modern Browsers', 'IE11', 'IE9']}
              className="justify-center lg:justify-start"
            />
          </div>
        }
        left={
          <div
            className="relative z-10 lg:mr-6 grid grid-cols-3 grid-rows-2 gap-4 text-4xl font-black text-purple-300"
            style={{ height: 336 }}
          >
            <div className="bg-white rounded-xl shadow-lg flex items-center justify-center">1</div>
            <div className="bg-white rounded-xl shadow-lg col-span-2 flex items-center justify-center">
              2
            </div>
            <div className="bg-white rounded-xl shadow-lg flex items-center justify-center">3</div>
            <div className="bg-white rounded-xl shadow-lg flex items-center justify-center">4</div>
            <div className="bg-white rounded-xl shadow-lg flex items-center justify-center">5</div>
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
