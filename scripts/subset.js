const path = require('path')
const exec = require('exec-sh').promise
const glob = require('glob')
const fs = require('fs')

const inDir = path.resolve(__dirname, '../src/fonts')
const outDir = path.resolve(inDir, 'generated')
const files = glob.sync(path.resolve(__dirname, '../src/fonts/*'), { nodir: true })

const customizationDemo = [
  'AaBbCc',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut augue gravida cras quis ac duis pretium ullamcorper consequat. Integer pellentesque eu.',
]

const subsets = {
  'Pally-Variable': [
    ...customizationDemo,
    'Kids Jumpsuit',
    'In stock',
    '$39.00',
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'Buy now',
    'Add to bag',
    'Free shipping on all continental US orders.',
  ],
  'SourceSerifPro-Regular': [...customizationDemo, 'Dogtooth Style Jacket'],
  'IBMPlexMono-Regular': [
    customizationDemo[0],
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut augue gravida cras quis ac duis pretium ullamcorper consequat.',
    'IN STOCK',
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'Free shipping on all continental US orders.',
  ],
  'IBMPlexMono-SemiBold': ['Retro Shoe', '$89.00', 'BUY NOW', 'ADD TO BAG'],
  'Synonym-Variable': [
    'IN STOCK',
    '$350.00',
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'BUY NOW',
    'ADD TO BAG',
    'Free shipping on all continental US orders.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut augue gravida cras quis ac duis pretium ullamcorper consequat. Integer pellentesque eu.',
  ],
}

const additionalSettings = {
  'Pally-Variable': 'font-weight: 400 700;',
  'Synonym-Variable': 'font-weight: 400 700;',
}

Promise.all(
  Object.keys(subsets).map((font) =>
    exec(
      `${path.resolve(
        __dirname,
        '../node_modules/.bin/glyphhanger'
      )} --css --family="${font}" --whitelist="${subsets[font]
        .join('')
        .replace(/(["$\\])/g, '\\$1')}" --formats=woff-zopfli,woff2 --subset=${font}.ttf`,
      { cwd: inDir }
    )
  )
).then(() => {
  const generatedFiles = glob
    .sync(path.resolve(inDir, '*'), { nodir: true })
    .filter((file) => !files.includes(file))

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {})
  }

  generatedFiles.forEach((file) => {
    if (file.endsWith('.css')) {
      let family = path.basename(file, '.css')
      fs.writeFileSync(
        file,
        `.font {\n  font-family: ${family};\n}\n\n` +
          fs
            .readFileSync(file, 'utf8')
            .replace(/}\s*$/, (match) => `${additionalSettings[family] ?? ''}${match}`)
      )
    }
    fs.renameSync(file, path.resolve(outDir, path.basename(file).replace(/\.css$/, '.module.css')))
  })
})
