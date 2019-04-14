<template>
  <div class="mx-auto" style="width: 40rem; height: 28rem">
    <div class="flex flex-col">
      <div class="code-white text-sm font-mono bg-black p-6 rounded leading-normal overflow-hidden" style="width: 36rem; line-height: 1.675">
        <div class="whitespace-no-wrap"><!--
       --><div class="inline-block code-blue">&lt;</div><!--
       --><div class="inline-block code-red">div&nbsp;</div><!--
       --><div class="inline-block code-yellow">class</div><!--
       --><div class="inline-block code-blue">=&quot;</div><!--
       --><animation-code-text ref="classCardFlex" class="inline-block code-green" text="md:flex "></animation-code-text><!--
       --><div ref="cardFlexCursor" class="invisible inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
       --><div class="inline-block code-green">bg-white rounded</div><!--
       --><animation-code-text ref="classCardPadding" class="inline-block code-green" text=" p-6"></animation-code-text><!--
       --><div ref="cardCursor" class="inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
       --><div class="inline-block code-blue">&quot;&gt;</div><!--
     --></div>
        <div class="whitespace-no-wrap"><!--
       --><div class="inline-block code-blue">&nbsp;&nbsp;&lt;</div><!--
       --><div class="inline-block code-red">img&nbsp;</div><!--
       --><div class="inline-block code-yellow">class</div><!--
       --><div class="inline-block code-blue">=&quot;</div><!--
       --><div class="inline-block code-green">h-16 w-16</div><!--
       --><animation-code-text ref="classAvatarLarger" class="inline-block code-green" text=" md:h-24 md:w-24"></animation-code-text><!--
       --><div ref="avatarLargerCursor" class="invisible inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
       --><animation-code-text ref="classAvatarRounded" class="inline-block code-green" text=" rounded-full"></animation-code-text><!--
       --><animation-code-text ref="classAvatarCenter" class="inline-block code-green" text=" mx-auto"></animation-code-text><!--
       --><animation-code-text ref="classAvatarMarginFix" class="inline-block code-green" text=" md:mx-0"></animation-code-text><!--
       --><animation-code-text ref="classAvatarRightMargin" class="inline-block code-green" text=" md:mr-6"></animation-code-text><!--
       --><div ref="avatarCursor" class="invisible inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
       --><div class="inline-block code-blue">&quot;&nbsp;</div><!--
       --><div class="inline-block code-purple">src</div><!--
       --><div class="inline-block code-blue">=&quot;</div><!--
       --><div class="inline-block code-green">avatar.jpg</div><!--
       --><div class="inline-block code-blue">&quot;&gt;</div><!--
     --></div><!--
     --><div><!--
       --><div class="inline-block code-blue">&nbsp;&nbsp;&lt;</div><!--
       --><div class="inline-block code-red">div</div><!--
       --><div ref="classContentCenter" class="inline-block code-green"><!--
         --><div class="hidden">&nbsp;</div><!--
         --><div class="hidden code-yellow">c</div><!--
         --><div class="hidden code-yellow">l</div><!--
         --><div class="hidden code-yellow">a</div><!--
         --><div class="hidden code-yellow">s</div><!--
         --><div class="hidden code-yellow">s</div><!--
         --><div class="hidden code-blue">=</div><!--
         --><div class="hidden code-blue">&quot;</div><!--
         --><div class="hidden code-green">t</div><!--
         --><div class="hidden code-green">e</div><!--
         --><div class="hidden code-green">x</div><!--
         --><div class="hidden code-green">t</div><!--
         --><div class="hidden code-green">-</div><!--
         --><div class="hidden code-green">c</div><!--
         --><div class="hidden code-green">e</div><!--
         --><div class="hidden code-green">n</div><!--
         --><div class="hidden code-green">t</div><!--
         --><div class="hidden code-green">e</div><!--
         --><div class="hidden code-green"><!--
           --><span>r</span><!--
           --><div ref="classContentLeftAlign" class="inline-block code-green"><!--
             --><div class="hidden">&nbsp;</div><!--
             --><div class="hidden code-green">m</div><!--
             --><div class="hidden code-green">d</div><!--
             --><div class="hidden code-green">:</div><!--
             --><div class="hidden code-green">t</div><!--
             --><div class="hidden code-green">e</div><!--
             --><div class="hidden code-green">x</div><!--
             --><div class="hidden code-green">t</div><!--
             --><div class="hidden code-green">-</div><!--
             --><div class="hidden code-green">l</div><!--
             --><div class="hidden code-green">e</div><!--
             --><div class="hidden code-green">f</div><!--
             --><div class="hidden code-green">t</div><!--
           --></div><!--
           --><div ref="contentLeftAlignCursor" class="invisible inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
         --></div><!--
         --><div class="hidden code-blue">&quot;</div><!--
       --></div><!--
       --><div ref="contentCursor" class="invisible inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
     --></div><!--
     --><div><!--
       --><div class="inline-block code-blue">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</div><!--
       --><div class="inline-block code-red">h2</div><!--
       --><animation-code-text ref="classNameSize" class="inline-block code-green" :text="[
            { class: 'code-yellow', text: ' class' },
            { class: 'code-blue', text: '=&quot;' },
            'text-lg',
            { class: 'code-blue', text: '&quot;' },
          ]"></animation-code-text><!--
       --><div ref="nameCursor" class="invisible inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
       --><div class="inline-block code-white">Erin Lindford</div><!--
       --><div class="inline-block code-blue">&lt;/</div><!--
       --><div class="inline-block code-red">h2</div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
     --></div><!--
     --><div><!--
       --><div class="inline-block code-blue">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</div><!--
       --><div class="inline-block code-red">div</div><!--
       --><div ref="classRoleColor" class="inline-block code-green"><!--
         --><div class="hidden">&nbsp;</div><!--
         --><div class="hidden code-yellow">c</div><!--
         --><div class="hidden code-yellow">l</div><!--
         --><div class="hidden code-yellow">a</div><!--
         --><div class="hidden code-yellow">s</div><!--
         --><div class="hidden code-yellow">s</div><!--
         --><div class="hidden code-blue">=</div><!--
         --><div class="hidden code-blue">&quot;</div><!--
         --><div class="hidden code-green">t</div><!--
         --><div class="hidden code-green">e</div><!--
         --><div class="hidden code-green">x</div><!--
         --><div class="hidden code-green">t</div><!--
         --><div class="hidden code-green">-</div><!--
         --><div class="hidden code-green">p</div><!--
         --><div class="hidden code-green">u</div><!--
         --><div class="hidden code-green">r</div><!--
         --><div class="hidden code-green">p</div><!--
         --><div class="hidden code-green">l</div><!--
         --><div class="hidden code-green">e</div><!--
         --><div class="hidden code-blue">&quot;</div><!--
       --></div><!--
       --><div ref="roleCursor" class="invisible inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
       --><div class="inline-block code-white">Customer Support</div><!--
       --><div class="inline-block code-blue">&lt;/</div><!--
       --><div class="inline-block code-red">div</div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
     --></div><!--
     --><div class="whitespace-no-wrap"><!--
       --><div class="inline-block code-blue">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</div><!--
       --><div class="inline-block code-red">div</div><!--
       --><div ref="classContactColor1" class="inline-block code-green"><!--
         --><div class="hidden">&nbsp;</div><!--
         --><div class="hidden code-yellow">c</div><!--
         --><div class="hidden code-yellow">l</div><!--
         --><div class="hidden code-yellow">a</div><!--
         --><div class="hidden code-yellow">s</div><!--
         --><div class="hidden code-yellow">s</div><!--
         --><div class="hidden code-blue">=</div><!--
         --><div class="hidden code-blue">&quot;</div><!--
         --><div class="hidden code-green">t</div><!--
         --><div class="hidden code-green">e</div><!--
         --><div class="hidden code-green">x</div><!--
         --><div class="hidden code-green">t</div><!--
         --><div class="hidden code-green">-</div><!--
         --><div class="hidden code-green">g</div><!--
         --><div class="hidden code-green">r</div><!--
         --><div class="hidden code-green">e</div><!--
         --><div class="hidden code-green">y</div><!--
         --><div class="hidden code-green">-</div><!--
         --><div class="hidden code-green">d</div><!--
         --><div class="hidden code-green">a</div><!--
         --><div class="hidden code-green">r</div><!--
         --><div class="hidden code-green">k</div><!--
         --><div class="hidden code-blue">&quot;</div><!--
       --></div><!--
       --><div ref="contactCursor1" class="invisible inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
       --><div class="inline-block code-white">erinlindford@example.com</div><!--
       --><div class="inline-block code-blue">&lt;/</div><!--
       --><div class="inline-block code-red">div</div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
     --></div><!--
     --><div class="whitespace-no-wrap"><!--
       --><div class="inline-block code-blue">&nbsp;&nbsp;&nbsp;&nbsp;&lt;</div><!--
       --><div class="inline-block code-red">div</div><!--
       --><div ref="classContactColor2" class="inline-block code-green"><!--
         --><div class="hidden">&nbsp;</div><!--
         --><div class="hidden code-yellow">c</div><!--
         --><div class="hidden code-yellow">l</div><!--
         --><div class="hidden code-yellow">a</div><!--
         --><div class="hidden code-yellow">s</div><!--
         --><div class="hidden code-yellow">s</div><!--
         --><div class="hidden code-blue">=</div><!--
         --><div class="hidden code-blue">&quot;</div><!--
         --><div class="hidden code-green">t</div><!--
         --><div class="hidden code-green">e</div><!--
         --><div class="hidden code-green">x</div><!--
         --><div class="hidden code-green">t</div><!--
         --><div class="hidden code-green">-</div><!--
         --><div class="hidden code-green">g</div><!--
         --><div class="hidden code-green">r</div><!--
         --><div class="hidden code-green">e</div><!--
         --><div class="hidden code-green">y</div><!--
         --><div class="hidden code-green">-</div><!--
         --><div class="hidden code-green">d</div><!--
         --><div class="hidden code-green">a</div><!--
         --><div class="hidden code-green">r</div><!--
         --><div class="hidden code-green">k</div><!--
         --><div class="hidden code-blue">&quot;</div><!--
       --></div><!--
       --><div ref="contactCursor2" class="invisible inline-block border-r-2 border-yellow h-6 absolute" style="margin-top: -0.125rem"></div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
       --><div class="inline-block code-white">(555) 765-4321</div><!--
       --><div class="inline-block code-blue">&lt;/</div><!--
       --><div class="inline-block code-red">div</div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
     --></div><!--
     --><div><!--
       --><div class="inline-block code-blue">&nbsp;&nbsp;&lt;/</div><!--
       --><div class="inline-block code-red">div</div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
     --></div><!--
     --><div><!--
       --><div class="inline-block code-blue">&lt;</div><!--
       --><div class="inline-block code-red">div</div><!--
       --><div class="inline-block code-blue">&gt;</div><!--
     --></div><!--
   --></div>
      <div ref="card" class="shadow-lg leading-normal self-end bg-white w-64 rounded -mt-16 relative" style="width: 20rem; font-family: Akagi Pro">
        <div ref="cardLarge" class="hidden p-6">
          <img ref="avatar" class="h-24 w-24 block mr-6 rounded-full" src="https://randomuser.me/api/portraits/women/17.jpg" alt="">
          <div ref="content" class="text-gray-800 text-left">
            <h2 ref="name" class="text-xl font-normal text-gray-800">
              <div class="inline-block relative">Erin Lindford</div>
            </h2>
            <div ref="role">
              <div class="inline-block relative text-purple-600">Customer Support</div>
            </div>
            <div ref="email">
              <div class="inline-block relative text-gray-700">erinlindford@example.com</div>
            </div>
            <div ref="phone">
              <div class="inline-block relative text-gray-700">(555) 765-4321</div>
            </div>
          </div>
        </div>
        <div ref="cardSmall" class="hidden p-6">
          <img ref="avatar" class="h-16 w-16 block mb-4 mx-auto rounded-full" src="https://randomuser.me/api/portraits/women/17.jpg" alt="">
          <div ref="content" class="text-gray-800 text-center">
            <h2 ref="name" class="text-xl font-normal text-gray-800">
              <div class="inline-block relative">Erin Lindford</div>
            </h2>
            <div ref="role">
              <div class="inline-block relative text-purple-600">Customer Support</div>
            </div>
            <div ref="email">
              <div class="inline-block relative text-gray-700">erinlindford@example.com</div>
            </div>
            <div ref="phone">
              <div class="inline-block relative text-gray-700">(555) 765-4321</div>
            </div>
          </div>
        </div>
        <div ref="cardInner">
          <img ref="avatar" class="h-16 w-16 block mb-4" src="https://randomuser.me/api/portraits/women/17.jpg" alt="">
          <div ref="content" class="text-gray-800">
            <h2 ref="name" class="text-base font-normal text-gray-800">
              <div class="inline-block relative">Erin Lindford</div>
            </h2>
            <div ref="role">
              <div class="inline-block relative">Customer Support</div>
            </div>
            <div ref="email">
              <div class="inline-block relative">erinlindford@example.com</div>
            </div>
            <div ref="phone">
              <div class="inline-block relative">(555) 765-4321</div>
            </div>
          </div>
        </div>
        <div class="absolute flex inset-y-0 left-0">
          <div ref="resizeCursor" class="mt-16 h-6 w-6 -ml-3 opacity-0 relative" style="transform: translateX(150px) translateY(150px)">
            <svg ref="resizeCursorCircle" class="absolute inset-0 h-6 w-6 text-black opacity-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255, 255, 255, 0.5)" stroke-width="8" fill="rgba(0, 0, 0, 0.5)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { TimelineLite, TweenLite, Power4 } from 'gsap/TweenMax'
  import _ from 'lodash'
  import AnimationCodeText from './AnimationCodeText'

  function tweenTo(el, duration, vars, position) {
    return new Promise((resolve, reject) => {
      (new TimelineLite).to(el, duration, {
        ...vars,
        onComplete: resolve
      }, position)
    })
  }

  function tweenStaggerTo(el, duration, vars, stagger, position) {
    return new Promise((resolve, reject) => {
      (new TimelineLite).staggerTo(el, duration, {
        ...vars,
      }, stagger, position, resolve)
    })
  }

  export default {
    name: 'WorkflowAnimation',
    components: {
      AnimationCodeText
    },
    methods: {
      runAnimation() {
        this.animateCardPadding()
          .then(() => this.animateAvatarRadius())
          .then(() => this.animateAvatarCentering())
          .then(() => this.animateNameSize())
          .then(() => this.animateRoleColor())
          .then(() => this.animateContactColors())
          .then(() => this.animateContentCentering())
          .then(() => this.animateCardWidening())
          .then(() => this.animateCardFlexLayout())
          .then(() => this.animateAvatarMarginFix())
          .then(() => this.animateContentLeftAlign())
          .then(() => this.animateAvatarRightMargin())
          .then(() => this.animateAvatarLarger())
          .then(() => this.animateResizeCursorIntoPosition())
          .then(() => this.animateCardResizing())
      },
      animateCardPadding() {
        return tweenTo(this.$refs.cardCursor, .08, { visibility: 'visible' })
          .then(() => tweenStaggerTo(this.$refs.classCardPadding.$el.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => tweenTo(this.$refs.cardInner, 1, { padding: '1.5rem', ease: Power4.easeOut }, '+=.25'))
          .then(() => tweenTo(this.$refs.cardCursor, .08, { visibility: 'hidden' }))
      },
      animateAvatarRadius() {
        return tweenTo(this.$refs.avatarCursor, .08, { visibility: 'visible' })
          .then(() => tweenStaggerTo(this.$refs.classAvatarRounded.$el.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => tweenTo(this.$refs.avatar, 1, { borderRadius: '2rem', ease: Power4.easeOut }, '+=.25'))
      },
      animateAvatarCentering() {
        return tweenStaggerTo(this.$refs.classAvatarCenter.$el.children, .08, { display: 'inline-block' }, .08)
          .then(() => {
            const oldPosition = this.$refs.avatar.getBoundingClientRect()
            TweenLite.set(this.$refs.avatar, { marginLeft: 'auto', marginRight: 'auto' })
            TweenLite.set(this.$refs.avatar, { x: 0 })
            TweenLite.set(this.$refs.avatar, { x: oldPosition.left - this.$refs.avatar.getBoundingClientRect().left })
            return tweenTo(this.$refs.avatar, 1, { x: 0, ease: Power4.easeOut }, '+=.25')
          })
          .then(tweenTo(this.$refs.avatarCursor, .08, { visibility: 'hidden'}))
      },
      animateNameSize() {
        return tweenTo(this.$refs.nameCursor, .08, { visibility: 'visible'})
          .then(() => tweenStaggerTo(this.$refs.classNameSize.$el.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => tweenTo(this.$refs.name, 1, { fontSize: '1.25rem', ease: Power4.easeOut }, '+=.25'))
          .then(() => tweenTo(this.$refs.nameCursor, .08, { visibility: 'hidden'}))
      },
      animateRoleColor() {
        return tweenTo(this.$refs.roleCursor, .08, { visibility: 'visible'})
          .then(() => tweenStaggerTo(this.$refs.classRoleColor.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => tweenTo(this.$refs.role, 1, { color: '#9561e2', ease: Power4.easeOut }, '+=.25'))
          .then(() => tweenTo(this.$refs.roleCursor, .08, { visibility: 'hidden'}))
      },
      animateContactColors() {
        return tweenTo(this.$refs.contactCursor1, .25, { visibility: 'visible'})
          .then(() => tweenTo(this.$refs.contactCursor2, .25, { visibility: 'visible'}))
          .then(() => {
            return Promise.all([
              tweenStaggerTo(this.$refs.classContactColor1.children, 0.08, { display: 'inline-block' }, 0.08),
              tweenStaggerTo(this.$refs.classContactColor2.children, 0.08, { display: 'inline-block' }, 0.08),
            ])
          })
          .then(() => {
            return Promise.all([
              tweenTo(this.$refs.email, 1, { color: '#8795a1', ease: Power4.easeOut }, '+=.25'),
              tweenTo(this.$refs.phone, 1, { color: '#8795a1', ease: Power4.easeOut }, '+=.25'),
            ])
          })
          .then(() => {
            return Promise.all([
              tweenTo(this.$refs.contactCursor1, .08, { visibility: 'hidden'}),
              tweenTo(this.$refs.contactCursor2, .08, { visibility: 'hidden'}),
            ])
          })
      },
      animateContentCentering() {
        return tweenTo(this.$refs.contentCursor, .08, { visibility: 'visible'})
          .then(() => tweenStaggerTo(this.$refs.classContentCenter.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => {
            const elements = _.flatMap([...this.$refs.content.children], el => [...el.children])
            const oldPositions = elements.map(el => el.getBoundingClientRect())

            TweenLite.set(this.$refs.content, { textAlign: 'center' })

            elements.forEach((el, i) => {
              TweenLite.set(el, { x: oldPositions[i].left - el.getBoundingClientRect().left })
            })

            return tweenTo(elements, 1, { x: 0, ease: Power4.easeOut })
          })
          .then(() => tweenTo(this.$refs.contentCursor, .25, { visibility: 'hidden' }))
      },
      animateCardWidening() {
        return tweenTo(this.$refs.resizeCursor, 1, { opacity: 1, x: 0, y: 0, ease: Power4.easeOut })
          .then(() => tweenTo(this.$refs.resizeCursorCircle, 0, { opacity: 1 }))
          .then(() => tweenTo(this.$refs.card, 2, { width: '30rem', ease: Power4.easeOut }, '+=.25'))
          .then(() => tweenTo(this.$refs.resizeCursorCircle, 0, { opacity: .5 }))
          .then(() => tweenTo(this.$refs.resizeCursor, 1, { opacity: 0, x: 100, y: 150, ease: Power4.easeInOut }, '+=.25'))
      },
      animateCardFlexLayout() {
        return tweenTo(this.$refs.cardFlexCursor, .25, { visibility: 'visible'})
          .then(() => tweenStaggerTo(this.$refs.classCardFlex.$el.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => {
            const contentElements = _.flatMap([...this.$refs.content.children], el => [...el.children])
            const oldCardPosition = this.$refs.cardInner.getBoundingClientRect()
            const oldAvatarPosition = this.$refs.avatar.getBoundingClientRect()
            const oldContentPositions = contentElements.map(el => el.getBoundingClientRect())

            TweenLite.set(this.$refs.cardInner, { display: 'flex' })

            const newCardPosition = this.$refs.cardInner.getBoundingClientRect()
            const newAvatarPosition = this.$refs.avatar.getBoundingClientRect()
            const newContentPositions = contentElements.map(el => el.getBoundingClientRect())

            TweenLite.set(this.$refs.cardInner, { height: oldCardPosition.height })
            TweenLite.set(this.$refs.avatar, { x: oldAvatarPosition.left - newAvatarPosition.left })
            contentElements.forEach((el, i) => {
              TweenLite.set(el, {
                x: oldContentPositions[i].left - newContentPositions[i].left,
                y: oldContentPositions[i].top - newContentPositions[i].top,
              })
            })

            return Promise.all([
              tweenTo(this.$refs.avatar, 1, { x: 0, ease: Power4.easeOut }, '+=.25'),
              tweenTo(contentElements, 1, { x: 0, y: 0, ease: Power4.easeOut }, '+=.25'),
              tweenTo(this.$refs.cardInner, 1, { height: newCardPosition.height, ease: Power4.easeOut }, '+=.25'),
            ])
          })
          .then(() => tweenTo(this.$refs.cardFlexCursor, .25, { visibility: 'hidden' }))
      },
      animateAvatarMarginFix() {
        return tweenTo(this.$refs.avatarCursor, .25, { visibility: 'visible'})
          .then(() => tweenStaggerTo(this.$refs.classAvatarMarginFix.$el.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => {
            const oldAvatarPosition = this.$refs.avatar.getBoundingClientRect()
            const oldContentPosition = this.$refs.content.getBoundingClientRect()

            TweenLite.set(this.$refs.avatar, { marginRight: 0, marginLeft: 0 })

            const newAvatarPosition = this.$refs.avatar.getBoundingClientRect()
            const newContentPosition = this.$refs.content.getBoundingClientRect()

            TweenLite.set(this.$refs.avatar, { x: oldAvatarPosition.left - newAvatarPosition.left })
            TweenLite.set(this.$refs.content, { x: oldContentPosition.left - newContentPosition.left })

            return Promise.all([
              tweenTo(this.$refs.avatar, 1, { x: 0, ease: Power4.easeOut }, '+=.25'),
              tweenTo(this.$refs.content, 1, { x: 0, ease: Power4.easeOut }, '+=.25'),
            ])
          })
          .then(() => tweenTo(this.$refs.avatarCursor, .25, { visibility: 'hidden' }))
      },
      animateContentLeftAlign() {
        return tweenTo(this.$refs.contentLeftAlignCursor, .25, { visibility: 'visible'})
          .then(() => tweenStaggerTo(this.$refs.classContentLeftAlign.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => {
            const elements = _.flatMap([...this.$refs.content.children], el => [...el.children])
            const oldPositions = elements.map(el => el.getBoundingClientRect())

            TweenLite.set(this.$refs.content, { textAlign: 'left' })

            elements.forEach((el, i) => {
              TweenLite.set(el, { x: oldPositions[i].left - el.getBoundingClientRect().left })
            })

            return tweenTo(elements, 1, { x: 0, ease: Power4.easeOut })
          })
          .then(() => tweenTo(this.$refs.contentLeftAlignCursor, .25, { visibility: 'hidden' }))
      },
      animateAvatarRightMargin() {
        return tweenTo(this.$refs.avatarCursor, .25, { visibility: 'visible'})
          .then(() => tweenStaggerTo(this.$refs.classAvatarRightMargin.$el.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => {
            const oldContentPosition = this.$refs.content.getBoundingClientRect()

            TweenLite.set(this.$refs.avatar, { marginRight: '1.5rem' })

            const newContentPosition = this.$refs.content.getBoundingClientRect()

            TweenLite.set(this.$refs.content, { x: oldContentPosition.left - newContentPosition.left })

            return tweenTo(this.$refs.content, 1, { x: 0, ease: Power4.easeOut }, '+=.25')
          })
          .then(() => tweenTo(this.$refs.avatarCursor, .25, { visibility: 'hidden' }))
      },
      animateAvatarLarger() {
        TweenLite.set(this.$refs.avatar, { borderRadius: '100%' })

        return tweenTo(this.$refs.avatarLargerCursor, .08, { visibility: 'visible'})
          .then(() => tweenStaggerTo(this.$refs.classAvatarLarger.$el.children, 0.08, { display: 'inline-block' }, 0.08))
          .then(() => tweenTo(this.$refs.avatar, 1, { height: '6rem', width: '6rem', ease: Power4.easeOut }, '+=.25'))
          .then(() => tweenTo(this.$refs.avatarLargerCursor, .08, { visibility: 'hidden'}))
      },
      animateResizeCursorIntoPosition() {
        TweenLite.set(this.$refs.cardInner, { display: 'none' })
        TweenLite.set(this.$refs.cardLarge, { display: 'flex' })

        return tweenTo(this.$refs.resizeCursor, 1, { opacity: 1, x: 0, y: 0, ease: Power4.easeOut })
          .then(() => tweenTo(this.$refs.resizeCursorCircle, 0, { opacity: 1 }))
      },
      animateCardResizing() {
        return Promise.all([
          tweenTo(this.$refs.cardLarge, 0, { display: 'none' }, '+=.65'),
          tweenTo(this.$refs.cardSmall, 0, { display: 'block' }, '+=.65'),
          tweenTo(this.$refs.card, 2, { width: '20rem', ease: Power4.easeOut }, '+=.25'),
        ])
          .then(() => {
            return Promise.all([
              tweenTo(this.$refs.cardLarge, 0, { display: 'flex' }, '+=.5'),
              tweenTo(this.$refs.cardSmall, 0, { display: 'none' }, '+=.5'),
              tweenTo(this.$refs.card, 2, { width: '30rem', ease: Power4.easeOut }, '+=.25'),
            ])
          })
          .then(() => this.animateCardResizing())
      },
    },
    mounted() {
      setTimeout(() => {
        this.runAnimation()
      }, 1000)
    }
  }
</script>

<style>
  .code-green {
    color: hsl(88, 72%, 71%);
  }
  .code-blue {
    color: hsl(193, 100%, 71%);
  }
  .code-red {
    color: hsl(355, 100%, 70%);
  }
  .code-purple {
    color: hsl(281, 77%, 75%);
  }
  .code-white {
    color: hsl(180, 100%, 96%);
  }
  .code-yellow {
    color: hsl(41, 100%, 67%);
  }
</style>
