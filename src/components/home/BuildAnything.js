import { useEffect, useRef, useState } from 'react'
import { IconContainer, Caption, BigText, Paragraph, Link, Widont } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/build-anything.svg'
import { HtmlZenGarden } from '@/components/HtmlZenGarden'
import tokenize from '../../macros/tokenize.macro'
import { Token } from '../Code'
import { motion } from 'framer-motion'
import { shuffle } from '@/utils/shuffle'
import { randomIntFromInterval } from '@/utils/randomIntFromInterval'

const { tokens } = tokenize.html(`<div class="__CLASS__">
  <div class="__CLASS__">
    <img src="avatar.jpg" class="__CLASS__">
  </div>
  <div class="__CLASS__">
    <p class="__CLASS__">"If I had to recommend a way of
      getting into programming today, it would be HTML + CSS
      with @tailwindcss."
    </p>
    <div class="__CLASS__">
      <div>
        <h2 class="__CLASS__">Guillermo Rauch</h2>
        <small class="__CLASS__">CEO Vercel</small>
      </div>
      <a href="https://twitter.com/rauchg" class="__CLASS__">View Tweet</a>
    </div>
  </div>
</div>`)

export function BuildAnything() {
  const [theme, setTheme] = useState('simple')

  return (
    <section id="build-anything">
      <div className="px-4 sm:px-6 md:px-8 mb-20">
        <IconContainer className={`${gradients.orange[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-orange-600 mb-3">
          Build anything
        </Caption>
        <BigText className="mb-8">
          <Widont>Build whatever you want, seriously.</Widont>
        </BigText>
        <Paragraph className="mb-6">
          Because Tailwind is so low-level, it never encourages you to design the same site twice.
          Even with the same color palette and sizing scale, it's easy to build the same component
          with a completely different look in the next project.
        </Paragraph>
        <Link href="#" className="text-orange-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="orange"
        rotate={-2}
        pin="right"
        header={
          <div className="flex overflow-auto -mx-4 sm:-mx-6 md:-mx-8 xl:-ml-4 xl:mr-0">
            <Tabs
              tabs={{
                simple: 'Simple',
                playful: 'Playful',
                elegant: 'Elegant',
                brutalist: 'Brutalist',
              }}
              selected={theme}
              onChange={setTheme}
              className="mx-auto xl:mx-0 px-4 sm:px-6 md:px-8 xl:px-0"
            />
          </div>
        }
        left={<HtmlZenGarden theme={theme} />}
        right={
          <CodeWindow className="bg-pink-600">
            <CodeWindow.Code
              tokens={tokens}
              tokenComponent={BuildAnythingToken}
              tokenProps={{ theme }}
            />
          </CodeWindow>
        }
      />
    </section>
  )
}

const classes = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ornare nisi at nisi ultricies egestas. Duis consequat sem non nulla placerat finibus. Sed leo turpis, imperdiet nec erat et, mollis venenatis lectus'
  .toLowerCase()
  .split(/[^a-z]+/i)

function BuildAnythingToken(props) {
  const { token, theme } = props
  const initial = useRef(true)

  useEffect(() => {
    initial.current = false
  }, [])

  if (token[0] === 'attr-value' && token[1].includes('__CLASS__')) {
    const noOfClasses = randomIntFromInterval(2, 5)
    return (
      <span className="text-code-attr-value">
        <span className="text-code-punctuation">="</span>
        <motion.span
          className={`text-code-attr-value ${initial.current ? '' : 'animate-flash-code'}`}
          key={theme}
          style={{
            borderRadius: 3,
            padding: '1px 3px',
            margin: '0 -3px',
          }}
        >
          {shuffle([...classes])
            .filter((_, i) => i <= noOfClasses)
            .join(' ')}
        </motion.span>
        "
      </span>
    )
  }

  return <Token {...props} />
}
