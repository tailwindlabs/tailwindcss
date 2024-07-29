module.exports = function ({ addVariant }) {
  addVariant('inverted', '@media (inverted-colors: inverted)')
  addVariant('hocus', ['&:focus', '&:hover'])
}
