<template>
  <div>
    <div class="flex items-end justify-end pb-2">
      <svg class="inline-block cursor-pointer mr-4" :class="activeScreen === 'none' ? 'text-slate-dark' : 'text-slate-light'" @click="activeScreen = 'none'" width="12" height="20" viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="a" d="M3.625 9a.6.6 0 0 0-.184-.441A.607.607 0 0 0 3 8.375a.596.596 0 0 0-.441.184.604.604 0 0 0-.184.441c0 .17.061.318.184.441s.27.185.441.184a.607.607 0 0 0 .441-.184A.6.6 0 0 0 3.625 9zM5.25 7.75v-5.5a.24.24 0 0 0-.074-.176A.24.24 0 0 0 5 2H1a.24.24 0 0 0-.176.074.24.24 0 0 0-.074.176v5.5a.24.24 0 0 0 .074.176A.24.24 0 0 0 1 8h4a.24.24 0 0 0 .176-.074.24.24 0 0 0 .074-.176zm-1.5-6.625c0-.083-.042-.125-.125-.125h-1.25c-.083 0-.125.042-.125.125 0 .083.042.125.125.125h1.25c.083 0 .125-.042.125-.125zM6 1v8a.96.96 0 0 1-.297.703A.96.96 0 0 1 5 10H1a.96.96 0 0 1-.703-.297A.96.96 0 0 1 0 9V1A.96.96 0 0 1 .297.297.96.96 0 0 1 1 0h4a.96.96 0 0 1 .703.297A.96.96 0 0 1 6 1z"/></svg>
      <svg class="inline-block cursor-pointer mr-4" :class="activeScreen === 'sm' ? 'text-slate-dark' : 'text-slate-light'" @click="activeScreen = 'sm'" width="18" height="22" viewBox="0 0 9 11" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="a" d="M5 10a.483.483 0 0 0-.148-.352A.476.476 0 0 0 4.5 9.5a.486.486 0 0 0-.352.148A.479.479 0 0 0 4 10c0 .137.05.254.148.352a.486.486 0 0 0 .352.148.476.476 0 0 0 .352-.148A.483.483 0 0 0 5 10zm3-1.25v-7.5a.24.24 0 0 0-.074-.176A.24.24 0 0 0 7.75 1h-6.5a.24.24 0 0 0-.176.074A.24.24 0 0 0 1 1.25v7.5a.24.24 0 0 0 .074.176A.24.24 0 0 0 1.25 9h6.5a.24.24 0 0 0 .176-.074A.24.24 0 0 0 8 8.75zm1-7.5v8.5c0 .344-.122.638-.367.883A1.204 1.204 0 0 1 7.75 11h-6.5c-.344 0-.638-.122-.883-.367A1.204 1.204 0 0 1 0 9.75v-8.5C0 .906.122.612.367.367S.906 0 1.25 0h6.5c.344 0 .638.122.883.367S9 .906 9 1.25z"/></svg>
      <svg class="inline-block cursor-pointer mr-4" :class="activeScreen === 'md' ? 'text-slate-dark' : 'text-slate-light'" @click="activeScreen = 'md'" width="28" height="22" viewBox="0 0 14 11" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="a" d="M1 6c.135 0 .253-.05.352-.148A.476.476 0 0 0 1.5 5.5a.486.486 0 0 0-.148-.352A.479.479 0 0 0 1 5a.479.479 0 0 0-.352.148A.486.486 0 0 0 .5 5.5c0 .136.049.253.148.352C.748 5.951.865 6 1 6zm1.25 4h10.5a.24.24 0 0 0 .176-.074A.24.24 0 0 0 13 9.75v-8.5a.24.24 0 0 0-.074-.176A.24.24 0 0 0 12.75 1H2.25a.24.24 0 0 0-.176.074A.24.24 0 0 0 2 1.25v8.5a.24.24 0 0 0 .074.176.24.24 0 0 0 .176.074zm10.5 1H1.25c-.344 0-.638-.122-.883-.367A1.204 1.204 0 0 1 0 9.75v-8.5C0 .906.122.612.367.367S.906 0 1.25 0h11.5c.344 0 .638.122.883.367S14 .906 14 1.25v8.5c0 .344-.122.638-.367.883a1.204 1.204 0 0 1-.883.367z"/></svg>
      <svg class="inline-block cursor-pointer mr-4" :class="activeScreen === 'lg' ? 'text-slate-dark' : 'text-slate-light'" @click="activeScreen = 'lg'" width="34" height="24" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="a" d="M2.25 10c-.344 0-.638-.122-.883-.367A1.204 1.204 0 0 1 1 8.75v-7.5c0-.344.122-.638.367-.883S1.906 0 2.25 0h12.5c.344 0 .638.122.883.367S16 .906 16 1.25v7.5c0 .344-.122.638-.367.883a1.204 1.204 0 0 1-.883.367H2.25zM2 1.25v7.5a.24.24 0 0 0 .074.176A.24.24 0 0 0 2.25 9h12.5a.24.24 0 0 0 .176-.074A.24.24 0 0 0 15 8.75v-7.5a.24.24 0 0 0-.074-.176A.24.24 0 0 0 14.75 1H2.25a.24.24 0 0 0-.176.074A.24.24 0 0 0 2 1.25zm13.75 9.25H17v.75c0 .208-.122.385-.367.531-.245.146-.539.219-.883.219H1.25c-.344 0-.638-.073-.883-.219C.122 11.635 0 11.458 0 11.25v-.75h15.75zm-6.625.75c.083 0 .125-.042.125-.125 0-.083-.042-.125-.125-.125h-1.25c-.083 0-.125.042-.125.125 0 .083.042.125.125.125h1.25z"/></svg>
      <svg class="inline-block cursor-pointer" :class="activeScreen === 'xl' ? 'text-slate-dark' : 'text-slate-light'" @click="activeScreen = 'xl'" width="38" height="30" viewBox="0 0 19 15" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="a" d="M18 10.75v-9.5a.24.24 0 0 0-.074-.176A.24.24 0 0 0 17.75 1H1.25a.24.24 0 0 0-.176.074A.24.24 0 0 0 1 1.25v9.5a.24.24 0 0 0 .074.176.24.24 0 0 0 .176.074h16.5a.24.24 0 0 0 .176-.074.24.24 0 0 0 .074-.176zm1-9.5v10.5c0 .344-.122.638-.367.883a1.204 1.204 0 0 1-.883.367H11.5c0 .193.042.394.125.605.083.21.167.396.25.555.083.16.125.273.125.34 0 .135-.05.253-.148.352A.476.476 0 0 1 11.5 15h-4a.483.483 0 0 1-.352-.148A.476.476 0 0 1 7 14.5c0-.073.042-.187.125-.344.083-.157.167-.339.25-.547.083-.208.125-.411.125-.609H1.25c-.344 0-.638-.122-.883-.367A1.204 1.204 0 0 1 0 11.75V1.25C0 .906.122.612.367.367S.906 0 1.25 0h16.5c.344 0 .638.122.883.367S19 .906 19 1.25z"/></svg>
    </div>
    <div class="rounded mask border-2 border-smoke mb-8">
      <div class="p-4 bg-smoke-lighter border-b-2 border-smoke">
        <div class="whitespace-pre font-mono text-slate-lighter text-sm overflow-x-scroll" v-html="highlightedCode"></div>
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
