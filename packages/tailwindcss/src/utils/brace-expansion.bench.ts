// import braces from 'braces'
import { bench } from 'vitest'
import { expand } from './brace-expansion'

const PATTERN =
  '{{xs,sm,md,lg}:,}{border-{x,y,t,r,b,l,s,e},bg,text,cursor,accent}-{{red,orange,amber,yellow,lime,green,emerald,teal,cyan,sky,blue,indigo,violet,purple,fuchsia,pink,rose,slate,gray,zinc,neutral,stone}-{50,{100..900..100},950},black,white}{,/{0..100}}'

// bench('braces', () => {
//   void braces.expand(PATTERN)
// })

bench('./brace-expansion', () => {
  void expand(PATTERN)
})
