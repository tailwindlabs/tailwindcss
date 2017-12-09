<template>
  <div>
    <div class="flex items-end justify-center mb-2 bg-white">
      <span class="inline-block text-center cursor-pointer select-none mr-8" :class="activeScreen === 'none' ? 'text-grey-darkest' : 'text-grey-dark'" @click="activeScreen = 'none'" >
        <svg :width="0.857142857142857 * 10" height="24" class="fill-current block mx-auto mb-1" viewBox="0 0 10 28" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 12h7a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 8.5 28h-7A1.5 1.5 0 0 1 0 26.5v-13A1.5 1.5 0 0 1 1.5 12zM1 15v10h8V15H1zm4 12.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM4 13v1h2v-1H4z" fill-rule="evenodd"/></svg>
        <p class="text-xs">all</p>
      </span>
      <span class="inline-block text-center cursor-pointer select-none mr-8" :class="activeScreen === 'sm' ? 'text-grey-darkest' : 'text-grey-dark'" @click="activeScreen = 'sm'" >
        <svg :width="0.857142857142857 * 14" height="24" class="fill-current block mx-auto mb-1" viewBox="0 0 14 28" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 6h11A1.5 1.5 0 0 1 14 7.5v19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 0 26.5v-19A1.5 1.5 0 0 1 1.5 6zM1 9v16h12V9H1zm6 18.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM7 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill-rule="evenodd"/></svg>
        <p class="text-xs">sm</p>
      </span>
      <span class="inline-block text-center cursor-pointer select-none mr-8" :class="activeScreen === 'md' ? 'text-grey-darkest' : 'text-grey-dark'" @click="activeScreen = 'md'" >
        <svg :width="0.857142857142857 * 26" height="24" class="fill-current block mx-auto mb-1" viewBox="0 0 26 28" xmlns="http://www.w3.org/2000/svg"><path d="M26 26.5a1.5 1.5 0 0 1-1.5 1.5h-23A1.5 1.5 0 0 1 0 26.5v-14A1.5 1.5 0 0 1 1.5 11h23a1.5 1.5 0 0 1 1.5 1.5v14zm-3 .5V12H3v15h20zm1.5-6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-23-.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill-rule="evenodd"/></svg>
        <p class="text-xs">md</p>
      </span>
      <span class="inline-block text-center cursor-pointer select-none mr-8" :class="activeScreen === 'lg' ? 'text-grey-darkest' : 'text-grey-dark'" @click="activeScreen = 'lg'" >
        <svg :width="0.857142857142857 * 38" height="24" class="fill-current block mx-auto mb-1" viewBox="0 0 38 28" xmlns="http://www.w3.org/2000/svg"><path d="M34 26h4v1c-1.333.667-2.667 1-4 1H4c-1.333 0-2.667-.333-4-1v-1h4V7.5A1.5 1.5 0 0 1 5.5 6h27A1.5 1.5 0 0 1 34 7.5V26zM6 8v18h26V8H6z" fill-rule="evenodd"/></svg>
        <p class="text-xs">lg</p>
      </span>
      <span class="inline-block text-center cursor-pointer select-none" :class="activeScreen === 'xl' ? 'text-grey-darkest' : 'text-grey-dark'" @click="activeScreen = 'xl'" >
        <svg :width="0.857142857142857 * 36" height="24" class="fill-current block mx-auto mb-1" viewBox="0 0 36 28" xmlns="http://www.w3.org/2000/svg"><path d="M20.857 24l.857 3H24v1H12v-1h2.286l.857-3H1.5A1.5 1.5 0 0 1 0 22.5v-21A1.5 1.5 0 0 1 1.5 0h33A1.5 1.5 0 0 1 36 1.5v21a1.5 1.5 0 0 1-1.5 1.5H20.857zM2 2v18h32V2H2z"/></svg>
        <p class="text-xs">xl</p>
      </span>
    </div>
    <div class="rounded overflow-hidden border-2 border-grey-light mb-8">
      <div class="p-4 bg-grey-lightest border-b-2 border-grey-light">
        <div class="whitespace-pre font-mono text-grey text-sm overflow-x-scroll" v-html="highlightedCode"></div>
      </div>
      <div class="bg-white p-4">
        <slot v-if="activeScreen === 'none'" name="none"></slot>
        <slot v-if="activeScreen === 'sm'" name="sm"></slot>
        <slot v-if="activeScreen === 'md'" name="md"></slot>
        <slot v-if="activeScreen === 'lg'" name="lg"></slot>
        <slot v-if="activeScreen === 'xl'" name="xl"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import escape from 'escape-html'

export default {
  props: ['code'],
  data() {
    return {
      activeScreen: 'none',
    }
  },
  computed: {
    highlightedCode() {
      const regex = new RegExp(`(${this.activeScreen}\:[^\\s\\&]+)`, 'g')
      return escape(this.code).replace(regex, '<span class="text-purple">$1</span>').replace(/none:/g, '')
    }
  },
}
</script>
