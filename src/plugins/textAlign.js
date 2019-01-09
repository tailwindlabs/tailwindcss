export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
      '.text-left': { 'text-align': 'left' },
      '.text-center': { 'text-align': 'center' },
      '.text-right': { 'text-align': 'right' },
      '.text-justify': { 'text-align': 'justify' },
    }, config('modules.textAlign'))
  }
}
