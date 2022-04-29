import tinytime from 'tinytime'

export function formatDate(date, format) {
  return tinytime(format)
    .render(typeof date === 'string' ? new Date(date) : date)
    .replace('Febuary', 'February')
}
