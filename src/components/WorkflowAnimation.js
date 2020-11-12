import { forwardRef, useRef, useEffect } from 'react'
import { gsap } from 'gsap'

const AnimationCodeText = forwardRef((props, ref) => {
  let text = typeof props.text === 'string' ? [props.text] : props.text

  const characters = text
    .map((chunk) => {
      return typeof chunk === 'string' ? { text: chunk, class: '' } : chunk
    })
    .flatMap((chunk, i) => {
      return chunk.text.split('').map((c, j) => {
        return (
          <div
            key={`${i}-${j}`}
            style={{ display: 'none' }}
            className={`whitespace-pre ${chunk.class}`}
            dangerouslySetInnerHTML={{ __html: c }}
          />
        )
      })
    })

  return (
    <div ref={ref} className="inline-block text-code-green">
      {characters}
    </div>
  )
})

export function WorkflowAnimation() {
  const classCardFlex = useRef()
  const cardFlexCursor = useRef()
  const classCardPadding = useRef()
  const cardCursor = useRef()
  const classAvatarLarger = useRef()
  const avatarLargerCursor = useRef()
  const classAvatarRounded = useRef()
  const classAvatarCenter = useRef()
  const classAvatarMarginFix = useRef()
  const classAvatarRightMargin = useRef()
  const avatarCursor = useRef()
  const classContentCenter = useRef()
  const classContentLeftAlign = useRef()
  const contentLeftAlignCursor = useRef()
  const contentCursor = useRef()
  const classNameSize = useRef()
  const nameCursor = useRef()
  const classRoleColor = useRef()
  const roleCursor = useRef()
  const classContactColor1 = useRef()
  const contactCursor1 = useRef()
  const contactCursor2 = useRef()
  const classContactColor2 = useRef()
  const card = useRef()
  const cardLarge = useRef()
  const avatar = useRef()
  const content = useRef()
  const name = useRef()
  const role = useRef()
  const email = useRef()
  const phone = useRef()
  const cardSmall = useRef()
  const cardInner = useRef()
  const resizeCursor = useRef()
  const resizeCursorCircle = useRef()

  useEffect(() => {
    const timelines = []
    const delay = window.setTimeout(runAnimation, 1000)

    async function runAnimation() {
      await animateCardPadding()
      await animateAvatarRadius()
      await animateAvatarCentering()
      await animateNameSize()
      await animateRoleColor()
      await animateContactColors()
      await animateContentCentering()
      await animateCardWidening()
      await animateCardFlexLayout()
      await animateAvatarMarginFix()
      await animateContentLeftAlign()
      await animateAvatarRightMargin()
      await animateAvatarLarger()
      await animateResizeCursorIntoPosition()
      await animateCardResizing()
    }

    async function animateCardPadding() {
      await tweenTo(cardCursor.current, 0.08, { visibility: 'visible' })
      await tweenStaggerTo(
        classCardPadding.current.children,
        0.08,
        { display: 'inline-block' },
        0.08
      )
      await tweenTo(cardInner.current, 1, { padding: '1.5rem', ease: 'power4.out' }, '+=.25')
      await tweenTo(cardCursor.current, 0.08, { visibility: 'hidden' })
    }

    async function animateAvatarRadius() {
      await tweenTo(avatarCursor.current, 0.08, { visibility: 'visible' })
      await tweenStaggerTo(
        classAvatarRounded.current.children,
        0.08,
        { display: 'inline-block' },
        0.08
      )
      await tweenTo(avatar.current, 1, { borderRadius: '2rem', ease: 'power4.out' }, '+=.25')
    }

    async function animateAvatarCentering() {
      await tweenStaggerTo(
        classAvatarCenter.current.children,
        0.08,
        { display: 'inline-block' },
        0.08
      )

      const oldPosition = avatar.current.getBoundingClientRect()
      gsap.set(avatar.current, { marginLeft: 'auto', marginRight: 'auto' })
      gsap.set(avatar.current, { x: 0 })
      gsap.set(avatar.current, {
        x: oldPosition.left - avatar.current.getBoundingClientRect().left,
      })
      await tweenTo(avatar.current, 1, { x: 0, ease: 'power4.out' }, '+=.25')

      await tweenTo(avatarCursor.current, 0.08, { visibility: 'hidden' })
    }

    async function animateNameSize() {
      await tweenTo(nameCursor.current, 0.08, { visibility: 'visible' })
      await tweenStaggerTo(classNameSize.current.children, 0.08, { display: 'inline-block' }, 0.08)
      await tweenTo(name.current, 1, { fontSize: '1.25rem', ease: 'power4.out' }, '+=.25')
      await tweenTo(nameCursor.current, 0.08, { visibility: 'hidden' })
    }

    async function animateRoleColor() {
      await tweenTo(roleCursor.current, 0.08, { visibility: 'visible' })
      await tweenStaggerTo(classRoleColor.current.children, 0.08, { display: 'inline-block' }, 0.08)
      await tweenTo(role.current, 1, { color: '#9f7aea', ease: 'power4.out' }, '+=.25')
      await tweenTo(roleCursor.current, 0.08, { visibility: 'hidden' })
    }

    async function animateContactColors() {
      await tweenTo(contactCursor1.current, 0.25, { visibility: 'visible' })
      await tweenTo(contactCursor2.current, 0.25, { visibility: 'visible' })
      await Promise.all([
        tweenStaggerTo(
          classContactColor1.current.children,
          0.08,
          { display: 'inline-block' },
          0.08
        ),
        tweenStaggerTo(
          classContactColor2.current.children,
          0.08,
          { display: 'inline-block' },
          0.08
        ),
      ])
      await Promise.all([
        tweenTo(email.current, 1, { color: '#647287', ease: 'power4.out' }, '+=.25'),
        tweenTo(phone.current, 1, { color: '#647287', ease: 'power4.out' }, '+=.25'),
      ])
      await Promise.all([
        tweenTo(contactCursor1.current, 0.08, { visibility: 'hidden' }),
        tweenTo(contactCursor2.current, 0.08, { visibility: 'hidden' }),
      ])
    }

    async function animateContentCentering() {
      await tweenTo(contentCursor.current, 0.08, { visibility: 'visible' })
      await tweenStaggerTo(
        classContentCenter.current.children,
        0.08,
        { display: 'inline-block' },
        0.08
      )

      const elements = [...content.current.children].flatMap((el) => [...el.children])
      const oldPositions = elements.map((el) => el.getBoundingClientRect())
      gsap.set(content.current, { textAlign: 'center' })
      elements.forEach((el, i) => {
        gsap.set(el, { x: oldPositions[i].left - el.getBoundingClientRect().left })
      })
      await tweenTo(elements, 1, { x: 0, ease: 'power4.out' })

      await tweenTo(contentCursor.current, 0.25, { visibility: 'hidden' })
    }

    async function animateCardWidening() {
      await tweenTo(resizeCursor.current, 1, { opacity: 1, x: 0, y: 0, ease: 'power4.out' })
      await tweenTo(resizeCursorCircle.current, 0, { opacity: 1 })
      await tweenTo(card.current, 2, { width: '30rem', ease: 'power4.out' }, '+=.25')
      await tweenTo(resizeCursorCircle.current, 0, { opacity: 0.5 })
      await tweenTo(
        resizeCursor.current,
        1,
        { opacity: 0, x: 100, y: 150, ease: 'power4.inOut' },
        '+=.25'
      )
    }

    async function animateCardFlexLayout() {
      await tweenTo(cardFlexCursor.current, 0.25, { visibility: 'visible' })
      await tweenStaggerTo(classCardFlex.current.children, 0.08, { display: 'inline-block' }, 0.08)

      const contentElements = [...content.current.children].flatMap((el) => [...el.children])
      const oldCardPosition = cardInner.current.getBoundingClientRect()
      const oldAvatarPosition = avatar.current.getBoundingClientRect()
      const oldContentPositions = contentElements.map((el) => el.getBoundingClientRect())
      gsap.set(cardInner.current, { display: 'flex' })
      const newCardPosition = cardInner.current.getBoundingClientRect()
      const newAvatarPosition = avatar.current.getBoundingClientRect()
      const newContentPositions = contentElements.map((el) => el.getBoundingClientRect())
      gsap.set(cardInner.current, { height: oldCardPosition.height })
      gsap.set(avatar.current, { x: oldAvatarPosition.left - newAvatarPosition.left })
      contentElements.forEach((el, i) => {
        gsap.set(el, {
          x: oldContentPositions[i].left - newContentPositions[i].left,
          y: oldContentPositions[i].top - newContentPositions[i].top,
        })
      })
      await Promise.all([
        tweenTo(avatar.current, 1, { x: 0, ease: 'power4.out' }, '+=.25'),
        tweenTo(contentElements, 1, { x: 0, y: 0, ease: 'power4.out' }, '+=.25'),
        tweenTo(
          cardInner.current,
          1,
          { height: newCardPosition.height, ease: 'power4.out' },
          '+=.25'
        ),
      ])

      await tweenTo(cardFlexCursor.current, 0.25, { visibility: 'hidden' })
    }

    async function animateAvatarMarginFix() {
      await tweenTo(avatarCursor.current, 0.25, { visibility: 'visible' })
      await tweenStaggerTo(
        classAvatarMarginFix.current.children,
        0.08,
        { display: 'inline-block' },
        0.08
      )

      const oldAvatarPosition = avatar.current.getBoundingClientRect()
      const oldContentPosition = content.current.getBoundingClientRect()
      gsap.set(avatar.current, { marginRight: 0, marginLeft: 0 })
      const newAvatarPosition = avatar.current.getBoundingClientRect()
      const newContentPosition = content.current.getBoundingClientRect()
      gsap.set(avatar.current, { x: oldAvatarPosition.left - newAvatarPosition.left })
      gsap.set(content.current, { x: oldContentPosition.left - newContentPosition.left })
      await Promise.all([
        tweenTo(avatar.current, 1, { x: 0, ease: 'power4.out' }, '+=.25'),
        tweenTo(content.current, 1, { x: 0, ease: 'power4.out' }, '+=.25'),
      ])

      await tweenTo(avatarCursor.current, 0.25, { visibility: 'hidden' })
    }

    async function animateContentLeftAlign() {
      await tweenTo(contentLeftAlignCursor.current, 0.25, { visibility: 'visible' })
      await tweenStaggerTo(
        classContentLeftAlign.current.children,
        0.08,
        { display: 'inline-block' },
        0.08
      )

      const elements = [...content.current.children].flatMap((el) => [...el.children])
      const oldPositions = elements.map((el) => el.getBoundingClientRect())
      gsap.set(content.current, { textAlign: 'left' })
      elements.forEach((el, i) => {
        gsap.set(el, { x: oldPositions[i].left - el.getBoundingClientRect().left })
      })
      await tweenTo(elements, 1, { x: 0, ease: 'power4.out' })

      await tweenTo(contentLeftAlignCursor.current, 0.25, { visibility: 'hidden' })
    }

    async function animateAvatarRightMargin() {
      await tweenTo(avatarCursor.current, 0.25, { visibility: 'visible' })
      await tweenStaggerTo(
        classAvatarRightMargin.current.children,
        0.08,
        { display: 'inline-block' },
        0.08
      )

      const oldContentPosition = content.current.getBoundingClientRect()
      gsap.set(avatar.current, { marginRight: '1.5rem' })
      const newContentPosition = content.current.getBoundingClientRect()
      gsap.set(content.current, { x: oldContentPosition.left - newContentPosition.left })
      await tweenTo(content.current, 1, { x: 0, ease: 'power4.out' }, '+=.25')

      await tweenTo(avatarCursor.current, 0.25, { visibility: 'hidden' })
    }

    async function animateAvatarLarger() {
      gsap.set(avatar.current, { borderRadius: '100%' })
      await tweenTo(avatarLargerCursor.current, 0.08, { visibility: 'visible' })
      await tweenStaggerTo(
        classAvatarLarger.current.children,
        0.08,
        { display: 'inline-block' },
        0.08
      )
      await tweenTo(
        avatar.current,
        1,
        { height: '6rem', width: '6rem', ease: 'power4.out' },
        '+=.25'
      )
      await tweenTo(avatarLargerCursor.current, 0.08, { visibility: 'hidden' })
    }

    async function animateResizeCursorIntoPosition() {
      gsap.set(cardInner.current, { display: 'none' })
      gsap.set(cardLarge.current, { display: 'flex' })
      await tweenTo(resizeCursor.current, 1, {
        opacity: 1,
        x: 0,
        y: 0,
        ease: 'power4.out',
      })
      await tweenTo(resizeCursorCircle.current, 0, { opacity: 1 })
    }

    async function animateCardResizing() {
      await Promise.all([
        tweenTo(cardLarge.current, 0, { display: 'none' }, '+=.65'),
        tweenTo(cardSmall.current, 0, { display: 'block' }, '+=.65'),
        tweenTo(card.current, 2, { width: '20rem', ease: 'power4.out' }, '+=.25'),
      ])
      await Promise.all([
        tweenTo(cardLarge.current, 0, { display: 'flex' }, '+=.5'),
        tweenTo(cardSmall.current, 0, { display: 'none' }, '+=.5'),
        tweenTo(card.current, 2, { width: '30rem', ease: 'power4.out' }, '+=.25'),
      ])
      await animateCardResizing()
    }

    function tweenTo(el, duration, vars, position) {
      return new Promise((resolve) => {
        const timeline = gsap.timeline()
        timelines.push(timeline)
        timeline.to(
          el,
          duration,
          {
            ...vars,
            onComplete: resolve,
          },
          position
        )
      })
    }

    function tweenStaggerTo(el, duration, vars, stagger, position) {
      return new Promise((resolve) => {
        const timeline = gsap.timeline()
        timelines.push(timeline)
        timeline.staggerTo(
          el,
          duration,
          {
            ...vars,
          },
          stagger,
          position,
          resolve
        )
      })
    }

    return () => {
      window.clearTimeout(delay)
      timelines.forEach((timeline) => {
        timeline.kill()
      })
    }
  }, [])

  return (
    <div>
      <div className="flex flex-col">
        <div
          className="shadow-lg text-code-white text-sm font-mono subpixel-antialiased bg-gray-800 px-5 pb-6 pt-4 rounded-lg overflow-hidden"
          style={{ width: '36rem', lineHeight: 1.675 }}
        >
          <div className="flex mb-4">
            <span className="h-3 w-3 bg-red-500 rounded-full" />
            <span className="ml-2 h-3 w-3 bg-orange-300 rounded-full" />
            <span className="ml-2 h-3 w-3 bg-green-500 rounded-full" />
          </div>
          <div className="whitespace-nowrap">
            <div className="inline-block text-gray-600">1&nbsp;&nbsp;</div>
            <div className="inline-block text-code-blue">&lt;</div>
            <div className="inline-block text-code-red">div&nbsp;</div>
            <div className="inline-block text-code-yellow">class</div>
            <div className="inline-block text-code-blue">="</div>
            <AnimationCodeText
              ref={classCardFlex}
              className="inline-block text-code-green"
              text="md:flex "
            />
            <div
              ref={cardFlexCursor}
              className="inline-block border-r-2 border-yellow h-6 absolute"
              style={{ visibility: 'hidden', marginTop: '-0.125rem' }}
            />
            <div className="inline-block text-code-green">bg-white rounded-lg</div>
            <AnimationCodeText
              ref={classCardPadding}
              className="inline-block text-code-green"
              text=" p-6"
            />
            <div
              ref={cardCursor}
              className="inline-block border-r-2 border-yellow h-6 absolute"
              style={{ marginTop: '-0.125rem' }}
            />
            <div className="inline-block text-code-blue">"&gt;</div>
          </div>
          <div className="whitespace-nowrap">
            <div className="inline-block text-gray-600">2&nbsp;&nbsp;</div>
            <div className="inline-block text-code-blue">&nbsp;&nbsp;&lt;</div>
            <div className="inline-block text-code-red">img&nbsp;</div>
            <div className="inline-block text-code-yellow">class</div>
            <div className="inline-block text-code-blue">="</div>
            <div className="inline-block text-code-green">h-16 w-16</div>
            <AnimationCodeText
              ref={classAvatarLarger}
              className="inline-block text-code-green"
              text=" md:h-24 md:w-24"
            />
            <div
              ref={avatarLargerCursor}
              className="inline-block border-r-2 border-yellow h-6 absolute"
              style={{ visibility: 'hidden', marginTop: '-0.125rem' }}
            />
            <AnimationCodeText
              ref={classAvatarRounded}
              className="inline-block text-code-green"
              text=" rounded-full"
            />
            <AnimationCodeText
              ref={classAvatarCenter}
              className="inline-block text-code-green"
              text=" mx-auto"
            />
            <AnimationCodeText
              ref={classAvatarMarginFix}
              className="inline-block text-code-green"
              text=" md:mx-0"
            />
            <AnimationCodeText
              ref={classAvatarRightMargin}
              className="inline-block text-code-green"
              text=" md:mr-6"
            />
            <div
              ref={avatarCursor}
              className="inline-block border-r-2 border-yellow h-6 absolute"
              style={{ marginTop: '-0.125rem', visibility: 'hidden' }}
            />
            <div className="inline-block text-code-blue">"&nbsp;</div>
            <div className="inline-block text-code-yellow">src</div>
            <div className="inline-block text-code-blue">="</div>
            <div className="inline-block text-code-green">avatar.jpg</div>
            <div className="inline-block text-code-blue">"&gt;</div>
          </div>
          <div>
            <div className="inline-block text-gray-600">3&nbsp;&nbsp;</div>
            <div className="inline-block text-code-blue">&nbsp;&nbsp;&lt;</div>
            <div className="inline-block text-code-red">div</div>
            <div ref={classContentCenter} className="inline-block text-code-green">
              <div style={{ display: 'none' }}>&nbsp;</div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                c
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                l
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                a
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                s
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                s
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                =
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                "
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                t
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                e
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                x
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                t
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                -
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                c
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                e
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                n
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                t
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                e
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                <span>r</span>
                <div ref={classContentLeftAlign} className="inline-block text-code-green">
                  <div style={{ display: 'none' }}>&nbsp;</div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    m
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    d
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    :
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    t
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    e
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    x
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    t
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    -
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    l
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    e
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    f
                  </div>
                  <div style={{ display: 'none' }} className="text-code-green">
                    t
                  </div>
                </div>
                <div
                  ref={contentLeftAlignCursor}
                  className="inline-block border-r-2 border-yellow h-6 absolute"
                  style={{ visibility: 'hidden', marginTop: '-0.125rem' }}
                />
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                "
              </div>
            </div>
            <div
              ref={contentCursor}
              className="inline-block border-r-2 border-yellow h-6 absolute"
              style={{ visibility: 'hidden', marginTop: '-0.125rem' }}
            />
            <div className="inline-block text-code-blue">&gt;</div>
          </div>
          <div>
            <div className="inline-block text-gray-600">4&nbsp;&nbsp;</div>
            <div className="inline-block text-code-blue">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</div>
            <div className="inline-block text-code-red">h2</div>
            <AnimationCodeText
              ref={classNameSize}
              className="inline-block text-code-green"
              text={[
                { class: 'text-code-yellow', text: ' class' },
                { class: 'text-code-blue', text: '="' },
                'text-lg',
                { class: 'text-code-blue', text: '"' },
              ]}
            />
            <div
              ref={nameCursor}
              className="inline-block border-r-2 border-yellow h-6 absolute"
              style={{ marginTop: '-0.125rem', visibility: 'hidden' }}
            />
            <div className="inline-block text-code-blue">&gt;</div>
            <div className="inline-block text-code-white">Erin Lindford</div>
            <div className="inline-block text-code-blue">&lt;/</div>
            <div className="inline-block text-code-red">h2</div>
            <div className="inline-block text-code-blue">&gt;</div>
          </div>
          <div>
            <div className="inline-block text-gray-600">5&nbsp;&nbsp;</div>
            <div className="inline-block text-code-blue">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</div>
            <div className="inline-block text-code-red">div</div>
            <div ref={classRoleColor} className="inline-block text-code-green">
              <div style={{ display: 'none' }}>&nbsp;</div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                c
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                l
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                a
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                s
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                s
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                =
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                "
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                t
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                e
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                x
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                t
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                -
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                p
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                u
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                r
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                p
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                l
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                e
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                -
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                5
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                0
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                0
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                "
              </div>
            </div>
            <div
              ref={roleCursor}
              className="inline-block border-r-2 border-yellow h-6 absolute"
              style={{ visibility: 'hidden', marginTop: '-0.125rem' }}
            />
            <div className="inline-block text-code-blue">&gt;</div>
            <div className="inline-block text-code-white">Product Engineer</div>
            <div className="inline-block text-code-blue">&lt;/</div>
            <div className="inline-block text-code-red">div</div>
            <div className="inline-block text-code-blue">&gt;</div>
          </div>
          <div className="whitespace-nowrap">
            <div className="inline-block text-gray-600">6&nbsp;&nbsp;</div>
            <div className="inline-block text-code-blue">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</div>
            <div className="inline-block text-code-red">div</div>
            <div ref={classContactColor1} className="inline-block text-code-green">
              <div style={{ display: 'none' }}>&nbsp;</div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                c
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                l
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                a
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                s
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                s
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                =
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                "
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                t
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                e
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                x
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                t
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                -
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                g
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                r
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                a
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                y
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                -
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                6
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                0
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                0
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                "
              </div>
            </div>
            <div
              ref={contactCursor1}
              className="inline-block border-r-2 border-yellow h-6 absolute"
              style={{ visibility: 'hidden', marginTop: '-0.125rem' }}
            />
            <div className="inline-block text-code-blue">&gt;</div>
            <div className="inline-block text-code-white">erinlindford@example.com</div>
            <div className="inline-block text-code-blue">&lt;/</div>
            <div className="inline-block text-code-red">div</div>
            <div className="inline-block text-code-blue">&gt;</div>
          </div>
          <div className="whitespace-nowrap">
            <div className="inline-block text-gray-600">7&nbsp;&nbsp;</div>
            <div className="inline-block text-code-blue">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</div>
            <div className="inline-block text-code-red">div</div>
            <div ref={classContactColor2} className="inline-block text-code-green">
              <div style={{ display: 'none' }}>&nbsp;</div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                c
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                l
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                a
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                s
              </div>
              <div style={{ display: 'none' }} className="text-code-yellow">
                s
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                =
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                "
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                t
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                e
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                x
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                t
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                -
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                g
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                r
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                a
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                y
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                -
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                6
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                0
              </div>
              <div style={{ display: 'none' }} className="text-code-green">
                0
              </div>
              <div style={{ display: 'none' }} className="text-code-blue">
                "
              </div>
            </div>
            <div
              ref={contactCursor2}
              className="inline-block border-r-2 border-yellow h-6 absolute"
              style={{ visibility: 'hidden', marginTop: '-0.125rem' }}
            />
            <div className="inline-block text-code-blue">&gt;</div>
            <div className="inline-block text-code-white">(555) 765-4321</div>
            <div className="inline-block text-code-blue">&lt;/</div>
            <div className="inline-block text-code-red">div</div>
            <div className="inline-block text-code-blue">&gt;</div>
          </div>
          <div>
            <div className="inline-block text-gray-600">8&nbsp;&nbsp;</div>
            <div className="inline-block text-code-blue">&nbsp;&nbsp;&lt;/</div>
            <div className="inline-block text-code-red">div</div>
            <div className="inline-block text-code-blue">&gt;</div>
          </div>
          <div>
            <div className="inline-block text-gray-600">9&nbsp;&nbsp;</div>
            <div className="inline-block text-code-blue">&lt;/</div>
            <div className="inline-block text-code-red">div</div>
            <div className="inline-block text-code-blue">&gt;</div>
          </div>
        </div>
        <div
          ref={card}
          className="shadow-lg leading-normal self-end bg-white rounded-lg -mt-16 relative"
          style={{ width: '20rem' }}
        >
          <div ref={cardLarge} style={{ display: 'none' }} className="p-6">
            <img
              className="h-24 w-24 block rounded-full"
              style={{ marginRight: '1.5rem' }}
              src={require('@/img/erin-lindford.jpg').default}
              alt=""
            />
            <div className="text-gray-800">
              <h2 className="text-xl font-normal text-gray-800">
                <div className="inline-block relative">Erin Lindford</div>
              </h2>
              <div>
                <div className="inline-block relative text-purple-500">Product Engineer</div>
              </div>
              <div>
                <div className="inline-block relative text-gray-600">erinlindford@example.com</div>
              </div>
              <div>
                <div className="inline-block relative text-gray-600">(555) 765-4321</div>
              </div>
            </div>
          </div>
          <div ref={cardSmall} style={{ display: 'none' }} className="p-6">
            <img
              className="h-16 w-16 block mb-4 rounded-full"
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
              src={require('@/img/erin-lindford.jpg').default}
              alt=""
            />
            <div className="text-center text-gray-800">
              <h2 className="text-xl font-normal text-gray-800">
                <div className="inline-block relative">Erin Lindford</div>
              </h2>
              <div>
                <div className="inline-block relative text-purple-500">Product Engineer</div>
              </div>
              <div>
                <div className="inline-block relative text-gray-600">erinlindford@example.com</div>
              </div>
              <div>
                <div className="inline-block relative text-gray-600">(555) 765-4321</div>
              </div>
            </div>
          </div>
          <div ref={cardInner}>
            <img
              ref={avatar}
              className="block mb-4"
              style={{ width: '4rem', height: '4rem' }}
              src={require('@/img/erin-lindford.jpg').default}
              alt=""
            />
            <div ref={content} className="text-gray-800">
              <h2 ref={name} className="font-normal text-gray-800">
                <div className="inline-block relative">Erin Lindford</div>
              </h2>
              <div ref={role}>
                <div className="inline-block relative">Product Engineer</div>
              </div>
              <div ref={email}>
                <div className="inline-block relative">erinlindford@example.com</div>
              </div>
              <div ref={phone}>
                <div className="inline-block relative">(555) 765-4321</div>
              </div>
            </div>
          </div>
          <div className="absolute flex inset-y-0 left-0">
            <div
              ref={resizeCursor}
              className="mt-16 h-6 w-6 -ml-3 relative"
              style={{ opacity: 0, transform: 'translateX(150px) translateY(150px)' }}
            >
              <svg
                ref={resizeCursorCircle}
                className="absolute inset-0 h-6 w-6 text-black"
                style={{ opacity: 0.5 }}
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
              >
                <circle
                  cx={50}
                  cy={50}
                  r={40}
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth={8}
                  fill="rgba(0, 0, 0, 0.5)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
